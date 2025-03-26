// components/Navbar.tsx
'use client';

import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-lg font-semibold">My App</div>

        <button className="lg:hidden" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } lg:flex space-x-4 items-center`}
        >
          <Link href="/add-lead">
            <span className="text-white hover:bg-gray-700 px-4 py-2 rounded-md">Add Lead</span>
          </Link>
          <Link href="/leads">
            <span className="text-white hover:bg-gray-700 px-4 py-2 rounded-md">Leads</span>
          </Link>
          <Link href="/filter-leads">
            <span className="text-white hover:bg-gray-700 px-4 py-2 rounded-md">Status</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
