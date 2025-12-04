export default function ThoughtsBox({ value, onChange }) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-[#27A5A1] mb-2">
        Any thoughts you'd like to share? ✍️
      </h2>

      <textarea
        rows="4"
        className="w-full bg-gray-100 rounded-xl p-3 outline-none"
        placeholder="Write anything you'd like..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      ></textarea>
    </div>
  );
}