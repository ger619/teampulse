export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FBF1E7] p-4">
      <div className="bg-white px-10 py-4 rounded-2xl border border-green-200 shadow-md inline-flex items-center gap-3 mt-6 mb-4">
        <PulseLogo />
        <div>
          <h1 className="text-3xl font-semibold text-[#27A5A1]">Team Pulse</h1>
          <p className="text-sm text-[#9EC4C3] -mt-1">
            wellness dashboard
          </p>
        </div>
      </div>

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-green-200 p-6">
        {children}
      </div>
    </div>
  );
}

// Reuse your heart Pulse SVG
function PulseLogo() {
  return (
    <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
      <path
        d="M50 85C50 85 20 65 20 40C20 25 30 15 45 15C55 15 60 20 50 30C40 20 45 15 55 15C70 15 80 25 80 40C80 65 50 85 50 85Z"
        fill="#27A5A1"
      />
      <path
        d="M30 50L40 45L50 55L60 45L70 50"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M35 60L45 55L55 65L65 55L75 60"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
