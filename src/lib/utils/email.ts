import nodemailer, { Transporter } from 'nodemailer';

// Interface for email options (matching what the route handler expects)
interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// ----------------------------------------------------
// NOTE: CONFIGURE ENVIRONMENT VARIABLES
// ----------------------------------------------------
// Add these to your .env.local file:
// EMAIL_HOST=smtp.gmail.com (or your provider, e.g., smtp.sendgrid.net)
// EMAIL_PORT=587 (or 465 for SSL)
// EMAIL_USER=your_email@example.com
// EMAIL_PASS=your_app_password_or_token
// ----------------------------------------------------

let transporter: Transporter;

/**
 * Creates or returns the configured Nodemailer transporter.
 */
const createTransporter = (): Transporter => {
  if (!transporter) {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email environment variables (HOST, USER, PASS) are not fully configured.");
      // In development, we can create a fake mailtrap transporter for testing
      if (process.env.NODE_ENV !== 'production') {
        console.warn("Using ethereal.email for development testing (check console for credentials).");
        return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
                user: 'fake_user@ethereal.email', // Replace with dynamic ethereal data if using test accounts
                pass: 'fake_password' // Replace with dynamic ethereal data
            }
        });
      }
      throw new Error("Email service configuration missing. Please check .env.local.");
    }

    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

/**
 * Sends an email using the configured transporter.
 * @param options EmailOptions including to, subject, text, and html content.
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const mailTransporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: options.to,               // List of receivers
      subject: options.subject,     // Subject line
      text: options.text,           // Plain text body
      html: options.html,           // HTML body
    };

    const info = await mailTransporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    
  } catch (error) {
    console.error('Error sending email:', error);
    // Re-throw the error so the calling route handler can handle the failure
    throw error; 
  }
};