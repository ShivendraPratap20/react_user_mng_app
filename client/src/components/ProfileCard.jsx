import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import useApi from "../hooks/userApi";
import { toast } from "react-toastify";

const ProfileCard = ({ userData }) => {
  const [profileData, setProfileData] = useState(userData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { get, remove } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    setProfileData(userData);
  }, [userData]);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      const response = await get("/logout");
      if (response?.status === "SUCCESS") {
        toast.success("Logout successful!");
        navigate("/");
      } else {
        toast.error(response?.message || "Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout");
    } finally {
      setIsLoggingOut(false);
    }
  }, [get, navigate]);

  const handleDelete = useCallback(async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const response = await remove(`/deleteData/${profileData.userID}`);
      if (response?.status === "SUCCESS") {
        toast.success("Profile deleted successfully!");
        navigate("/");
      } else {
        toast.error(response?.message || "Failed to delete profile");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting profile");
    } finally {
      setIsDeleting(false);
    }
  }, [get, navigate, profileData.userID]);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="max-w-xs bg-white shadow-lg rounded-lg overflow-hidden text-center p-6">
      {profileData.profilePic ? (
        <img
          className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-500"
          src={profileData.profilePic}
          alt={`${profileData.userName}'s profile`}
        />
      ) : (
        <div className="w-24 h-24 mx-auto flex items-center justify-center rounded-full bg-blue-200 border-4 border-blue-500 text-blue-700 text-2xl font-bold">
          {getInitials(profileData.userName)}
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-xl font-semibold text-gray-800">{profileData.userName}</h2>
        <p className="text-gray-500 truncate">User ID: {profileData.userID}</p>
        <p className="text-gray-600 mt-2">Phone: {profileData.phoneNumber || "N/A"}</p>
      </div>

      <div className="mt-6 flex justify-between gap-2">
        <button
          aria-label="Modify profile"
          className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          onClick={() => setIsModalOpen(true)}
        >
          Modify
        </button>

        <button
          aria-label="Logout"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex-1 bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition disabled:opacity-60"
        >
          {isLoggingOut ? "Logging Out..." : "Logout"}
        </button>

        <button
          aria-label="Delete account"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={profileData}
        getInitials = {getInitials}
        setProfileData={setProfileData}
      />
    </div>
  );
};

export default React.memo(ProfileCard);
