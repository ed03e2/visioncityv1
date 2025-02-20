import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function BarChart({ data, title }) {
  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-semibold text-center text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height="80%">
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#1c1b1a" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
