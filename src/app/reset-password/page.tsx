// app/reset-password/page.tsx
"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Get token from URL
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token");
      
      if (urlToken) {
        setToken(urlToken);
        console.log("Token found:", urlToken.substring(0, 20) + "...");
      } else {
        setError("Invalid or missing reset token");
        console.log("No token found in URL");
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await axios.post('/api/users/resetpassword', {
        token,
        password
      });
      
      setSuccess(response.data.message || "Password reset successfully!");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl mb-6 text-center">Set New Password</h1>
        
        {!token && !error && (
          <div className="p-3 bg-yellow-900 border border-yellow-700 rounded-lg mb-4">
            <p className="text-yellow-200">Loading token...</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
              minLength={6}
              required
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
              minLength={6}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900 border border-red-700 rounded-lg">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-900 border border-green-700 rounded-lg">
              <p className="text-green-200">{success}</p>
              <p className="text-green-300 text-sm mt-1">
                Redirecting to login page...
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token || success.length > 0}
            className={`w-full py-3 px-4 rounded-lg font-medium ${
              loading || !token || success.length > 0
                ? "bg-blue-800 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <div>
            <Link href="/login" className="text-blue-400 hover:text-blue-300">
              Back to Login
            </Link>
          </div>
          {!token && (
            <div className="text-sm text-gray-400">
              <p>Need a new reset link?</p>
              <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300">
                Request another reset email
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}