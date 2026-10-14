export default function Card({ children, className = "", padding = "p-6" }) {
  return (
    <div className={`bg-white rounded-xl shadow-card ${padding} ${className}`}>
      {children}
    </div>
  );
}
