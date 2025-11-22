"use client";
import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: any;
  }
}

export default function OtpLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // Initialize invisible reCAPTCHA once
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth
,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA verified!");
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired, resetting...");
          },
        },
      );
    }
  }, []);

const syncUserWithDb = async (user: any) => {
  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        phone: user.phoneNumber,
        photoURL: user.photoURL,
        authProvider: user.email ? "GOOGLE" : "PHONE" 
      }),
    });


if (!res.ok) {
  const text = await res.text();            
  console.error("Sync failed: server response:", text);
  try {
    const json = JSON.parse(text);
    throw new Error(json?.message || JSON.stringify(json));
  } catch (e) {
    throw new Error("Sync failed (non-JSON response). See console for HTML error page.");
  }
}

    console.log("User synced to Neon!");
  } catch (error) {
    console.error("Sync failed:", error);
    alert("Database sync failed. Please contact support.");
  }
};

  // Send OTP
  const sendOtp = async () => {
    if (!phone.startsWith("+")) {
      alert("Please include country code (e.g. +91XXXXXXXXXX)");
      return;
    }

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );
      window.confirmationResult = confirmationResult;
      console.log(" OTP sent successfully");
      alert("OTP sent! Please check your phone.");
    } catch (error: any) {
      console.error(" Error sending OTP:", error);
      alert(error.message);
    }
  };

  //  Verify OTP
  const verifyOtp = async () => {
    try {
      const result = await window.confirmationResult.confirm(otp);
      console.log("User verified:", result.user);
      alert("Phone verified successfully!");
    } catch (error) {
      console.error(" Invalid OTP:", error);
      alert("Invalid OTP. Please try again.");
    }
  };

  //  Google Login
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google login success:", result.user);
      await syncUserWithDb(result.user)
      alert(`Welcome ${result.user.displayName}!`);
    } catch (error: any) {
      console.error(" Google login error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-semibold">Login with Phone or Google</h2>

      <input
        type="text"
        placeholder="+91XXXXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 rounded text-black"
      />

      <button
        onClick={sendOtp}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send OTP
      </button>

      <div id="recaptcha-container"></div>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 rounded text-black"
      />

      <button
        onClick={verifyOtp}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Verify OTP
      </button>

      <div className="flex items-center w-full justify-center my-4">
        <hr className="w-1/4 border-gray-400" />
        <span className="mx-2 text-gray-500">or</span>
        <hr className="w-1/4 border-gray-400" />
      </div>

      <button
        onClick={loginWithGoogle}
        className="bg-red-600 text-white px-4 py-2 rounded flex items-center space-x-2"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        <span>Login with Google</span>
      </button>
    </div>
  );
}
