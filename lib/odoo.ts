import xmlrpc from 'xmlrpc';

// --- CONFIGURATION ---
const ODOO_CONFIG = {
  url: process.env.ODOO_URL || '',
  db: process.env.ODOO_DB || '',
  username: process.env.ODOO_USERNAME || '',
  password: process.env.ODOO_PASSWORD || '',
};

// --- TYPES GLOBAUX ---
export interface OdooResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper pour créer le client Odoo avec authentification
async function getOdooClient(path: string): Promise<{ client: xmlrpc.Client; uid: number }> {
  const urlParts = new URL(ODOO_CONFIG.url);
  const clientOptions = {
    host: urlParts.hostname,
    port: urlParts.port ? parseInt(urlParts.port) : (urlParts.protocol === 'https:' ? 443 : 80),
    path: '/xmlrpc/2/common',
  };

  const common = urlParts.protocol === 'https:' ? xmlrpc.createSecureClient(clientOptions) : xmlrpc.createClient(clientOptions);

  const uid = await new Promise<number>((resolve, reject) => {
    common.methodCall('authenticate', [ODOO_CONFIG.db, ODOO_CONFIG.username, ODOO_CONFIG.password, {}], (err, val) => {
      if (err) reject(err);
      else if (!val) reject(new Error("Authentification échouée"));
      else resolve(val as number);
    });
  });

  const objectOptions = { ...clientOptions, path };
  const client = urlParts.protocol === 'https:' ? xmlrpc.createSecureClient(objectOptions) : xmlrpc.createClient(objectOptions);

  return { client, uid };
}

// --- CRUD OPERATIONS ---

// 1. READ (Search & Read)
export async function fetchOdooData(model: string, fields: string[], domain: any[] = [], limit: number = 100): Promise<any[]> {
  try {
    const { client, uid } = await getOdooClient('/xmlrpc/2/object');
    return new Promise((resolve, reject) => {
      client.methodCall('execute_kw', [
        ODOO_CONFIG.db, uid, ODOO_CONFIG.password,
        model, 'search_read', [domain], { fields, limit }
      ], (err, val) => (err ? reject(err) : resolve(val as any[])));
    });
  } catch (error) {
    console.error(`Read Error [${model}]:`, error);
    return [];
  }
}

/**
 * Récupère un seul enregistrement par son ID
 * @param model Le nom du modèle (ex: 'res.partner')
 * @param id L'ID de l'enregistrement
 * @param fields La liste des champs à récupérer
 */
export async function fetchOdooRecord<T = any>(model: string, id: number, fields: string[]): Promise<T | null> {
  try {
    // On réutilise notre fonction générique de recherche, mais avec un filtre sur l'ID
    const data = await fetchOdooData(model, fields, [['id', '=', id]], 1);

    if (data && data.length > 0) {
      return data[0] as T;
    }
    return null;
  } catch (error) {
    console.error(`Erreur FetchOne [${model} #${id}]:`, error);
    return null;
  }
}

// 2. CREATE
export async function createOdooRecord(model: string, data: any): Promise<number> {
  const { client, uid } = await getOdooClient('/xmlrpc/2/object');
  return new Promise((resolve, reject) => {
    client.methodCall('execute_kw', [
      ODOO_CONFIG.db, uid, ODOO_CONFIG.password,
      model, 'create', [data]
    ], (err, val) => (err ? reject(err) : resolve(val as number)));
  });
}

// 3. UPDATE (Write)
export async function updateOdooRecord(model: string, id: number, data: any): Promise<boolean> {
  const { client, uid } = await getOdooClient('/xmlrpc/2/object');
  return new Promise((resolve, reject) => {
    client.methodCall('execute_kw', [
      ODOO_CONFIG.db, uid, ODOO_CONFIG.password,
      model, 'write', [[id], data] // ⚠️ Important: [[ID], DATA]
    ], (err, val) => (err ? reject(err) : resolve(val as boolean)));
  });
}

// 4. DELETE (Unlink)
export async function deleteOdooRecord(model: string, id: number): Promise<boolean> {
  const { client, uid } = await getOdooClient('/xmlrpc/2/object');
  return new Promise((resolve, reject) => {
    client.methodCall('execute_kw', [
      ODOO_CONFIG.db, uid, ODOO_CONFIG.password,
      model, 'unlink', [[id]] // ⚠️ Important: [[ID]]
    ], (err, val) => (err ? reject(err) : resolve(val as boolean)));
  });
}