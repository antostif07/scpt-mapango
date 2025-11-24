import xmlrpc from 'xmlrpc';
import { AuditLog, Channel, Company, Inventory, Invoice, Message, RecoveryItem, ReportData, Ticket } from './types';

const ODOO_CONFIG = {
  url: process.env.ODOO_URL || '',
  db: process.env.ODOO_DB || '',
  username: process.env.ODOO_USERNAME || '',
  password: process.env.ODOO_PASSWORD || '',
};

export interface Province {
  id: number;
  name: string;
}

export interface Partner {
  id: number;
  name: string;
  email: string;
  phone: string;
  mobile: string;
  image: string; // Base64
  job: string;
  type: string; // 'contact', 'invoice', etc.
  category_id: any[]; // Tags (ex: [1, "Locataire"])
}

// Types pour un Site (basé sur tes screenshots)
export interface Site {
  id: number;
  name: string;
  ref: string;
  city: string; // ou un objet si c'est une relation
  state_id: any; // Province
  country_id: any;
  surface: number; // Superficie
  total_revenue: number; // Champs calculé ou custom
  latitude?: string;
  longitude?: string;
}

export interface CalendarEvent {
  id: number;
  name: string;
  start: string; // Odoo renvoie "YYYY-MM-DD HH:mm:ss"
  stop: string;
  description: string;
  location: string;
  duration: number;
  allday: boolean;
  tags: any[]; // [id, name]
}

/**
 * Fonction générique pour s'authentifier et faire un search_read
 */
export async function fetchOdooData(model: string, fields: string[], domain: any[] = []) {
  if (!ODOO_CONFIG.url) return []; // Fallback si pas de config pour éviter le crash en dev

  // Parser l'URL pour xmlrpc (http ou https)
  const urlParts = new URL(ODOO_CONFIG.url);
  const clientOptions = {
    host: urlParts.hostname,
    port: urlParts.port ? parseInt(urlParts.port) : (urlParts.protocol === 'https:' ? 443 : 80),
    path: '/xmlrpc/2/common',
  };

  const common = urlParts.protocol === 'https:' 
    ? xmlrpc.createSecureClient(clientOptions) 
    : xmlrpc.createClient(clientOptions);

  // 1. Authentification (Récupération UID)
  const uid = await new Promise<number>((resolve, reject) => {
    common.methodCall('authenticate', [ODOO_CONFIG.db, ODOO_CONFIG.username, ODOO_CONFIG.password, {}], (error, value) => {
      if (error) reject(error);
      else resolve(value);
    });
  });

  if (!uid) throw new Error("Authentification Odoo échouée");

  // 2. Récupération des données (Object Service)
  const objectClientOptions = { ...clientOptions, path: '/xmlrpc/2/object' };
  const models = urlParts.protocol === 'https:' 
    ? xmlrpc.createSecureClient(objectClientOptions) 
    : xmlrpc.createClient(objectClientOptions);

  return new Promise<Site[]>((resolve, reject) => {
    models.methodCall('execute_kw', [
      ODOO_CONFIG.db, 
      uid, 
      ODOO_CONFIG.password, 
      model, 
      'search_read', 
      [domain], 
      { fields: fields, limit: 100 } // Limite à 100 pour l'exemple
    ], (error, value) => {
      if (error) reject(error);
      else resolve(value);
    });
  });
}

/**
 * Créer un nouvel enregistrement dans Odoo
 * @param model Le nom du modèle (ex: 'mapango.site')
 * @param data Un objet contenant les champs et valeurs
 */
