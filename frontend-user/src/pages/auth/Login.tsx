import axios from "axios";
import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  useAuth,
} from "../../hooks/useAuth";

const Login = () => {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      setError("");

      if (
        !email ||
        !password
      ) {
        setError(
          "Email and password are required"
        );
        return;
      }

      try {
        setLoading(
          true
        );

        await login(
          email,
          password
        );

        toast.success(
          "Login Successful"
        );

        navigate(
          "/"
        );
      } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    setError(
      error.response?.data?.message ??
      "Login failed"
    );

    toast.error(
      error.response?.data?.message ??
      "Login failed"
    );
  } else {
    toast.error(
      "Something went wrong"
    );
  }
} finally {
        setLoading(
          false
        );
      }
    };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      <div className="hidden lg:flex bg-black text-white items-center justify-center">

        <div>
          <h1 className="text-7xl font-bold mb-4">
            AURA
          </h1>

          <p className="text-gray-300 max-w-sm">
            Discover vintage fashion and timeless pieces that define your style.
          </p>
        </div>

      </div>

      <div className="flex items-center justify-center bg-cream">

        <form
          onSubmit={
            handleSubmit
          }
          className="bg-white w-[420px] p-10 rounded-3xl shadow-xl"
        >

          <h2 className="text-4xl font-bold mb-2">
            Welcome Back
          </h2>

          <p className="text-gray-500 mb-6">
            Sign in to
            continue
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            className="input-field mb-4"
            onChange={(
              e
            ) =>
              setEmail(
                e.target
                  .value
              )
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="input-field mb-6"
            onChange={(
              e
            ) =>
              setPassword(
                e.target
                  .value
              )
            }
          />

          <button
            disabled={
              loading
            }
            className="btn-primary w-full"
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </button>

          <p className="text-center mt-5">

            Don't have an
            account?

            <Link
              to="/signup"
              className="ml-2 font-semibold"
            >
              Sign Up
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
};

export default Login;