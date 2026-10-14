export default function LoadingSpinner({ size = "md", text = "" }) {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-[3px]",
  };

  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div
        className={`${sizeMap[size] || sizeMap.md} border-brand-200 border-t-brand-600 rounded-full animate-spin`}
      />
      {text && <span className="text-sm text-slate-500">{text}</span>}
    </div>
  );
}
