const workloads = [
  { id: "light", label: "🌤️ Light", value: 1 },
  { id: "medium", label: "⛅ Moderate", value: 2 },
  { id: "heavy", label: "🌧️ Heavy", value: 3 },
  { id: "overload", label: "⛈️ Overloaded", value: 4 },
];

export default function WorkloadSelector({ selected, onChange }) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-[#27A5A1] mb-2">
        How's your workload?
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {workloads.map((w) => (
          <button
            key={w.id}
            onClick={() => onChange(w.value)}
            className={`px-4 py-3 rounded-xl border transition text-sm whitespace-nowrap
                ${
                  selected === w.value
                    ? "bg-[#F7A68C] text-white border-orange-300 shadow"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
          >
            {w.label}
          </button>
        ))}
      </div>
    </div>
  );
}