export async function createOdooRecord(model: string, data: any): Promise<number> {
  // 1. Authentification (copie simplifiée de la logique précédente)
  // Idéalement, on factorise l'auth dans une fonction privée getOdooClient()
  const urlParts = new URL(ODOO_CONFIG.url);
  const clientOptions = {
    host: urlParts.hostname,
    port: urlParts.port ? parseInt(urlParts.port) : (urlParts.protocol === 'https:' ? 443 : 80),
    path: '/xmlrpc/2/common',
  };
  
  const common = urlParts.protocol === 'https:' ? xmlrpc.createSecureClient(clientOptions) : xmlrpc.createClient(clientOptions);

  const uid = await new Promise<number>((resolve, reject) => {
    common.methodCall('authenticate', [ODOO_CONFIG.db, ODOO_CONFIG.username, ODOO_CONFIG.password, {}], (err, val) => {
      if (err) reject(err); else resolve(val);
    });
  });

  // 2. Création de l'enregistrement
  const objectClientOptions = { ...clientOptions, path: '/xmlrpc/2/object' };
  const models = urlParts.protocol === 'https:' ? xmlrpc.createSecureClient(objectClientOptions) : xmlrpc.createClient(objectClientOptions);

  return new Promise((resolve, reject) => {
    models.methodCall('execute_kw', [
      ODOO_CONFIG.db,
      uid,
      ODOO_CONFIG.password,
      model,
      'create', // La méthode magique d'Odoo
      [data]    // Les données doivent être dans un tableau (dictionnaire python)
    ], (error, newId) => {
      if (error) {
        console.error("Erreur création Odoo:", error);
        reject(error);
      } else {
        resolve(newId as number);
      }
    });
  });
}

export async function getProvinces(): Promise<Province[]> {
  try {
    // Si tu as importé le CSV dans un modèle custom 'x_provinces'
    // Si tu utilises les états standard Odoo, change 'x_provinces' par 'res.country.state'
    const provinces = await fetchOdooData('x_provinces', ['id', 'x_name']);
    
    // On mappe pour être sûr d'avoir le bon format
    return provinces.map((p: any) => ({
      id: p.id,
      name: p.name || p.x_name || "Inconnu" // Sécurité si le champ s'appelle x_name
    }));
  } catch (error) {
    console.error("Erreur récupération provinces:", error);
    return [];
  }
}

export async function getPartners(): Promise<Partner[]> {
  try {
    // On récupère les champs clés de res.partner
    const data = await fetchOdooData('res.partner', [
      'name', 'email', 'phone', 'image_128', 'function', 'category_id'
    ]);

    return data.map((p: any) => ({
      id: p.id,
      name: p.name || "Inconnu",
      email: p.email || "",
      phone: p.phone || "",
      mobile: p.mobile || "",
      image: p.image_128 || null, // Odoo renvoie du false ou base64
      job: p.function || "Particulier",
      type: "contact",
      category_id: p.category_id || []
    }));
  } catch (error) {
    console.error("Erreur contacts:", error);
    return [];
  }
}

export async function getSiteById(id: number): Promise<Site | null> {
  try {
    const data = await fetchOdooData('x_sites', [
      'x_name', 
      'x_studio_reference_1', 
      'x_studio_ville', 
      'x_studio_province', 
      'x_studio_superficie',
      'x_studio_latitude', 
      'x_studio_longitude',
      'x_avatar_image', // L'image du site
      // Ajoutez ici d'autres champs si nécessaire (ex: description, revenue...)
    ], [['id', '=', id]]); // Filtre sur l'ID

    if (!data || data.length === 0) return null;

    const item = data[0] as any;

    return {
      id: item.id,
      name: item.x_name || "Sans nom",
      ref: item.x_studio_reference_1 || "",
      city: item.x_studio_ville || "",
      state_id: Array.isArray(item.x_studio_province) ? item.x_studio_province : [0, ""],
      country_id: false,
      surface: item.x_studio_superficie || 0,
      total_revenue: 0, 
      latitude: item.x_studio_latitude,
      longitude: item.x_studio_longitude,
      // On ajoute l'image pour l'affichage (si elle existe)
      image: item.x_avatar_image || null 
    } as Site & { image?: string }; // Petit hack TypeScript pour ajouter l'image
  } catch (error) {
    console.error(`Erreur récupération site ${id}:`, error);
    return null;
  }
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    // On récupère les événements (tu peux ajouter un filtre de date ici si besoin)
    const data = await fetchOdooData('calendar.event', [
      'name', 'start', 'stop', 'description', 'location', 'duration', 'allday', 'categ_ids'
    ]);

    return data.map((e: any) => ({
      id: e.id,
      name: e.name || "Sans titre",
      start: e.start,
      stop: e.stop,
      description: e.description || "",
      location: e.location || "",
      duration: e.duration || 0,
      allday: e.allday || false,
      tags: e.categ_ids || [] 
    }));
  } catch (error) {
    console.error("Erreur Agenda:", error);
    return [];
  }
}

