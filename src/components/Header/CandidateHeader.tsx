import React, { useState, useRef, useEffect } from "react";
import { useAppSelector } from "../../hooks";
import type { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Briefcase,
  FileText,
  Users,
  MessageCircle,
  Bell,
  Sparkles,
  ChevronDown,
  LogOut,
} from "lucide-react";

interface CandidateHeaderProps {
  activeTab?: string;
}

const CandidateHeader: React.FC<CandidateHeaderProps> = ({ activeTab = "Jobs" }) => {
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const profileState = useAppSelector((state: RootState) => state.profile);
  const profileUser = profileState.user;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!dropdownRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setProfileDropdownOpen(false);
    }
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const navItems = [
    { label: "Jobs", icon: Briefcase, path: "/candidate-page" },
    { label: "Applications", icon: FileText, path: "/candidate-page" },
    { label: "Network", icon: Users, path: "/candidate-page" },
    { label: "Messages", icon: MessageCircle, path: "/candidate-page" },
    { label: "Notifications", icon: Bell, path: "/candidate-page", badge: 3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white shadow-xs">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/candidate-page")}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-blue-600">
              AI-JOB
            </span>
          </div>

          {/* Search bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs, skills, or companies..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="h-10 w-[300px] lg:w-[380px] pl-auto rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm text-slate-800 outline-hidden transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* MIDDLE SECTION - NAVIGATION */}
        <nav className="flex items-center gap-1.5 lg:gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === activeTab;
            
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2.5 transition-all text-sm font-medium ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? "text-blue-600" : "text-slate-500"}`} />
                <span className="hidden sm:inline">{item.label}</span>
  
              </button>
            );
          })}

          {/* AI Tools Premium Button */}
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white transition-all shadow-sm hover:shadow-md ml-1 lg:ml-2">
            <Sparkles className="h-4.5 w-4.5" />
            <span className="text-sm font-semibold">AI Tools</span>
          </button>
        </nav>

        {/* RIGHT SECTION - PROFILE */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-1.5 hover:shadow-lg transition-all cursor-pointer"
          >
            <img
              src={profileUser?.avatar || profileUser?.avatarUrl || profileUser?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"}
              alt={profileUser?.fullName || profileUser?.email || "Candidate"}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-50"
            />
            <span className="text-sm font-semibold text-slate-700 hidden sm:inline">{profileUser?.fullName ? profileUser.fullName : "Profile"}</span>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>

          {profileDropdownOpen && (
            <div className={`absolute right-0 mt-3 w-64 rounded-xl border border-slate-100 bg-white p-2 shadow-2xl z-50 transform transition-all origin-top-right ${profileDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs text-slate-400">Logged in as</p>
                <p className="mt-1 text-sm font-semibold text-slate-800 truncate">{profileUser?.fullName || profileUser?.email || "Candidate"}</p>
              </div>
              <div className="py-2">
                <button
                  onClick={() => { navigate('/candidate-page/account'); setProfileDropdownOpen(false); }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <FileText className="h-4 w-4 text-slate-500" />
                  My account
                </button>
                <button
                  onClick={() => { navigate('/candidate-page/account?tab=saved'); setProfileDropdownOpen(false); }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  Saved
                </button>
                <button
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CandidateHeader;
