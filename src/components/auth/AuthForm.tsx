"use client";

import { useState } from "react";
import Link from "next/link";
import FormInput from "./FormInput";
import SocialButton from "./SocialButton";

interface AuthFormProps {
  mode: "signin" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth logic will be implemented separately
    console.log("Form submitted:", formData);
  };

  const handleSocialAuth = (provider: "google" | "apple") => {
    // Social auth logic will be implemented separately
    console.log(`${provider} authentication`);
  };

  const isSignUp = mode === "signup";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {isSignUp ? "Join Nike Today!" : "Welcome Back"}
        </h1>
        <p className="mt-2 text-gray-600">
          {isSignUp
            ? "Create your account to start your fitness journey"
            : "Sign in to your Nike account"}
        </p>
      </div>

      {/* Social Sign-in Buttons */}
      <div className="space-y-3">
        <SocialButton
          provider="google"
          onClick={() => handleSocialAuth("google")}
        />
        <SocialButton
          provider="apple"
          onClick={() => handleSocialAuth("apple")}
        />
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or sign {isSignUp ? "up" : "in"} with
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <FormInput
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        )}

        <FormInput
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <FormInput
          label="Password"
          type="password"
          placeholder={
            isSignUp ? "minimum 8 characters" : "Enter your password"
          }
          value={formData.password}
          onChange={handleInputChange}
          required
        />

        {!isSignUp && (
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-black hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      {/* Terms and Privacy */}
      {isSignUp && (
        <p className="text-xs text-gray-500 text-center">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-black hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-black hover:underline">
            Privacy Policy
          </Link>
        </p>
      )}

      {/* Switch Mode */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            href={isSignUp ? "/sign-in" : "/sign-up"}
            className="font-medium text-black hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
}
