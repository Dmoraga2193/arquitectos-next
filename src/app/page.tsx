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
  Check,
  X,
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

const libraries: "places"[] = ["places"];

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
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
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
              <Users className="mr-2" /> Conócenos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4 text-gray-700">
              Somos un grupo de arquitectos especializados en la regularización
              de proyectos bajo la Ley del Mono chilena. Nuestro objetivo es
              ayudar a propietarios a legalizar sus construcciones de manera
              eficiente y profesional.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Evaluamos y regularizamos todo tipo de construcciones</li>
              <li>
                Gestionamos todos los trámites necesarios ante las autoridades
                competentes
              </li>
              <li>Ofrecemos asesoría personalizada durante todo el proceso</li>
              <li>
                Garantizamos el cumplimiento de todas las normativas vigentes
              </li>
            </ul>
          </CardContent>
        </Card>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-blue-800">
            Nuestros Servicios
          </h2>
          <p className="text-lg mb-6 text-gray-700">
            Ofrecemos servicios profesionales para regularizar su propiedad de
            acuerdo a la Ley del Mono, asegurando que su construcción cumpla con
            todas las normativas vigentes.
          </p>
          <div className="grid md:grid-cols-3 gap-6  ">
            {[
              {
                title: "Evaluación Inicial",
                desc: "Análisis detallado de su propiedad",
                icon: <Building className="h-6 w-6 mb-2" />,
              },
              {
                title: "Regularización",
                desc: "Trámites y documentación necesaria",
                icon: <Calculator className="h-6 w-6 mb-2" />,
              },
              {
                title: "Certificación",
                desc: "Obtención de certificados de regularización",
                icon: <Calendar className="h-6 w-6 mb-2" />,
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

        {/* Formulario de Cotización */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-blue-800">
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
                          <>
                            <Check className="h-5 w-5 mr-2 text-green-600" />
                            <span className="text-green-800">
                              Cumple con los requisitos
                            </span>
                          </>
                        ) : (
                          <>
                            <X className="h-5 w-5 mr-2 text-red-600" />
                            <span className="text-red-800">
                              No cumple con los requisitos
                            </span>
                          </>
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
                  <Card className="bg-green-100">
                    <CardContent className="p-4">
                      <h4 className="text-lg font-semibold flex items-center text-green-800">
                        <Calculator className="h-5 w-5 mr-2" />
                        Cotización Estimada
                      </h4>
                      <p className="text-2xl font-bold text-green-600">
                        ${cotizacion.toLocaleString("es-CL")} CLP
                      </p>
                      <p className="text-sm text-green-700 mt-2">
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
      <footer className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-6">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <p>
            &copy; 2024 Arquitectos Ley del Mono. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
