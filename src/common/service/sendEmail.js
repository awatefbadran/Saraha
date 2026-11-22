
// import { randomInt } from "node:crypto";
// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// export const sendEmail = async ({
//   to,
//   subject,
//   html = "",
//   attachments = []
// }) => {
//   const info = await transporter.sendMail({
//     from: `"sarahaApp" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html,
//     attachments
//   });

//   console.log(info.messageId);
//   return info;
// };

// export const generate_otp = () => {
//   return randomInt(10000, 100000).toString();
// };
