import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Text } from 'recharts';

// ✅ High-Contrast Grayscale Colors (Light to Dark)
const COLORS = ['#f0f0f0', '#d6d6d6', '#a6a6a6', '#707070', '#404040', '#1a1a1a'];

export function PieChart({ data, title }) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="40%"
            innerRadius="45%"
            outerRadius="80%"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                stroke="#000000" // ✅ Black stroke for separation
                strokeWidth={1} 
              />
            ))}
          </Pie>
          <Tooltip 
            wrapperStyle={{ backgroundColor: "#fff", color: "#000" }} 
          /> {/* ✅ Light tooltip for better contrast */}
          <Legend 
            verticalAlign="bottom" 
            height={20} 
            wrapperStyle={{ color: "#000", fontWeight: "bold" }} // ✅ Black text in legend
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
