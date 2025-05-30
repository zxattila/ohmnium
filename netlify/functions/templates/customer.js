// netlify/functions/templates/customer.js
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = (data) => {
  // Escape all user data for security
  const escapedData = {
    name: escapeHtml(data.name),
    email: escapeHtml(data.email),
    phone: escapeHtml(data.phone),
    service: data.service ? escapeHtml(data.service) : "",
    message: escapeHtml(data.message).replace(/\n/g, "<br>"),
    currentDate: escapeHtml(data.currentDate),
  };

  const siteUrl = process.env.SITE_URL || "https://ohmnium.co.uk";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Thank You for Your Message - Ohmnium Electricians</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Francois+One&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    @media (prefers-color-scheme: dark) {
      .dark-mode-bg { background-color: #1a1a1a !important; }
      .dark-mode-text { color: #e5e5e5 !important; }
      .dark-mode-heading { color: #ffffff !important; }
      .dark-mode-border { border-color: #404040 !important; }
      .dark-mode-section { background-color: #2d2d2d !important; }
      .dark-content { background-color: #2d2d2d !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: 'Source Sans 3', sans-serif; background-color: white;" class="dark-mode-bg">
  <div style="max-width: 600px; margin: 0 auto;">
    
    <!-- Heading Section -->
    <div style="margin-bottom: 40px;">
      <h1 style="font-family: 'Francois One', sans-serif; font-size: 30px; line-height: 1.25; font-weight: normal; color: black; text-transform: uppercase; margin: 0 0 16px 0;" class="dark-mode-heading">
        Thank You for Your Message!
      </h1>
    </div>
    
    <!-- Welcome Section -->
    <div style="margin-bottom: 40px;">
      <p style="font-family: 'Source Sans 3', sans-serif; font-size: 16px; line-height: 1.4; font-weight: 400; color: #1a1a1a; margin: 0 0 16px 0;" class="dark-mode-text">Hi ${escapedData.name},</p>
      <p style="font-family: 'Source Sans 3', sans-serif; font-size: 16px; line-height: 1.4; font-weight: 400; color: #1a1a1a; margin: 0 0 16px 0;" class="dark-mode-text">
        Thank you for reaching out to us!<br>We've received your ${data.urgent ? "<strong>urgent </strong>" : ""}message and our team will get back to you as soon as possible.
      </p>
    </div>
    
    <!-- What's Next Section -->
    <div style="margin-bottom: 40px;">
      <h3 style="font-family: 'Francois One', sans-serif; font-size: 20px; line-height: 1.25; font-weight: normal; color: black; text-transform: uppercase; margin: 0 0 8px 0;" class="dark-mode-heading">What's Next?</h3>
      <p style="font-family: 'Source Sans 3', sans-serif; font-size: 16px; line-height: 1.4; font-weight: 400; color: #1a1a1a; margin: 0 0 10px 0;" class="dark-mode-text">• We'll review your request within 24 hours</p>
      <p style="font-family: 'Source Sans 3', sans-serif; font-size: 16px; line-height: 1.4; font-weight: 400; color: #1a1a1a; margin: 0 0 10px 0;" class="dark-mode-text">• Our team will contact you at ${escapedData.phone}</p>
      ${escapedData.service ? `<p style="font-family: 'Source Sans 3', sans-serif; font-size: 16px; line-height: 1.4; font-weight: 400; color: #1a1a1a; margin: 0 0 16px 0;" class="dark-mode-text">• Service requested: <strong>${escapedData.service}</strong></p>` : ""}
      ${data.urgent ? "<p style=\"font-family: 'Source Sans 3', sans-serif; font-size: 16px; line-height: 1.4; font-weight: 600; color: #dc2626; margin: 0 0 10px 0;\">• Your request has been flagged as urgent</p>" : ""}
    </div>
    
    <!-- Emergency Contact Section -->
    <div style="margin-bottom: 40px;">
      <h3 style="font-family: 'Francois One', sans-serif; font-size: 20px; line-height: 1.25; font-weight: normal; color: black; text-transform: uppercase; margin: 0 0 8px 0;" class="dark-mode-heading">Emergency Contact</h3>
      <p style="font-family: 'Source Sans 3', sans-serif; font-size: 16px; line-height: 1.4; font-weight: 400; color: #1a1a1a; margin: 0 0 16px 0;" class="dark-mode-text">
        For immediate assistance outside business hours:
      </p>
      <p style="font-family: 'Source Sans 3', sans-serif; font-size: 20px; line-height: 1.4; font-weight: 600; color: #1a1a1a; margin: 0 0 16px 0;" class="dark-mode-text">📞 020 3500 1441</p>
    </div>
    
    <!-- Reference Section -->
    <div style="background-color: #d1d5db; border-radius: 6px; padding: 20px; margin-bottom: 20px;" class="dark-mode-section">
      <p style="font-family: 'Source Sans 3', sans-serif; font-size: 16px; line-height: 1.4; font-weight: 400; color: #1a1a1a; margin: 0;" class="dark-mode-text">
        <strong>Reference:</strong> Submitted on ${escapedData.currentDate}
      </p>
    </div>
    
    <!-- Business Info Section -->
    <div style="margin-bottom: 40px;">
      <h4 style="font-family: 'Francois One', sans-serif; font-size: 18px; line-height: 1.25; font-weight: normal; color: black; text-transform: uppercase; margin: 0 0 10px 0;" class="dark-mode-heading"><a href="https://ohmnium.co.uk" style="color: black; text-decoration: none;">Ohmnium Electricians</a></h4>
      <p style="font-family: 'Francois One', sans-serif; font-size: 14px; color: #979797; margin: 0;">© 2025 OHMNIUM</p>
    </div>
    
  </div>
</body>
</html>
`;
};
