import { Resend } from "resend";
import catchAsync from "../catchAsync";
import AppError from "../appError";
if (!process.env.RESEND_KEY || !process.env.EMAIL_FROM) {
  throw new Error("Missing Resend API Key or sender email");
}

const resend = new Resend(process.env.RESEND_KEY);

export const sendEmail = async (options: {
  email: string;
  subject: string;
  html: string;
}) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [options.email],
    subject: options.subject,
    html: options.html,
  });

  return { error, data };
};
