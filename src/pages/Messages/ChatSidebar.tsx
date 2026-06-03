import React, { useState, useEffect } from "react";
import { Search, Plus, X, User } from "lucide-react";
import { getImageUrl } from "../../utils/image";
import type { Conversation } from "../../services/chatService";
import { networkService, type NetworkUser } from "../../services/networkService";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (user: NetworkUser | Conversation) => void;
  isLoading: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
  isLoading,
}) => {
  const [searchVal, setSearchVal] = useState("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<NetworkUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (isNewChatModalOpen && allUsers.length === 0) {
      setLoadingUsers(true);
      networkService.getDirectory()
        .then(data => setAllUsers(data || []))
        .catch(err => console.error(err))
        .finally(() => setLoadingUsers(false));
    }
  }, [isNewChatModalOpen, allUsers.length]);

  const filteredConversations = conversations.filter((conv) => {
    const name = conv.participantName || conv.userName || "";
    return name.toLowerCase().includes(searchVal.toLowerCase());
  });

  const filteredNewUsers = allUsers.filter((user) => {
    const name = `${user.firstName || ''} ${user.lastName || ''} ${user.userName || ''}`.trim();
    return name.toLowerCase().includes(searchVal.toLowerCase());
  });

  const handleStartNewChat = (user: NetworkUser) => {
    setIsNewChatModalOpen(false);
    onSelectConversation(user);
    setSearchVal("");
  };

  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || "U";
  };

  return (
    <div className="w-full md:w-[320px] lg:w-[380px] h-full flex flex-col bg-white border-r border-slate-100 flex-shrink-0 relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
        <h2 className="text-xl font-bold text-slate-900">Messages</h2>
        <button 
          onClick={() => setIsNewChatModalOpen(true)}
          className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Main Sidebar Content (Active Chats) */}
      {!isNewChatModalOpen && (
        <>
          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-10 px-4">
                <p className="text-sm text-slate-500">No conversations yet.</p>
                <button 
                  onClick={() => setIsNewChatModalOpen(true)}
                  className="mt-4 text-blue-600 text-sm font-medium hover:underline"
                >
                  Start a new chat
                </button>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activeConversation && activeConversation.id === conv.id;
                const displayName = conv.participantName || conv.userName || `User ${conv.participantId || "Unknown"}`;
                const avatarSrc = getImageUrl(conv.participantAvatar || conv.userAvatar);
                const lastMessage = conv.lastMessage?.content || conv.lastMessage || "Click to start chatting";

                return (
                  <button
                    key={conv.id}
                    onClick={() => onSelectConversation(conv)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                      isActive
                        ? "bg-blue-50/80 hover:bg-blue-50"
                        : "hover:bg-slate-50 bg-transparent"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={displayName}
                          className="w-14 h-14 rounded-full object-cover border border-slate-200 bg-white"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-600 text-lg">
                          {getInitials(displayName)}
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className={`text-[15px] font-semibold truncate ${isActive ? "text-blue-900" : "text-slate-800"}`}>
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
        </>
      )}

      {/* New Chat Modal/Dialog Overlap */}
      {isNewChatModalOpen && (
        <div className="absolute inset-0 bg-white z-20 flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <button 
              onClick={() => {
                setIsNewChatModalOpen(false);
                setSearchVal("");
              }}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-600" />
            </button>
            <h2 className="text-lg font-bold text-slate-900">New Message</h2>
          </div>
          
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">To:</span>
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search people..."
                autoFocus
                className="flex-1 bg-transparent py-1 text-sm text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {loadingUsers ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredNewUsers.length === 0 ? (
              <div className="text-center py-10 px-4">
                <p className="text-sm text-slate-500">No users found.</p>
              </div>
            ) : (
              filteredNewUsers.map(user => {
                const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName;
                
                return (
                  <button
                    key={user.id}
                    onClick={() => handleStartNewChat(user)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold">
                      {getInitials(displayName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold text-slate-800 truncate">{displayName}</h3>
                      <p className="text-[13px] text-slate-500 truncate">{user.role || "Network Member"}</p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
