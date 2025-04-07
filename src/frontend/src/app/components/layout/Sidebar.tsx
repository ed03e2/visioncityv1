// import { useState, useEffect } from "react";
// import { Calendar } from "@/app/components/filters/Calendar";
// import RangeSlider from "@/app/components/filters/RangeSlider";
// import { IoFilter } from "react-icons/io5";

// export default function Sidebar({ selectedDate, setSelectedDate, availableDates, timeRange, setTimeRange }) {
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (open && !(event.target as HTMLElement).closest("#sidebar")) {
//         setOpen(false);
//       } 
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [open]);

//   return (
//     <>
//       {/* Toggle Button (Moved Down) */}
//       <button 
//         className="fixed top-16 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-500 transition"
//         onClick={() => setOpen(!open)}
//       >
//         <IoFilter size={24} />
//       </button>

//       {/* Sidebar (Improved Contrast & Fixing Transparency Issues) */}
//       <div 
//         id="sidebar"
//         className={`fixed top-0 left-0 h-full w-80 backdrop-blur-md bg-gray-900/75 shadow-xl z-50 transform transition-transform duration-300 ${
//           open ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="p-6 text-white font-sans">
//           <h2 className="text-2xl font-bold text-white/95 shadow-md mb-6">Filters</h2>

//           {/* Improved Calendar UI */}
//           <div className="bg-white/20 p-4 rounded-lg shadow-md">
//             <Calendar selectedDate={selectedDate} onChange={setSelectedDate} disabledDates={availableDates} />
//           </div>

//           {/* Improved Range Slider UI (Now More Visible) */}
//           <div className="mt-6 bg-white/20 p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold text-white/95 mb-2">Select Time Range</h3>
//             <RangeSlider value={timeRange} onChange={setTimeRange} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }








// ------------------------------------------------------------------------------------------------------------------------------------------------------------------


// import { useState, useEffect } from "react";
// import { Calendar } from "@/app/components/filters/Calendar";
// import RangeSlider from "@/app/components/filters/RangeSlider";
// import { IoFilter } from "react-icons/io5";

// interface SidebarProps {
//   selectedDate: string;
//   setSelectedDate: (date: string) => void;
//   availableDates: string[];
//   timeRange: [number, number];
//   setTimeRange: (range: [number, number]) => void;
//   layerVisibility: {
//     heatmap: boolean;
//     zones: boolean;
//     arcs: boolean;
//   };
//   setLayerVisibility: (visibility: {
//     heatmap: boolean;
//     zones: boolean;
//     arcs: boolean;
//   }) => void;
// }

// export default function Sidebar({
//   selectedDate,
//   setSelectedDate,
//   availableDates,
//   timeRange,
//   setTimeRange,
//   layerVisibility,
//   setLayerVisibility,
// }: SidebarProps) {
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (open && !(event.target as HTMLElement).closest("#sidebar")) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [open]);

//   // Manejador para cambiar la visibilidad de cada capa
//   const handleToggleLayer = (layer: keyof typeof layerVisibility) => {
//     setLayerVisibility({
//       ...layerVisibility,
//       [layer]: !layerVisibility[layer],
//     });
//   };

//   return (
//     <>
//       {/* Botón para mostrar/ocultar el Sidebar */}
//       <button 
//         className="fixed top-16 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-500 transition"
//         onClick={() => setOpen(!open)}
//       >
//         <IoFilter size={24} />
//       </button>

//       {/* Sidebar */}
//       <div 
//         id="sidebar"
//         className={`fixed top-0 left-0 h-full w-80 backdrop-blur-md bg-gray-900/75 shadow-xl z-50 transform transition-transform duration-300 ${
//           open ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="p-6 text-white font-sans">
//           <h2 className="text-2xl font-bold text-white/95 shadow-md mb-6">Filters</h2>

//           {/* Calendar */}
//           <div className="bg-white/20 p-4 rounded-lg shadow-md">
//             <Calendar selectedDate={selectedDate} onChange={setSelectedDate} disabledDates={availableDates} />
//           </div>

