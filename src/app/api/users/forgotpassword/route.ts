// app/api/users/forgotpassword/route.ts
import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/src/models/userModel";
import { sendEmail } from "@/src/helpers/mailer";
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    console.log("Forgot password request for:", email);

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal that user doesn't exist for security
      console.log("User not found with email:", email);
      return NextResponse.json({
        message: "If an account exists with this email, a reset link will be sent.",
        success: true
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your email first before resetting password" },
        { status: 400 }
      );
    }

    console.log("Sending reset password email to:", user.email);

    // Send reset password email
    await sendEmail({
      email: user.email,
      emailType: "RESET",
      userId: user._id
    });

    return NextResponse.json({
      message: "Password reset email sent successfully",
      success: true
    });
  } catch (error: any) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}