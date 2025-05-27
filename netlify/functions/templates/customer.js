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

  return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">⚡ Thank You for Contacting Us!</h1>
  </div>
  
  <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <p style="font-size: 18px; color: #333;">Hi ${escapedData.name},</p>
    
    <p style="line-height: 1.6; color: #555;">
      Thank you for reaching out to us! We've received your ${data.urgent ? "<strong>urgent</strong> " : ""}message and will get back to you as soon as possible.
    </p>
    
    <div style="background: #e8f4fd; padding: 20px; border-radius: 4px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1976d2;">What happens next?</h3>
      <ul style="color: #555; line-height: 1.6;">
        <li>We'll review your request within 24 hours</li>
        <li>Our team will contact you at ${escapedData.phone}</li>
        ${escapedData.service ? `<li>Service requested: <strong>${escapedData.service}</strong></li>` : ""}
        ${data.urgent ? '<li style="color: #ff6b6b; font-weight: bold;">Your request has been flagged as urgent</li>' : ""}
      </ul>
    </div>
    
    <div style="border-left: 4px solid #28a745; padding: 20px; background: #f8fff9; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #28a745;">Emergency Contact</h3>
      <p style="margin-bottom: 10px; color: #555;">
        For immediate assistance outside business hours:
      </p>
      <p style="font-size: 20px; font-weight: bold; color: #28a745; margin: 0;">
        📞 020 3500 1441
      </p>
    </div>
    
    <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; color: #856404;">
        <strong>Reference:</strong> Submitted on ${escapedData.currentDate}
      </p>
    </div>
    
    <p style="color: #555; line-height: 1.6;">
      Best regards,<br>
      <strong>The ${process.env.BUSINESS_NAME || "Ohmnium"} Team</strong>
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
    <p>This is an automated message. Please don't reply directly to this email.</p>
  </div>
</div>
`;
};
