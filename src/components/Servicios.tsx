import { Card, CardContent } from "@/components/ui/card";
import { Award, ClipboardCheck, FileText } from "lucide-react";

const services = [
  {
    title: "Evaluación Inicial",
    desc: "Análisis detallado de su propiedad",
    icon: <ClipboardCheck className="h-10 w-10 text-blue-600" />,
  },
  {
    title: "Regularización",
    desc: "Trámites y documentación necesaria",
    icon: <FileText className="h-10 w-10 text-blue-600" />,
  },
  {
    title: "Certificación",
    desc: "Obtención de certificados de regularización",
    icon: <Award className="h-10 w-10 text-blue-600" />,
  },
];

export default function Servicios() {
  return (
    <section id="servicios" className="py-20">
      <div className="container mx-auto px-4">
        <h2
          className="text-4xl font-bold mb-6 text-blue-800 text-center"
          data-aos="zoom-in"
        >
          Nuestros Servicios
        </h2>
        <p
          className="text-xl mb-12 text-gray-700 text-center max-w-3xl mx-auto"
          data-aos="zoom-in"
        >
          Ofrecemos servicios profesionales para regularizar su propiedad de
          acuerdo a la Ley del Mono, asegurando que su construcción cumpla con
          todas las normativas vigentes.
        </p>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          data-aos="zoom-in-up"
        >
          {services.map((service, index) => (
            <Card
              key={index}
              className="transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <CardContent className="p-6 flex items-start">
                <div className="mr-4 mt-1">{service.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-800">
                    {service.title}
                  </h3>
                  <p className="text-gray-700">{service.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
