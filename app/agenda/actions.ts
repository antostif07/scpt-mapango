"use server";

import { createOdooRecord } from "@/lib/odoo";
import { revalidatePath } from "next/cache";

export async function createEventAction(formData: any) {
  // 1. Construction de la date de début au format Odoo (YYYY-MM-DD HH:mm:ss)
  // formData.date est "YYYY-MM-DD" et formData.time est "HH:mm"
  const startDateTime = `${formData.date} ${formData.time}:00`;

  const odooPayload = {
    name: formData.title,
    start: startDateTime, // Odoo gère généralement l'UTC, à ajuster selon ta config serveur
    duration: parseFloat(formData.duration), // Durée en heures (float)
    location: formData.location,
    description: formData.description,
    // On peut ajouter allday: false par défaut
  };

  try {
    const newId = await createOdooRecord('calendar.event', odooPayload);
    console.log("Event créé ID:", newId);

    revalidatePath('/agenda'); // Rafraîchir le calendrier
    return { success: true, message: "Événement ajouté à l'agenda !" };

  } catch (error: any) {
    console.error("Erreur Agenda:", error);
    return { success: false, message: "Erreur lors de la création." };
  }
}