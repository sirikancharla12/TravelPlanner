// import Navbar from "./components/Navbar";
// import "./globals.css";

// export const metadata = {
//   title: "AI Travel Planner",
//   description: "Plan trips smartly with AI",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className="bg-[var(--color-bg-default)] font-inter lg:px-40 ">
//         {/* Navbar always on top */}
//         <Navbar />

//         {/* Main container */}
//         <main className="max-w-7xl  ">
//           {children}
        
//         </main>
//       </body>
//     </html>
//   );
// }


import { SessionProvider } from "next-auth/react";
import Navbar from "./components/Navbar";
import "./globals.css";
// import SessionProviderWrapper from "./providers/sessionWrapper";

export const metadata = {
  title: "AI Travel Planner",
  description: "Plan trips smartly with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-inter">
        {/* <SessionProviderWrapper> */}
          <Navbar />
        <main className="pt-16 ">{children}</main>
        {/* </SessionProviderWrapper> */}
      </body>
    </html>
  );
}
