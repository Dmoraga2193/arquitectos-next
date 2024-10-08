"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-sm shadow-md" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/images/logo.png"
                alt="Logo de Arquitectos Next Web"
                width={40}
                height={40}
                className="mr-2"
              />
              <span
                className={cn(
                  "text-2xl font-bold transition-colors duration-300",
                  isScrolled ? "text-primary" : "text-white"
                )}
              >
                Arquitectos Next
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300",
                    isScrolled
                      ? "text-gray-800 hover:text-primary"
                      : "text-white hover:text-gray-300"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              className={cn(
                "transition-colors duration-300",
                isScrolled ? "text-gray-800" : "text-white"
              )}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out",
          isOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div
          className={cn(
            "px-2 pt-2 pb-3 space-y-1 sm:px-3",
            isScrolled
              ? "bg-white/80 backdrop-blur-md"
              : "bg-gray-800/80 backdrop-blur-md"
          )}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300",
                isScrolled
                  ? "text-gray-800 hover:text-primary"
                  : "text-white hover:text-gray-300"
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