//           {/* Range Slider */}
//           <div className="mt-6 bg-white/20 p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold text-white/95 mb-2">Select Time Range</h3>
//             <RangeSlider value={timeRange} onChange={setTimeRange} />
//           </div>

//           {/* Controles de Visibilidad de Capas */}
//           <div className="mt-6 bg-white/20 p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold text-white/95 mb-2">Visualización de Capas</h3>
//             <div className="flex flex-col gap-2">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={layerVisibility.heatmap}
//                   onChange={() => handleToggleLayer("heatmap")}
//                   className="mr-2"
//                 />
//                 Mostrar Heatmap
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={layerVisibility.zones}
//                   onChange={() => handleToggleLayer("zones")}
//                   className="mr-2"
//                 />
//                 Mostrar Zonas
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={layerVisibility.arcs}
//                   onChange={() => handleToggleLayer("arcs")}
//                   className="mr-2"
//                 />
//                 Mostrar Arcos
//               </label>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }





















// Sidebar.tsx
import { useState, useEffect } from "react";
import { Calendar } from "@/app/components/filters/Calendar";
import RangeSlider from "@/app/components/filters/RangeSlider";
import { IoFilter } from "react-icons/io5";

interface SidebarProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  availableDates: string[];
  timeRange: [number, number];
  setTimeRange: (range: [number, number]) => void;
  layerVisibility: {
    heatmap: boolean;
    zones: boolean;
    arcs: boolean;
    camsFov: boolean; // NUEVO: Control de la capa FOV
  };
  setLayerVisibility: (visibility: {
    heatmap: boolean;
    zones: boolean;
    arcs: boolean;
    camsFov: boolean; // NUEVO: Control de la capa FOV
  }) => void;
}

export default function Sidebar({
  selectedDate,
  setSelectedDate,
  availableDates,
  timeRange,
  setTimeRange,
  layerVisibility,
  setLayerVisibility,
}: SidebarProps) {
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

  // Manejador para cambiar la visibilidad de cada capa
  const handleToggleLayer = (layer: keyof typeof layerVisibility) => {
    setLayerVisibility({
      ...layerVisibility,
      [layer]: !layerVisibility[layer],
    });
  };

  return (
    <>
      {/* Botón para mostrar/ocultar el Sidebar */}
      <button 
        className="fixed top-16 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-500 transition"
        onClick={() => setOpen(!open)}
      >
        <IoFilter size={24} />
      </button>

      {/* Sidebar */}
      <div 
        id="sidebar"
        className={`fixed top-0 left-0 h-full w-80 backdrop-blur-md bg-gray-900/75 shadow-xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 text-white font-sans">
          <h2 className="text-2xl font-bold text-white/95 shadow-md mb-6">Filters</h2>

          {/* Calendar */}
          <div className="bg-white/20 p-4 rounded-lg shadow-md">
            <Calendar selectedDate={selectedDate} onChange={setSelectedDate} disabledDates={availableDates} />
          </div>

          {/* Range Slider */}
          <div className="mt-6 bg-white/20 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-white/95 mb-2">Select Time Range</h3>
            <RangeSlider value={timeRange} onChange={setTimeRange} />
          </div>

          {/* Controles de Visibilidad de Capas */}
          <div className="mt-6 bg-white/20 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-white/95 mb-2">Visualización de Capas</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={layerVisibility.heatmap}
                  onChange={() => handleToggleLayer("heatmap")}
                  className="mr-2"
                />
                Mostrar Heatmap
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={layerVisibility.zones}
                  onChange={() => handleToggleLayer("zones")}
                  className="mr-2"
                />
                Mostrar Zonas
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={layerVisibility.arcs}
                  onChange={() => handleToggleLayer("arcs")}
                  className="mr-2"
                />
                Mostrar Arcos
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={layerVisibility.camsFov}
                  onChange={() => handleToggleLayer("camsFov")}
                  className="mr-2"
                />
                Mostrar FOV de Cámaras
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}