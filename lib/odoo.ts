import xmlrpc from 'xmlrpc';

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
