const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const createTransporter = async () => {
  // Make sure you're using the correct environment variable names
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD; // Make sure this matches your .env file
  
  if (!user || !pass) {
    console.error('Missing email credentials in environment variables');
    throw new Error('Email configuration error: Missing credentials');
  }
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass
    }
  });
  
  // Verify connection configuration
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return transporter;
  } catch (error) {
    console.error('SMTP Verification failed:', error);
    throw error; // Throw error instead of returning transporter to prevent silent failures
  }
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = await createTransporter();
    
    const message = {
      from: `"Your Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email notification failed:', error);
    return false;
  }
};

module.exports = sendEmail;