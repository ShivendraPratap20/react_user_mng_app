import React, { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import useApi from "../hooks/userApi";
import { ProfileUpdateValidation } from "../schemas/ValidationSchema";

const Modal = React.memo(({ isOpen, onClose, userData, setProfileData, getInitials }) => {
  const { isLoading, put, isError, errMsg } = useApi();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(userData?.profilePic || "");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const handleSubmitForm = useCallback(
    async (values) => {
      try {
        const formData = new FormData();
        formData.append("userName", values.userName);
        formData.append("userID", values.userID);
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("oldUserID", values.oldUserID);
        if (selectedFile) formData.append("profilePic", selectedFile);

        const response = await put("/updateData", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response?.status === "SUCCESS") {
          toast.success("Profile updated successfully");
          setProfileData(response?.data);
          onClose();
        } else {
          toast.error(response?.message || "Failed to update profile");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong while updating profile");
      }
    },
    [put, setProfileData, onClose, selectedFile]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      oldUserID: userData?.userID || "",
      userName: userData?.userName || "",
      userID: userData?.userID || "",
      phoneNumber: userData?.phoneNumber || "",
    },
    validationSchema: ProfileUpdateValidation,
    onSubmit: handleSubmitForm,
  });

  const { values, errors, handleChange, handleBlur, handleSubmit, touched } = formik;

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 w-11/12 sm:w-96 transition-transform transform scale-100"
      >
        <div className="relative w-24 h-24 mx-auto group">
          {previewURL ? (
            <img
              src={previewURL}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
            />
          ) : (
            <div className="w-24 h-24 mx-auto flex items-center justify-center rounded-full bg-blue-200 border-4 border-blue-500 text-blue-700 text-2xl font-bold">
              {getInitials(userData.userName)}
            </div>
          )}

          <label
            htmlFor="profilePic"
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
          >
            Edit Pic
          </label>

          <input
            id="profilePic"
            type="file"
            accept="image/*"
            name="profilePic"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-4 text-center">
          Modify User Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Username
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={values.userName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            {touched.userName && errors.userName && (
              <p className="text-sm text-red-600 mt-1">{errors.userName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              User ID
            </label>
            <input
              type="email"
              id="userID"
              name="userID"
              value={values.userID}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            {touched.userID && errors.userID && (
              <p className="text-sm text-red-600 mt-1">{errors.userID}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-2 text-sm text-red-600">
              {errMsg || "An error occurred while updating profile"}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-60"
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default Modal;
