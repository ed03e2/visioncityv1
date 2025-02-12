import React from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface CalendarProps {
  selectedDate: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
  disabledDates?: string[];
}

export function Calendar({ selectedDate, onChange, disabledDates = [] }: CalendarProps) {
  const handleDateChange = (date: Date) => {
    // ✅ Convert to local date before setting state
    const adjustedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Forces local timezone
    const formattedDate = adjustedDate.toISOString().split("T")[0];

    console.log("Calendar Selected Date (Corrected):", formattedDate);
    onChange(formattedDate);
  };

  const isTileDisabled = ({ date }: { date: Date }) => {
    // ✅ Disable dates that are not in the availableDates array
    const formattedDate = date.toISOString().split("T")[0];
    return !disabledDates.includes(formattedDate);
  };

  return (
    <ReactCalendar
      value={new Date(selectedDate + "T00:00:00")} // ✅ Ensures correct timezone
      onChange={(date) => handleDateChange(date as Date)}
      tileDisabled={isTileDisabled} // Disable unavailable dates
      className="w-full"
    />
  );
}
