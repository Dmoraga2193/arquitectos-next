import React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Img,
  Row,
  Column,
  Hr,
} from "@react-email/components";

interface PisoData {
  largo: string;
  ancho: string;
}

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  numeroPisos: string;
  pisos: PisoData[];
  anoConstruccion: string;
  superficieConstruida: string;
  avaluoFiscal: string;
  tipoPropiedad: string;
  subsidio27F: boolean;
  cotizacion: number;
}

export default function EmailTemplate(formData: FormData) {
  const logoUrl = "https://arquitectura-next.vercel.app/assets/images/logo.png";

  return (
    <Html>
      <Head />
      <Preview>Nueva Solicitud de Cotización - {formData.nombre}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={logoUrl}
              width="120"
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
              <Row style={rowStyle}>
                <Column style={columnStyle}>
                  <Detail label="Nombre" value={formData.nombre} />
                  <Detail label="Email" value={formData.email} />
                  <Detail label="Teléfono" value={formData.telefono} />
                </Column>
                <Column style={columnStyle}>
                  <Detail label="Dirección" value={formData.direccion} />
                  <Detail
                    label="Número de pisos"
                    value={formData.numeroPisos}
                  />
                  <Detail
                    label="Año de construcción"
                    value={formData.anoConstruccion}
                  />
                </Column>
              </Row>
              <Hr style={divider} />
              <Text style={subheading}>Detalles de los Pisos</Text>
              {formData.pisos.map((piso, index) => (
                <Row key={index} style={rowStyle}>
                  <Column style={columnStyle}>
                    <Detail
                      label={`Piso ${index + 1} - Largo`}
                      value={`${piso.largo} metros`}
                    />
                  </Column>
                  <Column style={columnStyle}>
                    <Detail
                      label={`Piso ${index + 1} - Ancho`}
                      value={`${piso.ancho} metros`}
                    />
                  </Column>
                  <Column style={columnStyle}>
                    <Detail
                      label={`Piso ${index + 1} - Área`}
                      value={`${(
                        parseFloat(piso.largo) * parseFloat(piso.ancho)
                      ).toFixed(2)} m²`}
                    />
                  </Column>
                </Row>
              ))}
              <Hr style={divider} />
              <Row style={rowStyle}>
                <Column style={columnStyle}>
                  <Detail
                    label="Superficie construida total"
                    value={`${formData.superficieConstruida} m²`}
                  />
                  <Detail
                    label="Avalúo fiscal"
                    value={`${formData.avaluoFiscal} UF`}
                  />
                </Column>
                <Column style={columnStyle}>
                  <Detail
                    label="Tipo de propiedad"
                    value={formData.tipoPropiedad}
                  />
                  <Detail
                    label="Subsidio 27F"
                    value={formData.subsidio27F ? "Sí" : "No"}
                  />
                </Column>
              </Row>
            </Section>
            <Section style={quoteSection}>
              <Text style={quoteText}>
                Cotización estimada: ${formData.cotizacion.toLocaleString()} CLP
              </Text>
            </Section>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              © 2024 Arquitectos Next. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
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
  fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "100%",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#1e3a8a",
  padding: "30px 24px",
  textAlign: "center" as const,
  borderRadius: "8px 8px 0 0",
};

const headerTitle = {
  color: "#fbbf24",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "16px 0 0",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const logoStyle = {
  margin: "0 auto",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "32px 24px",
  borderRadius: "0 0 8px 8px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1e3a8a",
  marginBottom: "24px",
  textAlign: "center" as const,
  borderBottom: "2px solid #e2e8f0",
  paddingBottom: "16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#4a5568",
};

const detailsContainer = {
  margin: "24px 0",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "16px",
};

const columnStyle = {
  flexBasis: "48%",
};

const detailRow = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#4a5568",
  marginBottom: "8px",
};

const detailLabel = {
  fontWeight: "bold",
  color: "#2d3748",
};

const divider = {
  borderTop: "1px solid #e2e8f0",
  margin: "16px 0",
};

const subheading = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#2d3748",
  marginBottom: "16px",
};

const quoteSection = {
  backgroundColor: "#edf2f7",
  padding: "24px",
  borderRadius: "8px",
  marginTop: "32px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const quoteText = {
  fontSize: "20px",
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
