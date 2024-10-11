import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, FileText, Shield, Users } from "lucide-react";

const nosotros = [
  {
    icon: <CheckSquare className="h-8 w-8 text-blue-600" />,
    title: "Evaluación Integral",
    description: "Evaluamos y regularizamos todo tipo de construcciones",
  },
  {
    icon: <FileText className="h-8 w-8 text-blue-600" />,
    title: "Gestión de Trámites",
    description:
      "Gestionamos todos los trámites necesarios ante las autoridades competentes",
  },
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "Asesoría Personalizada",
    description: "Ofrecemos asesoría personalizada durante todo el proceso",
  },
  {
    icon: <Shield className="h-8 w-8 text-blue-600" />,
    title: "Cumplimiento Normativo",
    description:
      "Garantizamos el cumplimiento de todas las normativas vigentes",
  },
];

export default function Conocenos() {
  return (
    <Card
      id="conocenos"
      className="mb-12 overflow-hidden shadow-lg"
      data-aos="zoom-in"
    >
      <CardHeader className="bg-blue-800 text-white p-6">
        <CardTitle className="text-3xl font-bold flex items-center">
          <Users className="mr-3 h-8 w-8" /> Conócenos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-lg mb-8 text-gray-700 leading-relaxed">
          Somos un grupo de arquitectos especializados en la regularización de
          proyectos bajo la Ley del Mono chilena. Nuestro objetivo es ayudar a
          propietarios a legalizar sus construcciones de manera eficiente y
          profesional.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {nosotros.map((service, index) => (
            <div
              key={index}
              className="flex items-start bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex-shrink-0 mr-4">{service.icon}</div>
              <div>
                <h3 className="font-semibold text-xl mb-2 text-blue-800">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
