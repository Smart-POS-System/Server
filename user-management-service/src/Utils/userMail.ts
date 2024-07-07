import nodemailer from "nodemailer";

interface MailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendMail = async (options: MailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST_DEV as string,
    port: Number(process.env.EMAIL_PORT_DEV),
    auth: {
      user: process.env.EMAIL_USERNAME_DEV as string,
      pass: process.env.EMAIL_PASSWORD_DEV as string,
    },
  });

  const mailOptions = {
    from: "Polos POS System <polos@uom.lk>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
