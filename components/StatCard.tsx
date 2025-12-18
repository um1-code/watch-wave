export default function StatCard({ title, value, color }: { title: string, value: string | number, color: string }) {
  return (
    <div className="bg-[#181818] p-6 rounded border-l-4 border-[#E50914] shadow-lg">
      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{title}</p>
      <p className="text-4xl font-black mt-1">{value}</p>
    </div>
  );
}