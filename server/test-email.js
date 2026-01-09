const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ahmad.sameer@g.bracu.ac.bd',
    pass: 'uahb jmcs lgpq huka'
  }
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: '"PetStore Test" <ahmad.sameer@g.bracu.ac.bd>',
      to: 'ahmad.sameer@g.bracu.ac.bd',
      subject: 'Test Email from PetStore',
      text: 'If you receive this, email setup is working!'
    });
    
    console.log('✅ Email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Email error:', error.message);
  }
}

testEmail();