import { useState } from "react";
import MoodSelector from "../components/MoodSelector";
import WorkloadSelector from "../components/WorkloadSelector";

const CheckInView = () => {
  const user = JSON.parse(localStorage.getItem("pulse_current_user"));
  const [mood, setMood] = useState(null);
  const [workload, setWorkload] = useState(null);
  const [thoughts, setThoughts] = useState("");

  const ready = mood && workload;

  const handleSubmit = () => {
    const entry = {
      user: user?.email,
      mood,
      workload,
      thoughts,
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    const checkins = JSON.parse(localStorage.getItem("pulse_checkins") || "[]");
    checkins.push(entry);
    localStorage.setItem("pulse_checkins", JSON.stringify(checkins));

    alert("✨ Check-in saved!");
    setMood(null);
    setWorkload(null);
    setThoughts("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[#c7ead5] p-8">
      <h2 className="text-2xl font-semibold text-[#27A5A1] mb-2">
        Hello {user?.name} 👋
      </h2>
      <p className="text-gray-600 mb-6">
        Ready to share how you're feeling today?
      </p>

      {/* Scrollable Check-in Content */}
      <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2">
        {/* Mood Section */}
        <MoodSelector selected={mood} onChange={setMood} />

        {/* Workload Section */}
        <WorkloadSelector selected={workload} onChange={setWorkload} />

        {/* Thoughts Section */}
        <div>
          <p className="text-center italic text-gray-600 text-lg mb-4">
            Any thoughts? (optional) 💭
          </p>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-xl bg-gray-100 outline-none resize-none"
            placeholder="Share what's on your mind..."
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            rows="4"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          disabled={!ready}
          onClick={handleSubmit}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
            ready 
              ? "bg-[#A0D6C2] text-white hover:bg-[#8acdb5] shadow-md" 
              : "bg-[#A0D6C2] bg-opacity-40 text-gray-400 cursor-not-allowed"
          }`}
        >
          {ready ? "Submit check-in ✨" : "Please select mood and workload"}
        </button>
      </div>
    </div>
  );
};

export default CheckInView;