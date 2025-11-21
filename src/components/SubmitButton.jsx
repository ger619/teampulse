export default function SubmitButton({ disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full mt-6 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2
        ${
          disabled
            ? "bg-[#A0D6C2] bg-opacity-40 text-gray-400 cursor-not-allowed"
            : "bg-[#A0D6C2] text-white hover:bg-[#8acdb5]"
        }`}
    >
      🌟 Submit Check-In
    </button>
  );
}
