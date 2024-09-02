"use client"
import type { Metadata } from "next";
import { type ReactNode } from "react";
import "./globals.css";
import SetRPCModal from "@/components/SetRPCModal";
import { useEffect, useState } from "react";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { ThirdwebProvider } from "thirdweb/react";
import { ThemeProvider } from "@/components/theme-provider";
 const metadata: Metadata = {
  title: "ConnectKit Next.js Example",
  description: "By Family",
 };


export default function RootLayout(props: { children: ReactNode }) {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  useEffect(() => {
    const storedRpcUrl = localStorage.getItem('rpcUrl');
    if (!storedRpcUrl) {
      setIsFirstVisit(true);
    }
  }, []);

  const handleModalClose = () => {
    setIsFirstVisit(false);
  };
  return (
    <html lang="en">
      <body>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        > */}
        {" "}
        
        <ThirdwebProvider>
        {isFirstVisit && <SetRPCModal onClose={handleModalClose} />}
          {props.children}</ThirdwebProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
