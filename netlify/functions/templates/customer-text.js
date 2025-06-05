// netlify/functions/templates/customer-text.js
module.exports = (data) => {
  const urgentText = data.urgent ? "urgent " : "";

  return `Thank you for contacting Ohmnium Electricians!

Hi ${data.name},

We've received your ${urgentText}request and appreciate you reaching out to us.

YOUR MESSAGE DETAILS
===================
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
${data.service ? `Service: ${data.service}\n` : ""}Message: ${data.message}
Submitted: ${data.currentDate}

WHAT HAPPENS NEXT?
=================
• Our team will review your request shortly
• We aim to respond within 24 hours (or sooner for urgent requests)
• You'll receive a detailed quote and timeline for your project
• All our work is fully insured and comes with warranty

NEED IMMEDIATE ASSISTANCE?
=========================
For urgent electrical emergencies, please call us directly:
📞 020 3500 1441

You can also email us at: info@ohmnium.co.uk

WHY CHOOSE OHMNIUM?
==================
✓ Qualified & certified electricians
✓ Competitive pricing with no hidden costs
✓ Fully insured work
✓ Prompt, professional service
✓ Customer satisfaction guarantee

Thank you for choosing Ohmnium Electricians for your electrical needs.

Best regards,
The Ohmnium Team

---
Ohmnium Electricians
Professional Electrical Services in London
Phone: 020 3500 1441
Email: info@ohmnium.co.uk
Website: https://ohmnium.co.uk

This is an automated confirmation email. Please do not reply to this email directly.`;
};
