// netlify/functions/contact.js
const { Resend } = require("resend");
const { render } = require("@react-email/render");

// Import React Email templates
const CustomerTemplate = require("./templates/customer").default;
const BusinessTemplate = require("./templates/business").default;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting setup (in-memory store - use Redis in production)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 submissions per 15 minutes per IP

// Helper functions
function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .substring(0, 2000); // Limit length
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitStore.get(ip) || [];

  // Remove expired requests
  const validRequests = userRequests.filter(
    (time) => now - time < RATE_LIMIT_WINDOW,
  );

  if (validRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }

  // Add current request
  validRequests.push(now);
  rateLimitStore.set(ip, validRequests);

  return true; // Within rate limit
}

function detectSpam(data) {
  const spamKeywords = [
    "bitcoin",
    "cryptocurrency",
    "investment",
    "loan",
    "casino",
    "viagra",
    "pharmacy",
    "weight loss",
    "make money",
    "work from home",
    "click here",
    "limited time",
    "act now",
    "congratulations",
  ];

  const text = `${data.name} ${data.email} ${data.message}`.toLowerCase();
  const suspiciousPatterns = [
    /http[s]?:\/\/[^\s]+/gi, // URLs
    /[^\s]+@[^\s]+\.[^\s]+/gi, // Multiple emails
    /\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/gi, // Credit card patterns
  ];

  // Check for spam keywords
  const hasSpamKeywords = spamKeywords.some((keyword) =>
    text.includes(keyword),
  );

  // Check for suspicious patterns
  const hasSuspiciousPatterns = suspiciousPatterns.some((pattern) =>
    pattern.test(text),
  );

  // Check for excessive repetition
  const words = text.split(/\s+/);
  const wordCount = {};
  words.forEach((word) => {
    if (word.length > 3) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  const hasExcessiveRepetition = Object.values(wordCount).some(
    (count) => count > 5,
  );

  return {
    isSpam: hasSpamKeywords || hasSuspiciousPatterns || hasExcessiveRepetition,
    reasons: [
      ...(hasSpamKeywords ? ["Contains spam keywords"] : []),
      ...(hasSuspiciousPatterns ? ["Contains suspicious patterns"] : []),
      ...(hasExcessiveRepetition ? ["Excessive word repetition"] : []),
    ],
  };
}

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  try {
    // Get client IP for rate limiting
    const clientIP =
      event.headers["x-forwarded-for"] ||
      event.headers["x-real-ip"] ||
      context.clientContext?.ip ||
      "unknown";

    // Check rate limiting
    if (!checkRateLimit(clientIP)) {
      return {
        statusCode: 429,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Too many requests. Please wait before submitting again.",
          retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000 / 60), // minutes
        }),
      };
    }

    // Parse and validate request body
    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Invalid JSON in request body" }),
      };
    }

    // Extract and sanitize form data
    const sanitizedData = {
      name: sanitizeInput(requestData.name),
      email: sanitizeInput(requestData.email),
      phone: sanitizeInput(requestData.phone),
      service: sanitizeInput(requestData.service || ""),
      message: sanitizeInput(requestData.message),
      urgent: Boolean(requestData.urgent),
    };

    // Validation
    const validationErrors = [];
    const warnings = [];

    if (!sanitizedData.name || sanitizedData.name.length < 2) {
      validationErrors.push(
        "Name is required and must be at least 2 characters",
      );
    }

    if (!sanitizedData.email) {
      validationErrors.push("Email is required");
    } else if (!validateEmail(sanitizedData.email)) {
      validationErrors.push("Please provide a valid email address");
    }

    if (!sanitizedData.phone) {
      validationErrors.push("Phone number is required");
    } else if (!validatePhone(sanitizedData.phone)) {
      validationErrors.push("Please provide a valid phone number");
    }

    if (!sanitizedData.message || sanitizedData.message.length < 10) {
      validationErrors.push(
        "Message is required and must be at least 10 characters",
      );
    }

    // Return validation errors if any
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Validation failed",
          details: validationErrors,
        }),
      };
    }

    // Spam detection
    const spamCheck = detectSpam(sanitizedData);
    if (spamCheck.isSpam) {
      // Log but don't tell the user - just return success to avoid giving feedback to spammers
      console.log("Spam detected:", spamCheck.reasons, sanitizedData);

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: true,
          message: "Thank you for your message. We will get back to you soon.",
        }),
      };
    }

    // Additional warnings for suspicious but not spam content
    if (sanitizedData.message.includes("http")) {
      warnings.push("Message contains URLs - please verify legitimacy");
    }
    if (sanitizedData.name.split(" ").length > 5) {
      warnings.push("Unusually long name provided");
    }

    // Generate current date
    const currentDate = new Date().toLocaleString("en-GB", {
      timeZone: "Europe/London",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // Render email templates
    const customerHtml = render(
      CustomerTemplate({
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        service: sanitizedData.service,
        message: sanitizedData.message,
        currentDate,
        urgent: sanitizedData.urgent,
      }),
    );

    const businessHtml = render(
      BusinessTemplate({
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        service: sanitizedData.service,
        message: sanitizedData.message,
        currentDate,
        clientIP,
        urgent: sanitizedData.urgent,
        warnings: warnings,
      }),
    );

    // Send emails
    const emailPromises = [];

    // Send confirmation email to customer
    emailPromises.push(
      resend.emails.send({
        from: `${process.env.BUSINESS_NAME || "Support"} <${process.env.FROM_EMAIL}>`,
        to: [sanitizedData.email],
        subject: `We've received your ${sanitizedData.urgent ? "urgent " : ""}request`,
        html: customerHtml,
        tags: [
          { name: "type", value: "customer_confirmation" },
          { name: "urgent", value: sanitizedData.urgent ? "yes" : "no" },
        ],
      }),
    );

    // Send notification email to business
    emailPromises.push(
      resend.emails.send({
        from: `${process.env.BUSINESS_NAME || "Website"} <${process.env.FROM_EMAIL}>`,
        to: [process.env.BUSINESS_EMAIL],
        subject: `New ${sanitizedData.urgent ? "URGENT " : ""}Contact: ${sanitizedData.name}`,
        html: businessHtml,
        tags: [
          { name: "type", value: "business_notification" },
          { name: "urgent", value: sanitizedData.urgent ? "yes" : "no" },
        ],
      }),
    );

    // Wait for all emails to send
    const emailResults = await Promise.allSettled(emailPromises);

    // Check if any emails failed
    const failedEmails = emailResults.filter(
      (result) => result.status === "rejected",
    );

    if (failedEmails.length > 0) {
      console.error("Some emails failed to send:", failedEmails);

      // If customer email failed, that's more critical
      if (emailResults[0].status === "rejected") {
        return {
          statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            error:
              "Failed to send confirmation email. Please try again or contact us directly.",
          }),
        };
      }
    }

    // Success response
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "Thank you for your message. We will get back to you soon.",
        urgent: sanitizedData.urgent,
        warnings: warnings.length > 0 ? warnings : undefined,
      }),
    };
  } catch (error) {
    console.error("Contact form error:", error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "An unexpected error occurred. Please try again later.",
      }),
    };
  }
};
