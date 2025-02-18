'use client'
import Link from "next/link";
import HeatMap from "@/app/components/charts/HeatMap"
import { useState } from "react";
import { Combobox } from "@headlessui/react";

const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

export default function map () {
  //Constantes para el combobox
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");
  const filteredOptions = query === "" 
  ? options 
  : options.filter((option) =>
      option.toLowerCase().includes(query.toLowerCase())
    );
//constante para el mapa de calor
    const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Always format as YYYY-MM-DD
      };
      const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
      const [availableDates, setAvailableDates] = useState<string[]>([]);
      const [timeRange, setTimeRange] = useState<[number, number]>([12, 16]); // ✅ Default 12:00 - 16:00
    
    return(
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 space-y-6">
            <h1 className="text-lg font-semibold mb-4">Heat Map</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Map</h2>
          <HeatMap selectedDate={selectedDate} timeRange={timeRange} />
        </div>
        </div>
        <div className="flex items-center justify-center min-h-screen bg-white-100">
      <form  
        className="bg-white p-6 rounded-2xl shadow-md w-100 space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-700 text-center">Form</h2>
        <label>Label</label>
        <input
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label>Label</label>
        <input
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <h2 className="text-xl font-semibold text-gray-700 text-center">Camera</h2>
        <Combobox value={selected}>
        <Combobox.Input
            onChange={(event) => setQuery(event.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search..."
          />
          <Combobox.Options className="mt-2 bg-white border rounded-lg shadow-md">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <Combobox.Option
                  key={option}
                  value={option}
                  className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                >
                  {option}
                </Combobox.Option>
              ))
            ) : (
              <div className="p-2 text-gray-500">No results found</div>
            )}
          </Combobox.Options>

        </Combobox>
        <h2 className="text-xl font-semibold text-gray-700 text-center">Camera 1</h2>
        <select
          value={"option1"}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <h2 className="text-xl font-semibold text-gray-700 text-center">Camera 2</h2>
        <select
          value={"option1"}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <h2 className="text-xl font-semibold text-gray-700 text-center">Camera 3</h2>
        <select
          value={"option1"}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <h2 className="text-xl font-semibold text-gray-700 text-center">Camera 4</h2>
        <select
          value={"option1"}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>

        <h2 className="text-xl font-semibold text-gray-700 text-center">Camera 5</h2>
        <select
          value={"option1"}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>


        
        <div className="flex gap-2">
        <Link 
            href={`/setting`}
            className="w-full rounded-md bg-white-500 text-[#030303] font-medium p-2 rounded-lg transition-all duration-300 hover:bg-blue-600 hover:text-white">Ready</Link>
            <br/>
            <Link 
            href={`/analytic`}
            className="w-full  rounded-md bg-white-500 text-[#030303] font-medium p-2 rounded-lg transition-all duration-300 hover:bg-red-600 hover:text-white">Cancel
        </Link>

        </div>
      </form>
    </div>
        <br/>


        </div>

        
    )
}