import { useState, useEffect } from "react";
import { IoFilter } from "react-icons/io5";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && !(event.target as HTMLElement).closest("#sidebar")) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      {/* Toggle Button (Moved Down) */}
      <button 
        className="fixed top-16 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-500 transition"
        onClick={() => setOpen(!open)}
      >
        <IoFilter size={24} />
      </button>

      {/* Sidebar (Improved Contrast & Fixing Transparency Issues) */}
      <div 
        id="sidebar"
        className={`fixed top-0 left-0 h-full w-80 backdrop-blur-md bg-gray-900/75 shadow-xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 text-white font-sans">
          <h2 className="text-2xl font-bold text-white/95 shadow-md mb-6">Camera</h2>
          </div>
        </div>
    </>
  );
}

