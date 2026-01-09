require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔧 Testing Gmail configuration...');
console.log('📧 Email:', process.env.EMAIL_USER);
console.log('🔑 App Password exists:', !!process.env.EMAIL_APP_PASSWORD);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // Add this for debugging
  }
});

async function test() {
  try {
    console.log('🔄 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: `"PetStore Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email from PetStore',
      text: 'If you receive this, your email setup is working!',
      html: '<h2>Test successful!</h2>'
    });
    
    console.log('✅ Test email sent!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📊 Response:', info.response);
    
  } catch (error) {
    console.error('❌ Email error:', error.message);
    console.error('🔍 Full error:', error);
    
    // Common error messages:
    if (error.message.includes('Invalid login')) {
      console.log('💡 Solution: Check your App Password - make sure 2FA is enabled');
    } else if (error.message.includes('Less secure apps')) {
      console.log('💡 Solution: Google blocks "less secure apps" - use App Password');
    } else if (error.message.includes('Connection timeout')) {
      console.log('💡 Solution: Check firewall/antivirus blocking SMTP');
    }
  }
}

test();