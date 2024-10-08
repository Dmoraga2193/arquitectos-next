import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arquitectos Next Web",
  description: "Aplicación web para arquitectos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <WhatsAppButton
          phoneNumber="56938706522"
          message="Hola, me gustaría obtener más información sobre sus servicios."
        />
        <Toaster />
      </body>
    </html>
  );
}
