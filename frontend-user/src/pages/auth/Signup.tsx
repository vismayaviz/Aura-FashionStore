import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import OTPModal from "../../components/auth/OTPModal";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  // 1. Split state or modify the schema to hold a File object instead of a string
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email address");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // 2. Wrap form values inside a multipart FormData body instead of standard JSON
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      
      if (profilePhoto) {
        data.append("profilePhoto", profilePhoto);
      }

      // 3. Post using multipart content-type headers config
      await api.post("/auth/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("OTP Sent Successfully");
      setShowOTPModal(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Registration failed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    try {
      await api.post("/auth/verify-otp", {
        email: formData.email,
        otp,
      });
      toast.success("Account Verified");
      navigate("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Invalid OTP");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const resendOTP = async () => {
    try {
      await api.post("/auth/resend-otp", {
        email: formData.email,
      });
      toast.success("OTP Resent");
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <>
      <div className="min-h-screen grid lg:grid-cols-2">
        <div className="hidden lg:flex bg-black text-white items-center justify-center">
          <div>
            <h1 className="text-6xl font-bold tracking-[0.2em] text-white uppercase mb-4">
              AURA
            </h1>
            <p className="text-sm font-medium tracking-wide text-neutral-800 uppercase mb-2">
              Create your account
            </p>
            <p className="text-neutral-500 text-sm leading-relaxed font-light max-w-sm">
              Make your mark in the world of fashion with AURA. Sign up to explore timeless pieces and elevate your style. Start your journey with us today and embrace the elegance of vintage fashion.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center bg-cream">
          <form onSubmit={handleSignup} className="bg-white w-[420px] p-10 rounded-3xl shadow-xl">
            <h2 className="text-4xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-500 mb-6">Start your journey</p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <input
              name="name"
              placeholder="Full Name"
              className="input-field mb-4"
              onChange={handleChange}
              value={formData.name}
            />

            <input
              name="email"
              placeholder="Email"
              className="input-field mb-4"
              onChange={handleChange}
              value={formData.email}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input-field mb-4"
              onChange={handleChange}
              value={formData.password}
            />

            {/* 4. Switched from a text input to an explicit file selection target picker */}
            <div className="mb-6 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 px-1">Profile Photo</label>
              <input
                type="file"
                name="profilePhoto"
                accept="image/*"
                className="input-field pt-2 text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setProfilePhoto(e.target.files[0]);
                  }
                }}
              />
            </div>

            <button disabled={loading} className="btn-primary w-full">
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>

            <p className="text-center mt-5">
              Already have an account?
              <Link to="/login" className="ml-2 font-semibold">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      <OTPModal
        key={showOTPModal ? "open" : "closed"}
        open={showOTPModal}
        email={formData.email}
        onVerify={verifyOTP}
        onResend={resendOTP}
      />
    </>
  );
};

export default Signup;