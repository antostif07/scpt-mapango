export interface Channel {
  id: number;
  name: string;
  description?: string;
  image?: string; // Avatar du channel ou du destinataire
  last_message_date?: string;
}

export interface Message {
  id: number;
  body: string; // C'est du HTML dans Odoo
  date: string;
  author_id: any; // [id, name]
  is_me: boolean; // Calculé plus tard
}

export interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  vat: string; // Numéro NIF/TVA
  image_1920: string;
  is_supplier: boolean; // rank > 0
  is_customer: boolean; // rank > 0
  tags: string[];
}

export interface Inventory {
  id: number;
  name: string;      // Réf (ex: EDL/2024/005)
  date: string;
  site_name: string; // Le bien concerné
  partner_name: string; // Le locataire
  type: 'incoming' | 'outgoing'; // Type d'état des lieux
  state: 'draft' | 'confirm' | 'done'; // Statut
}

export interface Ticket {
  id: number;
  name: string; // Titre de la demande
  partner_name: string; // Qui demande
  site_name: string; // Quel site
  stage: 'new' | 'progress' | 'done'; // État
  priority: '0' | '1' | '2' | '3'; // Priorité Odoo (stars)
  description: string;
  create_date: string;
}

export interface Invoice {
  id: number;
  name: string; // Numéro facture (INV/2024/001)
  partner_name: string;
  date: string;
  amount: number;
  status: 'draft' | 'posted' | 'cancel';
  payment_state: 'not_paid' | 'in_payment' | 'paid' | 'reversed';
}

export interface RecoveryItem {
  id: number;
  invoice_ref: string;
  partner_name: string;
  partner_phone: string;
  due_date: string;
  amount_due: number; // Montant restant à payer
  days_overdue: number; // Retard en jours
  level: 'low' | 'medium' | 'critical'; // Calculé selon le retard
}

export interface ReportData {
  revenueByMonth: { name: string; revenue: number; expense: number }[];
  occupancyByZone: { name: string; value: number }[];
  topSites: { name: string; revenue: number }[];
}

export interface AuditLog {
  id: number;
  date: string;
  author: string; // Qui
  model: string;  // Sur quoi (ex: res.partner)
  res_name: string; // Nom de l'objet (ex: Jean Kabuya)
  body: string;   // Quoi (ex: <p>Prix modifié de 500 à 600</p>)
}

export interface Partner {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    job?: string;
    image_1920?: string|boolean;
}

export interface OdooSite {
  id: number;
  x_name: string;
  x_studio_reference_1: string;
  x_studio_ville: string;
  x_studio_province: any; 
  x_studio_superficie: number;
  x_studio_latitude_1: string;
  x_studio_longitude_1: string;
  x_avatar_image: string | null;
}

export interface Site {
  id: number;
  name: string;
  ref: string;
  city: string;
  province: string;
  province_id: number | null;
  surface: number;
  latitude: string;
  longitude: string;
  image: string | null;
}

export interface OdooSite {
  id: number;
  x_name: string;
  x_avatar_image: string | null;
  x_studio_superficie: number;
  x_studio_ville: string;
  x_studio_reference_1: string;
  total_revenue: number;
  x_studio_province_1?: [number, string];
}

export interface CalendarEvent {
  id: number;
  name: string;
  start: string; // ISO String
  end: string;   // ISO String
  allDay: boolean;
  description?: string;
  location?: string;
  tags: string[];
  color_id?: number;
  duration: number; // Durée en heures
}

export interface Province {
  id: number;
  x_name: string;
}