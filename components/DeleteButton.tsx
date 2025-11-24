"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteItemAction } from "@/app/actions/crud";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteButtonProps {
  model: string;
  id: number;
  path: string;
  iconSize?: number;
}

export default function DeleteButton({ model, id, path, iconSize = 18 }: DeleteButtonProps) {
  const [step, setStep] = useState<"IDLE" | "CONFIRM" | "DELETING">("IDLE");

  const handleDelete = async () => {
    setStep("DELETING");
    const res = await deleteItemAction(model, id, path);
    
    if (res.success) {
      toast.success(res.message);
      setStep("IDLE"); // Le composant sera probablement démonté avant, mais c'est safe
    } else {
      toast.error(res.message);
      setStep("IDLE");
    }
  };

  return (
    <div className="relative inline-block">
      <AnimatePresence mode="wait">
        
        {step === "IDLE" && (
          <motion.button
            key="idle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setStep("CONFIRM")}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Supprimer"
          >
            <Trash2 size={iconSize} />
          </motion.button>
        )}

        {step === "CONFIRM" && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.9, x: 10 }} 
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute right-0 top-0 z-10 flex items-center bg-white border border-red-200 shadow-lg rounded-lg overflow-hidden"
          >
            <button 
                onClick={handleDelete}
                className="bg-red-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1"
            >
                <Trash2 size={12}/> Oui
            </button>
            <button 
                onClick={() => setStep("IDLE")}
                className="bg-slate-50 text-slate-600 px-3 py-1.5 text-xs font-medium hover:bg-slate-100 transition-colors"
            >
                Non
            </button>
          </motion.div>
        )}

        {step === "DELETING" && (
           <motion.div
             key="loading"
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="p-2"
           >
             <Loader2 size={iconSize} className="animate-spin text-red-500" />
           </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}