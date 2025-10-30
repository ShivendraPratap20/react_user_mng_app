import React, { useEffect } from "react";
import ProfileCard from "../components/ProfileCard";
import useAuth from "../context/AuthContext/auth";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { authorized, loading, userData, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !authorized) {
      navigate("/");
    }
  }, [authorized, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-70"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="text-red-600 text-lg font-semibold">
          Failed to load user data: {error.message || error.toString()}
        </div>
      </div>
    );
  }
  if (authorized && userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <ProfileCard userData={userData} />
      </div>
    );
  }
}
