import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Sidebar>
      <div className="flex-1 flex flex-col overscroll-none">
        <Navbar />

        <main className="flex-1 overflow-hidden pt-16 bg-[#f5f6f8] h-screen">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
        <Footer />
      </div>
    </Sidebar>
  );
};

export default Layout;
