"use client";

import React, { useState, useEffect } from "react";
import {
  Calculator,
  Home,
  Phone,
  Users,
  Calendar,
  DollarSign,
  Ruler,
  CheckCircle,
  FileText,
  Shield,
  CheckSquare,
  ClipboardCheck,
  Award,
  AlertTriangle,
  AtSign,
  User,
  HousePlus,
  LandPlot,
  House,
  MapPin,
  Mail,
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
import { Separator } from "@/components/ui/separator";
import AOS from "aos";
import "aos/dist/aos.css";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

const libraries: "places"[] = ["places"];

export default function LeyDelMonoPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: libraries,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
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

  const steps = [
    "Información personal",
    "Detalles de la propiedad",
    "Información adicional",
    "Resumen",
  ];

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

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

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
    if (!formData.nombre) newErrors.nombre = "El nombre es requerido";
    if (!formData.email) newErrors.email = "El email es requerido";
    if (!formData.telefono) newErrors.telefono = "El teléfono es requerido";
    if (!formData.direccion) newErrors.direccion = "La dirección es requerida";
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
  ]);

  const validarPaso = (paso: number) => {
    const newErrors: { [key: string]: string } = {};
    switch (paso) {
      case 0:
        if (!formData.nombre) newErrors.nombre = "El nombre es requerido";
        if (!formData.email) newErrors.email = "El email es requerido";
        if (!formData.telefono) newErrors.telefono = "El teléfono es requerido";
        if (!formData.direccion)
          newErrors.direccion = "La dirección es requerida";
        break;
      case 1:
        if (!formData.largo)
          newErrors.largo = "El largo del terreno es requerido";
        if (!formData.ancho)
          newErrors.ancho = "El ancho del terreno es requerido";
        if (!formData.anoConstruccion)
          newErrors.anoConstruccion = "El año de construcción es requerido";
        break;
      case 2:
        if (!formData.superficieConstruida)
          newErrors.superficieConstruida =
            "La superficie construida es requerida";
        if (!formData.avaluoFiscal)
          newErrors.avaluoFiscal = "El avalúo fiscal es requerido";
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validarPaso(currentStep)) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      {/* Hero Section */}
      <header className="relative bg-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/fondo.jpg"
            alt="Fondo arquitectónico"
            layout="fill"
            objectFit="cover"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-blue-900 opacity-60"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 py-24 max-w-4xl flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-yellow-300 drop-shadow-lg">
              Regularización Sin Complicaciones
            </h1>
            <p className="text-xl font-semibold text-white drop-shadow-md">
              Navegamos por ti la Ley del Mono. Asegura el futuro de tu
              propiedad con nuestro equipo de arquitectos especializados.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source
                  src="/assets/videos/video_hero.webm"
                  type="video/webm"
                />
                Tu navegador no soporta el elemento de video.
              </video>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Sección Conócenos */}
        <Card className="mb-12" data-aos="zoom-in">
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
          <h2
            className="text-3xl font-semibold mb-4 text-blue-800 text-center"
            data-aos="zoom-in"
          >
            Nuestros Servicios
          </h2>
          <p
            className="text-lg mb-6 text-gray-700 text-center"
            data-aos="zoom-in"
          >
            Ofrecemos servicios profesionales para regularizar su propiedad de
            acuerdo a la Ley del Mono, asegurando que su construcción cumpla con
            todas las normativas vigentes.
          </p>
          <div className="grid md:grid-cols-3 gap-6 " data-aos="zoom-in-up">
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
                className="transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
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
              <h2
                className="text-3xl font-semibold text-center text-blue-800 dark:text-gray-100 mb-8"
                data-aos="zoom-in"
              >
                Lo que dicen nuestros clientes
              </h2>
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                data-aos="zoom-in-up"
              >
                {testimonials.map((testimonial, index) => (
                  <Card
                    key={index}
                    className="bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-3"
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
            <h2
              className="text-3xl font-semibold mb-6 text-blue-800 dark:text-blue-300 text-center"
              data-aos="flip-up"
            >
              Preguntas Frecuentes
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger
                    className="text-left font-semibold text-gray-800 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
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

        {/* Sección de Estadísticas */}
        <motion.section
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="py-12 bg-blue-900 text-white rounded-lg mb-12"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-4xl font-bold mb-2" aria-live="polite">
                  {projectsCount}+
                </h3>
                <p className="text-xl">Proyectos Completados</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold mb-2" aria-live="polite">
                  {satisfactionRate}%
                </h3>
                <p className="text-xl">Clientes Satisfechos</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold mb-2" aria-live="polite">
                  {yearsExperience}
                </h3>
                <p className="text-xl">Años de Experiencia</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Formulario de Cotización */}
        <Card className="w-full max-w-4xl mx-auto" data-aos="zoom-in">
          <CardHeader>
            <CardTitle>Solicitar Cotización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`flex items-center ${
                      index <= currentStep
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index <= currentStep
                          ? "bg-blue-900 text-white"
                          : "bg-muted"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="ml-2 text-sm hidden sm:inline">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <div className="relative mt-1">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="nombre"
                      name="nombre"
                      className="pl-10"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ingrese su nombre completo"
                    />
                  </div>

                  {errors.nombre && (
                    <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative mt-1">
                    <AtSign
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ingrese su correo electrónico"
                    />
                  </div>

                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
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
                    <p className="mt-1 text-sm text-red-600">
                      {errors.telefono}
                    </p>
                  )}
                </div>
                <div>
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
                    <p className="text-sm text-red-500 mt-1">
                      {errors.direccion}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="largo">Largo del terreno (metros)</Label>
                  <div className="relative mt-1">
                    <Ruler
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="largo"
                      name="largo"
                      type="number"
                      className="pl-10"
                      value={formData.largo}
                      onChange={handleInputChange}
                      placeholder="Ingrese el largo del terreno. Ej: 20"
                    />
                  </div>

                  {errors.largo && (
                    <p className="text-sm text-red-500 mt-1">{errors.largo}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="ancho">Ancho del terreno (metros)</Label>
                  <div className="relative mt-1">
                    <Ruler
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="ancho"
                      name="ancho"
                      type="number"
                      className="pl-10"
                      value={formData.ancho}
                      onChange={handleInputChange}
                      placeholder="Ingrese el ancho del terreno. Ej: 10"
                    />
                  </div>

                  {errors.ancho && (
                    <p className="text-sm text-red-500 mt-1">{errors.ancho}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="pisos">Número de Pisos</Label>
                  <div className="relative mt-1">
                    <HousePlus
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Select
                      name="pisos"
                      value={formData.pisos}
                      onValueChange={(value) =>
                        handleInputChange({
                          target: { name: "pisos", value },
                        } as any)
                      }
                    >
                      <SelectTrigger className="mt-1 pl-10">
                        <SelectValue placeholder="Seleccione número de pisos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 piso</SelectItem>
                        <SelectItem value="2">2 pisos</SelectItem>
                        <SelectItem value="3+">3 o más pisos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="anoConstruccion">Año de construcción</Label>
                  <div className="relative mt-1">
                    <Calendar
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="anoConstruccion"
                      name="anoConstruccion"
                      type="number"
                      className="pl-10"
                      value={formData.anoConstruccion}
                      onChange={handleInputChange}
                      placeholder="Ingrese el año de construcción"
                    />
                  </div>

                  {errors.anoConstruccion && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.anoConstruccion}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="superficieConstruida">
                    Superficie construida (m²)
                  </Label>
                  <div className="relative mt-1">
                    <LandPlot
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="superficieConstruida"
                      name="superficieConstruida"
                      type="number"
                      className="pl-10"
                      value={formData.superficieConstruida}
                      onChange={handleInputChange}
                      placeholder="Ingrese la superficie construida"
                    />
                  </div>

                  {errors.superficieConstruida && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.superficieConstruida}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="avaluoFiscal">Avalúo fiscal (UF)</Label>
                  <div className="relative mt-1">
                    <DollarSign
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="avaluoFiscal"
                      name="avaluoFiscal"
                      type="number"
                      className="pl-10"
                      value={formData.avaluoFiscal}
                      onChange={handleInputChange}
                      placeholder="Ingrese el avalúo fiscal. Ej: 1000"
                    />
                  </div>

                  {errors.avaluoFiscal && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.avaluoFiscal}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="tipoPropiedad">Tipo de Propiedad</Label>
                  <div className="relative mt-1">
                    <House
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Select
                      name="tipoPropiedad"
                      value={formData.tipoPropiedad}
                      onValueChange={(value) =>
                        handleInputChange({
                          target: { name: "tipoPropiedad", value },
                        } as any)
                      }
                    >
                      <SelectTrigger className="mt-1 pl-10">
                        <SelectValue placeholder="Seleccione tipo de propiedad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vivienda">Vivienda</SelectItem>
                        <SelectItem value="microempresa">
                          Microempresa
                        </SelectItem>
                        <SelectItem value="equipamientoSocial">
                          Equipamiento Social
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Resumen de la cotización
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nombre</p>
                      <p className="font-medium">{formData.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-medium">{formData.telefono}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dirección</p>
                      <p className="font-medium">{formData.direccion}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Dimensiones del terreno
                      </p>
                      <p className="font-medium">
                        {formData.largo}m x {formData.ancho}m
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Número de pisos</p>
                      <p className="font-medium">{formData.pisos}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Año de construcción
                      </p>
                      <p className="font-medium">{formData.anoConstruccion}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Superficie construida
                      </p>
                      <p className="font-medium">
                        {formData.superficieConstruida} m²
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Avalúo fiscal</p>
                      <p className="font-medium">{formData.avaluoFiscal} UF</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tipo de propiedad</p>
                      <p className="font-medium">{formData.tipoPropiedad}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Subsidio 27F</p>
                      <p className="font-medium">
                        {formData.subsidio27F ? "Sí" : "No"}
                      </p>
                    </div>
                  </div>
                </div>

                {cumpleRequisitos ? (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="text-green-500" />
                        <h4 className="text-lg font-semibold text-green-700">
                          Cumple con los requisitos
                        </h4>
                      </div>
                      <p className="mt-2 text-green-600">
                        Su propiedad cumple con los requisitos para acogerse a
                        la Ley del Mono.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="text-red-500" />
                        <h4 className="text-lg font-semibold text-red-700">
                          No cumple con los requisitos
                        </h4>
                      </div>
                      <p className="mt-2 text-red-600">
                        Su propiedad no cumple con todos los requisitos para
                        acogerse a la Ley del Mono. Revise los siguientes
                        puntos:
                      </p>
                      <ul className="list-disc list-inside mt-2 text-sm text-red-600">
                        {requisitosIncumplidos.map((requisito, index) => (
                          <li key={index}>{requisito}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {showCotizacion && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Calculator className="text-green-500" />
                        <h4 className="text-lg font-semibold text-green-700">
                          Cotización Estimada
                        </h4>
                      </div>
                      <p className="mt-2 text-3xl font-bold text-green-600">
                        ${cotizacion.toLocaleString("es-CL")} CLP
                      </p>
                      <p className="text-sm text-green-600 mt-2">
                        *Este es un valor estimado. La cotización final puede
                        variar según la complejidad del proyecto.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <Separator className="my-6" />

            <div className="mt-8 flex justify-between">
              {currentStep > 0 && (
                <Button onClick={prevStep} variant="outline">
                  Anterior
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-blue-500 to-blue-900 text-white"
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  onClick={calcularCotizacion}
                  disabled={!cumpleRequisitos}
                  className="bg-green-600 text-white"
                >
                  Solicitar Cotización
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Nueva sección: Nuestra Sucursal */}
        <section className="mb-12 mt-12">
          <h2
            className="text-3xl font-semibold text-blue-800 text-center mb-8"
            data-aos="zoom-in"
          >
            Nuestra Sucursal
          </h2>
          <Card className="mb-6" data-aos="fade-up">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-800">
                    Información de Contacto
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <MapPin className="h-10 w-10 text-blue-600 mr-2" />
                      Radal del Obispo Francisco Anabalón Duarte 1015, 8500771
                      Quinta Normal, Región Metropolitana
                    </p>
                    <p className="flex items-center">
                      <Phone className="h-5 w-5 text-blue-600 mr-2" />
                      +56 2 2345 6789
                    </p>
                    <p className="flex items-center">
                      <Mail className="h-5 w-5 text-blue-600 mr-2" />
                      contacto@arquitectosnext.cl
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-800">
                    Horario de Atención
                  </h3>
                  <p>Lunes a Jueves: 8:30 AM - 6:00 PM</p>
                  <p>Viernes: 8:30 AM - 4:45 PM</p>
                  <p>Sabado y Domingo: Cerrado</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="relative mt-8" data-aos="zoom-in">
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
        </section>
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
