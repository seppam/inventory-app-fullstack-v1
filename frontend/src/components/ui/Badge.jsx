const variantMap = {
  admin:   "bg-brand-100 text-brand-700",
  user:    "bg-slate-100 text-slate-600",
  active:  "bg-emerald-100 text-emerald-700",
  inactive:"bg-slate-100 text-slate-500",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger:  "bg-red-100 text-red-700",
  info:    "bg-blue-100 text-blue-700",
  default: "bg-slate-100 text-slate-600",
};

export default function Badge({ children, variant = "default", className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantMap[variant] || variantMap.default} ${className}`}
    >
      {children}
    </span>
  );
}
