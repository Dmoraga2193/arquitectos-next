import React from "react";
import { Html } from "@react-email/html";
import { Head } from "@react-email/head";
import { Preview } from "@react-email/preview";
import { Container } from "@react-email/container";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import { Img } from "@react-email/img";

export default function EmailTemplate(formData: any) {
  // Asegúrate de que esta URL sea accesible públicamente
  const logoUrl = "https://arquitectura-next.vercel.app/assets/images/logo.png";

  return (
    <Html>
      <Head />
      <Preview>Nueva Solicitud de Cotización - {formData.nombre}</Preview>
      <body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={logoUrl}
              width="150"
              height="auto"
              alt="Arquitectos Next Web Logo"
              style={logoStyle}
            />
            <Text style={headerTitle}>Regularización Sin Complicaciones</Text>
          </Section>
          <Section style={content}>
            <Text style={heading}>Nueva Solicitud de Cotización</Text>
            <Text style={paragraph}>
              Hemos recibido una nueva solicitud de cotización con los
              siguientes detalles:
            </Text>
            <Section style={detailsContainer}>
              <Detail label="Nombre" value={formData.nombre} />
              <Detail label="Email" value={formData.email} />
              <Detail label="Dirección" value={formData.direccion} />
              <Detail label="Teléfono" value={formData.telefono} />
              <Detail
                label="Largo del terreno"
                value={`${formData.largo} metros`}
              />
              <Detail
                label="Ancho del terreno"
                value={`${formData.ancho} metros`}
              />
              <Detail
                label="Área del terreno"
                value={`${formData.area} metros cuadrados`}
              />
              <Detail label="Número de pisos" value={formData.pisos} />
              <Detail
                label="Año de construcción"
                value={formData.anoConstruccion}
              />
              <Detail
                label="Superficie construida"
                value={`${formData.superficieConstruida} m²`}
              />
              <Detail
                label="Avalúo fiscal"
                value={`${formData.avaluoFiscal} UF`}
              />
              <Detail
                label="Tipo de propiedad"
                value={formData.tipoPropiedad}
              />
              <Detail
                label="Subsidio 27F"
                value={formData.subsidio27F ? "Sí" : "No"}
              />
            </Section>
            <Section style={quoteSection}>
              <Text style={quoteText}>
                Cotización estimada: ${formData.cotizacion.toLocaleString()} CLP
              </Text>
            </Section>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              © 2023 Arquitectos Next Web. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </body>
    </Html>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <Text style={detailRow}>
      <span style={detailLabel}>{label}:</span> {value}
    </Text>
  );
}

const main = {
  backgroundColor: "#f0f4f8",
  fontFamily: "Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#1e3a8a",
  padding: "40px 24px",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "#fbbf24",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "20px 0 0",
};

const logoStyle = {
  margin: "0 auto",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "32px 24px",
  borderRadius: "8px",
  marginTop: "24px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1e3a8a",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#4a5568",
};

const detailsContainer = {
  margin: "24px 0",
};

const detailRow = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#4a5568",
  marginBottom: "8px",
};

const detailLabel = {
  fontWeight: "bold",
  color: "#2d3748",
};

const quoteSection = {
  backgroundColor: "#edf2f7",
  padding: "24px",
  borderRadius: "8px",
  marginTop: "32px",
};

const quoteText = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1e3a8a",
  textAlign: "center" as const,
};

const footer = {
  textAlign: "center" as const,
  marginTop: "32px",
  padding: "0 24px",
};

const footerText = {
  fontSize: "12px",
  color: "#718096",
};
