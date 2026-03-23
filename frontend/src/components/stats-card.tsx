import Card from './card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
}

export default function StatsCard({ title, value, change }: StatsCardProps) {
  return (
    <Card>
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {change && <div className="text-sm text-green-400 mt-1">{change}</div>}
    </Card>
  );
}