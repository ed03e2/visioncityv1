import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface CalendarProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export function Calendar({ selectedDate, onChange }: CalendarProps) {
  return (
    <ReactCalendar
      value={selectedDate}
      onChange={(date) => onChange(date as Date)}
      className="w-full"
    />
  );
} 