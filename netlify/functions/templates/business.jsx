// netlify/functions/templates/business.jsx
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Link,
} from "@react-email/components";

export default function BusinessTemplate({
  name,
  email,
  phone,
  service,
  message,
  currentDate,
  clientIP,
  urgent = false,
  warnings = [],
}) {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Francois+One&family=Source+Sans+3:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>
          {`
            @media (prefers-color-scheme: dark) {
              .dark-mode-bg { background-color: #1a1a1a !important; }
              .dark-mode-text { color: #e5e5e5 !important; }
              .dark-mode-heading { color: #ffffff !important; }
              .dark-mode-border { border-color: #404040 !important; }
              .dark-mode-section { background-color: #2d2d2d !important; }
              .dark-mode-warning { background-color: #451a03 !important; border-color: #92400e !important; }
            }
          `}
        </style>
      </Head>
      <Body style={bodyStyle} className="dark-mode-bg">
        <Container style={containerStyle}>
          {/* Heading Section */}
          <Section style={sectionStyle}>
            <Heading as="h1" style={h1Style} className="dark-mode-heading">
              New Contact Form Submission
            </Heading>
            {urgent && <Text style={urgentTextStyle}>🚨 URGENT REQUEST</Text>}
          </Section>

          {/* Warnings Section */}
          {warnings && warnings.length > 0 && (
            <Section style={warningSectionStyle} className="dark-mode-warning">
              <Heading as="h3" style={h3Style} className="dark-mode-heading">
                ⚠️ Warnings
              </Heading>
              {warnings.map((warning, index) => (
                <Text
                  key={index}
                  style={warningTextStyle}
                  className="dark-mode-text"
                >
                  • {warning}
                </Text>
              ))}
            </Section>
          )}

          {/* Contact Information */}
          <Section style={sectionStyle}>
            <Heading as="h3" style={h3Style} className="dark-mode-heading">
              Contact Information
            </Heading>
            <Text style={bodyTextStyle} className="dark-mode-text">
              <strong>Name:</strong> {name}
            </Text>
            <Text style={bodyTextStyle} className="dark-mode-text">
              <strong>Email:</strong>{" "}
              <Link href={`mailto:${email}`} style={linkStyle}>
                {email}
              </Link>
            </Text>
            <Text style={bodyTextStyle} className="dark-mode-text">
              <strong>Phone:</strong>{" "}
              <Link href={`tel:${phone}`} style={linkStyle}>
                {phone}
              </Link>
            </Text>
            {service && (
              <Text style={bodyTextStyle} className="dark-mode-text">
                <strong>Service:</strong> {service}
              </Text>
            )}
            <Text style={bodyTextStyle} className="dark-mode-text">
              <strong>Submitted:</strong> {currentDate}
            </Text>
          </Section>

          {/* Message */}
          <Section style={sectionStyle}>
            <Heading as="h3" style={h3Style} className="dark-mode-heading">
              Message
            </Heading>
            <Text style={messageTextStyle} className="dark-mode-text">
              {message.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  {index < message.split("\n").length - 1 && <br />}
                </span>
              ))}
            </Text>
          </Section>

          {/* Quick Actions */}
          <Section style={sectionStyle}>
            <Heading as="h3" style={h3Style} className="dark-mode-heading">
              Quick Actions
            </Heading>
            <Text style={bodyTextStyle} className="dark-mode-text">
              <Link
                href={`mailto:${email}?subject=Re: Your ${service || "Inquiry"}&body=Hello ${name},%0D%0A%0D%0AThank you for contacting us...`}
                style={actionLinkStyle}
              >
                📧 Reply via Email
              </Link>
            </Text>
            <Text style={bodyTextStyle} className="dark-mode-text">
              <Link href={`tel:${phone}`} style={actionLinkStyle}>
                📞 Call {phone}
              </Link>
            </Text>
          </Section>

          {/* HR Divider */}
          <Hr style={hrStyle} className="dark-mode-border" />

          {/* System Information */}
          <Section style={systemSectionStyle} className="dark-mode-section">
            <Heading as="h4" style={h4Style} className="dark-mode-heading">
              System Information
            </Heading>
            <Text style={systemTextStyle} className="dark-mode-text">
              <strong>Source:</strong> Website Contact Form
            </Text>
            <Text style={systemTextStyle} className="dark-mode-text">
              <strong>IP Address:</strong> {clientIP || "Unknown"}
            </Text>
            <Text style={systemTextStyle} className="dark-mode-text">
              <strong>Processed:</strong> {currentDate}
            </Text>
          </Section>

          {/* Footer */}
          <Section>
            <Text style={footerTextStyle} className="dark-mode-text">
              This notification was automatically generated from your website
              contact form. Make sure to respond promptly to maintain customer
              satisfaction.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles matching customer.jsx design
