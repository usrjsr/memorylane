// lib/email.ts
import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  // For development, use Ethereal Email (fake SMTP)
  // For production, use real service like Gmail, SendGrid, etc.
  
  if (process.env.NODE_ENV === 'production') {
    // Production email service (example with Gmail)
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App-specific password
      },
    });
  } else {
    // Development - Use console logging for now
    return {
      sendMail: async (options: any) => {
        console.log('📧 [EMAIL] Would send email:', options);
        return { messageId: 'dev-message-id' };
      }
    };
  }
};

interface UnlockEmailData {
  recipients: string[];
  capsuleTitle: string;
  capsuleId: string;
  unlockDate: Date;
}

export async function sendUnlockEmail(data: UnlockEmailData) {
  const { recipients, capsuleTitle, capsuleId, unlockDate } = data;
  
  const transporter = createTransporter();
  const capsuleUrl = `${process.env.NEXTAUTH_URL}/unlocked/${capsuleId}`;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 A Time Capsule Has Been Unlocked!</h1>
          </div>
          <div class="content">
            <h2>${capsuleTitle}</h2>
            <p>Great news! A special memory has been unlocked for you.</p>
            <p>This time capsule was sealed and set to open on ${new Date(unlockDate).toLocaleDateString()}, and that day has finally arrived!</p>
            <p>Click the button below to view the memories, photos, and messages waiting for you:</p>
            <center>
              <a href="${capsuleUrl}" class="button">Open Time Capsule</a>
            </center>
            <p><small>If the button doesn't work, copy this link: ${capsuleUrl}</small></p>
          </div>
          <div class="footer">
            <p>© 2024 MemoryLane - Preserving memories for the future</p>
          </div>
        </div>
      </body>
    </html>
  `;
  
  try {
    // Send to each recipient
    for (const recipient of recipients) {
      await transporter.sendMail({
        from: '"MemoryLane" <noreply@memorylane.com>',
        to: recipient,
        subject: `🎉 Time Capsule Unlocked: ${capsuleTitle}`,
        html: emailHtml,
        text: `A time capsule "${capsuleTitle}" has been unlocked! View it at: ${capsuleUrl}`
      });
      
      console.log(`✅ [EMAIL] Sent unlock notification to ${recipient}`);
    }
    
    return { success: true, recipients: recipients.length };
  } catch (error) {
    console.error('❌ [EMAIL] Failed to send:', error);
    throw error;
  }
}

// Test email function
export async function sendTestEmail(to: string) {
  const transporter = createTransporter();
  
  try {
    const result = await transporter.sendMail({
      from: '"MemoryLane Test" <test@memorylane.com>',
      to,
      subject: 'Test Email from MemoryLane',
      html: '<h1>Test Email</h1><p>If you see this, email is working!</p>',
      text: 'Test email - If you see this, email is working!'
    });
    
    return result;
  } catch (error) {
    console.error('Test email failed:', error);
    throw error;
  }
}