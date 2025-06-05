// netlify/functions/templates/business-text.js
module.exports = (data) => {
  const urgentPrefix = data.urgent
    ? "🚨 URGENT REQUEST - PRIORITY RESPONSE NEEDED 🚨\n\n"
    : "";

  const warningsText =
    data.warnings && data.warnings.length > 0
      ? `⚠️ WARNINGS:\n${data.warnings.map((warning) => `- ${warning}`).join("\n")}\n\n`
      : "";

  const serviceText = data.service ? `Service: ${data.service}\n` : "";

  return `⚡ NEW LEAD ALERT!

${urgentPrefix}${warningsText}👤 CONTACT INFORMATION
====================
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
${serviceText}Submitted: ${data.currentDate}

💬 MESSAGE
==========
${data.message}

🚀 QUICK ACTIONS
===============
Reply via Email: mailto:${data.email}?subject=Re: Your ${data.service || "Inquiry"}&body=Hello ${data.name},%0D%0A%0D%0AThank you for contacting us...
Call: tel:${data.phone}

SYSTEM INFORMATION
==================
Source: Website Contact Form
IP Address: ${data.clientIP}
Processed: ${data.currentDate}

---
This notification was automatically generated from your website contact form.
Make sure to respond promptly to maintain customer satisfaction.`;
};
