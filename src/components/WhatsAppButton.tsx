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
        isHovered ? "pr-4" : ""
      }`}
      aria-label="Contactar por WhatsApp"
    >
      <span className="p-3 rounded-full">
        <Phone size={24} />
      </span>
      <span
        className={`font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ${
          isHovered ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
        }`}
      >
        Comunicate por WhatsApp
      </span>
    </button>
  );
};

export default WhatsAppButton;
