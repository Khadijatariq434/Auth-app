// import nodemailer from "nodemailer";
// import User from "../models/userModel";
// import bcryptjs from "bcryptjs";

// export const sendEmail = async ({ email, emailType, userId }: any) => {
//   try {
//     const hashedToken = await bcryptjs.hash(userId.toString(), 10);

//     if (emailType === "VERIFY") {
//       await User.findByIdAndUpdate(userId, {
//         verifyToken: hashedToken,
//         verifyTokenExpiry: Date.now() + 3600000,
//       });
//     } else if (emailType === "RESET") {
//       await User.findByIdAndUpdate(userId, {
//         forgotPasswordToken: hashedToken,
//         forgotPasswordTokenExpiry: Date.now() + 3600000,
//       });
//     }
//     // Looking to send emails in production? Check out our Email API/SMTP product!
//     var transport = nodemailer.createTransport({
//       host: "sandbox.smtp.mailtrap.io",
//       port: 2525,
//       auth: {
//         user: "389a44e425a4a0",
//         pass: "32bd86c1cc783e",
//       },
//     });

//     const mailOptions = {
//       from: "khadijatariq434@gmail.com",
//       to: email,
//       subject:
//         emailType === "VERIFY" ? "Verify your email" : "Reset your Password",
//       html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`,
//     };

//     const mailResponse = await transport.sendMail(mailOptions);
//     return mailResponse;
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// };

// //f5e256608e6e49b1c472bc32a28c3c5e
import nodemailer from "nodemailer";
import User from "../models/userModel";
import bcryptjs from "bcryptjs";
import crypto from "crypto"; // Add this import

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // Generate a random token (not hash of userId)
    const token = crypto.randomBytes(32).toString("hex");
    
    // Hash the random token for storage
    const hashedToken = await bcryptjs.hash(token, 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken, // Store the hashed random token
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
  pass: process.env.MAILTRAP_PASS,
      },
    });

    // const mailOptions = {
    //   from: "khadijatariq434@gmail.com",
    //   to: email,
    //   subject:
    //     emailType === "VERIFY" ? "Verify your email" : "Reset your Password",
    //   // Use the PLAIN token (not hashed) in the URL
    //   html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${token}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${token}</p>`,
    // };
// Update the mailOptions in sendEmail.ts
const mailOptions = {
  from: "khadijatariq434@gmail.com",
  to: email,
  subject: emailType === "VERIFY" ? "Verify your email" : "Reset your Password",
  html: `<p>Click <a href="https://auth-app-seven-eta.vercel.app/${emailType === 'VERIFY' ? 'verifyemail' : 'reset-password'}?token=${token}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or copy and paste the link below in your browser. <br> https://auth-app-seven-eta.vercel.app/${emailType === 'VERIFY' ? 'verifyemail' : 'reset-password'}?token=${token}</p>`,
};
    const mailResponse = await transport.sendMail(mailOptions);
    console.log("Verification email sent with token:", token.substring(0, 10) + "...");
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
