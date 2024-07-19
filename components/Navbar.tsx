import { ConnectKitButton } from "connectkit";
import Link from "next/link";
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
      <div className="flex items-baseline justify-between gap-x-14">
      <Link className="text-lg font-medium text-gray-700" href="/chains">
        Chains
      </Link>
        {" "}
        <ConnectKitButton />
      </div>
    </div>
  );
};

export default Navbar;
