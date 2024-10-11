"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Briefcase, User, Clock } from "lucide-react";

export default function Estadisticas() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [projectsCount, setProjectsCount] = useState(0);
  const [satisfactionRate, setSatisfactionRate] = useState(0);
  const [yearsExperience, setYearsExperience] = useState(0);

  useEffect(() => {
    if (inView) {
      const projectsInterval = setInterval(() => {
        setProjectsCount((prev) => Math.min(prev + 10, 500));
      }, 40);

      const satisfactionInterval = setInterval(() => {
        setSatisfactionRate((prev) => Math.min(prev + 1, 98));
      }, 40);

      const yearsInterval = setInterval(() => {
        setYearsExperience((prev) => Math.min(prev + 1, 15));
      }, 200);

      return () => {
        clearInterval(projectsInterval);
        clearInterval(satisfactionInterval);
        clearInterval(yearsInterval);
      };
    }
  }, [inView]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-blue-900 text-white rounded-lg mb-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Briefcase className="w-40 h-40 text-white" />
            </div>
            <h3 className="text-4xl font-bold mb-2 relative" aria-live="polite">
              {projectsCount}+
            </h3>
            <p className="text-xl relative">Proyectos Completados</p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <User className="w-40 h-40 text-white" />
            </div>
            <h3 className="text-4xl font-bold mb-2 relative" aria-live="polite">
              {satisfactionRate}%
            </h3>
            <p className="text-xl relative">Clientes Satisfechos</p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Clock className="w-40 h-40 text-white" />
            </div>
            <h3 className="text-4xl font-bold mb-2 relative" aria-live="polite">
              {yearsExperience}
            </h3>
            <p className="text-xl relative">Años de Experiencia</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
