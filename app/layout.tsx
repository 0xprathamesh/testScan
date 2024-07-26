import type { Metadata } from "next";
import { type ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { ThirdwebProvider } from "thirdweb/react";
import { ThemeProvider } from "@/components/theme-provider";
export const metadata: Metadata = {
  title: "ConnectKit Next.js Example",
  description: "By Family",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {" "}
          <ThirdwebProvider>{props.children}</ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
