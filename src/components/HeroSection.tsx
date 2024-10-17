import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, Play } from "lucide-react";

const backgroundImages = [
  "/assets/images/fondo1.jpg",
  "/assets/images/fondo2.jpg",
  "/assets/images/fondo3.jpg",
];

export default function HeroSection() {
  const [currentBg, setCurrentBg] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
  };

  const scrollToCotizacion = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const cotizacionElement = document.getElementById("cotiza");
    if (cotizacionElement) {
      cotizacionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      id="inicio"
      className="relative bg-blue-900 text-segundario overflow-hidden h-screen"
    >
      {backgroundImages.map((bg, index) => (
        <Image
          key={bg}
          src={bg}
          alt={`Fondo arquitectónico ${index + 1}`}
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
          className={`transition-opacity duration-1000 ${
            index === currentBg ? "opacity-60" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-primario via-primerplano to-transparent opacity-70"></div>
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
        <div className="flex w-full items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-acento drop-shadow-lg text-shadow shadow-primario/60">
              Regularización sin complicaciones
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-white drop-shadow-md mb-8 text-shadow shadow-primario/60">
              Navegamos por ti la Ley del Mono. Asegura el futuro de tu
              propiedad con nuestro equipo de arquitectos especializados.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-acento text-primerplano font-bold py-3 px-6 rounded-full text-lg shadow-lg flex items-center"
              onClick={scrollToCotizacion}
            >
              Solicita una cotización <ArrowRight className="ml-2" />
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-128 h-64 rounded-lg overflow-hidden shadow-lg"
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
            >
              <source src="/assets/videos/video_hero.webm" type="video/webm" />
              Tu navegador no soporta el elemento de video.
            </video>
            {!isPlaying && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
                onClick={handleVideoClick}
              >
                <Play className="w-12 h-12 text-white" />
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="cursor-pointer"
        >
          <ChevronDown size={32} className="text-white" />
        </motion.div>
      </div>
    </header>
  );
}
