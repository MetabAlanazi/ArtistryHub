type Props = { title: string; value: string | number; icon?: React.ReactNode; hint?: string };

export default function StatCard({ title, value, icon, hint }: Props) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">{title}</div>
        {icon}
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </div>
  );
}
