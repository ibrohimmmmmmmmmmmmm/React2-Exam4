import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getImageUrl } from "../../utils/image";
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
import { useAppSelector } from "../../hooks";

const OrganizationHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const user = useAppSelector((state) => state.profile.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/organization-page" },
    { label: "Company Profile", icon: Building, path: "/organization-page/company-profile" },
    { label: "Jobs", icon: Briefcase, path: "/organization-page/jobs" },
    { label: "Candidates", icon: Users, path: "/organization-page/candidates" },
    { label: "Applications", icon: FileText, path: "/organization-page/applications" },
    { label: "Messages", icon: MessageCircle, path: "/organization-page/messages" },
    { label: "AI Hiring Tools", icon: Wand2, path: "/organization-page/ai-tools" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-6">
        {/* LEFT SECTION - LOGO */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/organization-page")}>
            <span className="text-[17px] font-bold tracking-tight text-blue-600">
              AI-JOB
            </span>
          </div>
        </div>

        {/* MIDDLE SECTION - NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1 h-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Exact match for dashboard, prefix match for others
            const isActive = item.path === "/organization-page" 
              ? location.pathname === "/organization-page"
              : location.pathname.startsWith(item.path);
            
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`relative flex h-full items-center gap-2 px-3 transition-colors text-[13px] font-medium ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className={`h-[15px] w-[15px] ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                <span>{item.label}</span>
                
                {/* Active Indicator Bar - Exact match to screenshot */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600" />
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT SECTION - CREATE JOB & PROFILE */}
        <div className="flex items-center gap-4">
          {/* Create Job Button */}
          <button
            onClick={() => navigate("/organization-page/create-job")}
            className="flex items-center gap-1 rounded-full bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Job</span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1 rounded-full p-0.5 cursor-pointer transition-colors hover:bg-gray-50"
            >
              <img
                src={getImageUrl(user?.avatar) || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"}
                alt="Org Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white p-1 shadow-lg z-50">
                <div className="px-3 py-2 border-b border-gray-50 mb-1">
                  <p className="text-xs text-gray-400 font-medium">Organization</p>
                  <p className="text-[13px] font-semibold text-gray-700 truncate">{user?.firstName || "Hiring Manager"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
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
