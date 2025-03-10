import { BarChart } from "@/app/components/charts/BarChart";
import { LineChart } from "@/app/components/charts/LineChart";
import { PieChart } from "@/app/components/charts/PieChart";

export default function AnalyticsModal({ zoneId, heatmapData }) {
  // ✅ Filter Heatmap Data Based on Selected Zone
  const filteredData = heatmapData.filter((point) => point.zone_id === zoneId);
  const modalClick = (event) => {
    event.stopPropagation(); // ✅ Prevent closing when clicking inside modal
  };
  // ✅ Count Unique `id_person` for Line Chart (Activity Over Time)
  const processTimeSeriesData = () => {
    if (!filteredData || filteredData.length === 0) return [];

    const timeCounts = filteredData.reduce((acc, point) => {
      const hour = new Date(point.timestamp).getHours();
      if (!acc[hour]) acc[hour] = new Set();
      acc[hour].add(point.id_person); // ✅ Ensure only unique `id_person` is counted
      return acc;
    }, {});

    return Object.keys(timeCounts).map((hour) => ({
      name: `${hour}:00`,
      value: timeCounts[hour].size, // ✅ Count unique `id_person`
    }));
  };

  // ✅ Count Unique `id_person` for Pie Chart (Morning, Afternoon, Evening Distribution)
  const processTimeOfDayDistribution = () => {
    if (!filteredData || filteredData.length === 0) return [];

    let morning = new Set();
    let afternoon = new Set();
    let evening = new Set();

    filteredData.forEach((point) => {
      const hour = new Date(point.timestamp).getHours();
      if (hour >= 6 && hour < 12) morning.add(point.id_person);
      else if (hour >= 12 && hour < 18) afternoon.add(point.id_person);
      else evening.add(point.id_person);
    });

    return [
      { name: "Morn", value: morning.size },
      { name: "After", value: afternoon.size },
      { name: "Even", value: evening.size },
    ];
  };


  return (
    <div
      onClick={modalClick} // ✅ Ensures modal does not close when clicking inside
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 backdrop-blur-lg bg-gray-900/80 p-6 shadow-xl rounded-xl w-[90%] md:w-[70%] lg:w-[60%] font-sans border border-gray-700 transition-opacity duration-300 ease-in-out"
    >
      {/* Header */}
      <h2 className="text-2xl font-bold text-white text-center mb-6 shadow-md">Zone {zoneId} - Analytics</h2>

      {/* Charts Grid (Data from Heatmap) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Line Chart - Activity Over Time */}
        <div className="flex justify-center p-4 bg-white/90 rounded-lg shadow-md aspect-[4/3]">
          <LineChart data={processTimeSeriesData()} title="Daily Capacity" />
        </div>

        {/* Pie Chart - Time of Day Distribution */}
        <div className="flex justify-center p-4 bg-white/90 rounded-lg shadow-md aspect-[4/3]">
          <PieChart data={processTimeOfDayDistribution()} title="Capacity Distribution (Pie)" />
        </div>

        {/* Bar Chart - Time of Day Activity */}
        <div className="flex justify-center p-4 bg-white/90 rounded-lg shadow-md aspect-[4/3]">
          <BarChart data={processTimeOfDayDistribution()} title="Capacity Distribution (Histogram)" />
        </div>
      </div>
    </div>
  );
}
