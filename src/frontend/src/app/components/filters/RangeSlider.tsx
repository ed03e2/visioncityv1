import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface RangeSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export default function RangeSlider({ value, onChange }: RangeSliderProps) {
  return (
    <div className="p-4">
      <Slider
        range
        min={0}
        max={23}
        step={1}
        value={value}
        onChange={(newValue) => onChange(newValue as [number, number])}
      />
      <div className="flex justify-between text-sm mt-2">
        <span>Desde: {String(value[0]).padStart(2, '0')}:00</span>
        <span>Hasta: {String(value[1]).padStart(2, '0')}:00</span>
      </div>
    </div>
  );
}
