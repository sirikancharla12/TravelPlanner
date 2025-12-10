"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import OtpLogin from "./Home/Otplogin";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

type LinkProps = React.PropsWithChildren<
  React.AnchorHTMLAttributes<HTMLAnchorElement>
> & { href: string };

const Link: React.FC<LinkProps> = ({ href, children, ...props }) => (
  <a
    href={href}
    className="px-3 py-2 text-[var(--color-small)] hover:text-[var(--color-primary)] transition"
    {...props}
  >
    {children}
  </a>
);

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<any>(null);

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const navClasses = isHomePage
    ? "fixed top-0 left-0 w-full z-50 bg-[var(--color-bg-default)] border-b border-gray-200"
    : "fixed top-0 left-0 w-full z-50 bg-[var(--color-bg-default)] backdrop-blur-xl shadow-sm";

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <>
      <nav className={navClasses}>
        {/* INNER CONTAINER – matches whole site width */}
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo / brand */}
          <div className="font-bold text-xl text-[var(--color-primary)]">
            TravelMate
          </div>

          {/* Center links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/Plan">Plan a Trip</Link>
            <Link href="/destinations">Destinations</Link>
            <Link href="/about">About</Link>
            <Link href="/Trips">Saved Trips</Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--color-accent)] transition"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {showLogin && (
        <OtpLogin
          onSuccess={() => setShowLogin(false)}
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
}
