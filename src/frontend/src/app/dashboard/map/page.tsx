'use client'
import { useState } from 'react';
import HeatMap from '@/app/components/charts/HeatMap';
import Modal from '@/app/components/ui/modal'; // Asegúrate de tener este componente

export default function Map() {
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<[number, number]>([12, 16]);
  const [zonesData, setZonesData] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newMarker, setNewMarker] = useState<{ lat: number; lng: number; name: string }>({ lat: 0, lng: 0, name: ''});

  // 📌 Función para abrir el modal con las coordenadas del clic
  const handleMapClick = (lat: number, lng: number) => {
    setNewMarker({ lat, lng, name: '' });
    setModalOpen(true);
  };

  // 📌 Guardar el marcador en la lista
  const handleSaveMarker = () => {
    if (newMarker.name.trim()) {
      setMarkers([...markers, newMarker]);
      setModalOpen(false);
    } else {
      alert('El nombre no puede estar vacío');
    }
  };

  return (
    <div className="relative w-screen h-screen">

      {/* 📌 Botón para añadir un punto manualmente */}


      {/* 📌 Mapa */}
      <HeatMap
        selectedDate={selectedDate}
        timeRange={timeRange}
        availableDates={availableDates}
        zonesData={zonesData}
        setSelectedZone={setSelectedZone}
        onMapClick={handleMapClick} // Pasamos la función al mapa
        markers={markers} // Pasamos los marcadores al mapa
      />
            <button
        onClick={() => setModalOpen(true)}
        className="absolute top-4 left-4 bg-blue-500 text-white p-2 rounded"
      >
        +
      </button>

      {/* 📌 Modal para ingresar datos del punto */}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h2 className="text-lg font-bold mb-2">Add point</h2>
          <input
            type="text"
            placeholder="Point name"
            value={newMarker.name}
            onChange={(e) => setNewMarker({ ...newMarker, name: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
            <input
            type="text"
            placeholder="URL camera"
            value={newMarker.name}
            onChange={(e) => setNewMarker({ ...newMarker, name: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <button onClick={handleSaveMarker} className="bg-green-500 text-white p-2 rounded">
            Save
          </button>
        </Modal>
      )}
    </div>
  );
}
