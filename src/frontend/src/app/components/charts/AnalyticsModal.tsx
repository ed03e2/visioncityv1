import { BarChart } from "@/app/components/charts/BarChart";
import { LineChart } from "@/app/components/charts/LineChart";
import { PieChart } from "@/app/components/charts/PieChart";

export default function AnalyticsModal({ zoneId }) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 backdrop-blur-lg bg-white/30 p-6 shadow-lg rounded-xl w-[90%] md:w-[70%] lg:w-[60%]">
      <h2 className="text-xl font-bold text-white text-center mb-6">Zone {zoneId} - Analytics</h2>
      
      {/* Charts Grid (Prevents Overlapping) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="flex justify-center p-4 bg-white/50 rounded-lg shadow-md aspect-[4/3]">
          <BarChart />
        </div>

        <div className="flex justify-center p-4 bg-white/50 rounded-lg shadow-md aspect-[4/3]">
          <LineChart />
        </div>

        <div className="flex justify-center p-4 bg-white/50 rounded-lg shadow-md aspect-[4/3]">
          <PieChart />
        </div>
      </div>
    </div>
  );
}
