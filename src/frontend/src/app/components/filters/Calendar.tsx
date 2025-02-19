import React from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface CalendarProps {
  selectedDate: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
  disabledDates?: string[];
}

export function Calendar({ selectedDate, onChange, disabledDates = [] }: CalendarProps) {
  const handleDateChange = (date: Date) => {
    const adjustedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const formattedDate = adjustedDate.toISOString().split("T")[0];

    console.log("Calendar Selected Date (Corrected):", formattedDate);
    onChange(formattedDate);
  };

  const isTileDisabled = ({ date }: { date: Date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    return !disabledDates.includes(formattedDate);
  };

  return (
    <div className="p-4 rounded-xl shadow-lg bg-white/90">
      {/* Custom Header (Month and Year Only) */}
      <div className="bg-gray-800/90 text-white text-center py-2 rounded-t-lg shadow-md">
        <h3 className="text-lg font-semibold">
          {new Date(selectedDate).toLocaleString("default", { month: "long", year: "numeric" })}
        </h3>
      </div>

      {/* Calendar */}
      <ReactCalendar
        value={new Date(selectedDate + "T00:00:00")}
        onChange={(date) => handleDateChange(date as Date)}
        tileDisabled={isTileDisabled}
        className="w-full rounded-b-lg border shadow-md bg-white p-2"
      />
    </div>
  );
}
