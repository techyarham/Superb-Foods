import { transporter } from "../config/email.config";

export interface EmailData {
  to: string;
  html: string;
  text: string;
  subject: string;
}

export const sendEmail = async ({ to, html, subject, text }: EmailData) => {
  await transporter.sendMail({
    from: `"Superb Foods" <${process.env.EMAIL_USER}>`,
    to,
    text,
    html,
    subject
  });
};
