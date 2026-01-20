// // import { connect } from "@/src/dbConfig/dbConfig";
// // import { NextRequest, NextResponse } from "next/server";
// // import User from "@/src/models/userModel";

// // connect();

// // export async function POST(request: NextRequest){
// //     try {

// // const reqBody=await request.json()  
// // const {token} =reqBody;

// // const user=await User.findOne({verifyToken:token, verifyTokenExpiry:{$gt:Date.now()}});
// // if(!user){
// //     return NextResponse.json({error:"Invalid token"},{status:400})
// // }
// //     console.log(user);

// //     user.isVerified=true;
// //     user.verifyToken=undefined;
// //     user.verifyTokenExpiry=undefined;

// //     await user.save();

// //     return NextResponse.json({
// //         message:"Email verified successfully",
// //         success:true,
// //     })
// //     } catch (error:any) {
// //         return NextResponse.json({error:error.message},
// //             {status:500}
// //         )
// //     }
// // }
// import { connect } from "@/src/dbConfig/dbConfig";
// import { NextRequest, NextResponse } from "next/server";
// import User from "@/src/models/userModel";
// import bcryptjs from "bcryptjs"; // Import bcryptjs

// connect();

// export async function POST(request: NextRequest) {
//     try {
//         const reqBody = await request.json()  
//         const { token } = reqBody;

//         // Find all users with valid verifyTokenExpiry
//         // We need to find first, then compare tokens
//         const users = await User.find({ 
//             verifyTokenExpiry: { $gt: Date.now() } 
//         });

//         let user = null;
        
//         // Manually compare tokens since we need to use bcrypt
//         for (const potentialUser of users) {
//             if (potentialUser.verifyToken) {
//                 const isMatch = await bcryptjs.compare(token, potentialUser.verifyToken);
//                 if (isMatch) {
//                     user = potentialUser;
//                     break;
//                 }
//             }
//         }

//         if (!user) {
//             return NextResponse.json(
//                 { error: "Invalid or expired token" }, 
//                 { status: 400 }
//             );
//         }

//         console.log(user);

//         user.isVerified = true;
//         user.verifyToken = undefined;
//         user.verifyTokenExpiry = undefined;

//         await user.save();

//         return NextResponse.json({
//             message: "Email verified successfully",
//             success: true,
//         });
//     } catch (error: any) {
//         return NextResponse.json(
//             { error: error.message },
//             { status: 500 }
//         );
//     }
// }
// app/api/users/verifyEmail/route.ts
import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/src/models/userModel";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    console.log("=== VERIFY EMAIL DEBUG ===");
    console.log("Token from URL:", token);
    console.log("Token length:", token.length);

    // Find all users with valid token expiry
    const users = await User.find({
      verifyTokenExpiry: { $gt: Date.now() }
    });

    console.log(`Found ${users.length} users with valid token expiry`);

    // Debug: Log all users and their tokens
    users.forEach((user, index) => {
      console.log(`User ${index + 1}: ${user.email}`);
      console.log(`Stored verifyToken: ${user.verifyToken?.substring(0, 20)}...`);
      console.log(`Token expiry: ${user.verifyTokenExpiry}`);
      console.log(`Current time: ${Date.now()}`);
      console.log(`Is expired? ${user.verifyTokenExpiry < Date.now()}`);
    });

    let user = null;

    // Compare each user's hashed token with the provided token
    for (const potentialUser of users) {
      if (potentialUser.verifyToken) {
        console.log(`\nComparing token for user: ${potentialUser.email}`);
        console.log(`Stored token (first 20 chars): ${potentialUser.verifyToken.substring(0, 20)}...`);
        
        const isMatch = await bcryptjs.compare(token, potentialUser.verifyToken);
        console.log(`bcrypt.compare result: ${isMatch}`);
        
        if (isMatch) {
          user = potentialUser;
          console.log(`✅ Token MATCH for user: ${user.email}`);
          break;
        }
      }
    }

    if (!user) {
      console.log("❌ No matching user found");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    console.log("✅ User verified successfully:", user.email);

    // Update user
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Error in verify email API:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}