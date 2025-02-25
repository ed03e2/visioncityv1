'use client'
interface InputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export default function Input({ label, value, onChange }: InputProps) {
    return (
      <div>
        <label className="block text-sm font-medium text-white">{label}</label>
        <input
          className="w-full p-2 bg-gray-900/75 text-white mt-1"
          type="text"
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }
  