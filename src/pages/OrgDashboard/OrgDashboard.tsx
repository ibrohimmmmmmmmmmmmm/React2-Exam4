import React, { useState } from "react";
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Sparkles, 
  Search, 
  ArrowUpRight, 
  MapPin, 
  Clock,
  TrendingUp,
  FileCheck,
  Building
} from "lucide-react";

export default function OrgDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "Active Jobs", value: "8", change: "+2 this week", icon: Briefcase, color: "bg-blue-50 text-blue-600" },
    { label: "Total Candidates", value: "246", change: "+14% vs last month", icon: Users, color: "bg-indigo-50 text-indigo-600" },
    { label: "Interviews Scheduled", value: "15", change: "5 scheduled today", icon: Calendar, color: "bg-emerald-50 text-emerald-600" },
    { label: "AI Match Score", value: "94%", change: "Industry top 5%", icon: Sparkles, color: "bg-amber-50 text-amber-600" },
  ];

  const jobs = [
    { title: "Senior AI Research Engineer", department: "Engineering", location: "San Francisco, CA (Hybrid)", applicants: 42, matchRate: "96%", status: "Active" },
    { title: "Lead Product Designer", department: "Design", location: "Remote (US/Canada)", applicants: 28, matchRate: "91%", status: "Active" },
    { title: "Senior React Developer", department: "Engineering", location: "New York, NY (On-site)", applicants: 65, matchRate: "89%", status: "Active" },
  ];

  const candidates = [
    { name: "Alex Rivera", role: "Senior AI Engineer", match: "98%", status: "Interviewing", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Sophia Chen", role: "Lead Product Designer", match: "94%", status: "Applied", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Marcus Johnson", role: "Senior React Developer", match: "91%", status: "Offer Stage", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100" },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      {/* Welcome banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Hiring Dashboard
          </h1>
          <p className="mt-1 text-slate-500">
            Welcome back! Here's an overview of your recruitment pipeline and active positions.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-xs hover:bg-slate-50 cursor-pointer">
            Export Report
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 cursor-pointer">
            Create New Job
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                <div className="mt-1 flex items-center gap-1.5 text-xs">
                  <span className="font-semibold text-emerald-600">{stat.change.split(" ")[0]}</span>
                  <span className="text-slate-400">{stat.change.split(" ").slice(1).join(" ")}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main split section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Active Positions */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Active Job Openings</h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.title} className="group rounded-xl border border-slate-100 hover:border-blue-100 p-4 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Building className="h-3.5 w-3.5" /> {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {job.applicants} Applicants
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                      <Sparkles className="h-3 w-3" /> {job.matchRate} AI Fit
                    </span>
                    <div className="mt-2 text-xs text-slate-400">
                      Status: <span className="font-semibold text-emerald-600">{job.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Selected Candidates */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">Top Matches by AI</h2>
            <p className="text-xs text-slate-500 mt-1">Recommended based on skillset and alignment</p>
          </div>

          <div className="space-y-4">
            {candidates.map((cand) => (
              <div key={cand.name} className="flex items-center justify-between rounded-xl border border-slate-50 p-3 hover:bg-slate-50/50 transition-all">
                <div className="flex items-center gap-3">
                  <img
                    src={cand.avatar}
                    alt={cand.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{cand.name}</h4>
                    <p className="text-xs text-slate-500">{cand.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                    {cand.match} Fit
                  </span>
                  <p className="mt-1 text-[10px] text-slate-400 font-semibold">{cand.status}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 w-full rounded-xl border border-slate-200 hover:bg-slate-50 py-2.5 text-center text-sm font-semibold text-slate-600 transition-all cursor-pointer">
            Explore Candidates Platform
          </button>
        </div>
      </div>
    </div>
  );
}
