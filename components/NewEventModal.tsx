"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MapPin, AlignLeft, Save } from "lucide-react";
import { createEventAction } from "@/app/agenda/actions";
import { toast } from "sonner";
import { format } from "date-fns";

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate: Date; // La date sélectionnée dans le calendrier
}

export default function NewEventModal({ isOpen, onClose, defaultDate }: NewEventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "09:00",
    duration: "1",
    location: "",
    description: ""
  });

  // Mettre à jour la date quand on ouvre la modale
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        date: format(defaultDate, "yyyy-MM-dd")
      }));
    }
  }, [isOpen, defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Création de l'événement...");

    const result = await createEventAction(formData);

    if (result.success) {
      toast.success(result.message, { id: toastId });
      onClose(); // Fermer la modale
      // Reset form (optionnel)
      setFormData(prev => ({ ...prev, title: "", description: "", location: "" }));
    } else {
      toast.error(result.message, { id: toastId });
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Overlay sombre */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal Card */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique dedans
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-lg text-slate-800">Nouvel Événement</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Titre de l'événement</label>
              <input 
                autoFocus
                type="text" 
                required
                placeholder="Ex: Visite Appartement A2..."
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><Calendar size={14}/> Date</label>
                    <input 
                        type="date" 
                        required
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>
                {/* Heure */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><Clock size={14}/> Heure début</label>
                    <input 
                        type="time" 
                        required
                        value={formData.time}
                        onChange={e => setFormData({...formData, time: e.target.value})}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Durée */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Durée (heures)</label>
                    <input 
                        type="number" 
                        step="0.5"
                        min="0.5"
                        value={formData.duration}
                        onChange={e => setFormData({...formData, duration: e.target.value})}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>
                {/* Lieu */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><MapPin size={14}/> Lieu</label>
                    <input 
                        type="text" 
                        placeholder="Ex: Kinshasa"
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><AlignLeft size={14}/> Description</label>
                 <textarea 
                    rows={3}
                    placeholder="Détails supplémentaires..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                 />
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-2">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    Annuler
                </button>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-70"
                >
                    {isSubmitting ? "Enregistrement..." : <><Save size={18}/> Enregistrer</>}
                </button>
            </div>

          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}