import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  AtSign,
  Building2,
  Calculator,
  Calendar,
  CheckCircle,
  Home,
  House,
  LandPlot,
  Layers,
  Mail,
  MessageSquare,
  Phone,
  Ruler,
  SquareStack,
  User,
  Users,
} from "lucide-react";
import { Autocomplete } from "@react-google-maps/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Separator } from "./ui/separator";
import { AnimatedStepper } from "./ui/AnimatedStepper";
import Toast from "./ui/ToastMejorado";
import { Badge } from "./ui/badge";

export default function Cotizacion() {
  const initialFormData = {
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    numeroPisos: "1",
    pisos: [{ largo: "", ancho: "" }],
    anoConstruccion: "",
    superficieConstruida: "",
    tipoPropiedad: "vivienda",
    subsidio27F: false,
    comentarios: "", // Nuevo campo para comentarios adicionales
  };
  const [enviandoSolicitud, setEnviandoSolicitud] = useState(false);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    numeroPisos: "1",
    pisos: [{ largo: "", ancho: "" }],
    anoConstruccion: "",
    superficieConstruida: "",
    tipoPropiedad: "vivienda",
    subsidio27F: false,
    comentarios: "", // Nuevo campo para comentarios adicionales
  });
  const [cotizacion, setCotizacion] = useState(0);
  const [showCotizacion, setShowCotizacion] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [metrosCuadrados, setMetrosCuadrados] = useState<number[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "",
    description: "",
    type: "success" as "success" | "error" | "warning",
  });

  useEffect(() => {
    const newMetrosCuadrados = formData.pisos.map((piso) => {
      const largo = parseFloat(piso.largo);
      const ancho = parseFloat(piso.ancho);
      return !isNaN(largo) && !isNaN(ancho) ? largo * ancho : 0;
    });
    setMetrosCuadrados(newMetrosCuadrados);

    // Calcular la superficie construida total
    const superficieTotal = newMetrosCuadrados.reduce(
      (total, area) => total + area,
      0
    );
    setFormData((prevState) => ({
      ...prevState,
      superficieConstruida: superficieTotal.toFixed(2),
    }));
  }, [formData.pisos]);

  const renderPisoInputs = () => {
    return formData.pisos.map((piso, index) => (
      <div key={index} className="space-y-4 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Piso {index + 1}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`piso-${index}-largo`}>Largo (metros)</Label>
            <div className="relative mt-1">
              <Ruler
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="number"
                id={`piso-${index}-largo`}
                name={`piso-${index}-largo`}
                value={piso.largo}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Ej: 10"
              />
              {errors[`piso-${index}-largo`] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors[`piso-${index}-largo`]}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor={`piso-${index}-ancho`}>Ancho (metros)</Label>
            <div className="relative mt-1">
              <Ruler
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="number"
                id={`piso-${index}-ancho`}
                name={`piso-${index}-ancho`}
                value={piso.ancho}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Ej: 8"
              />
              {errors[`piso-${index}-ancho`] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors[`piso-${index}-ancho`]}
                </p>
              )}
            </div>
          </div>
        </div>
        <div>
          <Label>Metros Cuadrados calculados</Label>
          <div className="relative mt-1">
            <SquareStack
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              value={metrosCuadrados[index]?.toFixed(2) || "0.00"}
              readOnly
              className="pl-10 bg-gray-100"
            />
          </div>
        </div>
      </div>
    ));
  };

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

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 1) {
      return digits;
    } else if (digits.length <= 5) {
      return `${digits.slice(0, 1)} ${digits.slice(1)}`;
    } else {
      return `${digits.slice(0, 1)} ${digits.slice(1, 5)} ${digits.slice(
        5,
        9
      )}`;
    }
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const newErrors = { ...errors };

      if (name.startsWith("piso")) {
        const [, index, campo] = name.split("-");
        setFormData((prev) => ({
          ...prev,
          pisos: prev.pisos.map((piso, i) =>
            i === parseInt(index) ? { ...piso, [campo]: value } : piso
          ),
        }));

        if (newErrors[name] && value) {
          delete newErrors[name];
        }
      } else if (name === "telefono") {
        const formattedValue = formatPhoneNumber(value);
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));

        if (newErrors[name] && formattedValue) {
          delete newErrors[name];
        }
      } else if (name === "comentarios") {
        setFormData((prev) => ({ ...prev, [name]: value }));
        // No necesitamos validación para comentarios ya que es opcional
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (newErrors[name] && value) {
          delete newErrors[name];
        }
      }

      setErrors(newErrors);
    },
    [errors]
  );

  const handleSelectChange = useCallback((value: string) => {
    const numPisos = parseInt(value);
    setFormData((prev) => ({
      ...prev,
      numeroPisos: value,
      pisos: Array(numPisos)
        .fill(null)
        .map((_, i) => prev.pisos[i] || { largo: "", ancho: "" }),
    }));
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  // Definición de calcularAreaTotal con useCallback
  const calcularAreaTotal = useCallback(() => {
    return formData.pisos.reduce((total, piso) => {
      const largo = parseFloat(piso.largo);
      const ancho = parseFloat(piso.ancho);
      if (!isNaN(largo) && !isNaN(ancho)) {
        return total + largo * ancho;
      }
      return total;
    }, 0);
  }, [formData.pisos]);

  const validarFormulario = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nombre) newErrors.nombre = "El nombre es requerido";
    if (!formData.email) newErrors.email = "El email es requerido";
    if (!formData.telefono) newErrors.telefono = "El teléfono es requerido";
    if (!formData.direccion) newErrors.direccion = "La dirección es requerida";
    if (!formData.anoConstruccion)
      newErrors.anoConstruccion = "El año de construcción es requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Función para calcular el precio con useCallback
  const calcularPrecio = useCallback(() => {
    if (validarFormulario()) {
      let costoBase = 500000; // Costo base en pesos chilenos
      const superficieConstruida = parseFloat(formData.superficieConstruida);

      const anoConstruccion = parseInt(formData.anoConstruccion);
      const numPisos = parseInt(formData.numeroPisos);

      // Ajuste por superficie construida
      costoBase += superficieConstruida * 5000;

      // Ajuste por número de pisos
      if (numPisos === 2) {
        costoBase *= 1.3;
      } else if (numPisos >= 3) {
        costoBase *= 1.5;
      }

      // Ajuste por antigüedad
      const anoActual = new Date().getFullYear();
      if (anoConstruccion && anoActual - anoConstruccion > 20) {
        costoBase *= 1.2;
      }

      // Ajuste por tipo de propiedad y superficie
      if (formData.tipoPropiedad === "vivienda") {
        if (superficieConstruida <= 90) {
          costoBase *= 0.9;
        } else if (superficieConstruida <= 140) {
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
        if (superficieConstruida <= 90) {
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
  }, [formData]);

  useEffect(() => {
    // Verificar que todos los campos necesarios estén completos antes de calcular el precio
    if (
      formData.nombre &&
      formData.email &&
      formData.telefono &&
      formData.direccion &&
      formData.pisos &&
      formData.anoConstruccion &&
      validarFormulario()
    ) {
      calcularPrecio();
    }
  }, [formData, calcularPrecio, validarFormulario]);

  const resetForm = () => {
    setFormData(initialFormData);
    setCotizacion(0);
    setCumpleRequisitos(false);
    setSolicitudEnviada(false);
    setCurrentStep(0); // Vuelve al primer paso
  };

  // Función para enviar la solicitud por correo electrónico
  const enviarSolicitud = async () => {
    setEnviandoSolicitud(true);
    try {
      const areaTotal = calcularAreaTotal();
      const datosParaEnviar = {
        ...formData,
        cotizacion,
        areaTotal,
        pisos: formData.pisos.map((piso) => ({
          ...piso,
          area: parseFloat(piso.largo) * parseFloat(piso.ancho),
        })),
        requisitosIncumplidos,
        cumpleRequisitos: requisitosIncumplidos.length === 0,
      };

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosParaEnviar),
      });

      if (response.ok) {
        // Eliminamos la asignación de 'data' ya que no la estamos utilizando
        await response.json(); // Consumimos la respuesta para evitar advertencias
        setSolicitudEnviada(true);
        setToastProps({
          title: "Solicitud enviada",
          description:
            "Tu solicitud está en progreso. Te responderemos a la brevedad.",
          type: "success",
        });
        setShowToast(true);
        resetForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al enviar la solicitud");
      }
    } catch (error) {
      console.error("Error:", error);
      setToastProps({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Hubo un problema al enviar tu solicitud. Por favor, intenta de nuevo más tarde.",
        type: "error",
      });
      setShowToast(true);
    } finally {
      setEnviandoSolicitud(false);
    }
  };

  useEffect(() => {
    const superficieConstruida = parseFloat(formData.superficieConstruida);

    const anoConstruccion = parseInt(formData.anoConstruccion);
    const incumplidos = [];

    if (superficieConstruida > 140) {
      incumplidos.push("La superficie construida supera los 140 m²");
    }
    if (anoConstruccion >= 2016) {
      incumplidos.push("La construcción es posterior al 4 de febrero de 2016");
    }

    setRequisitosIncumplidos(incumplidos);
    setCumpleRequisitos(incumplidos.length === 0);
  }, [formData.superficieConstruida, formData.anoConstruccion]);

  const validarPaso = (paso: number) => {
    const newErrors: { [key: string]: string } = {};
    switch (paso) {
      case 0:
        // Validación del nombre (letras y espacios)
        if (!formData.nombre) {
          newErrors.nombre = "El nombre es requerido";
        } else if (!/^[A-Za-z\s]+$/.test(formData.nombre)) {
          newErrors.nombre = "El nombre solo debe contener letras y espacios";
        }

        // Validación del email (formato de correo electrónico)
        if (!formData.email) {
          newErrors.email = "El email es requerido";
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
          newErrors.email = "El formato del email es inválido";
        }
        if (!formData.telefono) newErrors.telefono = "El teléfono es requerido";
        if (!formData.direccion)
          newErrors.direccion = "La dirección es requerida";
        break;
      case 1:
        // Validar largo y ancho de cada piso
        formData.pisos.forEach((piso, index) => {
          if (!piso.largo) {
            newErrors[`piso-${index}-largo`] = `El largo del piso ${
              index + 1
            } es requerido`;
          } else if (isNaN(Number(piso.largo)) || Number(piso.largo) <= 0) {
            newErrors[`piso-${index}-largo`] = `El largo del piso ${
              index + 1
            } debe ser un número positivo`;
          }

          if (!piso.ancho) {
            newErrors[`piso-${index}-ancho`] = `El ancho del piso ${
              index + 1
            } es requerido`;
          } else if (isNaN(Number(piso.ancho)) || Number(piso.ancho) <= 0) {
            newErrors[`piso-${index}-ancho`] = `El ancho del piso ${
              index + 1
            } debe ser un número positivo`;
          }
        });

        // Validar el año de construcción
        if (!formData.anoConstruccion) {
          newErrors.anoConstruccion = "El año de construcción es requerido";
        } else if (!/^\d{4}$/.test(formData.anoConstruccion)) {
          newErrors.anoConstruccion =
            "El año de construcción debe tener 4 dígitos";
        }
        break;
      case 2:
        if (!formData.superficieConstruida)
          newErrors.superficieConstruida =
            "La superficie construida es requerida";
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    const isValid = validarPaso(currentStep);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto" data-aos="zoom-in">
      <CardHeader id="cotiza" className="scroll-mt-20 py-18">
        <CardTitle className="text-4xl font-bold mb-6 text-blue-800 text-center">
          Solicitar Cotización
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatedStepper steps={steps} currentStep={currentStep} />

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
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                  <Phone className="text-gray-400" size={18} />
                  <span className="ml-1 text-gray-400 text-sm">+56</span>
                </div>
                <Input
                  type="tel"
                  name="telefono"
                  id="telefono"
                  className="pl-16"
                  placeholder="9 XXXX XXXX"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              </div>

              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
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
                <p className="text-sm text-red-500 mt-1">{errors.direccion}</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="numeroPisos">Número de Pisos</Label>
              <Select
                value={formData.numeroPisos}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione el número de pisos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 piso</SelectItem>
                  <SelectItem value="2">2 pisos</SelectItem>
                  <SelectItem value="3">3 pisos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {renderPisoInputs()}

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
                  value={formData.anoConstruccion}
                  onChange={handleInputChange}
                  className="pl-10"
                  placeholder="Ej: 1990"
                />
                {errors.anoConstruccion && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.anoConstruccion}
                  </p>
                )}
              </div>
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
                  readOnly
                  placeholder="Calculado automáticamente"
                />
              </div>

              {errors.superficieConstruida && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.superficieConstruida}
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
                    <SelectItem value="microempresa">Microempresa</SelectItem>
                    <SelectItem value="equipamientoSocial">
                      Equipamiento Social
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="comentarios">
                Comentarios adicionales (opcional)
              </Label>
              <Textarea
                id="comentarios"
                name="comentarios"
                placeholder="Ingrese cualquier comentario o información adicional aquí"
                value={formData.comentarios}
                onChange={handleInputChange}
                className="mt-1"
              />
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
                      Subsidio para la reconstrucción de viviendas afectadas por
                      el terremoto del 27 de febrero de 2010
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">
                  Resumen de la cotización
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Nombre
                        </p>
                        <p className="font-semibold">{formData.nombre}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Email
                        </p>
                        <p className="font-semibold">{formData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Teléfono
                        </p>
                        <p className="font-semibold">{formData.telefono}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Home className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Dirección
                        </p>
                        <p className="font-semibold">{formData.direccion}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <LandPlot className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Superficie total construida
                        </p>
                        <p className="font-semibold">
                          {formData.superficieConstruida} m²
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Año de construcción
                        </p>
                        <p className="font-semibold">
                          {formData.anoConstruccion}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Tipo de propiedad
                        </p>
                        <p className="font-semibold">
                          {formData.tipoPropiedad}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Subsidio 27F
                        </p>
                        <Badge
                          variant={
                            formData.subsidio27F ? "default" : "secondary"
                          }
                        >
                          {formData.subsidio27F ? "Sí" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-primary" />
                    Detalles por piso
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.pisos.map((piso, index) => (
                      <Card key={index} className="bg-secondary/10">
                        <CardHeader>
                          <CardTitle className="text-md">
                            Piso {index + 1}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Largo:{" "}
                            <span className="font-semibold">{piso.largo}m</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Ancho:{" "}
                            <span className="font-semibold">{piso.ancho}m</span>
                          </p>
                          <p className="text-sm font-medium mt-2">
                            Área:{" "}
                            <span className="font-semibold">
                              {metrosCuadrados[index]?.toFixed(2) || "0.00"} m²
                            </span>
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                <Separator />
                {formData.comentarios && (
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Comentarios adicionales
                      </p>
                      <p className="font-semibold">{formData.comentarios}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

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
                    Su propiedad cumple con los requisitos para acogerse a la
                    Ley del Mono.
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
                    acogerse a la Ley del Mono. Revise los siguientes puntos:
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
                    *Este es un valor estimado. La cotización final puede variar
                    según la complejidad del proyecto.
                  </p>
                </CardContent>
              </Card>
            )}

            {solicitudEnviada ? (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="text-blue-500" />
                    <h4 className="text-lg font-semibold text-blue-700">
                      Solicitud Enviada
                    </h4>
                  </div>
                  <p className="mt-2 text-blue-600">
                    Tu solicitud está en progreso. Te responderemos a la
                    brevedad.
                  </p>
                </CardContent>
              </Card>
            ) : null}
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
            // Solo este botón para enviar la solicitud queda presente
            <Button
              onClick={enviarSolicitud}
              className="bg-green-600 text-white"
            >
              {enviandoSolicitud ? "Enviando..." : "Solicitar Cotización"}
            </Button>
          )}
        </div>
        {showToast && (
          <Toast
            title={toastProps.title}
            description={toastProps.description}
            type={toastProps.type}
            onClose={() => setShowToast(false)}
          />
        )}
      </CardContent>
    </Card>
  );
}
