import { Resend } from "resend";

export async function sendVerificationEmail(to, token) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Verify your OurTribe email address",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Welcome to OurTribe</h2>
        <p>Thanks for registering. Please confirm your email address to activate your account.</p>
        <p>
          <a
            href="${verifyUrl}"
            style="display: inline-block; padding: 12px 20px; background-color: #4d7c0f; color: #ffffff; text-decoration: none; border-radius: 6px;"
          >
            Verify Email
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p style="color: #666; font-size: 13px;">This link expires in 24 hours.</p>
      </div>
    `,
  });
}