export async function getChannels(): Promise<Channel[]> {
  try {
    // On récupère les canaux de type 'chat' ou 'channel'
    const data = await fetchOdooData('mail.channel', [
      'name', 'description', 'image_128', 'message_unread_counter'
    ], [['channel_type', 'in', ['chat', 'channel']]]);

    return data.map((c: any) => ({
      id: c.id,
      name: c.name || "Discussion",
      description: c.description || "",
      image: c.image_128 || null,
      // On pourrait trier par date si on récupérait last_message_date
    }));
  } catch (error) {
    console.error("Erreur Channels:", error);
    return [];
  }
}

// 2. Récupérer les messages d'un canal spécifique
export async function getChannelMessages(channelId: number): Promise<Message[]> {
  try {
    const data = await fetchOdooData('mail.message', [
      'body', 'date', 'author_id'
    ], [
      ['model', '=', 'mail.channel'], 
      ['res_id', '=', channelId],
      ['message_type', '!=', 'notification'] // On ignore les notifs systèmes
    ]); // Idéalement ajouter un limit: 50

    // Important: Odoo renvoie les plus récents en premier. On devra inverser pour l'affichage Chat.
    return data.map((m: any) => ({
      id: m.id,
      body: m.body || "", // HTML content
      date: m.date,
      author_id: m.author_id,
      is_me: false // Sera défini côté client selon l'utilisateur connecté
    })).reverse();
  } catch (error) {
    console.error("Erreur Messages:", error);
    return [];
  }
}

export async function getCompanies(): Promise<Company[]> {
  try {
    const data = await fetchOdooData('res.partner', [
      'name', 'email', 'phone', 'website', 'vat', 'image_128', 
      'supplier_rank', 'customer_rank', 'category_id'
    ], [['is_company', '=', true]]); // Filtre clé

    return data.map((c: any) => ({
      id: c.id,
      name: c.name || "Société Inconnue",
      email: c.email || "",
      phone: c.phone || "",
      website: c.website || "",
      vat: c.vat || "",
      image: c.image_128 || null,
      is_supplier: (c.supplier_rank || 0) > 0,
      is_customer: (c.customer_rank || 0) > 0,
      tags: [] // On simplifie pour l'instant, faudrait fetcher les tags séparément
    }));
  } catch (error) {
    console.error("Erreur Compagnies:", error);
    return [];
  }
}

export async function getInventories(): Promise<Inventory[]> {
  try {
    // Adapter le nom du modèle : 'x_inventory', 'property.inventory', etc.
    const data = await fetchOdooData('x_inventory', [
      'name', 'date', 'x_site_id', 'partner_id', 'type', 'state'
    ]);

    return data.map((d: any) => ({
      id: d.id,
      name: d.name || "Nouveau",
      date: d.date || new Date().toISOString(),
      site_name: Array.isArray(d.x_site_id) ? d.x_site_id[1] : "Site Inconnu",
      partner_name: Array.isArray(d.partner_id) ? d.partner_id[1] : "Locataire Inconnu",
      type: d.type || 'incoming',
      state: d.state || 'draft'
    }));
  } catch (error) {
    console.error("Erreur Reprise Immo:", error);
    return [];
  }
}

export async function getTickets(): Promise<Ticket[]> {
  try {
    // Adapter 'helpdesk.ticket' selon tes modules installés
    const data = await fetchOdooData('helpdesk.ticket', [
      'name', 'partner_id', 'x_site_id', 'stage_id', 'priority', 'description', 'create_date'
    ]);

    return data.map((t: any) => ({
      id: t.id,
      name: t.name || "Demande sans titre",
      partner_name: Array.isArray(t.partner_id) ? t.partner_id[1] : "Inconnu",
      site_name: Array.isArray(t.x_site_id) ? t.x_site_id[1] : "",
      // Simplification du stage pour l'exemple (il faudrait mapper les IDs des stages)
      stage: t.stage_id ? 'new' : 'new', 
      priority: t.priority || '0',
      description: t.description || "",
      create_date: t.create_date
    }));
  } catch (error) {
    console.error("Erreur Tickets:", error);
    return [];
  }
}

