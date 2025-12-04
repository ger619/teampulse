import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoodSelector from "../components/MoodSelector";
import WorkloadSelector from "../components/WorkloadSelector";
import ThoughtsBox from "../components/ThoughtsBox";
import SubmitButton from "../components/SubmitButton";
import { createPulseLog, clearPulseLogState, resetPulseLogSuccess } from "../redux/pulseLogs/pulseLogSlice";
import { fetchMoods, fetchWorkloads } from "../redux/moodWorkload/moodWorkloadSlice";
import { fetchTeams } from "../redux/teams/teamSlice";

const CheckInPage = () => {
  const [mood, setMood] = useState(null);
  const [workload, setWorkload] = useState(null);
  const [comment, setComment] = useState("");
  const [team, setTeam] = useState("");
  
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.pulseLogs);
  const { user } = useSelector((state) => state.logIn);
  const { loading: moodWorkloadLoading, error: moodWorkloadError } = useSelector((state) => state.moodWorkload);
  const { teams } = useSelector((state) => state.teams);
  
  // Fetch moods and workloads on component mount
  useEffect(() => {
    // Fetch data - tokenManager will handle authentication
    dispatch(fetchMoods());
    dispatch(fetchWorkloads());
    dispatch(fetchTeams());
    dispatch(clearPulseLogState());
  }, [dispatch]);
  
  // Get team UUID from user's team names (derived state using useMemo)
  const derivedTeamId = useMemo(() => {
    if (user?.teams && user.teams.length > 0 && teams && teams.length > 0) {
      const userTeamName = user.teams[0];
      const matchingTeam = teams.find(t => t.team_name === userTeamName);
      return matchingTeam?.id || "";
    }
    return "";
  }, [user, teams]);

  // Update team state when derived value changes
  useEffect(() => {
    if (derivedTeamId && derivedTeamId !== team) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTeam(derivedTeamId);
    }
  }, [derivedTeamId, team]);

  const handleSubmit = async () => {
    if (!mood || !workload) {
      alert("Please select mood and workload.");
      return;
    }

    // Build the request based on API documentation
    // NOTE: user field is NOT required - backend infers from JWT token
    const pulseLogData = {
      mood: mood,
      workload: workload,
      comment: comment || "",
    };

    // Add team UUID if available
    if (team) {
      pulseLogData.team = team;
    } else {
      console.warn("WARNING: No team UUID available - submission may fail");
    }

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
        {/* Loading moods/workloads */}
        {moodWorkloadLoading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-sm text-blue-600">Loading options...</p>
            </div>
          </div>
        )}

        {/* Mood/Workload Error */}
        {moodWorkloadError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 text-sm">!</span>
              </div>
              <div>
                <p className="font-medium text-yellow-800">Could not load mood/workload options</p>
                <p className="text-sm text-yellow-600 mt-1">{moodWorkloadError}</p>
              </div>
            </div>
          </div>
        )}
        
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
      </div>
    </div>
  );
};

export default CheckInPage;