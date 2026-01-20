import {connect} from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/src/helpers/mailer";

connect();

// Export named HTTP method handlers
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {username, email, password} = reqBody;
        console.log(reqBody);

        const user = await User.findOne({email});
        if(user) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        console.log(savedUser);

        //send verification email
        await sendEmail({email, emailType:"VERIFY",userId: savedUser._id})

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        });

    } catch (error: any) {
        return NextResponse.json(
            {error: error.message},
            {status: 500}
        );
    }
}

// If you want to handle other methods, add them here:
export async function GET() {
    return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
    );
}

export async function PUT() {
    return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
    );
}

export async function DELETE() {
    return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
    );
}