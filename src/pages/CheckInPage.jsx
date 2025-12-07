import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoodSelector from "../components/MoodSelector";
import WorkloadSelector from "../components/WorkloadSelector";
import ThoughtsBox from "../components/ThoughtsBox";
import SubmitButton from "../components/SubmitButton";
import { createPulseLog, clearPulseLogState, resetPulseLogSuccess } from "../redux/pulseLogs/pulseLogSlice";
import { fetchMoods, fetchWorkloads } from "../redux/moodWorkload/moodWorkloadSlice";
import { fetchTeams } from "../redux/teams/teamSlice";

const CheckInPage = ({ onNavigateTab }) => {
  const [mood, setMood] = useState(null);
  const [workload, setWorkload] = useState(null);
  const [comment, setComment] = useState("");
  const [team, setTeam] = useState("");
  const [lastSubmission, setLastSubmission] = useState(null);
  
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

    // Keep a snapshot for post-submit processing (email alerts)
    setLastSubmission({ mood, workload, comment, teamId: team, at: new Date().toISOString() });
    dispatch(createPulseLog(pulseLogData));
  };

  // Reset success message and show redirect toast
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetPulseLogSuccess());
        setMood(null);
        setWorkload(null);
        setComment("");
      }, 2000);

      const navTimer = setTimeout(() => {
        if (typeof onNavigateTab === "function") {
          onNavigateTab("teamfeed");
        }
      }, 1500);

      // Fire-and-forget: send low mood email to admin via Formspree
      if (lastSubmission && typeof lastSubmission.mood === "number" && lastSubmission.mood <= 2) {
        try {
          const ADMIN_EMAIL = "nemwelnyandoro20@gmail.com"; // POC default recipient
          const FORMSPREE_URL = "https://formspree.io/f/mgedowaj";

          const findTeamName = (id) => {
            if (!id || !teams) return "";
            const t = teams.find((tt) => tt.id === id);
            return t?.team_name || "";
          };

          const moodEmoji = (v) => {
            if (v <= 1) return "😞";
            if (v === 2) return "😕";
            if (v === 3) return "😐";
            if (v === 4) return "🙂";
            return "😄";
          };

          const workloadLabel = (v) => {
            if (v <= 1) return "Light 🌤️";
            if (v === 2) return "Moderate ⛅";
            if (v === 3) return "Heavy 🌧️";
            return "Overloaded ⛈️";
          };

          const u = user || {};
          const fullName = u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : (u.name || u.username || "");
          const teamName = findTeamName(lastSubmission.teamId);

          const subject = `[TeamPulse] Low mood alert for ${fullName || u.username || "a team member"}`;
          const bodyLines = [
            `A team member submitted a low mood check-in.`,
            ``,
            `User: ${fullName || u.username || "Unknown"}`,
            `Email: ${u.email || "n/a"}`,
            `Team: ${teamName || "n/a"}`,
            `Submitted at: ${new Date(lastSubmission.at).toLocaleString()}`,
            `Mood score: ${lastSubmission.mood} ${moodEmoji(lastSubmission.mood)}`,
            `Workload: ${workloadLabel(lastSubmission.workload)}`,
            `Comment: ${lastSubmission.comment ? lastSubmission.comment : "(no comment)"}`,
          ];

          const payload = {
            _subject: subject,
            admin_email: ADMIN_EMAIL,
            user_name: fullName || u.username || "",
            user_email: u.email || "",
            team_name: teamName || "",
            mood_score: String(lastSubmission.mood),
            workload_value: String(lastSubmission.workload),
            message: bodyLines.join("\n"),
          };

          fetch(FORMSPREE_URL, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }).catch(() => {});
        } catch (e) {
          // swallow to avoid impacting UX
          // console.error('Formspree alert failed', e);
        }
      }
      
      return () => {
        clearTimeout(timer);
        clearTimeout(navTimer);
      };
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

        {/* Redirect Toast */}
        {success && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-[#A0D6C2] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span className="text-sm">Redirecting to Team Feed…</span>
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