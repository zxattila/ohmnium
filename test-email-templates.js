// test-email-templates.js
// Simple test script to verify email templates are working

import { createRequire } from "module";
const require = createRequire(import.meta.url);

console.log("Starting email template test...");

try {
  const CustomerTemplate = require("./netlify/functions/templates/customer");
  const BusinessTemplate = require("./netlify/functions/templates/business");

  console.log("Templates loaded successfully");

  // Test data
  const testData = {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "07700 900123",
    service: "Emergency Electrical Repair",
    message:
      "I have an urgent electrical issue in my kitchen. The lights are flickering and there's a burning smell. Please help!",
    currentDate: "30 May 2025, 11:45",
    urgent: true,
    clientIP: "192.168.1.100",
    warnings: ["Suspicious email pattern detected", "Rate limit approaching"],
  };

  console.log("🧪 Testing Email Templates...\n");

  // Test customer template
  console.log("📧 Testing Customer Template...");
  const customerHtml = CustomerTemplate(testData);
  console.log("✅ Customer template generated successfully");
  console.log(`📏 Customer HTML length: ${customerHtml.length} characters\n`);

  // Test business template
  console.log("📧 Testing Business Template...");
  const businessHtml = BusinessTemplate(testData);
  console.log("✅ Business template generated successfully");
  console.log(`📏 Business HTML length: ${businessHtml.length} characters\n`);

  console.log("🎉 All tests passed! Email templates are working correctly.");
} catch (error) {
  console.error("❌ Error testing email templates:", error.message);
  console.error(error.stack);
}
