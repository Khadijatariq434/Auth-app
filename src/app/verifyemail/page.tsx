"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const hasVerified = useRef(false); // Prevent multiple calls

  const verifyUserEmail = async () => {
    if (hasVerified.current || loading) return;
    
    try {
      setLoading(true);
      setError("");
      
      console.log("Sending verification request with token:", token.substring(0, 20) + "...");
      
      const response = await axios.post('/api/users/verifyEmail', { token });
      
      console.log("Verification response:", response.data);
      setVerified(true);
      hasVerified.current = true;
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error: any) {
      console.error("Verification error:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get token from URL
    const urlToken = window.location.search.split("=")[1];
    if (urlToken) {
      console.log("Token extracted from URL:", urlToken.substring(0, 20) + "...");
      setToken(urlToken);
    } else {
      setError("No token found in URL");
    }
  }, []);

  useEffect(() => {
    if (token && !hasVerified.current && !loading) {
      console.log("Calling verifyUserEmail with token...");
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl mb-4">Verify Email</h1>
      
      <div className="p-4 bg-gray-800 rounded-lg mb-4">
        <h2 className="text-lg mb-2">Token Status:</h2>
        <p className="text-sm font-mono break-all bg-gray-900 p-2 rounded">
          {token ? `${token.substring(0, 30)}...` : "No token"}
        </p>
      </div>

      {loading && (
        <div className="p-4 bg-blue-900 rounded-lg mb-4">
          <p className="text-white">Verifying your email...</p>
        </div>
      )}

      {verified && (
        <div className="p-4 bg-green-900 rounded-lg mb-4">
          <h2 className="text-xl mb-2">✅ Email Verified Successfully!</h2>
          <p>You will be redirected to login page shortly.</p>
          <Link 
            href="/login" 
            className="mt-4 inline-block bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Go to Login
          </Link>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-900 rounded-lg mb-4">
          <h2 className="text-xl mb-2">❌ Error</h2>
          <p>{error}</p>
          <div className="mt-4 space-x-4">
            <Link 
              href="/login" 
              className="inline-block bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Go to Login
            </Link>
            <Link 
              href="/signup" 
              className="inline-block bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Sign Up Again
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}