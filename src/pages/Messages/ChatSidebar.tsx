import React, { useState } from "react";
import { Search, Plus, Building2 } from "lucide-react";
import { getImageUrl } from "../../utils/image";
import type { Conversation } from "../../services/chatService";

interface Organization {
  id: number;
  ownerId: number;
  name: string;
  description?: string;
  logoUrl?: string;
  industry?: string;
  [key: string]: any;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  allOrganizations: Organization[];
  activeConversation: Conversation | null;
  onSelectOrganization: (org: Organization) => void;
  isLoading: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  allOrganizations,
  activeConversation,
  onSelectOrganization,
  isLoading,
}) => {
  const [searchVal, setSearchVal] = useState("");

  const filteredOrgs = allOrganizations.filter((org) => {
    const name = org.name || "";
    return name.toLowerCase().includes(searchVal.toLowerCase());
  });

  return (
    <div className="w-full md:w-[320px] lg:w-[380px] h-full flex flex-col bg-white border-r border-slate-100 flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
        <h2 className="text-xl font-bold text-slate-800">Messages</h2>
        <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
          <Plus size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search organizations..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* Organizations List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="text-center py-10 px-4">
            <p className="text-sm text-slate-500">No organizations found.</p>
          </div>
        ) : (
          filteredOrgs.map((org) => {
            // Check if there is an existing conversation with this organization's owner
            const existingConv = conversations.find(
              (c) => c.participantId === org.ownerId || c.senderId === org.ownerId || c.receiverId === org.ownerId
            );
            const isActive = activeConversation && existingConv && activeConversation.id === existingConv.id;
            
            const displayName = org.name || `Organization ${org.id}`;
            const avatarSrc = getImageUrl(org.logoUrl) || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
            const lastMessage = existingConv?.lastMessage?.content || existingConv?.lastMessage || "Click to start chatting";

            return (
              <button
                key={org.id}
                onClick={() => onSelectOrganization(org)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  isActive
                    ? "bg-blue-50/80 hover:bg-blue-50"
                    : "hover:bg-slate-50 bg-transparent"
                }`}
              >
                <div className="relative flex-shrink-0">
                  {org.logoUrl ? (
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 bg-white"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-500" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`text-sm font-semibold truncate ${isActive ? "text-blue-900" : "text-slate-800"}`}>
                      {displayName}
                    </h3>
                  </div>
                  <p className={`text-[13px] truncate ${isActive ? "text-blue-600/80 font-medium" : "text-slate-500"}`}>
                    {lastMessage}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
