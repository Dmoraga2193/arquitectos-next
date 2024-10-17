import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackgroundPattern from "@/components/BackgroundPattern";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arquitectos Next Web",
  description: "Aplicación web para arquitectos",
  icons: {
    icon: "/assets/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-white`}>
        <div className="relative min-h-screen">
          <BackgroundPattern />
          <div className="relative z-0">{children}</div>
          <WhatsAppButton
            phoneNumber="56938706522"
            message="Hola, me gustaría obtener más información sobre sus servicios."
          />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
