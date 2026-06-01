import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  Briefcase,
  Users,
  FileText,
  MessageCircle,
  Wand2,
  Plus,
  ChevronDown,
  LogOut,
} from "lucide-react";

interface OrganizationHeaderProps {
  activeTab?: string;
}

const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({ activeTab = "Dashboard" }) => {
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/organization-page" },
    { label: "Company Profile", icon: Building, path: "/organization-page" },
    { label: "Jobs", icon: Briefcase, path: "/organization-page" },
    { label: "Candidates", icon: Users, path: "/organization-page" },
    { label: "Applications", icon: FileText, path: "/organization-page" },
    { label: "Messages", icon: MessageCircle, path: "/organization-page" },
    { label: "AI Hiring Tools", icon: Wand2, path: "/organization-page" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white shadow-xs">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        {/* LEFT SECTION - LOGO */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/organization-page")}>
            <span className="text-xl font-extrabold tracking-tight text-blue-600">
              AI-JOB
            </span>
          </div>
        </div>

        {/* MIDDLE SECTION - NAVIGATION */}
        <nav className="flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === activeTab;
            
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`relative flex items-center gap-2 rounded-xl px-3 py-2 transition-all text-sm font-medium ${
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                <span className="hidden xl:inline">{item.label}</span>
                
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT SECTION - CREATE JOB & PROFILE */}
        <div className="flex items-center gap-4">
          {/* Create Job Button */}
          <button
            onClick={() => navigate("/organization-page")}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Job</span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1.5 rounded-full border border-slate-100 hover:bg-slate-50 p-1 cursor-pointer transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
                alt="Org Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
              <ChevronDown className="h-4 w-4 text-slate-500 mr-1" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white p-1 shadow-lg z-50">
                <div className="px-3 py-2 border-b border-slate-50">
                  <p className="text-xs text-slate-400 font-medium">Organization</p>
                  <p className="text-sm font-semibold text-slate-700 truncate">Hiring Manager</p>
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
      </div>
    </header>
  );
};

export default OrganizationHeader;
