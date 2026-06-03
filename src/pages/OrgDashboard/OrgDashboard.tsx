import React, { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosRequest from "../../services/axiosRequest";
import { networkService, type NetworkUser } from "../../services/networkService";
import { getImageUrl } from "../../utils/image";
import { useAppSelector } from "../../hooks";
import { 
  Video, 
  Image as ImageIcon, 
  FileText, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Briefcase, 
  FileCheck, 
  Users, 
  Plus, 
  MapPin, 
  Mail, 
  User 
} from "lucide-react";

interface UserExperience {
  id: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  location?: string;
}

interface UserLanguage {
  id: number;
  languageName: string;
  proficiencyLevel: string;
}

interface CandidateFeedData extends NetworkUser {
  experiences: UserExperience[];
  languages: UserLanguage[];
}

const CandidateCard = ({ candidate }: { candidate: CandidateFeedData }) => {
  const navigate = useNavigate();
  const displayName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || candidate.userName;
  const primaryRole = candidate.experiences?.[0]?.position || "Specialist";
  
  // Format current date for the mock feed
  const postDate = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4"
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex gap-3 items-center cursor-pointer" onClick={() => navigate(`/organization-page/candidate/${candidate.id}`)}>
          <img 
            src={getImageUrl(candidate.avatar) || "https://ui-avatars.com/api/?name=" + displayName + "&background=0D8ABC&color=fff"} 
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 leading-tight">{displayName}</h2>
            <p className="text-[13px] text-gray-500">{primaryRole}</p>
            <p className="text-[12px] text-gray-400 mt-0.5">{postDate} г.</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <span className="text-xl leading-none tracking-widest">...</span>
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-[14px] text-gray-800 line-clamp-3 mb-3">
          {candidate.experiences?.[0]?.description || "Experienced professional looking for new opportunities in the tech industry. Skilled in building scalable applications."}
        </p>
        
        {candidate.languages && candidate.languages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {candidate.languages.map(lang => (
              <span key={lang.id} className="text-[12px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {lang.languageName}
              </span>
            ))}
          </div>
        )}

        <button 
          onClick={() => navigate(`/organization-page/candidate/${candidate.id}`)}
          className="text-[14px] font-semibold text-blue-600 hover:underline"
        >
          Read more
        </button>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex justify-between">
        <button className="flex-1 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 py-2 rounded-lg transition-colors text-[14px] font-medium">
          <ThumbsUp size={18} /> Like
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 py-2 rounded-lg transition-colors text-[14px] font-medium">
          <MessageSquare size={18} /> Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 py-2 rounded-lg transition-colors text-[14px] font-medium">
          <Share2 size={18} /> Share
        </button>
      </div>
    </motion.div>
  );
};

