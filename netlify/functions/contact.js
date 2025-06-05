// netlify/functions/contact.js
const { Resend } = require("resend");
const businessTemplate = require("./templates/business");
const businessTextTemplate = require("./templates/business-text");
const customerTemplate = require("./templates/customer");
const customerTextTemplate = require("./templates/customer-text");

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple rate limiting storage (in production, use Redis or database)
const submissions = new Map();

// Rate limiting function
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxSubmissions = 3; // Max 3 submissions per 15 minutes

  const userSubmissions = submissions.get(ip) || [];
  const recentSubmissions = userSubmissions.filter(
    (time) => now - time < windowMs,
  );

  if (recentSubmissions.length >= maxSubmissions) {
    return true;
  }

  // Clean up old entries
  submissions.set(ip, [...recentSubmissions, now]);
  return false;
}

// Input validation
function validateInput(data) {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!data.name?.trim()) {
    errors.push("Name is required");
  } else if (data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  } else if (data.name.trim().length > 100) {
    errors.push("Name is too long (max 100 characters)");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email?.trim()) {
    errors.push("Email is required");
  } else if (!emailRegex.test(data.email.trim())) {
    errors.push("Please enter a valid email address");
  } else if (data.email.trim().length > 254) {
    errors.push("Email is too long");
  }

  // Phone validation - UK phone numbers
  const ukPhoneRegex =
    /^(?:(?:\+44)|(?:0))(?:\d{2}\s?\d{4}\s?\d{4}|\d{3}\s?\d{3}\s?\d{4}|\d{4}\s?\d{6}|\d{5}\s?\d{5})$/;
  const cleanPhone = data.phone?.replace(/\s/g, "") || "";
  if (!data.phone?.trim()) {
    errors.push("Phone number is required");
  } else if (!ukPhoneRegex.test(cleanPhone)) {
    errors.push("Please enter a valid UK phone number (e.g., 020 1234 5678)");
  }

  // Message validation
  if (!data.message?.trim()) {
    errors.push("Message is required");
  } else if (data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters");
  } else if (data.message.trim().length > 2000) {
    errors.push("Message is too long (max 2000 characters)");
  }

  // Service validation (optional)
  if (data.service && data.service.length > 100) {
    errors.push("Service type is too long");
  }

  // Spam detection (basic)
  const spamKeywords = [
    "cialis",
    "viagra",
    "casino",
    "lottery",
    "crypto",
    "bitcoin",
  ];
  const messageText = data.message?.toLowerCase() || "";
  const nameText = data.name?.toLowerCase() || "";

  if (
    spamKeywords.some(
      (keyword) => messageText.includes(keyword) || nameText.includes(keyword),
    )
  ) {
    warnings.push("Message flagged for manual review");
  }

  // URL detection in message
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  if (urlRegex.test(data.message || "")) {
    warnings.push("Message contains URLs - flagged for review");
  }

  return { errors, warnings };
}

// Sanitize input
function sanitizeInput(data) {
  return {
    name: data.name?.trim().slice(0, 100) || "",
    email: data.email?.trim().toLowerCase().slice(0, 254) || "",
    phone: data.phone?.trim().slice(0, 20) || "",
    service: data.service?.trim().slice(0, 100) || "",
    message: data.message?.trim().slice(0, 2000) || "",
    urgent: Boolean(data.urgent),
  };
}

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin":
      process.env.NODE_ENV === "production"
        ? `https://${process.env.DOMAIN}`
        : "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Method not allowed",
      }),
    };
  }

  try {
    // Rate limiting
    const clientIP =
      event.headers["client-ip"] ||
      event.headers["x-forwarded-for"]?.split(",")[0] ||
      event.headers["x-real-ip"] ||
      "unknown";

    if (isRateLimited(clientIP)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          success: false,
          error:
            "Too many requests. Please wait 15 minutes before trying again.",
        }),
      };
    }

    // Parse and validate request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Request body is required",
        }),
      };
    }

    let formData;
    try {
      formData = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Invalid JSON in request body",
        }),
      };
    }

    // Sanitize input
    const sanitizedData = sanitizeInput(formData);

    // Validate input
    const { errors, warnings } = validateInput(sanitizedData);

    if (errors.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Validation failed",
          details: errors,
        }),
      };
    }

    // Check required environment variables
    const requiredEnvVars = ["RESEND_API_KEY", "FROM_EMAIL", "BUSINESS_EMAIL"];
    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar],
    );

    if (missingEnvVars.length > 0) {
      console.error("Missing environment variables:", missingEnvVars);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Server configuration error",
        }),
      };
    }

    // Prepare template data
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    const templateData = {
      ...sanitizedData,
      currentDate,
      clientIP, // For internal tracking
      warnings,
    };

    // Prepare email promises
    const emailPromises = [];

    // Business notification email
    emailPromises.push(
      resend.emails.send({
        from: `Notifications <${process.env.FROM_EMAIL}>`,
        to: [process.env.BUSINESS_EMAIL],
        subject: `New ${sanitizedData.urgent ? "URGENT " : ""}Contact: ${sanitizedData.name}${warnings.length > 0 ? " [FLAGGED]" : ""}`,
        html: businessTemplate(templateData),
        text: businessTextTemplate(templateData),
        reply_to: sanitizedData.email,
        tags: [
          { name: "type", value: "business_notification" },
          { name: "urgent", value: sanitizedData.urgent ? "yes" : "no" },
          { name: "flagged", value: warnings.length > 0 ? "yes" : "no" },
        ],
      }),
    );

    // Customer confirmation email (skip if flagged as potential spam)
    if (warnings.length === 0) {
      emailPromises.push(
        resend.emails.send({
          from: `${process.env.BUSINESS_NAME || "Support"} <${process.env.FROM_EMAIL}>`,
          to: [sanitizedData.email],
          subject: `We've received your ${sanitizedData.urgent ? "urgent " : ""}request`,
          html: customerTemplate(templateData),
          text: customerTextTemplate(templateData),
          tags: [
            { name: "type", value: "customer_confirmation" },
            { name: "urgent", value: sanitizedData.urgent ? "yes" : "no" },
          ],
        }),
      );
    }

    // Send emails
    const results = await Promise.allSettled(emailPromises);

    // Check if business email failed (critical)
    const businessEmailResult = results[0];
    if (businessEmailResult.status === "rejected") {
      console.error(
        "Failed to send business notification:",
        businessEmailResult.reason,
      );
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error:
            "Failed to process your request. Please try again or contact us directly.",
        }),
      };
    }

    // Check customer email result (non-critical)
    let customerEmailSent = true;
    if (results.length > 1) {
      const customerEmailResult = results[1];
      if (customerEmailResult.status === "rejected") {
        console.error(
          "Failed to send customer confirmation:",
          customerEmailResult.reason,
        );
        customerEmailSent = false;
      }
    }

    // Success response
    const response = {
      success: true,
      message:
        warnings.length > 0
          ? "Your message has been received and is under review. We'll contact you soon."
          : "Thank you! We've received your message and will get back to you soon.",
    };

    if (warnings.length > 0) {
      response.warnings = warnings;
    }

    if (!customerEmailSent && warnings.length === 0) {
      response.warnings = ["Confirmation email delivery may be delayed"];
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Contact form error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error:
          "An unexpected error occurred. Please try again later or contact us directly.",
      }),
    };
  }
};
