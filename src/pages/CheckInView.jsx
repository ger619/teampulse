import { useState } from "react";
import MoodSelector from "../components/MoodSelector";
import WorkloadSelector from "../components/WorkloadSelector";

const CheckInView = () => {
  const user = JSON.parse(localStorage.getItem("pulse_current_user"));
  const [mood, setMood] = useState(null);
  const [workload, setWorkload] = useState(null);
  const [thoughts, setThoughts] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false); // New state for confirmation

  const ready = mood && workload;

  const handleSubmit = () => {
    // Determine the current user's ID for linking check-ins
    const userId = user?.email; 

    if (!userId) {
        return;
    }

    const entry = {
      userId: userId, // Use userId for consistency with DashboardHome logic
      mood,
      workload,
      thoughts,
      date: new Date().toISOString() // Using 'date' for consistency
    };

    // Save to localStorage
    const checkins = JSON.parse(localStorage.getItem("pulse_checkins") || "[]");
    checkins.push(entry);
    localStorage.setItem("pulse_checkins", JSON.stringify(checkins));

    // Show custom confirmation and reset form
    setShowConfirmation(true);
    setTimeout(() => {
        setShowConfirmation(false);
    }, 3000); 
    
    setMood(null);
    setWorkload(null);
    setThoughts("");
  };

  return (
    <div className="flex justify-center p-4">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 
                   border border-gray-100 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(135deg, #ffffff 50%, #f0fff4 100%)',
          boxShadow: '0 20px 40px -15px rgba(160, 214, 194, 0.4)'
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-[#27A5A1] mb-2">
            How are you today?
          </h1>
          <p className="text-lg italic text-gray-500">
            Quick check-in ✨
          </p>
        </div>

        {/* Mood Section */}
        <div className="bg-[#fcf8f0] rounded-2xl p-6 mb-8 border border-orange-100">
          <p className="text-center text-xl font-medium text-[#c49265] mb-5">
            How's your mood?
          </p>
          <MoodSelector selected={mood} onChange={setMood} />
        </div>

        {/* Workload Section */}
        <div className="bg-[#f0f8fc] rounded-2xl p-6 mb-8 border border-blue-100">
          <p className="text-center text-xl font-medium text-[#6597c4] mb-5">
            What's your workload?
          </p>
          <WorkloadSelector selected={workload} onChange={setWorkload} />
        </div>

        {/* Thoughts Section */}
        <div className="mb-8">
          <p className="text-center italic text-gray-500 text-lg mb-4">
            Any thoughts? (optional)
          </p>
          <textarea
            className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white outline-none resize-none focus:border-[#A0D6C2] transition placeholder-gray-400"
            placeholder="Share what's on your mind..."
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            rows="4"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            disabled={!ready}
            onClick={handleSubmit}
            className={`w-full py-4 rounded-xl font-bold text-lg transition duration-300 transform ${
              ready 
                ? "bg-[#A0D6C2] text-white hover:bg-[#8acdb5] shadow-lg hover:shadow-xl active:scale-[0.99]" 
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit Check-in ✨
          </button>
        </div>

        {/* Confirmation Message */}
        {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-2xl text-center border border-[#A0D6C2] animate-bounceIn">
                    <p className="text-xl font-semibold text-[#27A5A1]">
                        Check-in Recorded! 🎉
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Thanks for sharing your pulse with the team.
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CheckInView;