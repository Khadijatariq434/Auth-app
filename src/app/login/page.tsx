"use client";
import Link from "next/link";
import React, {useEffect} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router=useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    
  });
  const [loading, setLoading] = React.useState(false)
  
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
  

  const onLogin = async () => {
    try {
      setLoading(true);
      const response=await axios.post("/api/users/login",user);
      console.log("login success",response.data);
      toast.success("login successful");
      router.push("/profile");
    } catch (error:any) {
      console.log("login failed",error.message);
      toast.error(error.message);
    }finally{
      setLoading(false)
    }
  };

  useEffect(()=>{
      if(user.email.length>0 && user.password.length>0){
        setButtonDisabled(false);
      }else{
        setButtonDisabled(true);
      }
  },[user])
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading? "Processing" : "Login"}</h1>
      <hr />
    
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
       onClick={onLogin}
      >
       {buttonDisabled? "No Login": "Login"}
      </button>
      <Link href="/signup"> Create Account</Link>
<div className="text-center mt-4">
  <Link 
    href="/forgotpassword" 
    className="text-blue-400 hover:text-blue-300"
  >
    Forgot Password?
  </Link>
</div>
    </div>
  );
}
