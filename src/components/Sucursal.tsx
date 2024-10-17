import { Card, CardContent } from "./ui/card";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function Sucursal() {
  return (
    <section id="contacto" className="py-20">
      <div className="container mx-auto px-4" data-aos="zoom-in">
        <h2 className="text-4xl font-bold text-center text-acento mb-12">
          Nuestra Sucursal
        </h2>
        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 bg-primario text-white">
                <h3 className="text-2xl font-semibold mb-6">
                  Información de Contacto
                </h3>
                <div className="space-y-4">
                  <p className="flex items-start">
                    <MapPin className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                    <span>
                      Radal del Obispo Francisco Anabalón Duarte 1015, 8500771
                      Quinta Normal, Región Metropolitana
                    </span>
                  </p>
                  <p className="flex items-center">
                    <Phone className="h-6 w-6 mr-4 flex-shrink-0" />
                    <span>+56 2 2345 6789</span>
                  </p>
                  <p className="flex items-center">
                    <Mail className="h-6 w-6 mr-4 flex-shrink-0" />
                    <span>contacto@arquitectosnext.cl</span>
                  </p>
                </div>
              </div>
              <div className="p-8 bg-white">
                <h3 className="text-2xl font-semibold mb-6 text-primario">
                  Horario de Atención
                </h3>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-acento" />
                    <span>Lunes a Jueves: 8:30 AM - 6:00 PM</span>
                  </p>
                  <p className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-acento" />
                    <span>Viernes: 8:30 AM - 4:45 PM</span>
                  </p>
                  <p className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-acento" />
                    <span>Sábado y Domingo: Cerrado</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="relative mt-20" data-aos="zoom-in">
          <div className="absolute inset-0 bg-blue-200 transform rotate-3 rounded-lg shadow-lg"></div>
          <div className="absolute inset-0 bg-white transform -rotate-3 rounded-lg shadow-lg"></div>
          <div className="relative bg-white p-4 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d699.8964686150196!2d-70.7027135670081!3d-33.441817032144115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c46fa6a860c7%3A0xb4d5edc02fce12df!2sRadal%20del%20Obispo%20Francisco%20Anabal%C3%B3n%20Duarte%201015%2C%208500771%20Quinta%20Normal%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1728328131503!5m2!1ses-419!2scl"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de nuestra sucursal"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
