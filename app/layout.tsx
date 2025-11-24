// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // Assure-toi que le chemin est bon
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mapango | Odoo Real Estate",
  description: "Gestion immobilière connectée",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <div className="flex min-h-screen">
          
          {/* 1. On affiche la Sidebar (elle est en position: fixed dans son code CSS) */}
          <Sidebar />

          {/* 2. On crée le conteneur principal */}
          {/* 'ml-64' est CRUCIAL : il pousse le contenu de 16rem (la largeur de la sidebar) vers la droite */}
          <main className="flex-1 ml-64 transition-all duration-300 ease-in-out">
            {children}
          </main>
        </div>
        <Toaster position="top-right" richColors /> 
      </body>
    </html>
  );
}