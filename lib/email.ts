// lib/email.ts

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendUnlockEmailParams {
  recipientEmail: string;
  capsuleTitle: string;
  capsuleId: string;
  senderName: string;
}

export async function sendUnlockNotification({
  recipientEmail,
  capsuleTitle,
  capsuleId,
  senderName,
}: SendUnlockEmailParams) {
  // Use the NEXTAUTH_URL environment variable (which is our mock domain locally)
  const capsuleUrl = `${process.env.NEXTAUTH_URL}/unlocked/${capsuleId}`;

  try {
    const { data, error } = await resend.emails.send({
      // IMPORTANT: Use onboarding@resend.dev for local testing validation
      from: "MemoryLane <onboarding@resend.dev>", 
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

    if (error) {
      console.error("❌ [EMAIL] Failed to send:", error);
      return { success: false, error };
    }

    console.log("✅ [EMAIL] Sent to:", recipientEmail);
    return { success: true, data };
  } catch (error) {
    console.error("💥 [EMAIL] Exception:", error);
    return { success: false, error };
  }
}