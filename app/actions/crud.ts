"use server";

import { createOdooRecord, updateOdooRecord, deleteOdooRecord } from "@/lib/odoo";
import { revalidatePath } from "next/cache";

export type ActionResult = {
  success: boolean;
  message: string;
};

/**
 * Action Générique pour Supprimer un élément
 * @param model Le nom technique du modèle Odoo (ex: 'res.partner')
 * @param id L'ID à supprimer
 * @param pathToRevalidate La route Next.js à rafraîchir (ex: '/users')
 */
export async function deleteItemAction(model: string, id: number, pathToRevalidate: string): Promise<ActionResult> {
  try {
    await deleteOdooRecord(model, id);
    revalidatePath(pathToRevalidate);
    return { success: true, message: "Élément supprimé avec succès." };
  } catch (error: any) {
    console.error(`Delete Action Error (${model}):`, error);
    // Odoo renvoie souvent des erreurs XML-RPC cryptiques, on essaie d'être clair
    return { 
      success: false, 
      message: error.message?.includes("restrict") 
        ? "Impossible de supprimer : cet élément est lié à d'autres documents." 
        : "Erreur lors de la suppression." 
    };
  }
}

/**
 * Action Générique pour Créer ou Mettre à jour
 * @param model Le nom technique du modèle Odoo
 * @param data L'objet contenant les champs à sauvegarder
 * @param id (Optionnel) Si présent, on fait un Update. Sinon un Create.
 * @param pathToRevalidate La route Next.js à rafraîchir
 */
export async function saveItemAction(
  model: string, 
  data: any, 
  pathToRevalidate: string,
  id?: number
): Promise<ActionResult> {
  try {
    if (id) {
      // MODE UPDATE
      await updateOdooRecord(model, id, data);
      revalidatePath(pathToRevalidate);
      return { success: true, message: "Mise à jour effectuée." };
    } else {
      // MODE CREATE
      await createOdooRecord(model, data);
      revalidatePath(pathToRevalidate);
      return { success: true, message: "Création réussie." };
    }
  } catch (error: any) {
    console.error(`Save Action Error (${model}):`, error);
    return { success: false, message: "Erreur lors de l'enregistrement." };
  }
}