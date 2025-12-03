import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPulseLogs } from "../redux/pulseLogs/pulseLogSlice";
import { fetchTeams } from "../redux/teams/teamSlice";

const DashboardHome = () => {
  const dispatch = useDispatch();
  const { logs, loading: pulseLogsLoading } = useSelector((state) => state.pulseLogs);
  const { teams, loading: teamsLoading } = useSelector((state) => state.teams);
  const { user } = useSelector((state) => state.logIn);
  
  const [stats, setStats] = useState({
    teamSize: 0,
    avgMood: 0,
    needsAttention: 0,
    checkInRate: 0,
    totalCheckIns: 0,
  });
  const [workloadDist, setWorkloadDist] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchPulseLogs());
    dispatch(fetchTeams());
  }, [dispatch]);

  // Process pulse logs data when logs change
  useEffect(() => {
    if (!logs || logs.length === 0) return;

    // Calculate stats from API data
    const uniqueUsers = new Set(logs.map(log => log.user)).size;
    const avgMoodValue = logs.reduce((acc, log) => acc + log.mood, 0) / logs.length;
    const needsAttentionCount = logs.filter(log => log.mood <= 2 || log.workload >= 4).length;

    // Calculate workload distribution
    const workloadCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    logs.forEach(log => {
      if (workloadCounts[log.workload] !== undefined) {
        workloadCounts[log.workload]++;
      }
    });

    const totalLogs = logs.length;
    const wDist = [
      { label: "Light", value: workloadCounts[1], color: "#4ADE80", percent: Math.round((workloadCounts[1]/totalLogs)*100) || 0 },
      { label: "Moderate", value: workloadCounts[2], color: "#5BB5A2", percent: Math.round((workloadCounts[2]/totalLogs)*100) || 0 },
      { label: "Heavy", value: workloadCounts[3], color: "#FACC15", percent: Math.round((workloadCounts[3]/totalLogs)*100) || 0 },
      { label: "Overloaded", value: workloadCounts[4] + workloadCounts[5], color: "#F7A68C", percent: Math.round(((workloadCounts[4] + workloadCounts[5])/totalLogs)*100) || 0 },
    ];

    setWorkloadDist(wDist);
    setStats({
      teamSize: uniqueUsers,
      avgMood: avgMoodValue.toFixed(1),
      needsAttention: needsAttentionCount,
      checkInRate: 100, // This would need to be calculated based on total team members
      totalCheckIns: logs.length,
    });

    // Simple trend data (last 5 average moods)
    setTrendData([3.5, 3.8, 4.0, 3.9, parseFloat(avgMoodValue.toFixed(1))]);

    // Group logs by user for member list
    const userLogsMap = {};
    logs.forEach(log => {
      if (!userLogsMap[log.user]) {
        userLogsMap[log.user] = [];
      }
      userLogsMap[log.user].push(log);
    });

    const memberData = Object.entries(userLogsMap).map(([userId, userLogs]) => {
      const latest = userLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      return {
        name: latest.user_name || "Unknown",
        email: userId,
        team: latest.team_name || "No team",
        latestCheckIn: {
          mood: latest.mood,
          workload: latest.workload,
          thoughts: latest.comment,
          date: latest.timestamp,
        },
        needsAttention: latest.mood <= 2 || latest.workload >= 4,
        isPending: false,
        status: (latest.mood <= 2 || latest.workload >= 4) ? "attention" : "active",
      };
    });

    setMembers(memberData);
  }, [logs]);

  // --- Helpers ---
  const getMoodDetails = (moodValue) => {
    // Map numeric mood values to emoji/labels
    if (moodValue === 5) return { label: "Excellent", emoji: "🔥", color: "text-orange-500" };
    if (moodValue === 4) return { label: "Good", emoji: "😄", color: "text-green-600" };
    if (moodValue === 3) return { label: "Okay", emoji: "😐", color: "text-yellow-600" };
    if (moodValue === 2) return { label: "Low", emoji: "😓", color: "text-orange-600" };
    if (moodValue === 1) return { label: "Very Low", emoji: "😵", color: "text-red-600" };
    return { label: "Unknown", emoji: "❓", color: "text-gray-400" };
  };

  const getWorkloadLabel = (workloadValue) => {
    // Map numeric workload values to labels
    if (workloadValue === 1) return "Light";
    if (workloadValue === 2) return "Moderate";
    if (workloadValue === 3) return "Heavy";
    if (workloadValue === 4) return "Very Heavy";
    if (workloadValue === 5) return "Overloaded";
    return "Unknown";
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", { month: 'numeric', day: 'numeric', year: 'numeric' }) + 
           " at " + d.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
  };

  // --- Filter Logic ---
  const filteredMembers = members.filter(m => {
    if (activeFilter === 'attention') return m.needsAttention;
    if (activeFilter === 'pending') return m.isPending;
    return true;
  });

  return (
    <div className="w-full max-w-7xl animate-fadeIn space-y-8 pb-12 font-sans text-gray-800">
      
      {/* Loading State */}
      {pulseLogsLoading && (
        <div className="bg-white rounded-2xl p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A0D6C2] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      )}

      {/* 1. Top Banner */}
      <div className="bg-[#A0D6C2] rounded-2xl p-6 md:p-8 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-medium mb-1">Team Pulse Dashboard</h1>
          <p className="opacity-90 italic font-light">Monitor your team's wellbeing and workload</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm outline-none cursor-pointer hover:bg-white/30 transition">
            <option className="text-gray-800">All Teams</option>
            <option className="text-gray-800">Engineering</option>
            <option className="text-gray-800">Design</option>
          </select>
          <button className="bg-white/20 border border-white/30 px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition flex items-center gap-2">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             Export
          </button>
          <button className="bg-[#5BB5A2] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a9685] transition shadow-sm">
             Message
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Team Size */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition">
           <div className="absolute right-4 top-4 w-10 h-10 bg-[#A0D6C2] rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
           </div>
           <p className="text-gray-500 text-sm font-medium">Team Size</p>
           <p className="text-3xl font-bold mt-1 text-gray-800">{stats.teamSize}</p>
           <p className="text-xs text-gray-400 mt-2">Active members</p>
        </div>

        {/* Average Mood */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition">
           <div className="absolute right-4 top-4 w-10 h-10 bg-[#86EFAC] rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
           </div>
           <p className="text-gray-500 text-sm font-medium">Average Mood</p>
           <p className="text-3xl font-bold mt-1 text-gray-800">{stats.avgMood}</p>
           <p className="text-xs text-gray-400 mt-2">Out of 5.0</p>
        </div>

        {/* Needs Attention */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition">
           <div className="absolute right-4 top-4 w-10 h-10 bg-[#FCA5A5] rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           </div>
           <p className="text-gray-500 text-sm font-medium">Needs Attention</p>
           <p className="text-3xl font-bold mt-1 text-gray-800">{stats.needsAttention}</p>
           <p className="text-xs text-gray-400 mt-2">Team members</p>
        </div>

        {/* Check-in Rate */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition">
           <div className="absolute right-4 top-4 w-10 h-10 bg-[#27A5A1] rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <p className="text-gray-500 text-sm font-medium">Check-in Rate</p>
           <p className="text-3xl font-bold mt-1 text-gray-800">{stats.checkInRate}%</p>
           <p className="text-xs text-gray-400 mt-2">{stats.totalCheckIns}/{stats.teamSize} this week</p>
        </div>
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Line Chart Container */}
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-6">Team Mood Trend</h3>
            <div className="h-64 w-full relative flex items-end justify-between px-4 pb-6 border-b border-l border-gray-200">
               {/* Y-Axis Labels */}
               <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
                  <span>5</span>
                  <span>4</span>
                  <span>3</span>
                  <span>2</span>
                  <span>1</span>
               </div>
               
               {/* Simple SVG Line Chart */}
               <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="0%" x2="100%" y2="0%" stroke="#f3f4f6" strokeDasharray="4 4" />
                  <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#f3f4f6" strokeDasharray="4 4" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#f3f4f6" strokeDasharray="4 4" />
                  <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#f3f4f6" strokeDasharray="4 4" />
                  
                  {/* The Trend Line */}
                  <polyline
                     fill="none"
                     stroke="#A0D6C2"
                     strokeWidth="3"
                     points={trendData.map((val, i) => {
                        const x = (i / (trendData.length - 1)) * 100;
                        const y = 100 - ((val - 1) / 4) * 100; // Scale 1-5 to 0-100%
                        return `${x}%,${y}%`;
                     }).join(" ")}
                  />
                  {/* Points */}
                  {trendData.map((val, i) => {
                     const x = (i / (trendData.length - 1)) * 100;
                     const y = 100 - ((val - 1) / 4) * 100;
                     return (
                        <circle key={i} cx={`${x}%`} cy={`${y}%`} r="4" fill="#27A5A1" stroke="white" strokeWidth="2" />
                     )
                  })}
               </svg>

               {/* X-Axis Labels */}
               <div className="absolute -bottom-6 left-0 text-xs text-gray-400">Week 45</div>
               <div className="absolute -bottom-6 right-0 text-xs text-gray-400">Week 46</div>
            </div>
            <div className="text-center mt-4 text-xs text-[#A0D6C2] font-medium">Avg Mood: {stats.avgMood}</div>
         </div>

         {/* Pie/Donut Chart Container */}
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Current Workload Distribution</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-full pb-4">
               {/* CSS Conic Gradient Pie Chart */}
               <div 
                  className="w-48 h-48 rounded-full relative"
                  style={{
                    background: `conic-gradient(
                      #5BB5A2 0% ${workloadDist[1]?.percent || 0}%, 
                      #FACC15 ${workloadDist[1]?.percent || 0}% ${(workloadDist[1]?.percent || 0) + (workloadDist[2]?.percent || 0)}%,
                      #F7A68C ${(workloadDist[1]?.percent || 0) + (workloadDist[2]?.percent || 0)}% 95%,
                      #4ADE80 95% 100%
                    )`
                  }}
               >
                 {/* Center Cutout for Donut */}
                 <div className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full"></div>
                 
                 {/* Labels overlaid (Optional simplified version) */}
                 <div className="absolute -top-4 right-0 text-xs font-bold text-[#5BB5A2]">{workloadDist.find(w => w.label.includes('Busy But'))?.percent}%</div>
               </div>

               {/* Legend */}
               <div className="space-y-3">
                  {workloadDist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{backgroundColor: item.color}}></div>
                      <span className="text-xs text-gray-600 font-medium">{item.label}</span>
                      <span className="text-xs text-gray-400 font-bold">{item.percent}%</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* 4. Member List & Filters */}
      <div>
         {/* Tabs */}
         <div className="flex gap-2 mb-6">
            <button 
               onClick={() => setActiveFilter('all')}
               className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
               All Team ({members.length})
            </button>
            <button 
               onClick={() => setActiveFilter('attention')}
               className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeFilter === 'attention' ? 'bg-[#F7A68C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
               Needs Attention ({stats.needsAttention})
            </button>
            <button 
               onClick={() => setActiveFilter('pending')}
               className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeFilter === 'pending' ? 'bg-gray-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
               Pending Check-in ({members.filter(m => m.isPending).length})
            </button>
         </div>

         {/* Grid of Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMembers.map((member, idx) => (
               <div 
                  key={idx}
                  className={`bg-white p-5 rounded-xl border shadow-sm flex items-start justify-between relative overflow-hidden ${member.needsAttention ? 'border-[#F7A68C] border-l-4' : 'border-gray-100 border-l-4 border-l-[#A0D6C2]'}`}
               >
                  {/* Left Content */}
                  <div className="flex gap-4">
                     {/* Avatar */}
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${member.needsAttention ? 'bg-[#818CF8]' : 'bg-[#818CF8]'}`}>
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
                     </div>
                     
                     <div>
                        <h4 className="font-semibold text-gray-800">{member.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{member.team} • {member.email}</p>
                        
                        {!member.isPending ? (
                           <>
                              <div className="flex items-center gap-3 mb-2">
                                 <div className="flex items-center gap-1">
                                    <span className="text-lg">{getMoodDetails(member.latestCheckIn.mood).emoji}</span>
                                    <span className={`text-xs font-bold ${getMoodDetails(member.latestCheckIn.mood).color}`}>
                                       {getMoodDetails(member.latestCheckIn.mood).label}
                                    </span>
                                 </div>
                                 <span className="text-gray-300">•</span>
                                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${member.needsAttention ? 'bg-[#FFEDD5] text-[#C2410C]' : 'bg-[#DBEAFE] text-[#1E40AF]'}`}>
                                    {getWorkloadLabel(member.latestCheckIn.workload)}
                                 </span>
                              </div>
                              <p className="text-sm text-gray-600 italic">"{member.latestCheckIn.thoughts || "No thoughts shared"}"</p>
                              <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                 {formatDate(member.latestCheckIn.date)}
                              </div>
                           </>
                        ) : (
                           <p className="text-sm text-gray-400 italic mt-2">No check-in recorded yet.</p>
                        )}
                     </div>
                  </div>

                  {/* Needs Attention Badge */}
                  {member.needsAttention && (
                     <span className="absolute top-4 right-4 border border-[#F7A68C] text-[#F7A68C] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Needs attention
                     </span>
                  )}
               </div>
            ))}

            {filteredMembers.length === 0 && (
               <div className="col-span-full py-10 text-center text-gray-400 italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No team members found for this filter.
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default DashboardHome;