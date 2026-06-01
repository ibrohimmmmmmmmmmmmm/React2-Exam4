import React from "react";
import {
  Search,
  Briefcase,
  FileText,
  Users,
  MessageCircle,
  Bell,
  Sparkles,
  ChevronDown,
} from "lucide-react";

const Header: React.FC = () => {
  const navItems = [
    {
      label: "Jobs",
      icon: Briefcase,
      active: true,
    },
    {
      label: "Applications",
      icon: FileText,
    },
    {
      label: "Network",
      icon: Users,
    },
    {
      label: "Messages",
      icon: MessageCircle,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        {/* LEFT */}
        <div className="flex items-center gap-8">
          {/* LOGO */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>

            <span className="text-xl font-extrabold tracking-tight text-blue-600">
              AI-JOB
            </span>
          </div>

          {/* SEARCH */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search jobs, skills, companies..."
              className="h-11 w-[380px] rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* CENTER NAVIGATION */}
        <nav className="hidden xl:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`group flex items-center gap-2 rounded-xl px-4 py-2 transition-all ${
                  item.active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />

                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}

          {/* AI TOOLS */}
          <button className="ml-2 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700">
            <Sparkles className="h-4 w-4" />

            <span className="text-sm font-medium">
              AI Tools
            </span>
          </button>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* NOTIFICATIONS */}
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100">
            <Bell className="h-5 w-5 text-slate-600" />

            <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          {/* PROFILE */}
          <button className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-100">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="profile"
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="hidden text-left lg:block">
              <p className="text-sm font-semibold text-slate-800">
                Ibrohim
              </p>

              <p className="text-xs text-slate-500">
                Software Developer
              </p>
            </div>

            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;