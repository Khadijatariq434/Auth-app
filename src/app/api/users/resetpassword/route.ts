// app/api/users/resetpassword/route.ts
import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/src/models/userModel";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token, password } = reqBody;

    console.log("Reset password request received");

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Find users with valid reset token expiry
    const users = await User.find({
      forgotPasswordTokenExpiry: { $gt: Date.now() }
    });

    console.log(`Found ${users.length} users with valid reset token expiry`);

    if (users.length === 0) {
      // Check if token exists but expired
      const expiredUser = await User.findOne({
        forgotPasswordToken: { $exists: true },
        forgotPasswordTokenExpiry: { $lt: Date.now() }
      });

      if (expiredUser) {
        return NextResponse.json(
          { error: "Reset token has expired. Please request a new one." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    let user = null;

    // Compare each user's hashed token with the provided token
    for (const potentialUser of users) {
      if (potentialUser.forgotPasswordToken) {
        const isMatch = await bcryptjs.compare(token, potentialUser.forgotPasswordToken);
        if (isMatch) {
          user = potentialUser;
          break;
        }
      }
    }

    if (!user) {
      console.log("No user found with matching reset token");
      return NextResponse.json(
        { error: "Invalid reset token" },
        { status: 400 }
      );
    }

    console.log("User found for password reset:", user.email);

    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    await user.save();

    console.log("Password reset successfully for:", user.email);

    return NextResponse.json({
      message: "Password reset successfully",
      success: true
    });
  } catch (error: any) {
    console.error("Error in reset password:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}