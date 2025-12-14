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

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

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
        <div style="font-family: sans-serif; padding: 20px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
            <h1 style="color: #d97706; text-align: center;">📬 Time Capsule Created!</h1>
            <p style="color: #4b5563;">Hello,</p>
            <p style="color: #4b5563;"><strong>${creatorName}</strong> has created a special time capsule and added you as a recipient:</p>
            <h2 style="color: #1f2937; text-align: center; margin-bottom: 10px;">"${capsuleTitle}"</h2>
            <p style="color: #6b7280; text-align: center; margin-bottom: 25px;">
              This capsule will be ready to open on: <strong>${unlockDate}</strong>
            </p>
            <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 15px; margin: 20px 0;">
              <p style="color: #78350f; margin: 0;">
                💡 You will receive another email when the capsule is ready to be opened!
              </p>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #9ca3af; text-align: center;">
              If you did not expect this email, please ignore it.
            </p>
          </div>
        </div>
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
  // Use the NEXTAUTH_URL environment variable
  const capsuleUrl = `${process.env.NEXTAUTH_URL}/unlocked/${capsuleId}`;

  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@memorylane.com",
      to: recipientEmail,
      subject: `🎉 A Time Capsule Has Unlocked: "${capsuleTitle}"`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
            <h1 style="color: #4f46e5; text-align: center;">🎁 Memory Unlocked!</h1>
            <p style="color: #4b5563;">Dear recipient,</p>
            <p style="color: #4b5563;">A special time capsule created by <strong>${senderName}</strong> is now ready to be opened:</p>
            <h2 style="color: #1f2937; text-align: center; margin-bottom: 25px;">"${capsuleTitle}"</h2>
            <div style="text-align: center;">
              <a href="${capsuleUrl}" 
                 style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                 Open Your Time Capsule
              </a>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #9ca3af; text-align: center;">
              If you did not expect this email, please ignore it.
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ [EMAIL] Unlock notification sent to:", recipientEmail);
    return { success: true, data: result };
  } catch (error) {
    console.error("❌ [EMAIL] Failed to send unlock notification to", recipientEmail, ":", error);
    return { success: false, error };
  }
}