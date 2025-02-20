import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function LineChart({ data, title }) {
  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-semibold text-center text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height="80%">
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#434141" />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
