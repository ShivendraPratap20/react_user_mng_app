import { useEffect, useCallback } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { SignUpValidationSchema } from "../schemas/ValidationSchema";
import useAuth from "../context/AuthContext/auth";
import useApi from "../hooks/userApi";

export default function SignUp() {
  const { authorized, loading } = useAuth();
  const { isLoading, isError, errMsg, post } = useApi();
  const navigate = useNavigate();

  const handleSignUp = useCallback(
    async (values) => {
      const response = await post("/register", values);
      if (response?.status === "SUCCESS") navigate("/home");
    },
    [navigate, post]
  );

  const formik = useFormik({
    initialValues: {
      userName: "",
      userID: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: SignUpValidationSchema,
    onSubmit: handleSignUp,
  });

  const { values, errors, handleChange, handleBlur, handleSubmit, touched } = formik;

  useEffect(() => {
    if (authorized && !loading) navigate("/home");
  }, [authorized, loading, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-900">Chaintech Network</h1>
            </div>

            <h2 className="text-3xl font-bold text-gray-900">Sign up</h2>
            <p className="text-gray-600 mt-2">Create your Chaintech Network account</p>
          </div>

          {isError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{errMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {["userName", "userID", "phoneNumber", "password", "confirmPassword"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700 mb-2 capitalize"
                >
                  {field === "userID"
                    ? "Email"
                    : field === "confirmPassword"
                    ? "Confirm Password"
                    : field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field.includes("password") ? "password" : field === "userID" ? "email" : "text"}
                  value={values[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={
                    field === "userID"
                      ? "jonas_kahnwald@gmail.com"
                      : field === "phoneNumber"
                      ? "+91"
                      : ""
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    touched[field] && errors[field]
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {touched[field] && errors[field] && (
                  <p className="mt-2 text-sm text-red-600">{errors[field]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
