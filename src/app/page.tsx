"use client";

import React, { useEffect } from "react";

import { useLoadScript } from "@react-google-maps/api";
import "@fontsource/inter";
import "./globals.css";
import AOS from "aos";
import "aos/dist/aos.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Servicios from "@/components/Servicios";
import Conocenos from "@/components/Conocenos";
import Estadisticas from "@/components/Estadisticas";
import Faq from "@/components/Faq";
import HeroSection from "@/components/HeroSection";
import Sucursal from "@/components/Sucursal";
import Footer from "@/components/Footer";
import Cotizacion from "@/components/Cotizacion";
import Testimonios from "@/components/Testimonios";

const libraries: "places"[] = ["places"];

export default function LeyDelMonoPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: libraries,
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen  font-sans">
      <Navbar />
      <SmoothScroll />
      <HeroSection />
      {/* Contenido Principal */}
      <main className="container mx-auto px-4  max-w-4xl py-16">
        <Conocenos />
        <Servicios />
        <Testimonios />
        <Faq />
        <Estadisticas />
        <Cotizacion />
        <Sucursal />
      </main>
      <Footer />
    </div>
  );
}
