"use client"
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
const router = useRouter()
const [data, setData]=useState("nothing")
    const logout=async()=>{
        try {
            await axios.get("/api/users/logout")
            router.push("/login")
        } catch (error:any) {
            console.log(error.message);
            toast.error(error.message)
        }
    }

    const getUserDetails =  async()=>{
        const res=await axios.get('/api/users/me')
        console.log(res.data);
        setData(res.data.data._id)
    }
    return(
        <div className="flex flex-col justify-center items-center text-2xl">
            <h1>Profile</h1>
            <p>This is profile</p>
            <h2 className="p-2 bg-lime-500">{data === "nothing"?"Nothing": <Link href={
                `/profile/${data}`
            }>{data}</Link> }</h2>
            <hr/>
            <button
                onClick={logout}
                className="m-1 p-1 bg-lime-600 rounded pointer-coarse:"
            >
                Logout
            </button>
             <button
                onClick={getUserDetails}
                className="m-1 p-1 bg-lime-600 rounded pointer-coarse:"
            >
                getUserDetails
            </button>
        </div>
    )
}