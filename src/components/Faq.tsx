import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Qué es la Ley del Mono?",
    answer:
      "La Ley del Mono es una normativa chilena que permite regularizar ampliaciones de viviendas sin los permisos correspondientes, siempre que cumplan ciertas condiciones.",
  },
  {
    question: "¿Cuánto tiempo toma el proceso de regularización?",
    answer:
      "El tiempo de regularización puede variar dependiendo de la complejidad del proyecto y la carga de trabajo de las autoridades. En general, puede tomar entre 3 a 6 meses.",
  },
  {
    question: "¿Cuáles son los requisitos para regularizar una ampliación?",
    answer:
      "Los requisitos incluyen contar con un plano de la ampliación, cumplir con las normas de seguridad y contar con la autorización de los vecinos, entre otros.",
  },
  {
    question: "¿Cuál es el costo aproximado de la regularización?",
    answer:
      "El costo puede variar dependiendo del tamaño de la ampliación y otros factores, pero generalmente el costo base es de 500,000 CLP más otros gastos administrativos.",
  },
  {
    question:
      "¿Es necesario contratar a un arquitecto para regularizar una ampliación?",
    answer:
      "Sí, es recomendable contratar a un arquitecto para asegurarse de que la ampliación cumpla con todas las normativas y para facilitar el proceso de regularización.",
  },
  {
    question: "¿Qué sucede si no regularizo mi ampliación?",
    answer:
      "Si no regularizas tu ampliación, podrías enfrentar multas y problemas legales, especialmente si decides vender la propiedad o si las autoridades realizan inspecciones.",
  },

  // Añade más preguntas y respuestas según sea necesario
];

export default function Faq() {
  return (
    <section id="faq" className="mb-12 scroll-mt-20">
      <div className="max-w-4xl mx-auto p-4">
        <h2
          className="text-4xl font-bold mb-6 text-acento dark:text-blue-300 text-center"
          data-aos="flip-up"
        >
          Preguntas Frecuentes
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger
                className="text-left font-semibold text-primario dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-lg"
                data-aos="flip-up"
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