export default memo(function OrgDashboard() {
  const [candidates, setCandidates] = useState<CandidateFeedData[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((state) => state.profile.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const usersRes = await networkService.getDirectory();
        let usersList: NetworkUser[] = Array.isArray(usersRes) ? usersRes : (usersRes.data || []);
        
        const feedUsers = usersList.slice(0, 5);
        
        const enrichedPromises = feedUsers.map(async (u) => {
          let experiences: UserExperience[] = [];
          let languages: UserLanguage[] = [];
          
          try {
            const expRes = await axiosRequest.get(`/UserExperience/by-user/${u.id}`);
            experiences = Array.isArray(expRes.data) ? expRes.data : [];
          } catch (e) {
            // ignore
          }
          
          try {
            const langRes = await axiosRequest.get(`/Language`);
            const allLangs = Array.isArray(langRes.data) ? langRes.data : [];
            languages = allLangs.slice(0, 2);
          } catch (e) {
            // ignore
          }

          if (experiences.length === 0) {
            experiences = [
              {
                id: Math.random(),
                companyName: "Tech Innovations",
                position: "Senior Specialist",
                startDate: "2020-01-01",
                description: "Experienced specialist with a strong background in cross-functional team collaboration and product delivery."
              }
            ];
          }

          return { ...u, experiences, languages };
        });

        const resolvedCandidates = await Promise.all(enrichedPromises);
        setCandidates(resolvedCandidates);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto py-6 px-4 flex flex-col lg:flex-row gap-6">
      
      {/* LEFT COLUMN: Company Profile */}
      <div className="hidden lg:block w-[280px] shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-[84px]">
          <div className="h-20 bg-gradient-to-r from-blue-500 to-indigo-600 relative"></div>
          <div className="px-5 pb-5">
            <div className="flex justify-center -mt-10 mb-3">
              <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-md">
                <img 
                  src={getImageUrl(user?.avatar) || "https://ui-avatars.com/api/?name=Meta&background=fff&color=000"} 
                  alt="Company Logo" 
                  className="w-full h-full rounded-xl object-cover border border-gray-100"
                />
              </div>
            </div>
            
            <div className="text-center mb-5">
              <h2 className="text-[17px] font-bold text-gray-900">{user?.firstName || "Meta"}</h2>
              <p className="text-[13px] text-gray-500 mt-0.5">Industry not specified</p>
              <div className="mt-2 inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Administrator
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Profile Manager</p>
              <div className="flex items-center gap-2 mb-2 text-gray-700">
                <User size={16} className="text-gray-400" />
                <span className="text-[13px] font-medium">{user?.userName || "test22"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={16} className="text-gray-400" />
                <span className="text-[13px] font-medium truncate">{user?.email || "test22@gmail.com"}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Organization Info</p>
              <p className="text-[13px] text-gray-700 mb-2">Instagram facebook</p>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={16} />
                <span className="text-[13px]">Dushanbe</span>
              </div>
            </div>

            <button className="w-full py-2 border border-gray-200 rounded-lg text-[14px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Edit page
            </button>
          </div>
        </div>
      </div>

      {/* MIDDLE COLUMN: Feed */}
      <div className="flex-1 max-w-[580px] mx-auto lg:mx-0">
        
        {/* New Publication Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              {user?.firstName?.[0] || 'M'}
            </div>
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 cursor-text hover:bg-gray-100 transition-colors">
              <p className="text-gray-500 text-[14px] font-medium">New publication</p>
            </div>
          </div>
          <div className="flex justify-between items-center px-2">
            <button className="flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg">
              <Video className="text-green-500" size={20} /> Video
            </button>
            <button className="flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg">
              <ImageIcon className="text-blue-500" size={20} /> Photo
            </button>
            <button className="flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg">
              <FileText className="text-red-500" size={20} /> Write article
            </button>
          </div>
        </div>

        {/* Candidate Feed */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-48 shadow-sm border border-gray-200 animate-pulse p-4"></div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {candidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Analytics & Actions */}
      <div className="hidden lg:flex flex-col gap-4 w-[280px] shrink-0 sticky top-[84px]">
        
        {/* Analytics Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-[14px] font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="text-blue-600 text-lg">📈</span> Company Analytics
          </h3>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Briefcase size={16} />
              </div>
              <span className="text-[13px] font-semibold text-gray-700">Active jobs</span>
            </div>
            <span className="font-bold text-gray-900">2</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <FileCheck size={16} />
              </div>
              <span className="text-[13px] font-semibold text-gray-700">Received applies</span>
            </div>
            <span className="font-bold text-gray-900">12</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <Users size={16} />
              </div>
              <span className="text-[13px] font-semibold text-gray-700">Employees</span>
            </div>
            <span className="font-bold text-gray-900">0</span>
          </div>
        </div>

        {/* Fast Actions Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4 text-center">
            Fast Actions
          </h3>
          <button 
            onClick={() => navigate('/organization-page/create-job')}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold text-[14px] py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Publish job
          </button>
        </div>

      </div>
    </div>
  );
});
