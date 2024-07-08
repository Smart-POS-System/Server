import nodemailer from "nodemailer";

interface MailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendMail = async (options: MailOptions): Promise<void> => {
  if (process.env.NODE_ENV === "development") {
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
  }
  if (process.env.NODE_ENV === "production") {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_PROD,
        pass: process.env.PASSWORD_PROD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_PROD,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(mailOptions);
  }
};
