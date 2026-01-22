"use client"
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { 
  UserCircle, 
  Mail, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar,
  Key,
  LogOut,
  RefreshCw,
  Home,
  Crown
} from "lucide-react";

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully 👋");
      
      // Add animation delay before redirect
      setTimeout(() => {
        router.push("/login");
      }, 800);
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/users/me');
      console.log("User data:", res.data);
      setUserData(res.data.data);
      toast.success("Profile updated! 🎉");
    } catch (error: any) {
      console.log("Error fetching user details:", error);
      toast.error(error.response?.data?.error || "Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  // Load user details automatically on component mount
  useEffect(() => {
    getUserDetails();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.05 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"
          >
            <UserCircle className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Profile Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage your account and view your details</p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="md:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
          >
            <div className="p-6 md:p-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4"
                  />
                  <p className="text-lg text-gray-600">Loading your profile...</p>
                </div>
              ) : userData ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Username */}
                  <motion.div variants={itemVariants} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Username</p>
                      <p className="text-xl font-semibold text-gray-800">{userData.username}</p>
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={itemVariants} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="text-xl font-semibold text-gray-800">{userData.email}</p>
                    </div>
                  </motion.div>

                  {/* Status */}
                  <motion.div variants={itemVariants} className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-500 mb-3">Account Status</p>
                    <div className="flex flex-wrap gap-3">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${userData.isVerified
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                      >
                        {userData.isVerified ? (
                          <>
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Verified Account
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-4 h-4 mr-2" />
                            Not Verified
                          </>
                        )}
                      </motion.span>
                      {userData.isAdmin && (
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200 rounded-full text-sm font-medium"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Administrator
                        </motion.span>
                      )}
                    </div>
                  </motion.div>

                  {/* User ID */}
                  <motion.div variants={itemVariants} className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-3">
                      <Key className="w-5 h-5 text-gray-500 mr-2" />
                      <p className="text-sm font-medium text-gray-500">User ID</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs font-mono break-all text-gray-700">{userData._id}</p>
                    </div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="mt-3"
                    >
                      <Link
                        href={`/profile/${userData._id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View detailed profile page →
                      </Link>
                    </motion.div>
                  </motion.div>

                  {/* Member Since */}
                  {userData.createdAt && (
                    <motion.div variants={itemVariants} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
                      <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Member Since</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {new Date(userData.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-400 mb-4">
                    <UserCircle className="w-16 h-16 mx-auto" />
                  </div>
                  <p className="text-gray-600 mb-4">No user data available</p>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={getUserDetails}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                  >
                    Load Profile
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Actions Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={getUserDetails}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Refreshing...' : 'Refresh Profile'}</span>
                </motion.button>

                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={logout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <LogOut className={`w-5 h-5 ${isLoggingOut ? 'animate-pulse' : ''}`} />
                  <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </motion.button>
              </div>
            </div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white"
            >
              <h2 className="text-xl font-bold mb-4">Account Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Profile Status</span>
                  <span className="font-semibold">
                    {userData ? (userData.isVerified ? 'Active' : 'Pending') : 'Loading'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Role</span>
                  <span className="font-semibold">
                    {userData?.isAdmin ? 'Administrator' : 'Standard User'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Last Updated</span>
                  <span className="font-semibold">
                    {userData?.updatedAt
                      ? new Date(userData.updatedAt).toLocaleDateString()
                      : 'Never'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
            >
              <Link
                href="/"
                className="flex items-center justify-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-10 text-gray-500 text-sm"
        >
          <p>Secure profile dashboard • Protected by authentication</p>
        </motion.div>
      </motion.div>
    </div>
  );
}