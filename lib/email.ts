// lib/email.ts

import nodemailer from "nodemailer";

interface SendUnlockEmailParams {
  recipientEmail: string;
  capsuleTitle: string;
  capsuleId: string;
  senderName: string;
}

interface SendCapsuleCreationEmailParams {
  recipientEmail: string;
  capsuleTitle: string;
  capsuleId: string;
  creatorName: string;
  unlockDate: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const emailStyles = {
  container: "font-sans text-gray-800",
  wrapper: "max-w-2xl mx-auto bg-slate-900 rounded-2xl p-8 sm:p-10 border-2 border-cyan-500/30 shadow-2xl",
  header: "text-center mb-8",
  title: "text-3xl sm:text-4xl font-black text-white mb-2",
  subtitle: "text-cyan-400 font-semibold text-lg mb-6",
  description: "text-slate-300 text-base leading-relaxed mb-6",
  highlight: "text-cyan-300 font-bold",
  button: "inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-8 py-4 rounded-lg font-bold text-center transition-all duration-200 no-underline",
  infoBox: "bg-cyan-900/30 border-2 border-cyan-500/50 rounded-lg p-4 my-6",
  infoText: "text-cyan-300 text-sm font-medium m-0",
  footer: "text-center mt-10 pt-8 border-t-2 border-slate-700 text-slate-500 text-xs font-medium",
  emoji: "text-2xl mr-2",
};

export async function sendCapsuleCreationNotification({
  recipientEmail,
  capsuleTitle,
  capsuleId,
  creatorName,
  unlockDate,
}: SendCapsuleCreationEmailParams) {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@memorylane.com",
      to: recipientEmail,
      subject: `📬 You've Been Added to a Time Capsule: "${capsuleTitle}"`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background-color: #0f172a;
              margin: 0;
              padding: 20px;
            }
            .wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: #0f172a;
              border: 2px solid rgba(6, 182, 212, 0.3);
              border-radius: 16px;
              padding: 40px 30px;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            }
            h1 {
              color: #ffffff;
              text-align: center;
              font-size: 32px;
              font-weight: 900;
              margin: 0 0 8px 0;
            }
            .emoji {
              font-size: 32px;
              margin-right: 8px;
            }
            .subtitle {
              color: #06b6d4;
              text-align: center;
              font-size: 18px;
              font-weight: 600;
              margin: 16px 0 24px 0;
            }
            p {
              color: #cbd5e1;
              font-size: 16px;
              line-height: 1.6;
              margin: 12px 0;
            }
            .highlight {
              color: #06b6d4;
              font-weight: 700;
            }
            .capsule-title {
              color: #ffffff;
              text-align: center;
              font-size: 24px;
              font-weight: 900;
              margin: 20px 0;
              padding: 16px;
              background: rgba(6, 182, 212, 0.1);
              border-radius: 12px;
              border-left: 4px solid #06b6d4;
            }
            .info-box {
              background: rgba(6, 182, 212, 0.1);
              border: 2px solid rgba(6, 182, 212, 0.5);
              border-radius: 12px;
              padding: 16px;
              margin: 24px 0;
            }
            .info-text {
              color: #06b6d4;
              font-size: 14px;
              font-weight: 600;
              margin: 0;
            }
            .footer {
              text-align: center;
              margin-top: 32px;
              padding-top: 24px;
              border-top: 2px solid #1e293b;
              color: #64748b;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <h1><span class="emoji">📬</span>Time Capsule Created!</h1>
            <p style="text-align: center; color: #94a3b8; margin-top: 0;">A special memory awaits you</p>
            
            <p>Hello,</p>
            <p><span class="highlight">${creatorName}</span> has created a special time capsule and added you as a recipient:</p>
            
            <div class="capsule-title">"${capsuleTitle}"</div>
            
            <p style="text-align: center; color: #cbd5e1;">
              This capsule will be ready to open on:<br>
              <span class="highlight" style="font-size: 18px;">${unlockDate}</span>
            </p>
            
            <div class="info-box">
              <p class="info-text">💡 You will receive another email when the capsule is ready to be opened!</p>
            </div>
            
            <p style="text-align: center; color: #94a3b8; font-size: 14px;">
              We'll notify you as soon as this time capsule unlocks so you can relive these precious memories together.
            </p>
            
            <div class="footer">
              <p style="margin: 0;">© ${new Date().getFullYear()} MemoryLane - Preserving Memories for Tomorrow</p>
              <p style="margin: 8px 0 0 0;">If you did not expect this email, please ignore it.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅ [EMAIL] Capsule creation email sent to:", recipientEmail);
    return { success: true, data: result };
  } catch (error) {
    console.error("❌ [EMAIL] Failed to send capsule creation email:", error);
    return { success: false, error };
  }
}

