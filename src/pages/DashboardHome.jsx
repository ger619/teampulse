import { useState, useEffect } from "react";

const DashboardHome = () => {
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

  useEffect(() => {
    // 1. Fetch Data
    const users = JSON.parse(localStorage.getItem("pulse_users") || "[]");
    const checkins = JSON.parse(localStorage.getItem("pulse_checkins") || "[]");

    // 2. Process Members & Latest Check-in
    const memberData = users.map((u) => {
      // Find latest check-in for this user
      const userCheckins = checkins
        .filter((c) => c.userId === u.email)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      const latest = userCheckins[0];
      
      // Determine Status
      let status = "active";
      let isPending = !latest;
      let needsAttention = false;

      if (latest) {
        // Mood Scoring: fire(5), good(4), okay(3), bad(2), coffee(1)
        const moodScore = getMoodScore(latest.mood);
        const workloadScore = getWorkloadScore(latest.workload);
        
        // Needs Attention Logic: Low mood or Overwhelmed workload
        if (moodScore <= 2 || workloadScore >= 4) {
          needsAttention = true;
          status = "attention";
        }
      } else {
        status = "pending";
      }

      return { ...u, latestCheckIn: latest, status, needsAttention, isPending };
    });

    setMembers(memberData);

    // 3. Calculate Top Level Stats
    const teamSize = users.length;
    
    // Avg Mood
    const validCheckins = checkins.filter(c => c.mood);
    const totalMoodScore = validCheckins.reduce((acc, c) => acc + getMoodScore(c.mood), 0);
    const avgMood = validCheckins.length ? (totalMoodScore / validCheckins.length).toFixed(1) : "0.0";

    // Needs Attention Count
    const attentionCount = memberData.filter(m => m.needsAttention).length;

    // Check-in Rate (Unique users checked in / Total users)
    const uniqueCheckins = new Set(checkins.map(c => c.userId)).size;
    const rate = teamSize ? Math.round((uniqueCheckins / teamSize) * 100) : 0;

    setStats({
      teamSize,
      avgMood,
      needsAttention: attentionCount,
      checkInRate: rate,
      totalCheckIns: uniqueCheckins
    });

    // 4. Calculate Workload Distribution
    const workloads = { easy: 0, manageable: 0, busy: 0, very_busy: 0, frozen: 0 };
    let wTotal = 0;
    validCheckins.forEach(c => {
      if (workloads[c.workload] !== undefined) {
        workloads[c.workload]++;
        wTotal++;
      }
    });

    // Convert to array for chart
    const wDist = [
      { label: "All Good", value: workloads.easy, color: "#4ADE80", percent: wTotal ? Math.round((workloads.easy/wTotal)*100) : 0 },
      { label: "Busy But Fine", value: workloads.manageable, color: "#5BB5A2", percent: wTotal ? Math.round((workloads.manageable/wTotal)*100) : 0 }, // Main Green
      { label: "Quite Busy", value: workloads.busy, color: "#FACC15", percent: wTotal ? Math.round((workloads.busy/wTotal)*100) : 0 },
      { label: "Very Busy", value: workloads.very_busy + workloads.frozen, color: "#F7A68C", percent: wTotal ? Math.round(((workloads.very_busy + workloads.frozen)/wTotal)*100) : 0 }, // Orange/Red
    ];
    setWorkloadDist(wDist);

    // 5. Calculate Trend Data (Mocking weekly data from available timestamps)
    // For a real app, you'd group by actual weeks. Here we simulate 2 points if only 1 exists to draw a line.
    let chartPoints = [3.5, 3.8, 4.0, 3.9, parseFloat(avgMood)]; // Default mock + current
    if (validCheckins.length > 5) {
       // Logic to actually group by date could go here
       // For now, we append the current average to show the end of the line
       chartPoints = [...chartPoints.slice(1), parseFloat(avgMood)];
    }
    setTrendData(chartPoints);

  }, []);

  // --- Helpers ---
  const getMoodScore = (mood) => {
    switch (mood) {
      case "fire": return 5;
      case "good": return 4;
      case "okay": return 3;
      case "bad": return 2;
      case "coffee": return 1;
      default: return 3;
    }
  };
  
  const getWorkloadScore = (workload) => {
    switch (workload) {
      case "frozen": return 5;
      case "very_busy": return 4;
      case "busy": return 3;
      case "manageable": return 2;
      case "easy": return 1;
      default: return 2;
    }
  };

  const getMoodDetails = (mood) => {
     switch(mood) {
         case "fire": return { label: "On Fire!", emoji: "🔥", color: "text-orange-500" };
         case "good": return { label: "Pretty Good", emoji: "😄", color: "text-green-600" };
         case "okay": return { label: "It's Okay", emoji: "😐", color: "text-yellow-600" };
         case "bad": return { label: "Not Great", emoji: "😓", color: "text-orange-600" };
         case "coffee": return { label: "Send Coffee", emoji: "😵", color: "text-red-600" };
         default: return { label: "Unknown", emoji: "❓", color: "text-gray-400" };
     }
  };

  const getWorkloadLabel = (workload) => {
      const map = {
          easy: "All Good",
          manageable: "Busy But Fine",
          busy: "Quite Busy",
          very_busy: "Very Busy",
          frozen: "Overfrozen"
      };
      return map[workload] || workload;
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