import {FaMapMarkerAlt,FaCalendar, FaRunning, FaChartLine, FaHospital, FaSlidersH, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="h-screen w-16 bg-black flex flex-col items-center py-4 space-y-6">
      <FaMapMarkerAlt className="text-white text-2xl cursor-pointer" />
      <FaCalendar className="text-white text-2xl cursor-pointer" />
      <FaRunning className="text-white text-2xl cursor-pointer" />
      <FaChartLine className="text-white text-2xl cursor-pointer" />
      <FaHospital className="text-white text-2xl cursor-pointer" />
      <FaSlidersH className="text-white text-2xl cursor-pointer" />
      <FaSignOutAlt className="text-white text-2xl cursor-pointer" />
    </div>
  );
}