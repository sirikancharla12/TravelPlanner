"use client";
import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
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

type Props = {
  onSuccess?: (user: any) => void;
  onClose?: () => void;
};

export default function OtpLogin({ onSuccess, onClose }: Props) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => console.log("reCAPTCHA verified!"),
        "expired-callback": () => console.log("reCAPTCHA expired"),
      });
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
          authProvider: user.email ? "GOOGLE" : "PHONE",
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Sync failed:", text);
        throw new Error(text);
      }
      console.log("User synced to DB");
    } catch (err) {
      console.error("syncUserWithDb error:", err);
      throw err;
    }
  };

  const cleanupRecaptcha = () => {
    try { (window.recaptchaVerifier as any)?.clear?.(); } catch (e) { /* ignore */ }
    const rc = document.getElementById("recaptcha-container");
    if (rc) rc.innerHTML = "";
    try { delete (window as any).recaptchaVerifier; } catch (e) {}
  };

  const sendOtp = async () => {
    if (!phone.startsWith("+")) {
      alert("Please include country code (e.g. +91XXXXXXXXXX)");
      return;
    }
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
      }
      const confirmationResult = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      alert("OTP sent! Check your phone.");
    } catch (err: any) {
      console.error("sendOtp error", err);
      alert(err?.message || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      await syncUserWithDb(user);

      cleanupRecaptcha();
            if (onSuccess) {
        onSuccess(user);
      } else if (onClose) {
        onClose();
      }

      router.push("/");
    } catch (err: any) {
      console.error("verifyOtp error", err);
      alert(err?.message || "Invalid OTP");
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await syncUserWithDb(user);

      cleanupRecaptcha();

      if (onSuccess) {
        onSuccess(user);
      } else if (onClose) {
        onClose();
      }

      router.push("/");
    } catch (err: any) {
      console.error("loginWithGoogle error", err);
      alert(err?.message || "Google login failed");
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-pop-in {
          animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    
      <div 
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-pop-in flex flex-col space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {onClose && (
            <button 
              onClick={onClose} 
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}

          <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
          <p className="text-center text-gray-500 text-sm">Sign in to continue to TravelMate</p>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91XXXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg text-black w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            <button 
              onClick={sendOtp} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg w-full transition-colors"
            >
              Send OTP
            </button>

            <div id="recaptcha-container" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">One-Time Password</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg text-black w-full focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              />
            </div>

            <button 
              onClick={verifyOtp} 
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg w-full transition-colors"
            >
              Verify & Login
            </button>
          </div>

          <div className="flex items-center w-full justify-center my-2">
            <hr className="w-full border-gray-300" />
            <span className="px-3 text-gray-400 text-sm bg-white">OR</span>
            <hr className="w-full border-gray-300" />
          </div>

          <button 
            onClick={loginWithGoogle} 
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg w-full flex items-center justify-center space-x-3 transition-colors"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </>
  );
}