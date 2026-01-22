"use client"
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface UserData {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/users/me');
      setUserData(res.data.data);
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged out");
      router.push("/login");
    } catch (error: any) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
          
          {userData && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Username</label>
                  <p className="mt-1 text-lg font-semibold">{userData.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="mt-1 text-lg font-semibold">{userData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-2 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${userData.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {userData.isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                    {userData.isAdmin && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">User ID</label>
                  <p className="mt-1 text-sm font-mono bg-gray-100 p-2 rounded break-all">
                    {userData._id}
                  </p>
                  <Link 
                    href={`/profile/${userData._id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                  >
                    View profile page →
                  </Link>
                </div>
                
                {userData.createdAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Member Since</label>
                    <p className="mt-1 text-lg">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-8 flex gap-4">
            <button
              onClick={getUserDetails}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}