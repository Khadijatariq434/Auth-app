"use client"
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });
  const [loading, setLoading] = React.useState(false)

  const [buttonDisabled, setButtonDisabled] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response= await axios.post("/api/users/signup",user);
      console.log("saved User",response.data);
      router.push("/login");
      
    } catch (error:any) {
      console.log("falied",error.message);
      
    }finally{
      setLoading(false)
    }
  };

  useEffect(()=>{
    if(user.email.length > 0 && user.password.length>0 && user.username.length>0 ){
      setButtonDisabled(false);
    }else{
      setButtonDisabled(true);
    }
  },[user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading? "Processing": "Signup"}</h1>
      <hr />
      <label htmlFor="username">username</label>
      <input
        className="p-2 border-2 border-amber-300 rounded-2xl"
        type="text"
        id="username"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder="username"
      />
      <label htmlFor="email">email</label>
      <input
        className="p-2 border-2 border-amber-300 rounded-2xl"
        type="text"
        id="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="email"
      />
      <label htmlFor="password">password</label>
      <input
        className="p-2 border-2 border-amber-300 rounded-2xl"
        type="password"
        id="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="password"
      />
      <button
       className="p-1 border border-amber-800  text-2xl rounded-2xl m-2"
       onClick={onSignup}
      >
       {buttonDisabled? "No signup" : "Signup Here"}
      </button>
      <Link href="/login"> Visit Login</Link>
    </div>
  );
}
