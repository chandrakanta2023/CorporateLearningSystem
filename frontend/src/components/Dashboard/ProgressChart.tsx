import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressData {
  month: string;
  completionRate: number;
}

interface ProgressChartProps {
  data: ProgressData[];
}

export default function ProgressChart({ data }: ProgressChartProps) {
  const chartData = data.map((item) => ({
    name: item.month,
    value: item.completionRate,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="name"
          stroke="#999"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#999"
          style={{ fontSize: '12px' }}
          domain={[0, 100]}
          label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #f0f0f0',
            borderRadius: '4px',
          }}
          formatter={(value) => `${value}%`}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#0f4c81"
          strokeWidth={3}
          dot={{ fill: '#0f4c81', r: 5 }}
          activeDot={{ r: 7 }}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
