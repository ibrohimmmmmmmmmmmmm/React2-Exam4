import React, { useState, useRef, useEffect } from "react";
import { useAppSelector } from "../../hooks";
import type { RootState } from "../../store";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { getImageUrl } from "../../utils/image";
import {
  Search, Briefcase, FileText, Users,
  MessageCircle, Bell, Sparkles, ChevronDown, LogOut,
} from "lucide-react";

// No interface change needed
const navItems = [
  { label: "Jobs",          icon: Briefcase,      path: "/candidate-page" },
  { label: "Network",       icon: Users,          path: "/candidate-page/network" },
  { label: "Messages",      icon: MessageCircle,  path: "/candidate-page/messages" },
  { label: "Notifications", icon: Bell,           path: "/candidate-page/notifications", badge: 3 },
];

const CandidateHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current path
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const profileUser = useAppSelector((state: RootState) => state.profile.user);

  // Determine active tab based on current URL
  const activeTab = navItems.find(item => 
    location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== "/candidate-page")
  )?.label || "Jobs";

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && e.target instanceof Node && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDropdownOpen(false); };
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("click", handleClick); document.removeEventListener("keydown", handleKey); };
  }, []);

  const handleNav = (path: string) => {
    setTransitioning(true);
    setTimeout(() => {
      navigate(path);
      setTransitioning(false);
    }, 450);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const avatarSrc =
    getImageUrl(profileUser?.avatar || profileUser?.avatarUrl || profileUser?.photo) ||
    "https://i.pravatar.cc/150?img=12";

  const displayName = profileUser?.fullName || profileUser?.email || "Profile";

  return (
    <>
      <div
        style={{
          position: "fixed", top: 0, left: 0, height: "3px",
          width: transitioning ? "100%" : "0%",
          background: "linear-gradient(90deg, #2563eb, #60a5fa, #3b82f6)",
          boxShadow: transitioning ? "0 0 10px rgba(37, 99, 235, 0.6)" : "none",
          transition: transitioning ? "width 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none",
          zIndex: 9999,
        }}
      />

      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-6">
          
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 cursor-pointer select-none group" onClick={() => handleNav("/candidate-page")}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 transition-transform group-hover:scale-105">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-[15px] font-bold tracking-tight text-slate-900">AI-JOB</span>
            </div>

            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text" placeholder="Search jobs, skills..." value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="h-9 w-[260px] lg:w-[320px] rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-[13px] text-slate-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map(({ label, icon: Icon, path, badge }) => {
              const isActive = label === activeTab;
              return (
                <button
                  key={label}
                  onClick={() => handleNav(path)}
                  className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold transition-all duration-300 ${
                    isActive
                      ? "text-blue-600 bg-blue-50/50"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{label}</span>
                  {badge && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-[21px] left-1/2 -translate-x-1/2 h-[3px] w-6 rounded-t-full bg-blue-600 animate-in fade-in zoom-in duration-300" />
                  )}
                </button>
              );
            })}

            <button
              onClick={() => handleNav("/candidate-page/ai-tools")}
              className="ml-3 flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-black active:scale-95 px-4 py-2 text-[13px] font-semibold text-white transition-all shadow-md"
            >
              <Sparkles className="h-4 w-4" />
              AI Tools
            </button>
          </nav>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 p-1 pr-3 hover:border-blue-300 transition-all bg-white"
            >
              <img src={avatarSrc} alt={displayName} className="h-7 w-7 rounded-lg object-cover" />
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform duration-300" style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-100 bg-white p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-3 py-2.5 border-b border-slate-50 mb-1">
                  <p className="text-[11px] text-slate-400">Signed in as</p>
                  <p className="text-[13px] font-semibold text-slate-800 truncate">{displayName}</p>
                </div>
                <button onClick={() => { handleNav("/candidate-page/account"); setDropdownOpen(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all">
                  <FileText className="h-3.5 w-3.5" /> My Account
                </button>
                <button onClick={() => { handleNav("/candidate-page/account?tab=saved"); setDropdownOpen(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all">
                  <Briefcase className="h-3.5 w-3.5" /> Saved Jobs
                </button>
                <div className="border-t border-slate-50 mt-1 pt-1">
                  <button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-rose-500 hover:bg-rose-50 transition-all">
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default CandidateHeader;