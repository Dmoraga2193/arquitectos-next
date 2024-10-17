"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { name: "Inicio", href: "#inicio" },
  { name: "Conócenos", href: "#conocenos" },
  { name: "Servicios", href: "#servicios" },
  { name: "Testimonios", href: "#testimonios" },
  { name: "FAQ", href: "#faq" },
  { name: "Cotiza", href: "#cotiza" },
  { name: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("Inicio");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-colorfondo/85 backdrop-blur-sm shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/images/logo.png"
              alt="Logo de Arquitectos Next Web"
              width={50}
              height={50}
              className="mr-2"
            />
            <span
              className={cn(
                "text-2xl font-bold transition-colors duration-300",
                isScrolled ? "text-gray-800" : "text-white"
              )}
            >
              Arquitectos Next
            </span>
          </Link>
          <div className="hidden md:flex  items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-base font-medium transition-colors duration-300",
                    isScrolled
                      ? "text-gray-800 hover:text-gray-600"
                      : "text-white hover:text-gray-300"
                  )}
                  onMouseEnter={() => setActiveItem(item.name)}
                  onClick={() => setActiveItem(item.name)}
                >
                  {item.name}
                </Link>
                {activeItem === item.name && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-acento"
                    layoutId="underline"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "transition-colors duration-300",
                isScrolled ? "text-gray-800" : "text-white"
              )}
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                onClick={() => {
                  setIsOpen(false);
                  setActiveItem(item.name);
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