export async function sendUnlockNotification({
  recipientEmail,
  capsuleTitle,
  capsuleId,
  senderName,
}: SendUnlockEmailParams) {
  const capsuleUrl = `${process.env.NEXTAUTH_URL}/unlocked/${capsuleId}`;

  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@memorylane.com",
      to: recipientEmail,
      subject: `🎉 A Time Capsule Has Unlocked: "${capsuleTitle}"`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background-color: #0f172a;
              margin: 0;
              padding: 20px;
            }
            .wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: #0f172a;
              border: 2px solid rgba(6, 182, 212, 0.3);
              border-radius: 16px;
              padding: 40px 30px;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            }
            h1 {
              color: #ffffff;
              text-align: center;
              font-size: 32px;
              font-weight: 900;
              margin: 0 0 8px 0;
            }
            .emoji {
              font-size: 32px;
              margin-right: 8px;
            }
            .subtitle {
              color: #06b6d4;
              text-align: center;
              font-size: 18px;
              font-weight: 600;
              margin: 16px 0 24px 0;
            }
            p {
              color: #cbd5e1;
              font-size: 16px;
              line-height: 1.6;
              margin: 12px 0;
            }
            .highlight {
              color: #06b6d4;
              font-weight: 700;
            }
            .capsule-title {
              color: #ffffff;
              text-align: center;
              font-size: 28px;
              font-weight: 900;
              margin: 24px 0;
              padding: 20px;
              background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2));
              border-radius: 12px;
              border: 2px solid rgba(6, 182, 212, 0.4);
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #06b6d4, #3b82f6);
              color: #ffffff;
              padding: 14px 32px;
              border-radius: 8px;
              font-weight: 700;
              font-size: 16px;
              text-decoration: none;
              text-align: center;
              transition: all 0.3s ease;
              border: 2px solid #06b6d4;
              width: 100%;
              box-sizing: border-box;
              margin: 24px 0;
            }
            .cta-button:hover {
              background: linear-gradient(135deg, #06a3c7, #3476dd);
              box-shadow: 0 8px 16px rgba(6, 182, 212, 0.3);
            }
            .footer {
              text-align: center;
              margin-top: 32px;
              padding-top: 24px;
              border-top: 2px solid #1e293b;
              color: #64748b;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <h1><span class="emoji">🎉</span>Your Memory Awaits!</h1>
            <p style="text-align: center; color: #94a3b8; margin-top: 0;">The time has come to unlock special moments</p>
            
            <p>Dear ${recipientEmail.split('@')[0]},</p>
            <p>A special time capsule created by <span class="highlight">${senderName}</span> is now ready to be opened:</p>
            
            <div class="capsule-title">"${capsuleTitle}"</div>
            
            <p style="text-align: center; color: #cbd5e1;">
              Step back in time and experience the memories that were carefully preserved for this moment. Click below to unlock your time capsule.
            </p>
            
            <center>
              <a href="${capsuleUrl}" class="cta-button">
                🔓 Open Your Time Capsule
              </a>
            </center>
            
            <p style="text-align: center; color: #94a3b8; font-size: 14px;">
              This link will take you directly to your unlocked capsule where you can view all the cherished memories.
            </p>
            
            <div class="footer">
              <p style="margin: 0;">© ${new Date().getFullYear()} MemoryLane - Preserving Memories for Tomorrow</p>
              <p style="margin: 8px 0 0 0;">If you did not expect this email, please ignore it.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅ [EMAIL] Unlock notification sent to:", recipientEmail);
    return { success: true, data: result };
  } catch (error) {
    console.error(
      "❌ [EMAIL] Failed to send unlock notification to",
      recipientEmail,
      ":",
      error
    );
    return { success: false, error };
  }
}