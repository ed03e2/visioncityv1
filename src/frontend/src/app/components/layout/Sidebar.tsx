import { useState, useEffect } from "react";
import { Calendar } from "@/app/components/filters/Calendar";
import RangeSlider from "@/app/components/filters/RangeSlider";
import { IoFilter } from "react-icons/io5";

export default function Sidebar({ selectedDate, setSelectedDate, availableDates, timeRange, setTimeRange }) {
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
          <h2 className="text-2xl font-bold text-white/95 shadow-md mb-6">Filters</h2>

          {/* Improved Calendar UI */}
          <div className="bg-white/20 p-4 rounded-lg shadow-md">
            <Calendar selectedDate={selectedDate} onChange={setSelectedDate} disabledDates={availableDates} />
          </div>

          {/* Improved Range Slider UI (Now More Visible) */}
          <div className="mt-6 bg-white/20 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-white/95 mb-2">Select Time Range</h3>
            <RangeSlider value={timeRange} onChange={setTimeRange} />
          </div>
        </div>
      </div>
    </>
  );
}
