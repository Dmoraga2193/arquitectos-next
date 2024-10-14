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
  tipoPropiedad: string;
  subsidio27F: boolean;
  cotizacion: number;
  cumpleRequisitos: boolean;
  requisitosIncumplidos: string[];
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
            <Row>
              <Column style={logoColumn}>
                <Img
                  src={logoUrl}
                  width="120"
                  height="120"
                  alt="Arquitectos Next Web Logo"
                  style={logoStyle}
                />
              </Column>
              <Column style={titleColumn}>
                <Text style={headerTitle}>Arquitectos Next</Text>
                <Text style={headerSubtitle}>
                  Regularización Sin Complicaciones
                </Text>
              </Column>
            </Row>
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
                  <Detail label="Nombre" value={formData.nombre} icon="👤" />
                  <Detail label="Email" value={formData.email} icon="✉️" />
                  <Detail
                    label="Teléfono"
                    value={formData.telefono}
                    icon="📞"
                  />
                </Column>
                <Column style={columnStyle}>
                  <Detail
                    label="Dirección"
                    value={formData.direccion}
                    icon="🏠"
                  />
                  <Detail
                    label="Número de pisos"
                    value={formData.numeroPisos}
                    icon="🏢"
                  />
                  <Detail
                    label="Año de construcción"
                    value={formData.anoConstruccion}
                    icon="🗓️"
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
                      icon="↔️"
                    />
                  </Column>
                  <Column style={columnStyle}>
                    <Detail
                      label={`Piso ${index + 1} - Ancho`}
                      value={`${piso.ancho} metros`}
                      icon="↕️"
                    />
                  </Column>
                  <Column style={columnStyle}>
                    <Detail
                      label={`Piso ${index + 1} - Área`}
                      value={`${(
                        parseFloat(piso.largo) * parseFloat(piso.ancho)
                      ).toFixed(2)} m²`}
                      icon="📐"
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
                    icon="🏗️"
                  />
                </Column>
                <Column style={columnStyle}>
                  <Detail
                    label="Tipo de propiedad"
                    value={formData.tipoPropiedad}
                    icon="🏘️"
                  />
                  <Detail
                    label="Subsidio 27F"
                    value={formData.subsidio27F ? "Sí" : "No"}
                    icon="🏛️"
                  />
                </Column>
              </Row>
            </Section>
            <Section style={leyDelMonoSection}>
              <Text style={leyDelMonoTitle}>
                {formData.cumpleRequisitos ? (
                  <>
                    <span style={iconStyle}>✅</span> Cumple con los requisitos
                    de la Ley del Mono
                  </>
                ) : (
                  <>
                    <span style={iconStyle}>❌</span> No cumple con los
                    requisitos de la Ley del Mono
                  </>
                )}
              </Text>
              {!formData.cumpleRequisitos &&
                formData.requisitosIncumplidos.length > 0 && (
                  <>
                    <Text style={leyDelMonoSubtitle}>
                      Requisitos incumplidos:
                    </Text>
                    <ul style={leyDelMonoList}>
                      {formData.requisitosIncumplidos.map(
                        (requisito, index) => (
                          <li key={index} style={leyDelMonoListItem}>
                            {requisito}
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}
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

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <Text style={detailRow}>
      <span style={iconStyle}>{icon}</span>
      <span style={detailLabel}>{label}:</span> {value}
    </Text>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const header = {
  backgroundColor: "#1e3a8a",
  padding: "36px",
  borderRadius: "8px 8px 0 0",
  marginBottom: "48px",
};

const logoColumn = {
  width: "25%",
  textAlign: "center" as const,
};

const titleColumn = {
  width: "75%",
  paddingLeft: "24px",
};

const logoStyle = {
  margin: "0 auto",
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0 0 8px",
  lineHeight: "1.2",
};

const headerSubtitle = {
  color: "#fbbf24",
  fontSize: "18px",
  fontWeight: "500",
  margin: "0",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "32px 24px",
  borderRadius: "0 0 8px 8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const heading = {
  fontSize: "28px",
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
  backgroundColor: "#f8fafc",
  padding: "24px",
  borderRadius: "8px",
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
  marginBottom: "12px",
  display: "flex",
  alignItems: "center",
};

const detailLabel = {
  fontWeight: "bold",
  color: "#2d3748",
  marginRight: "8px",
};

const iconStyle = {
  marginRight: "8px",
  fontSize: "18px",
};

const divider = {
  borderTop: "1px solid #e2e8f0",
  margin: "24px 0",
};

const subheading = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#2d3748",
  marginBottom: "16px",
  textAlign: "center" as const,
};

const leyDelMonoSection = {
  background: "linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)",
  padding: "24px",
  borderRadius: "8px",
  marginTop: "32px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const leyDelMonoTitle = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#2f855a",
  marginBottom: "16px",
  textAlign: "center" as const,
};

const leyDelMonoSubtitle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#2f855a",
  marginBottom: "8px",
};

const leyDelMonoList = {
  margin: "0",
  padding: "0 0 0 20px",
};

const leyDelMonoListItem = {
  fontSize: "14px",
  color: "#4a5568",
  marginBottom: "4px",
};

const quoteSection = {
  background: "linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%)",
  padding: "24px",
  borderRadius: "8px",
  marginTop: "32px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const quoteText = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1e3a8a",
  textAlign: "center" as const,
  textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
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