export async function getInvoices(): Promise<Invoice[]> {
  try {
    // account.move = Modèle comptable principal
    const data = await fetchOdooData('account.move', [
      'name', 'partner_id', 'invoice_date', 'amount_total', 'state', 'payment_state'
    ], [['move_type', '=', 'out_invoice']]); // Uniquement factures clients

    return data.map((i: any) => ({
      id: i.id,
      name: i.name,
      partner_name: Array.isArray(i.partner_id) ? i.partner_id[1] : "",
      date: i.invoice_date,
      amount: i.amount_total,
      status: i.state,
      payment_state: i.payment_state
    }));
  } catch (error) { return []; }
}

export async function getRecoveryItems(): Promise<RecoveryItem[]> {
  try {
    const today = new Date().toISOString().split('T')[0];

    // On cherche les factures clients publiées avec un reste à payer
    const data = await fetchOdooData('account.move', [
      'name', 'partner_id', 'invoice_date_due', 'amount_residual'
    ], [
      ['move_type', '=', 'out_invoice'],
      ['state', '=', 'posted'],
      ['payment_state', 'in', ['not_paid', 'partial']],
      ['invoice_date_due', '<', today] // Date d'échéance passée
    ]);

    return data.map((i: any) => {
      // Calcul du nombre de jours de retard
      const due = new Date(i.invoice_date_due);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - due.getTime());
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Détermination du niveau d'urgence
      let level: 'low' | 'medium' | 'critical' = 'low';
      if (days > 30) level = 'medium';
      if (days > 60) level = 'critical';

      return {
        id: i.id,
        invoice_ref: i.name,
        partner_name: Array.isArray(i.partner_id) ? i.partner_id[1] : "Inconnu",
        partner_phone: "", // Faudrait faire un fetch supplémentaire ou join pour avoir le tel
        due_date: i.invoice_date_due,
        amount_due: i.amount_residual,
        days_overdue: days,
        level: level
      };
    });
  } catch (error) {
    console.error("Erreur Recouvrement:", error);
    return [];
  }
}

export async function getReportData(): Promise<ReportData> {
  // Dans un vrai cas Odoo, on ferait plusieurs appels 'read_group' sur account.move
  // Ici, on retourne des données statiques réalistes pour alimenter les graphiques
  return {
    revenueByMonth: [
      { name: 'Jan', revenue: 45000, expense: 12000 },
      { name: 'Fév', revenue: 47000, expense: 15000 },
      { name: 'Mar', revenue: 42000, expense: 8000 },
      { name: 'Avr', revenue: 52000, expense: 18000 },
      { name: 'Mai', revenue: 56000, expense: 14000 },
      { name: 'Juin', revenue: 61000, expense: 22000 },
    ],
    occupancyByZone: [
      { name: 'Gombe', value: 85 },
      { name: 'Ngaliema', value: 65 },
      { name: 'Limete', value: 92 },
      { name: 'Lubumbashi', value: 78 },
    ],
    topSites: [
      { name: "Résidence Mapango", revenue: 125000 },
      { name: "Villa Karavia", revenue: 85000 },
      { name: "Immeuble du 30 Juin", revenue: 62000 },
    ]
  };
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    const data = await fetchOdooData('mail.message', [
      'date', 'author_id', 'model', 'record_name', 'body'
    ], [
      ['message_type', '!=', 'comment'], // On ne veut pas les chats, mais les logs
      ['model', '!=', false] // Seulement ceux liés à un objet
    ]); // Limit 50

    return data.map((l: any) => ({
      id: l.id,
      date: l.date,
      author: Array.isArray(l.author_id) ? l.author_id[1] : "Système",
      model: l.model,
      res_name: l.record_name || "Document inconnu",
      body: l.body || "Modification technique"
    }));
  } catch (error) { return []; }
}