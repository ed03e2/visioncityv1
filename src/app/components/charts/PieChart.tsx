import { PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'A', value: 400 },
  { name: 'B', value: 300 },
  { name: 'C', value: 300 },
];

const COLORS = ['#1c1b1a', '#282727', '#434141'];

export function PieChart() {
  return (
    <RechartsPieChart width={300} height={200}>
      <Pie
        data={data}
        cx={150}
        cy={100}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </RechartsPieChart>
  );
} 