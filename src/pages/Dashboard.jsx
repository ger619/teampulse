import { useState } from "react";
import Layout from "../components/Layout";
import MoodSelector from "../components/MoodSelector";
import WorkloadSelector from "../components/WorkloadSelector";
import ThoughtsBox from "../components/ThoughtsBox";
import SubmitButton from "../components/SubmitButton";
import { saveCheckIn, getCurrentUser } from "../utils/storage";

const Dashboard = () => {
  const user = getCurrentUser();

  const [mood, setMood] = useState(null);
  const [workload, setWorkload] = useState(null);
  const [thoughts, setThoughts] = useState("");

  const isDisabled = !mood || !workload || thoughts.length === 0;

  const handleSubmit = () => {
    saveCheckIn({ user: user.email, mood, workload, thoughts });
    alert("Check-in submitted! 🎉");
    setMood(null);
    setWorkload(null);
    setThoughts("");
  };

  return (
    <Layout>
      <h2 className="text-xl text-[#27A5A1] font-bold mb-4">
        Hello {user.name} 👋
      </h2>

      <div className="max-h-[60vh] overflow-y-auto pr-2">
        <MoodSelector selected={mood} onChange={setMood} />
        <WorkloadSelector selected={workload} onChange={setWorkload} />
        <ThoughtsBox value={thoughts} onChange={setThoughts} />
      </div>

      <SubmitButton disabled={isDisabled} onClick={handleSubmit} />
    </Layout>
  );
}

export default Dashboard;