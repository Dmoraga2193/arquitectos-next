"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (
        target.hash &&
        target.origin + target.pathname === window.location.href
      ) {
        e.preventDefault();
        const targetId = target.hash.slice(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const navbarHeight = 64; // Ajusta esto a la altura de tu navbar
          const targetPosition =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset -
            navbarHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
          history.pushState(null, "", target.hash);
        }
      }
    };

    document.body.addEventListener("click", handleClick);
    return () => document.body.removeEventListener("click", handleClick);
  }, []);

  return null;
}
