import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Mail, Briefcase, Calendar, ChevronRight, Download, Link as LinkIcon } from "lucide-react";
import { networkService, type NetworkUser } from "../../services/networkService";
import axiosRequest from "../../services/axiosRequest";
import { getImageUrl } from "../../utils/image";

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

const OrgCandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [candidate, setCandidate] = useState<NetworkUser | null>(null);
  const [experiences, setExperiences] = useState<UserExperience[]>([]);
  const [languages, setLanguages] = useState<UserLanguage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidateData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Fetch candidate base info
        const usersRes = await networkService.getDirectory();
        const usersList: NetworkUser[] = Array.isArray(usersRes) ? usersRes : (usersRes.data || []);
        const foundCandidate = usersList.find(u => u.id === parseInt(id));
        
        if (foundCandidate) {
          setCandidate(foundCandidate);
        }

        // Fetch Experiences
        try {
          const expRes = await axiosRequest.get(`/UserExperience/by-user/${id}`);
          setExperiences(Array.isArray(expRes.data) ? expRes.data : []);
        } catch (e) {
          console.warn("Could not fetch experiences.");
        }

        // Fetch Languages
        try {
          const langRes = await axiosRequest.get(`/Language`);
          const allLangs = Array.isArray(langRes.data) ? langRes.data : [];
          setLanguages(allLangs.slice(0, 3)); // Mocking user specific languages
        } catch (e) {
          console.warn("Could not fetch languages.");
        }

      } catch (error) {
        console.error("Error fetching candidate details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto py-8 px-4 flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!candidate && !loading) {
    return (
      <div className="max-w-[800px] mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidate Not Found</h2>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  const displayName = `${candidate?.firstName || ''} ${candidate?.lastName || ''}`.trim() || candidate?.userName;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[900px] mx-auto py-8 px-4 lg:px-0"
    >
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 mb-4">
            <div className="flex items-end gap-6">
              <img 
                src={getImageUrl(candidate?.avatar) || "https://ui-avatars.com/api/?name=" + displayName + "&background=0D8ABC&color=fff"} 
                alt={displayName}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
              />
              <div className="pb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{displayName}</h1>
                <p className="text-[15px] text-gray-600 font-medium mt-1">
                  {experiences[0]?.position || "Specialist"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pb-2">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200">
                <LinkIcon size={18} />
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200">
                <Download size={18} />
              </button>
              <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors shadow-sm">
                Connect
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={16} className="text-gray-400" />
              <span className="text-[14px] font-medium">{candidate?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} className="text-gray-400" />
              <span className="text-[14px] font-medium">{experiences[0]?.location || "Location not specified"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Experience */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase className="text-blue-600" /> Work Experience
            </h2>
            
            {experiences.length > 0 ? (
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="relative pl-8 before:absolute before:left-[11px] before:top-2 before:bottom-[-32px] before:w-0.5 before:bg-gray-100 last:before:hidden">
                    <div className="absolute left-[3px] top-1.5 w-[18px] h-[18px] bg-white border-[3px] border-blue-500 rounded-full z-10"></div>
                    
                    <h3 className="text-[17px] font-bold text-gray-900">{exp.position}</h3>
                    <div className="text-[15px] font-semibold text-blue-600 mb-2">{exp.companyName}</div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-[13px] text-gray-500 mb-3 font-medium">
                      {exp.startDate && (
                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                          <Calendar size={14} /> 
                          {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                        </span>
                      )}
                      {exp.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} /> {exp.location}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[14px] text-gray-700 leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                      {exp.description || "No description provided."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 italic">No experience history available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Skills & Languages */}
        <div className="flex flex-col gap-6">
          {/* Languages */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-[16px] font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="text-xl">🗣️</span> Languages
            </h2>
            
            {languages.length > 0 ? (
              <div className="flex flex-col gap-3">
                {languages.map(lang => (
                  <div key={lang.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[14px] font-bold text-gray-800">{lang.languageName}</span>
                    <span className="text-[12px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      {lang.proficiencyLevel}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-gray-500 italic">No languages specified.</p>
            )}
          </div>

          {/* Quick Info */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-md p-8 text-white relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            
            <h3 className="text-lg font-bold mb-2 relative z-10">Interested in {displayName}?</h3>
            <p className="text-blue-100 text-sm mb-6 relative z-10 leading-relaxed">
              Send them a direct message or invite them to apply for one of your active positions.
            </p>
            
            <button className="w-full flex items-center justify-center gap-2 bg-white text-blue-700 font-bold text-[14px] py-3 rounded-xl hover:bg-gray-50 transition-colors relative z-10 shadow-sm">
              Send Message <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrgCandidateDetail;
