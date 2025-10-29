
"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation"; 
import { Moon, Sun } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

type LinkProps = React.PropsWithChildren<
  React.AnchorHTMLAttributes<HTMLAnchorElement>
> & { href: string };

const Link: React.FC<LinkProps> = ({ href, children, ...props }) => (
  <a
    href={href}
    className="px-4 py-2 text-[var(--color-small)] hover:text-[var(--color-primary)] transition"
    {...props}
  >
    {children}
  </a>
);

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname(); 

  const { data: session } = useSession();
  const isHomePage = pathname === '/';

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };
  
  const navClasses = isHomePage
    ? "fixed top-0 left-0 w-full z-50 transition-all duration-300" 
    : "fixed top-0 left-0 w-full bg-[var(--color-bg-default)] backdrop-blur-xl shadow-md z-50 transition-all duration-300"; // Default background for other pages

  return (
    <nav className={navClasses}> 
      <div className="container mx-auto flex items-center justify-between px-40 py-3">
        <div className="font-bold text-xl text-[var(--color-primary)]">
          TravelMate
        </div>

        <div className="hidden md:flex space-x-6">
          <Link href="/Plan">Plan a Trip</Link>
          <Link href="/destinations">Destinations</Link>
          <Link href="/about">About</Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--color-accent)] transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
           <div>
      {session ? (
        <>
          <p>Welcome, {session.user?.email}</p>
          <button onClick={() => signOut()}>Logout</button>
        </>
      ) : (
        <button onClick={() => signIn()}>Login</button>
      )}
    </div>
        </div>
      </div>
    </nav>
  );
}