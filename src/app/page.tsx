"use client";

import React, { useState, useEffect } from "react";
import {
  Calculator,
  Home,
  Phone,
  Users,
  Building,
  Calendar,
  DollarSign,
  Ruler,
  CheckCircle,
  XCircle,
  FileText,
  Shield,
  CheckSquare,
  ClipboardCheck,
  Award,
} from "lucide-react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "@fontsource/inter";
import "./globals.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import Link from "next/link";

const libraries: "places"[] = ["places"];

function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | undefined;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      setCount(Math.min(end, Math.floor((progress / duration) * end)));
      if (progress < duration) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}</span>;
}

export default function LeyDelMonoPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: libraries,
  });

  const [formData, setFormData] = useState({
    direccion: "",
    telefono: "",
    largo: "",
    ancho: "",
    pisos: "1",
    anoConstruccion: "",
    superficieConstruida: "",
    avaluoFiscal: "",
    tipoPropiedad: "vivienda",
    subsidio27F: false,
  });

  const [cotizacion, setCotizacion] = useState(0);
  const [showCotizacion, setShowCotizacion] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [cumpleRequisitos, setCumpleRequisitos] = useState<boolean | null>(
    null
  );
  const [requisitosIncumplidos, setRequisitosIncumplidos] = useState<string[]>(
    []
  );
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const calcularAreaTerreno = () => {
    const largo = parseFloat(formData.largo);
    const ancho = parseFloat(formData.ancho);
    return isNaN(largo) || isNaN(ancho) ? 0 : largo * ancho;
  };

  const validarFormulario = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.direccion) newErrors.direccion = "La dirección es requerida";
    if (!formData.telefono) newErrors.telefono = "El teléfono es requerido";
    if (!formData.largo) newErrors.largo = "El largo del terreno es requerido";
    if (!formData.ancho) newErrors.ancho = "El ancho del terreno es requerido";
    if (!formData.anoConstruccion)
      newErrors.anoConstruccion = "El año de construcción es requerido";
    if (!formData.superficieConstruida)
      newErrors.superficieConstruida = "La superficie construida es requerida";
    if (!formData.avaluoFiscal)
      newErrors.avaluoFiscal = "El avalúo fiscal es requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calcularCotizacion = () => {
    if (validarFormulario()) {
      const area = calcularAreaTerreno();
      const pisos = parseInt(formData.pisos);
      const anoConstruccion = parseInt(formData.anoConstruccion);
      const superficieConstruida = parseFloat(formData.superficieConstruida);
      const avaluoFiscal = parseFloat(formData.avaluoFiscal);
      let costoBase = 500000; // Costo base en pesos chilenos

      // Ajuste por área
      costoBase += area * 5000;

      // Ajuste por número de pisos
      if (pisos === 2) {
        costoBase *= 1.3;
      } else if (pisos >= 3) {
        costoBase *= 1.5;
      }

      // Ajuste por antigüedad
      const anoActual = new Date().getFullYear();
      if (anoConstruccion && anoActual - anoConstruccion > 20) {
        costoBase *= 1.2;
      }

      // Ajuste por tipo de propiedad y superficie
      if (formData.tipoPropiedad === "vivienda") {
        if (superficieConstruida <= 90 && avaluoFiscal <= 1000) {
          costoBase *= 0.9;
        } else if (superficieConstruida <= 140 && avaluoFiscal <= 2000) {
          costoBase *= 1.1;
        } else {
          costoBase *= 1.3;
        }
      } else if (formData.tipoPropiedad === "microempresa") {
        if (superficieConstruida <= 250) {
          costoBase *= 1.5;
        } else {
          costoBase *= 2;
        }
      } else if (formData.tipoPropiedad === "equipamientoSocial") {
        if (superficieConstruida <= 90 && avaluoFiscal <= 1000) {
          costoBase *= 0.8;
        } else {
          costoBase *= 1.2;
        }
      }

      // Ajuste por subsidio 27F
      if (formData.subsidio27F) {
        costoBase *= 0.9;
      }

      setCotizacion(Math.round(costoBase));
      setShowCotizacion(true);
      setFormSubmitted(true); // Marca el formulario como enviado
    }
  };

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

  const testimonials = [
    {
      name: "María González",
      avatar: "/avatar1.jpg",
      testimonial:
        "Gracias a este servicio, pude regularizar mi ampliación rápidamente y sin complicaciones.",
    },
    {
      name: "Juan Pérez",
      avatar: "/avatar2.jpg",
      testimonial:
        "El equipo de arquitectos fue muy profesional y me guió en todo el proceso. Altamente recomendado.",
    },
    {
      name: "Ana Ramírez",
      avatar: "/avatar3.jpg",
      testimonial:
        "Estoy muy satisfecha con el servicio. Todo fue claro y transparente desde el principio, y pude cumplir con todos los requisitos legales sin problemas.",
    },

    // Añade más testimonios según sea necesario
  ];

  useEffect(() => {
    const superficieConstruida = parseFloat(formData.superficieConstruida);
    const avaluoFiscal = parseFloat(formData.avaluoFiscal);
    const anoConstruccion = parseInt(formData.anoConstruccion);
    const incumplidos = [];

    if (superficieConstruida > 140) {
      incumplidos.push("La superficie construida supera los 140 m²");
    }
    if (avaluoFiscal > 2000) {
      incumplidos.push("El avalúo fiscal supera las 2.000 UF");
    }
    if (anoConstruccion >= 2016) {
      incumplidos.push("La construcción es posterior al 4 de febrero de 2016");
    }

    setRequisitosIncumplidos(incumplidos);
    setCumpleRequisitos(incumplidos.length === 0);
  }, [
    formData.superficieConstruida,
    formData.avaluoFiscal,
    formData.anoConstruccion,
    formSubmitted,
  ]);

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-800">Cargando...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">
            Regularización de Proyectos - Ley del Mono
          </h1>
          <p className="text-xl">
            Expertos en regularización de construcciones según la legislación
            chilena
          </p>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Sección Conócenos */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold flex items-center text-blue-800">
              <Users className="mr-2 h-8 w-8" /> Conócenos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6 text-gray-700">
              Somos un grupo de arquitectos especializados en la regularización
              de proyectos bajo la Ley del Mono chilena. Nuestro objetivo es
              ayudar a propietarios a legalizar sus construcciones de manera
              eficiente y profesional.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <CheckSquare className="h-6 w-6 text-blue-600 mr-2 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Evaluación Integral</h3>
                  <p className="text-gray-700">
                    Evaluamos y regularizamos todo tipo de construcciones
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FileText className="h-6 w-6 text-blue-600 mr-2 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Gestión de Trámites</h3>
                  <p className="text-gray-700">
                    Gestionamos todos los trámites necesarios ante las
                    autoridades competentes
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="h-6 w-6 text-blue-600 mr-2 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Asesoría Personalizada</h3>
                  <p className="text-gray-700">
                    Ofrecemos asesoría personalizada durante todo el proceso
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Shield className="h-6 w-6 text-blue-600 mr-2 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Cumplimiento Normativo</h3>
                  <p className="text-gray-700">
                    Garantizamos el cumplimiento de todas las normativas
                    vigentes
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nuestros servicios  */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-blue-800 text-center">
            Nuestros Servicios
          </h2>
          <p className="text-lg mb-6 text-gray-700 text-center">
            Ofrecemos servicios profesionales para regularizar su propiedad de
            acuerdo a la Ley del Mono, asegurando que su construcción cumpla con
            todas las normativas vigentes.
          </p>
          <div className="grid md:grid-cols-3 gap-6  ">
            {[
              {
                title: "Evaluación Inicial",
                desc: "Análisis detallado de su propiedad",
                icon: <ClipboardCheck className="h-8 w-8 mb-4 text-blue-600" />,
              },
              {
                title: "Regularización",
                desc: "Trámites y documentación necesaria",
                icon: <FileText className="h-8 w-8 mb-4 text-blue-600" />,
              },
              {
                title: "Certificación",
                desc: "Obtención de certificados de regularización",
                icon: <Award className="h-8 w-8 mb-4 text-blue-600" />,
              },
            ].map((service, index) => (
              <Card
                className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                key={index}
              >
                <CardContent className="p-6 ">
                  {service.icon}
                  <h3 className="text-xl font-semibold mb-2 text-blue-800">
                    {service.title}
                  </h3>
                  <p className="text-gray-700">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonios */}
        <section className="mb-12">
          <div className="py-12 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-semibold text-center text-blue-800 dark:text-gray-100 mb-8">
                Lo que dicen nuestros clientes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card
                    key={index}
                    className="bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage
                            src={testimonial.avatar}
                            alt={testimonial.name}
                          />
                          <AvatarFallback>
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {testimonial.name}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {testimonial.testimonial}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Preguntas Frecuentes */}
        <section className="mb-12">
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-semibold mb-6 text-blue-800 dark:text-blue-300 text-center">
              Preguntas Frecuentes
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left font-semibold text-gray-800 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
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

        {/* Sección de Estadísticas */}
        <section className="py-12 bg-blue-900 text-white rounded-lg mb-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-4xl font-bold mb-2">
                  <CountUp end={500} />+
                </h3>
                <p className="text-xl">Proyectos Completados</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-4xl font-bold mb-2">
                  <CountUp end={98} />%
                </h3>
                <p className="text-xl">Clientes Satisfechos</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-4xl font-bold mb-2">
                  <CountUp end={15} />
                </h3>
                <p className="text-xl">Años de Experiencia</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Formulario de Cotización */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-blue-800 text-center">
              Solicite una Cotización
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Autocomplete
                  onLoad={(autocomplete) => {
                    autocomplete.setOptions({
                      types: ["address"],
                      componentRestrictions: { country: "cl" },
                    });
                  }}
                  onPlaceChanged={() => {
                    const autocomplete = document.querySelector(
                      'input[name="direccion"]'
                    ) as HTMLInputElement;
                    if (autocomplete) {
                      const place = autocomplete.value;
                      setFormData((prevState) => ({
                        ...prevState,
                        direccion: place,
                      }));
                    }
                  }}
                >
                  <div className="relative mt-1">
                    <Home
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      type="text"
                      name="direccion"
                      id="direccion"
                      className="pl-10"
                      placeholder="Ingrese la dirección"
                      value={formData.direccion}
                      onChange={handleInputChange}
                    />
                  </div>
                </Autocomplete>
                {errors.direccion && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.direccion}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <div className="relative mt-1">
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="tel"
                    name="telefono"
                    id="telefono"
                    className="pl-10"
                    placeholder="+56 9 XXXX XXXX"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.telefono && (
                  <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                )}
              </div>
              <div>
                <Label htmlFor="largo">Largo del Terreno (m)</Label>
                <div className="relative mt-1">
                  <Ruler
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="number"
                    name="largo"
                    id="largo"
                    className="pl-10"
                    placeholder="Ej: 20"
                    value={formData.largo}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.largo && (
                  <p className="mt-1 text-sm text-red-600">{errors.largo}</p>
                )}
              </div>
              <div>
                <Label htmlFor="ancho">Ancho del Terreno (m)</Label>
                <div className="relative mt-1">
                  <Ruler
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="number"
                    name="ancho"
                    id="ancho"
                    className="pl-10"
                    placeholder="Ej: 15"
                    value={formData.ancho}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.ancho && (
                  <p className="mt-1 text-sm text-red-600">{errors.ancho}</p>
                )}
              </div>
              <div>
                <Label htmlFor="pisos">Número de Pisos</Label>
                <Select
                  name="pisos"
                  value={formData.pisos}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: { name: "pisos", value },
                    } as any)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccione número de pisos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 piso</SelectItem>
                    <SelectItem value="2">2 pisos</SelectItem>
                    <SelectItem value="3+">3 o más pisos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="anoConstruccion">Año de Construcción</Label>
                <div className="relative mt-1">
                  <Calendar
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="number"
                    name="anoConstruccion"
                    id="anoConstruccion"
                    className="pl-10"
                    placeholder="Ej: 1990"
                    value={formData.anoConstruccion}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.anoConstruccion && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.anoConstruccion}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="superficieConstruida">
                  Superficie Construida (m²)
                </Label>
                <div className="relative mt-1">
                  <Building
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="number"
                    name="superficieConstruida"
                    id="superficieConstruida"
                    className="pl-10"
                    placeholder="Ej: 80"
                    value={formData.superficieConstruida}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.superficieConstruida && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.superficieConstruida}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="avaluoFiscal">Avalúo Fiscal (UF)</Label>
                <div className="relative mt-1">
                  <DollarSign
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="number"
                    name="avaluoFiscal"
                    id="avaluoFiscal"
                    className="pl-10"
                    placeholder="Ej: 1000"
                    value={formData.avaluoFiscal}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.avaluoFiscal && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.avaluoFiscal}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="tipoPropiedad">Tipo de Propiedad</Label>
                <Select
                  name="tipoPropiedad"
                  value={formData.tipoPropiedad}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: { name: "tipoPropiedad", value },
                    } as any)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccione tipo de propiedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vivienda">Vivienda</SelectItem>
                    <SelectItem value="microempresa">Microempresa</SelectItem>
                    <SelectItem value="equipamientoSocial">
                      Equipamiento Social
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="subsidio27F"
                  name="subsidio27F"
                  checked={formData.subsidio27F}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange({
                      target: { name: "subsidio27F", checked },
                    } as any)
                  }
                />
                <label
                  htmlFor="subsidio27F"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  ¿Tiene subsidio 27F?
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Users className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Subsidio para la reconstrucción de viviendas afectadas
                        por el terremoto del 27 de febrero de 2010
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="md:col-span-2">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-4">
                    <h4 className="text-lg font-semibold flex items-center text-blue-800">
                      <Calculator className="h-5 w-5 mr-2" />
                      Área Total del Terreno
                    </h4>
                    <p className="text-3xl font-bold text-blue-700 mt-2">
                      {calcularAreaTerreno()} m²
                    </p>
                  </CardContent>
                </Card>
              </div>
              {formSubmitted && (
                <div className="md:col-span-2">
                  <Card
                    className={`${
                      cumpleRequisitos === null
                        ? "bg-gray-100"
                        : cumpleRequisitos
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <CardContent className="p-4">
                      <h4 className="text-lg font-semibold flex items-center">
                        {cumpleRequisitos === null ? (
                          <span className="text-gray-800">
                            Requisitos Ley del Mono
                          </span>
                        ) : cumpleRequisitos ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            <span>Cumple con los requisitos</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <XCircle className="mr-2 h-5 w-5" />
                            <span>No cumple con los requisitos</span>
                          </div>
                        )}
                      </h4>
                      <p className="mt-2 text-sm">
                        {cumpleRequisitos === null
                          ? "Complete los campos para verificar si cumple con los requisitos."
                          : cumpleRequisitos
                          ? "Su propiedad cumple con los requisitos para acogerse a la Ley del Mono."
                          : "Su propiedad no cumple con todos los requisitos para acogerse a la Ley del Mono. Revise los siguientes puntos:"}
                      </p>
                      {!cumpleRequisitos &&
                        requisitosIncumplidos.length > 0 && (
                          <ul className="list-disc list-inside mt-2 text-sm text-red-700">
                            {requisitosIncumplidos.map((requisito, index) => (
                              <li key={index}>{requisito}</li>
                            ))}
                          </ul>
                        )}
                    </CardContent>
                  </Card>
                </div>
              )}
              <div className="md:col-span-2">
                <Button
                  type="button"
                  onClick={calcularCotizacion}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
                >
                  Calcular Cotización
                </Button>
              </div>
              {showCotizacion && (
                <div className="md:col-span-2">
                  <Card className="bg-green-100 shadow-lg">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-semibold flex items-center text-green-800 mb-4">
                        <Calculator className="h-6 w-6 mr-2" />
                        Cotización Estimada
                      </h4>
                      <p className="text-4xl font-bold text-green-600 mb-2">
                        ${cotizacion.toLocaleString("es-CL")} CLP
                      </p>
                      <p className="text-sm text-green-700 italic">
                        *Este es un valor estimado. La cotización final puede
                        variar según la complejidad del proyecto.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Arquitectos Next Web
              </h3>
              <p className="text-sm">
                Expertos en regularización de proyectos bajo la Ley del Mono
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <p className="text-sm">Email: info@arquitectosnext.cl</p>
              <p className="text-sm">Teléfono: +56 9 1234 5678</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-white hover:text-blue-400 transition-colors duration-300"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-white hover:text-blue-400 transition-colors duration-300"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-white hover:text-blue-400 transition-colors duration-300"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} Arquitectos Next Web. Todos los
              derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
