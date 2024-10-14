import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { renderAsync } from "@react-email/render";
import EmailTemplate from "@/components/email/email-template";

// Define the expected shape of the form data
interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  numeroPisos: string;
  pisos: { largo: string; ancho: string }[];
  anoConstruccion: string;
  superficieConstruida: string;
  tipoPropiedad: string;
  subsidio27F: boolean;
  cotizacion: number;
  cumpleRequisitos: boolean;
  requisitosIncumplidos: string[];
}

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json();

    // Validate required fields
    if (!formData.nombre || !formData.email) {
      return NextResponse.json(
        { message: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Configurar el transporter de Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "465"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Ensure requisitosIncumplidos is always an array
    const requisitosIncumplidos = Array.isArray(formData.requisitosIncumplidos)
      ? formData.requisitosIncumplidos
      : [];

    // Render the email template
    const htmlContent = await renderAsync(
      EmailTemplate({
        ...formData,
        requisitosIncumplidos,
        cumpleRequisitos: requisitosIncumplidos.length === 0,
      })
    );

    // Enviar el correo
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "Nueva Solicitud de Cotización",
      html: htmlContent,
    });

    return NextResponse.json(
      { message: "Correo enviado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return NextResponse.json(
      { message: "Error al enviar el correo: " + (error as Error).message },
      { status: 500 }
    );
  }
}
