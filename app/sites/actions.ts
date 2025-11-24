"use server";

import { createOdooRecord } from "@/lib/odoo";
import { revalidatePath } from "next/cache";

// On retire 'redirect' ici pour laisser le client gérer la navigation
export async function createSiteAction(formData: any) {
  
  // Mapping des données
  const odooPayload = {
    x_name: formData.name,
    x_studio_reference_1: formData.reference,
    x_studio_ville: formData.city,
    // Attention: x_studio_province attend un ID (integer) si c'est un Many2one.
    // Assure-toi que formData.province contient bien l'ID (ex: "1") et on le convertit en int.
    x_studio_province_1: parseInt(formData.province) || false, 
    x_studio_superficie: parseFloat(formData.surface) || 0,
    x_studio_latitude_1: formData.latitude, 
    x_studio_longitude_1: formData.longitude,
    x_avatar_image: formData.imageBase64 ? formData.imageBase64.split(',')[1] : false,
  };

  try {
    const newId = await createOdooRecord('x_sites', odooPayload);
    console.log("Site créé avec ID:", newId);

    // On rafraîchit le cache de la liste des sites
    revalidatePath('/sites');
    
    // ✅ SUCCÈS : On retourne true
    return { success: true, message: "Site créé avec succès !" };

  } catch (error: any) {
    console.error("Erreur backend:", error);
    // ❌ ERREUR : On retourne false avec le détail
    return { success: false, message: error.message || "Impossible de créer le site sur Odoo." };
  }
}