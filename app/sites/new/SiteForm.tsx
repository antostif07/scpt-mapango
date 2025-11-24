"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Save, UploadCloud, MapPin,
  Crosshair, FileText, Image as ImageIcon,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createSiteAction } from "../actions";
import { toast } from "sonner";
import { Province } from "@/lib/odoo";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


// -----------------
// 🎯 SCHÉMA ZOD
// -----------------
const siteSchema = z.object({
  name: z.string().min(1, "Le nom du site est requis"),
  reference: z.string().optional(),
  surface: z.string().min(1, "Superficie requise"),
  city: z.string().min(1, "Ville requise"),
  province: z.string().min(1, "Province requise"),
  address: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  supervisor: z.string().optional(),
});

type SiteFormData = z.infer<typeof siteSchema>;


export default function NewSiteForm({ provinces }: { provinces: Province[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -----------------
  // 🎯 react-hook-form
  // -----------------
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      name: "",
      reference: "",
      surface: "",
      city: "",
      province: "",
      address: "",
      latitude: "",
      longitude: "",
      supervisor: ""
    }
  });


  // -----------------
  // 📌 Convertir en Base64
  // -----------------
  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });


  // -----------------
  // 📌 Localisation automatique
  // -----------------
  const handleLocateMe = () => {
    const toastId = toast.loading("Localisation...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("latitude", pos.coords.latitude.toFixed(6));
        setValue("longitude", pos.coords.longitude.toFixed(6));
        toast.success("Position trouvée !", { id: toastId });
      },
      () => toast.error("Impossible de récupérer la position", { id: toastId })
    );
  };


  // -----------------
  // 📌 Gestion upload image
  // -----------------
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image trop lourde (max 5MB)");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  };


  // -----------------
  // 📌 SUBMIT FINAL
  // -----------------
  const onSubmit = async (values: SiteFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Envoi du site vers Odoo...");

    try {
      let imageBase64 = null;

      if (fileInputRef.current?.files?.[0]) {
        imageBase64 = await toBase64(fileInputRef.current.files[0]);
      }

      const result = await createSiteAction({
        ...values,
        imageBase64
      });

      if (result.success) {
        toast.success(result.message, { id: toastId });
        setTimeout(() => router.push("/sites"), 800);
      } else {
        toast.error(result.message, { id: toastId });
        setIsSubmitting(false);
      }
    } catch (e) {
      toast.error("Erreur critique", { id: toastId });
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-slate-50/50 pb-20">

      {/* ---------------- HEADER ---------------- */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Nouveau Site Immobilier</h1>
            <p className="text-xs text-slate-500">Remplissez les informations pour créer un site</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
            Annuler
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-70"
          >
            {isSubmitting ? "Sauvegarde..." : <><Save size={18} /> Créer le site</>}
          </button>
        </div>
      </header>



      {/* ---------------- CONTENU ---------------- */}
      <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">


        {/* ---------------- SECTION 1 ---------------- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Building2 size={24} /></div>
            <h2 className="text-lg font-bold text-slate-800">Informations Principales</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* --- Image --- */}
            <div className="md:col-span-1">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-all group overflow-hidden relative",
                  previewImage && "border-solid"
                )}
              >
                {previewImage ? (
                  <img src={previewImage} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <ImageIcon className="text-blue-500" size={24} />
                    </div>
                    <p className="text-sm font-medium text-slate-600">Photo du site</p>
                  </>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* --- Champs textes --- */}
            <div className="md:col-span-2 space-y-5">
              <InputField
                label="Libellé du site"
                error={errors.name?.message}
                {...register("name")}
                required
                placeholder="Ex : Résidence Mapango"
              />

              <div className="grid grid-cols-2 gap-5">
                <InputField label="Référence" {...register("reference")} placeholder="Ex : MAP-001" />

                <InputField
                  label="Superficie (m²)"
                  type="number"
                  error={errors.surface?.message}
                  {...register("surface")}
                  required
                />
              </div>
            </div>
          </div>
        </motion.div>



        {/* ---------------- SECTION 2 ---------------- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><MapPin size={24} /></div>
            <h2 className="text-lg font-bold text-slate-800">Localisation & Coordonnées</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* --- Provinces --- */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Province <span className="text-red-500">*</span>
              </label>

              <select
                {...register("province")}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Sélectionner...</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id.toString()}>{p.name}</option>
                ))}
              </select>

              {errors.province && (
                <p className="text-xs text-red-500">{errors.province.message}</p>
              )}
            </div>


            <InputField
              label="Ville"
              error={errors.city?.message}
              required
              {...register("city")}
            />

            <div className="md:col-span-2">
              <InputField
                label="Adresse complète"
                {...register("address")}
              />
            </div>


            {/* --- GPS --- */}
            <div className="md:col-span-2 p-5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-700">Point GPS</h3>
                <button type="button" onClick={handleLocateMe}
                  className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:underline"
                >
                  <Crosshair size={14} /> Utiliser ma position
                </button>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <InputField label="Latitude" {...register("latitude")} />
                <InputField label="Longitude" {...register("longitude")} />
              </div>
            </div>
          </div>
        </motion.div>


        {/* ---------------- SECTION 3 ---------------- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-violet-50 text-violet-600 rounded-lg"><FileText size={24} /></div>
            <h2 className="text-lg font-bold text-slate-800">Documents & Assignation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="border-2 border-dashed border-blue-100 bg-blue-50/30 rounded-xl p-8 text-center cursor-pointer group">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-500 mx-auto mb-3 group-hover:scale-110">
                <UploadCloud size={24} />
              </div>
              <h4 className="text-sm font-bold text-slate-700">Document de référence</h4>
              <p className="text-xs text-slate-500">PDF, DOCX, JPG</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">
                  Superviseur du site
                </label>

                <select
                  {...register("supervisor")}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600"
                >
                  <option value="">Sélectionner...</option>
                  <option value="1">Jean Kabuya</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </form>
  );
}


// ----------------------------
// 🔹 InputField typé correctement
// ----------------------------
interface InputFieldProps {
  label: string;
  error?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

const InputField = ({
  label,
  error,
  placeholder,
  type = "text",
  required,
  ...rest
}: InputFieldProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700 flex justify-between">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        {...rest}
        type={type}
        placeholder={placeholder}
        className={cn(
          "w-full p-3 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all",
          error ? "border-red-400" : "border-slate-200"
        )}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
