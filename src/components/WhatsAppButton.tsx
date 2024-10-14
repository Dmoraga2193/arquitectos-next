"use client";
import React, { useState } from "react";
import { Phone } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed right-4 bottom-20 z-50 flex items-center bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 ${
        isHovered ? "pr-4 pl-1" : "p-1"
      }`}
      aria-label="Contactar por WhatsApp"
    >
      <span className={`p-2 rounded-full ${isHovered ? "animate-pulse" : ""}`}>
        <Phone size={24} />
      </span>
      <span
        className={`font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ${
          isHovered ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
        }`}
      >
        Comunicate por WhatsApp
      </span>
      <span
        className={`absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transition-all duration-300 ${
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        1
      </span>
    </button>
  );
};

export default WhatsAppButton;
