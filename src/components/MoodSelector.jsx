const moods = [
  { id: "fire", label: "🔥 On Fire", value: 5 },
  { id: "happy", label: "😄 Happy", value: 4 },
  { id: "meh", label: "😐 Meh", value: 3 },
  { id: "sad", label: "😢 Low", value: 2 },
  { id: "angry", label: "😠 Frustrated", value: 1 },
];

export default function MoodSelector({ selected, onChange }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[#27A5A1] mb-2">
        How are you feeling today?
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {moods.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange(m.value)}
            className={`px-4 py-3 rounded-xl border transition text-sm whitespace-nowrap
                ${
                  selected === m.value
                    ? "bg-[#A0D6C2] text-white border-green-300 shadow"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}