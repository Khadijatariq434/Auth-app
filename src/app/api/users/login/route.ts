import {connect} from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request:NextRequest){
    try {
       const reqBody=await request.json();
        const {email, password}=reqBody;
        console.log(reqBody);

        const user=await User.findOne({email})
        if(!user){
            return NextResponse.json({error:"User doesn't exist"},{status:400})
        }
        const validPassword=await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error:"password is incorrect"},{status:400})
        }
        const tokenData={
            id:user._id,
            username:user.username,
            email:user.email
        }
        const token=await jwt.sign(tokenData, process.env.TOKEN_SECRET!,{expiresIn:"1d"})
        const response=NextResponse.json({
            message:"login successful",
            success:true
        })
        response.cookies.set("token",token,{
            httpOnly:true,
        })
        return response;
    } catch (error:any) {
        NextResponse.json({
           error:error.message,
            
        },{status:400})
        console.log("login failed",error.message)
    }
}