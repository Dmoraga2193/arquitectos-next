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
import "@fontsource/inter";
import "./globals.css";

const libraries: "places"[] = ["places"];

export default function LeyDelMonoPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCfNUS9Q8jhQNsOVwfsX__Q4B2zdhtSr7o",
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
  ]);

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <header className="bg-stone-800 text-white">
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
        <section className="mb-12 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-3xl font-semibold mb-4 flex items-center text-stone-800">
            <Users className="mr-2" /> Conócenos
          </h2>
          <p className="text-lg mb-4 text-stone-700">
            Somos un grupo de arquitectos especializados en la regularización de
            proyectos bajo la Ley del Mono chilena. Nuestro objetivo es ayudar a
            propietarios a legalizar sus construcciones de manera eficiente y
            profesional.
          </p>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
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
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-stone-800">
            Nuestros Servicios
          </h2>
          <p className="text-lg mb-6 text-stone-700">
            Ofrecemos servicios profesionales para regularizar su propiedad de
            acuerdo a la Ley del Mono, asegurando que su construcción cumpla con
            todas las normativas vigentes.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
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
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                {service.icon}
                <h3 className="text-xl font-semibold mb-2 text-stone-800">
                  {service.title}
                </h3>
                <p className="text-stone-700">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Formulario de Cotización */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 text-stone-800">
            Solicite una Cotización
          </h2>
          <form className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="direccion"
                className="block text-sm font-medium text-stone-700"
              >
                Dirección
              </label>
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
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="h-5 w-5 text-stone-400" />
                  </div>
                  <input
                    type="text"
                    name="direccion"
                    id="direccion"
                    className="focus:ring-stone-500 focus:border-stone-500 block w-full pl-10 sm:text-sm border-stone-300 rounded-md"
                    placeholder="Ingrese la dirección"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>
              </Autocomplete>
              {errors.direccion && (
                <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="telefono"
                className="block text-sm font-medium text-stone-700"
              >
                Teléfono
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="tel"
                  name="telefono"
                  id="telefono"
                  className="focus:ring-stone-500 focus:border-stone-500 block w-full pl-10 sm:text-sm border-stone-300 rounded-md"
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
              <label
                htmlFor="largo"
                className="block text-sm font-medium text-stone-700"
              >
                Largo del Terreno (m)
              </label>
              <input
                type="number"
                name="largo"
                id="largo"
                className="mt-1 focus:ring-stone-500 focus:border-stone-500 block w-full sm:text-sm border-stone-300 rounded-md"
                placeholder="Ej: 20"
                value={formData.largo}
                onChange={handleInputChange}
              />
              {errors.largo && (
                <p className="mt-1 text-sm text-red-600">{errors.largo}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="ancho"
                className="block text-sm font-medium text-stone-700"
              >
                Ancho del Terreno (m)
              </label>
              <input
                type="number"
                name="ancho"
                id="ancho"
                className="mt-1 focus:ring-stone-500 focus:border-stone-500 block w-full sm:text-sm border-stone-300 rounded-md"
                placeholder="Ej: 15"
                value={formData.ancho}
                onChange={handleInputChange}
              />
              {errors.ancho && (
                <p className="mt-1 text-sm text-red-600">{errors.ancho}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="pisos"
                className="block text-sm font-medium text-stone-700"
              >
                Número de Pisos
              </label>
              <select
                name="pisos"
                id="pisos"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-stone-300 focus:outline-none focus:ring-stone-500 focus:border-stone-500 sm:text-sm rounded-md"
                value={formData.pisos}
                onChange={handleInputChange}
              >
                <option value="1">1 piso</option>
                <option value="2">2 pisos</option>
                <option value="3+">3 o más pisos</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="anoConstruccion"
                className="block text-sm font-medium text-stone-700"
              >
                Año de Construcción
              </label>
              <input
                type="number"
                name="anoConstruccion"
                id="anoConstruccion"
                className="mt-1 focus:ring-stone-500 focus:border-stone-500 block w-full sm:text-sm border-stone-300 rounded-md"
                placeholder="Ej: 1990"
                value={formData.anoConstruccion}
                onChange={handleInputChange}
              />
              {errors.anoConstruccion && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.anoConstruccion}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="superficieConstruida"
                className="block text-sm font-medium text-stone-700"
              >
                Superficie Construida (m²)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Ruler className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="number"
                  name="superficieConstruida"
                  id="superficieConstruida"
                  className="focus:ring-stone-500 focus:border-stone-500 block w-full pl-10 sm:text-sm border-stone-300 rounded-md"
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
              <label
                htmlFor="avaluoFiscal"
                className="block text-sm font-medium text-stone-700"
              >
                Avalúo Fiscal (UF)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="number"
                  name="avaluoFiscal"
                  id="avaluoFiscal"
                  className="focus:ring-stone-500 focus:border-stone-500 block w-full pl-10 sm:text-sm border-stone-300 rounded-md"
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
              <label
                htmlFor="tipoPropiedad"
                className="block text-sm font-medium text-stone-700"
              >
                Tipo de Propiedad
              </label>
              <select
                name="tipoPropiedad"
                id="tipoPropiedad"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-stone-300 focus:outline-none focus:ring-stone-500 focus:border-stone-500 sm:text-sm rounded-md"
                value={formData.tipoPropiedad}
                onChange={handleInputChange}
              >
                <option value="vivienda">Vivienda</option>
                <option value="microempresa">Microempresa</option>
                <option value="equipamientoSocial">Equipamiento Social</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                id="subsidio27F"
                name="subsidio27F"
                type="checkbox"
                className="h-4 w-4 text-stone-600 focus:ring-stone-500 border-stone-300 rounded"
                checked={formData.subsidio27F}
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor="subsidio27F"
                className="ml-2 block text-sm text-stone-900"
              >
                ¿Tiene subsidio 27F?
              </label>
            </div>
            <div className="md:col-span-2">
              <div className="bg-stone-100 p-4 rounded-md mt-4">
                <h4 className="text-lg font-semibold flex items-center text-stone-800">
                  <Calculator className="h-5 w-5 mr-2" />
                  Área Total del Terreno
                </h4>
                <p className="text-2xl font-bold text-stone-600">
                  {calcularAreaTerreno()} m²
                </p>
              </div>
            </div>
            <div className="md:col-span-2">
              <div
                className={`p-4 rounded-md mt-4 ${
                  cumpleRequisitos === null
                    ? "bg-gray-100"
                    : cumpleRequisitos
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
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
                {!cumpleRequisitos && requisitosIncumplidos.length > 0 && (
                  <ul className="list-disc list-inside mt-2 text-sm text-red-700">
                    {requisitosIncumplidos.map((requisito, index) => (
                      <li key={index}>{requisito}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={calcularCotizacion}
                className="w-full bg-stone-600 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Calcular Cotización
              </button>
            </div>
            {showCotizacion && (
              <div className="md:col-span-2">
                <div className="bg-green-100 p-4 rounded-md mt-4">
                  <h4 className="text-lg font-semibold flex items-center text-green-800">
                    <Calculator className="h-5 w-5 mr-2" />
                    Cotización Estimada
                  </h4>
                  <p className="text-2xl font-bold text-green-600">
                    ${cotizacion.toLocaleString("es-CL")} CLP
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    *Este es un valor estimado. La cotización final puede variar
                    según la complejidad del proyecto.
                  </p>
                </div>
              </div>
            )}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-stone-800 hover:bg-stone-900 text-white font-bold py-2 px-4 rounded-md transition duration-300 mt-4"
              >
                Solicitar Cotización Detallada
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-800 text-white py-6">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <p>
            &copy; 2024 Arquitectos Ley del Mono. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
