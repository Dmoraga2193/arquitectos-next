import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QuoteIcon } from "lucide-react";

interface Testimonial {
  name: string;
  avatar: string;
  testimonial: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "María González",
    avatar: "/assets/images/avatar.png",
    testimonial:
      "Gracias a este servicio, pude regularizar mi ampliación rápidamente y sin complicaciones.",
    rating: 5,
  },
  {
    name: "Juan Pérez",
    avatar: "/assets/images/avatar.png",
    testimonial:
      "El equipo de arquitectos fue muy profesional y me guió en todo el proceso. Altamente recomendado.",
    rating: 4,
  },
  {
    name: "Ana Ramírez",
    avatar: "/assets/images/avatar.png",
    testimonial:
      "Estoy muy satisfecha con el servicio. Todo fue claro y transparente desde el principio, y pude cumplir con todos los requisitos legales sin problemas.",
    rating: 5,
  },
];

export default function Testimonios() {
  return (
    <section id="testimonios" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-4xl font-bold mb-12 text-center text-blue-800 dark:text-blue-300"
          data-aos="fade-up"
        >
          Lo que dicen nuestros clientes
        </h2>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 relative overflow-hidden">
      <CardContent className="p-6">
        <QuoteIcon className="absolute top-4 right-4 text-blue-100 dark:text-blue-700 w-12 h-12 opacity-50" />
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-4 border-2 border-gray-300">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            <AvatarFallback>
              {testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {testimonial.name}
            </p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 italic">{`"${testimonial.testimonial}"`}</p>
      </CardContent>
    </Card>
  );
}
