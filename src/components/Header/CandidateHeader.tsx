import React, { useState } from "react";
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
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50/50 p-1.5 pr-3 hover:bg-slate-100/80 transition-all cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"
              alt="Candidate Profile"
              className="h-8 w-8 rounded-full border border-white object-cover"
            />
            <span className="text-sm font-semibold text-slate-700 hidden sm:inline">Profile</span>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white p-1 shadow-lg z-50">
              <div className="px-3 py-2 border-b border-slate-50">
                <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                <p className="text-sm font-semibold text-slate-700 truncate">Candidate User</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50/70 transition-all"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CandidateHeader;