const bodyStyle = {
  backgroundColor: "white",
  fontFamily: "'Source Sans 3', sans-serif",
  margin: 0,
  padding: "40px 20px",
};

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
};

const sectionStyle = {
  marginBottom: "40px",
};

const systemSectionStyle = {
  backgroundColor: "#d1d5db", // grey-300
  borderRadius: "6px",
  padding: "20px",
  marginBottom: "40px",
};

const warningSectionStyle = {
  backgroundColor: "#fef3c7", // yellow-100
  borderRadius: "6px",
  padding: "20px",
  marginBottom: "40px",
  border: "1px solid #f59e0b", // yellow-500
};

const hrStyle = {
  border: "none",
  borderTop: "1px solid #9ca3af", // grey-400
  margin: "40px 0",
};

// Typography styles
const h1Style = {
  fontFamily: "'Francois One', sans-serif",
  fontSize: "30px", // 3xl equivalent
  lineHeight: "1.25",
  fontWeight: "normal",
  color: "black",
  textTransform: "uppercase",
  margin: "0 0 16px 0",
};

const h3Style = {
  fontFamily: "'Francois One', sans-serif",
  fontSize: "20px", // xl equivalent
  lineHeight: "1.25",
  fontWeight: "normal",
  color: "black",
  textTransform: "uppercase",
  margin: "0 0 8px 0",
};

const h4Style = {
  fontFamily: "'Francois One', sans-serif",
  fontSize: "18px", // lg equivalent
  lineHeight: "1.25",
  fontWeight: "normal",
  color: "black",
  textTransform: "uppercase",
  margin: "0 0 8px 0",
};

const bodyTextStyle = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: "16px",
  lineHeight: "1.4",
  fontWeight: "500", // medium
  color: "#1a1a1a",
  margin: "0 0 16px 0",
};

const messageTextStyle = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: "16px",
  lineHeight: "1.6",
  fontWeight: "500",
  color: "#1a1a1a",
  margin: "0 0 16px 0",
  whiteSpace: "pre-wrap",
};

const urgentTextStyle = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: "16px",
  lineHeight: "1.4",
  fontWeight: "600", // semibold for emphasis
  color: "#dc2626", // red for urgency
  margin: "0 0 16px 0",
};

const warningTextStyle = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: "16px",
  lineHeight: "1.4",
  fontWeight: "500",
  color: "#92400e", // yellow-800
  margin: "0 0 8px 0",
};

const systemTextStyle = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: "14px",
  lineHeight: "1.4",
  fontWeight: "500",
  color: "#1a1a1a",
  margin: "0 0 8px 0",
};

const linkStyle = {
  color: "#6366f1", // indigo-500
  textDecoration: "none",
};

const actionLinkStyle = {
  color: "#6366f1", // indigo-500
  textDecoration: "none",
  fontWeight: "600",
};

const footerTextStyle = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: "12px",
  color: "#6b7280", // grey-500
  textAlign: "center",
  margin: 0,
  lineHeight: "1.4",
};
