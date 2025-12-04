export default function SubmitButton({ disabled, loading, onClick }) {
  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      className={`w-full mt-6 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2
        ${
          disabled || loading
            ? "bg-[#A0D6C2] bg-opacity-40 text-gray-400 cursor-not-allowed"
            : "bg-[#A0D6C2] text-white hover:bg-[#8acdb5]"
        }`}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Submitting...
        </>
      ) : (
        "🌟 Submit Check-In"
      )}
    </button>
  );
}