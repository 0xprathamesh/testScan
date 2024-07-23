import type { Metadata } from 'next';
import { type ReactNode } from 'react';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import { ThirdwebProvider } from "thirdweb/react";
export const metadata: Metadata = {
  title: 'ConnectKit Next.js Example',
  description: 'By Family',
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider>{props.children}</ThirdwebProvider>
      </body>
    </html>
  );
}
