import { ConnectKitButton } from "connectkit";
import React from "react";

const Navbar = () => {
  return (
    <div
      className="w-full px-32 py-8 flex items-center justify-between
      "
    >
      <p className="text-2xl font-medium text-green-500">
        XDC <span className="text-gray-700">Explorer</span>
      </p>
      <ConnectKitButton />
    </div>
  );
};

export default Navbar;
