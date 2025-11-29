import { useState } from "react";

const TeamFeedView = () => {
  const [newPost, setNewPost] = useState("");
  const [postAnonymously, setPostAnonymously] = useState(false);
  const user = JSON.parse(localStorage.getItem("pulse_current_user"));

  const calculateStats = () => {
    const checkins = JSON.parse(localStorage.getItem("pulse_checkins") || "[]");
    
    // Count specific moods
    const counts = {
      great: checkins.filter((c) => c.mood === "fire" || c.mood === "good").length,
      okay: checkins.filter((c) => c.mood === "okay").length,
      support: checkins.filter((c) => c.mood === "bad" || c.mood === "coffee").length,
    };

    return {
      counts,
      total: checkins.length
    };
  };

  const stats = calculateStats();

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;

    const post = {
      id: Date.now().toString(),
      content: newPost,
      author: postAnonymously ? "Team Member" : user?.name,
      initials: postAnonymously
        ? "?"
        : user?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
      timestamp: new Date().toISOString(),
      isAnonymous: postAnonymously,
    };

    // const updatedPosts = [post, ...posts];
    // setPosts(updatedPosts);
    // localStorage.setItem("pulse_posts", JSON.stringify(updatedPosts));

    setNewPost("");
    setPostAnonymously(false);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date
      .toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", " at");
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto w-full font-sans">
      
      {/* 1. Stats Banner Section */}
      <div className="bg-[#A0D6C2] rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
        
        <div className="flex items-start gap-4 z-10">
          {/* Icon Circle */}
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>

          <div className="flex-1">
            <h2 className="text-white text-lg font-medium mb-3 opacity-90">This Week's Team Pulse</h2>
            
            {/* Stats Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-white text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                {stats.counts.great} people are feeling great
              </span>
              <span className="bg-white text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                {stats.counts.okay} people are feeling okay
              </span>
              {stats.counts.support > 0 && (
                 <span className="bg-white text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                 {stats.counts.support} need support
               </span>
              )}
            </div>

            {/* Total Count */}
            <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
               <span>{stats.total} team members checked in this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Share Input Section */}
      <div className="bg-white rounded-[2rem] border border-[#A0D6C2] p-8 shadow-sm relative">
        <h3 className="text-[#8ACDB5] text-lg font-medium mb-6">Share with Your Team</h3>
        
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Send encouragement, share a win, or offer support..."
          className="w-full p-4 rounded-xl bg-[#F3F4F6] border-none focus:ring-0 outline-none resize-none h-24 text-sm text-gray-700 placeholder-gray-400 mb-6"
        />

        <div className="flex items-center justify-between">
          {/* Toggle Switch */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={postAnonymously}
                onChange={(e) => setPostAnonymously(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A0D6C2]"></div>
            </div>
            <span className="text-sm font-medium text-gray-600">Post anonymously</span>
          </label>

          {/* Post Button */}
          <button
            onClick={handlePostSubmit}
            disabled={!newPost.trim()}
            className={`px-8 py-2 rounded-full font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${
              newPost.trim()
                ? "bg-[#A0D6C2] text-white hover:bg-[#8acdb5] hover:shadow-md"
                : "bg-[#D1EBE2] text-white cursor-not-allowed opacity-70"
            }`}
          >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
             Post
          </button>
        </div>
      </div>

      {/* 3. Team Feed List */}
      <div>
        <h3 className="text-[#C5A880] text-lg mb-4 font-medium">Team Feed</h3>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-gray-400 py-10 italic">No updates yet. Be the first to share! ✨</p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl border-2 border-[#A0D6C2] p-5 shadow-[0_4px_12px_rgba(160,214,194,0.1)] flex gap-4 items-start transition-transform hover:-translate-y-0.5"
              >
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                    post.isAnonymous ? "bg-[#9CA3AF]" : "bg-[#A0D6C2]"
                  }`}
                >
                  {post.initials}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-gray-500 font-medium text-sm">
                      {post.author}
                    </span>
                    {post.isAnonymous && (
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200">
                        Anonymous
                      </span>
                    )}
                    <span className="text-[11px] text-[#A0D6C2]">
                      {formatDate(post.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 font-serif italic text-lg leading-relaxed">
                    {post.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamFeedView;