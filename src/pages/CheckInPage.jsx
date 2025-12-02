import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoodSelector from "../components/MoodSelector";
import WorkloadSelector from "../components/WorkloadSelector";
import ThoughtsBox from "../components/ThoughtsBox";
import SubmitButton from "../components/SubmitButton";
import { createPulseLog, clearPulseLogState, resetPulseLogSuccess } from "../redux/pulseLogs/pulseLogSlice";

const CheckInPage = () => {
  const [mood, setMood] = useState(null);
  const [workload, setWorkload] = useState(null);
  const [comment, setComment] = useState("");
  const [team, setTeam] = useState(""); // You'll need to get the team ID from your user data
  
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.pulseLogs);
  const { user } = useSelector((state) => state.login);
  
  // Get team ID from user data or localStorage
  useEffect(() => {
    if (user?.team) {
      setTeam(user.team);
    } else {
      const localStorageUser = JSON.parse(localStorage.getItem("pulse_current_user") || "null");
      if (localStorageUser?.team) {
        setTeam(localStorageUser.team);
      }
    }
    
    // Reset success state when component mounts
    dispatch(clearPulseLogState());
  }, [dispatch, user]);

  const handleSubmit = async () => {
    if (!mood || !workload || !team) {
      alert("Please select mood, workload, and ensure you have a team assigned.");
      return;
    }

    const pulseLogData = {
      mood: mood,
      workload: workload,
      comment: comment || "", // Optional field
      team: team,
    };

    console.log("Submitting pulse log:", pulseLogData);
    dispatch(createPulseLog(pulseLogData));
  };

  // Reset success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetPulseLogSuccess());
        // Reset form
        setMood(null);
        setWorkload(null);
        setComment("");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const isSubmitDisabled = !mood || !workload || loading;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">Check-in submitted successfully!</p>
                <p className="text-sm text-green-600 mt-1">Your team pulse has been recorded.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-sm">!</span>
              </div>
              <div>
                <p className="font-medium text-red-800">Submission failed</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Weekly Check-In</h1>
        <p className="text-gray-600 mb-8">
          Let your team know how you're doing this week. Your responses are anonymous to other team members.
        </p>

        {/* Mood Selector */}
        <MoodSelector selected={mood} onChange={setMood} />

        {/* Workload Selector */}
        <WorkloadSelector selected={workload} onChange={setWorkload} />

        {/* Thoughts Box */}
        <ThoughtsBox value={comment} onChange={setComment} />

        {/* Submit Button */}
        <SubmitButton 
          disabled={isSubmitDisabled} 
          loading={loading}
          onClick={handleSubmit} 
        />

        {/* Selected Values Debug (remove in production) */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>Debug info (remove this in production):</p>
          <p>Mood: {mood ? moods.find(m => m.value === mood)?.label : "Not selected"}</p>
          <p>Workload: {workload ? workloads.find(w => w.value === workload)?.label : "Not selected"}</p>
          <p>Team ID: {team || "Not set"}</p>
          <p>Character count: {comment.length}/500</p>
        </div>
      </div>
    </div>
  );
};

// Add these back at the bottom for reference
const moods = [
  { id: "fire", label: "🔥 On Fire", value: 5 },
  { id: "happy", label: "😄 Happy", value: 4 },
  { id: "meh", label: "😐 Meh", value: 3 },
  { id: "sad", label: "😢 Low", value: 2 },
  { id: "angry", label: "😠 Frustrated", value: 1 },
];

const workloads = [
  { id: "light", label: "🌤️ Light", value: 1 },
  { id: "medium", label: "⛅ Moderate", value: 2 },
  { id: "heavy", label: "🌧️ Heavy", value: 3 },
  { id: "overload", label: "⛈️ Overloaded", value: 4 },
];

export default CheckInPage;