import { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/userApi";
import useAuth from "../context/AuthContext/auth";
import { SignInValidation } from "../schemas/ValidationSchema";

export default function SignIn() {
  const { authorized, loading } = useAuth();
  const { isLoading, isError, errMsg, post } = useApi();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (values) => {
      const response = await post("/signin", values);
      if (response?.status === "SUCCESS") navigate("/home");
    },
    [navigate, post]
  );

  const formik = useFormik({
    initialValues: { userID: "", password: "" },
    validationSchema: SignInValidation,
    onSubmit: handleLogin,
  });

  useEffect(() => {
    if (authorized && !loading) navigate("/home");
  }, [authorized, loading, navigate]);

  const { values, errors, handleChange, handleBlur, handleSubmit, touched } = formik;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <img
                src="./images/logo.png"
                alt="Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-900">Chaintech Network</h1>
            </div>

            <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
            <p className="text-gray-600 mt-2">Welcome back! Please sign in to your account</p>
          </div>

          {isError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{errMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="userID" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="userID"
                name="userID"
                type="email"
                value={values.userID}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="jonas_kahnwald@gmail.com"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  touched.userID && errors.userID
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.userID && errors.userID && (
                <p className="mt-2 text-sm text-red-600">{errors.userID}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="*********"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    touched.password && errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            <p className="text-center text-gray-600">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign up for free
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
