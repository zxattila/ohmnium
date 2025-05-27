// netlify/functions/templates/business.js
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = (data) => {
  const escapedData = {
    name: escapeHtml(data.name),
    email: escapeHtml(data.email),
    phone: escapeHtml(data.phone),
    service: data.service ? escapeHtml(data.service) : "",
    message: escapeHtml(data.message).replace(/\n/g, "<br>"),
    currentDate: escapeHtml(data.currentDate),
    clientIP: data.clientIP || "Unknown",
  };

  const warningsHtml =
    data.warnings && data.warnings.length > 0
      ? `<div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0;">
         <h3 style="margin-top: 0; color: #856404;">⚠️ Warnings:</h3>
         <ul style="margin-bottom: 0; color: #856404;">
           ${data.warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}
         </ul>
       </div>`
      : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
        ⚡ New Lead Alert!
      </h1>
      ${data.urgent ? '<div style="background: rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 20px; margin-top: 10px; display: inline-block; font-weight: bold;">🚨 URGENT REQUEST</div>' : ""}
    </div>
    
    <!-- Content -->
    <div style="padding: 30px 20px;">
      
      ${data.urgent ? '<div style="background: #dc3545; color: white; padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center; font-weight: bold; font-size: 16px;">🚨 URGENT REQUEST - PRIORITY RESPONSE NEEDED 🚨</div>' : ""}
      
      ${warningsHtml}
      
      <!-- Contact Information -->
      <div style="background: #f8f9ff; border-left: 4px solid #667eea; padding: 25px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
        <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">👤 Contact Information</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Name:</td>
            <td style="padding: 8px 0; color: #333;">${escapedData.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${escapedData.email}" style="color: #667eea; text-decoration: none;">
                ${escapedData.email}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
            <td style="padding: 8px 0;">
              <a href="tel:${escapedData.phone}" style="color: #667eea; text-decoration: none;">
                ${escapedData.phone}
              </a>
            </td>
          </tr>
          ${
            escapedData.service
              ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Service:</td>
            <td style="padding: 8px 0; color: #333;">${escapedData.service}</td>
          </tr>
          `
              : ""
          }
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Submitted:</td>
            <td style="padding: 8px 0; color: #333; font-size: 14px;">${escapedData.currentDate}</td>
          </tr>
        </table>
      </div>
      
      <!-- Message -->
      <div style="background: #ffffff; border: 2px solid #e9ecef; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">💬 Message:</h3>
        <div style="line-height: 1.6; color: #555; font-size: 15px; white-space: pre-wrap;">
          ${escapedData.message}
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div style="background: #e8f4fd; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
        <h3 style="margin: 0 0 20px 0; color: #1976d2; font-size: 18px;">🚀 Quick Actions:</h3>
        <div style="text-align: center;">
          <a href="mailto:${escapedData.email}?subject=Re: Your ${data.service || "Inquiry"}&body=Hello ${escapedData.name},%0D%0A%0D%0AThank you for contacting us..." 
             style="display: inline-block; background: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; font-weight: bold; font-size: 14px;">
            📧 Reply via Email
          </a>
          <a href="tel:${escapedData.phone}" 
             style="display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; font-weight: bold; font-size: 14px;">
            📞 Call ${escapedData.phone}
          </a>
        </div>
      </div>
      
      <!-- System Information -->
      <div style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">System Information:</h4>
        <p style="margin: 0; color: #6c757d; font-size: 12px;">
          <strong>Source:</strong> Website Contact Form<br>
          <strong>IP Address:</strong> ${escapedData.clientIP}<br>
          <strong>Processed:</strong> ${escapedData.currentDate}
        </p>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
      <p style="margin: 0; color: #6c757d; font-size: 12px;">
        This notification was automatically generated from your website contact form.
        <br>
        Make sure to respond promptly to maintain customer satisfaction.
      </p>
    </div>
    
  </div>
</body>
</html>
`;
};
