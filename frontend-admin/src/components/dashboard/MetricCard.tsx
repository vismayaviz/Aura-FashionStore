export const MetricCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="rounded-3xl border border-slate-200 bg-white px-5 py-6 shadow-sm shadow-slate-200/40">
    <p className="text-sm font-medium text-slate-500">{title}</p>
    <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
  </div>
);
