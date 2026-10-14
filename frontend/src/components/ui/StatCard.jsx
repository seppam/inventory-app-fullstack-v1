export default function StatCard({ label, value, icon: Icon, color = "brand" }) {
  const colorMap = {
    brand:   "bg-brand-50 text-brand-600",
    slate:   "bg-slate-100 text-slate-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber:   "bg-amber-50 text-amber-600",
    red:     "bg-red-50 text-red-600",
    blue:    "bg-blue-50 text-blue-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{value ?? "—"}</p>
      </div>
      {Icon && (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[color] || colorMap.brand}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
