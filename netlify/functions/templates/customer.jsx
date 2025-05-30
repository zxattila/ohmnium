// netlify/functions/templates/customer.jsx
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Img,
  Link,
} from "@react-email/components";

export default function CustomerTemplate({
  name,
  email,
  phone,
  service,
  message,
  currentDate,
  urgent = false,
}) {
  const siteUrl = process.env.SITE_URL || "https://ohmnium.co.uk";

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
          {/* Company Logo */}
          <Section style={logoSectionStyle}>
            <Img
              src={`${siteUrl}/logo.png`}
              width={140}
              alt="Ohmnium Electricians - Professional Electrical Services"
              style={logoStyle}
            />
          </Section>

          {/* Heading Section */}
          <Section style={sectionStyle}>
            <Heading as="h1" style={h1Style} className="dark-mode-heading">
              Thank You for Your Message!
            </Heading>
          </Section>

          {/* Welcome Section */}
          <Section style={sectionStyle}>
            <Text style={bodyTextStyle} className="dark-mode-text">
              Hi {name},
            </Text>
            <Text style={bodyTextStyle} className="dark-mode-text">
              Thank you for reaching out to us! We've received your{" "}
              {urgent && <strong>urgent </strong>}
              message and our team will get back to you as soon as possible.
            </Text>
          </Section>

          {/* Welcome Image */}
          <Section style={sectionStyle}>
            <Img
              src={`${siteUrl}/welcome.jpg`}
              alt="Welcome to Ohmnium - Professional Electrical Services"
              style={welcomeImageStyle}
            />
          </Section>

          {/* What's Next Section */}
          <Section style={sectionStyle}>
            <Heading as="h3" style={h3Style} className="dark-mode-heading">
              What's Next?
            </Heading>
            <Text style={bodyTextStyle} className="dark-mode-text">
              • We'll review your request within 24 hours
            </Text>
            <Text style={bodyTextStyle} className="dark-mode-text">
              • Our team will contact you at {phone}
            </Text>
            {service && (
              <Text style={bodyTextStyle} className="dark-mode-text">
                • Service requested: <strong>{service}</strong>
              </Text>
            )}
            {urgent && (
              <Text style={urgentTextStyle}>
                • Your request has been flagged as urgent
              </Text>
            )}
          </Section>

          {/* Emergency Contact Section */}
          <Section style={sectionStyle}>
            <Heading as="h3" style={h3Style} className="dark-mode-heading">
              Emergency Contact
            </Heading>
            <Text style={bodyTextStyle} className="dark-mode-text">
              For immediate assistance outside business hours:
            </Text>
            <Text style={phoneTextStyle} className="dark-mode-text">
              📞 020 3500 1441
            </Text>
          </Section>

          {/* Reference Section */}
          <Section style={referenceSectionStyle} className="dark-mode-section">
            <Text style={referenceTextStyle} className="dark-mode-text">
              <strong>Reference:</strong> Submitted on {currentDate}
            </Text>
          </Section>

          {/* HR Divider */}
          <Hr style={hrStyle} className="dark-mode-border" />

          {/* Best Regards */}
          <Section style={sectionStyle}>
            <Text style={bodyTextStyle} className="dark-mode-text">
              Best Regards,
            </Text>
            <Text style={bodyTextStyle} className="dark-mode-text">
              from Kyle
            </Text>
          </Section>

          {/* HR Divider */}
          <Hr style={hrStyle} className="dark-mode-border" />

          {/* Business Info Section */}
          <Section style={sectionStyle}>
            <Heading as="h4" style={h4Style} className="dark-mode-heading">
              Ohmnium Electricians
            </Heading>
            <Text style={bodyTextStyle} className="dark-mode-text">
              020 3500 1441
            </Text>
            <Text style={bodyTextStyle} className="dark-mode-text">
              <Link href="mailto:info@ohmnium.co.uk" style={linkStyle}>
                info@ohmnium.co.uk
              </Link>
            </Text>
            <Text style={bodyTextStyle} className="dark-mode-text">
              <Link href="https://ohmnium.co.uk" style={linkStyle}>
                https://ohmnium.co.uk
              </Link>
            </Text>
          </Section>

          {/* Copyright */}
          <Section>
            <Text style={copyrightStyle}>© 2025 OHMNIUM</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles based on your specifications
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

const logoSectionStyle = {
  textAlign: "center",
  marginBottom: "40px",
};

const logoStyle = {
  display: "block",
  margin: "0 auto",
};

const sectionStyle = {
  marginBottom: "40px",
};

const referenceSectionStyle = {
  backgroundColor: "#d1d5db", // grey-300
  borderRadius: "6px",
  padding: "20px",
  marginBottom: "40px",
};

const gifStyle = {
  borderRadius: "6px",
  marginBottom: "40px",
  display: "block",
  maxWidth: "100%",
};

const welcomeImageStyle = {
  borderRadius: "6px",
  marginBottom: "40px",
  display: "block",
  maxWidth: "100%",
  width: "100%",
  height: "auto",
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

const phoneTextStyle = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: "20px",
  lineHeight: "1.4",
  fontWeight: "600", // semibold for emphasis
  color: "#1a1a1a",
  margin: "0 0 16px 0",
};

const urgentTextStyle = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: "16px",
  lineHeight: "1.4",
  fontWeight: "600", // semibold for emphasis
  color: "#dc2626", // red for urgency
  margin: "0 0 16px 0",
};

const referenceTextStyle = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: "16px",
  lineHeight: "1.4",
  fontWeight: "500",
  color: "#1a1a1a", // standard body color as specified
  margin: 0,
};

const linkStyle = {
  color: "#6366f1", // indigo-500
  textDecoration: "none",
};

const copyrightStyle = {
  fontFamily: "'Francois One', sans-serif",
  fontSize: "12px",
  color: "#979797",
  textAlign: "center",
  margin: 0,
};
