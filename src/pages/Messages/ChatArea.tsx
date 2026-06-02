import React, { useState, useRef, useEffect } from "react";
import { getImageUrl } from "../../utils/image";
import { useAppSelector } from "../../hooks";
import { Send, MoreVertical, Phone, Video, Info, Paperclip, Smile } from "lucide-react";
import type { Conversation, Message } from "../../services/chatService";
import type { RootState } from "../../store";

interface ChatAreaProps {
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  messages,
  onSendMessage,
  isLoading,
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const profileUser = useAppSelector((state: RootState) => state.profile.user);
  
  // Try to determine the current user's ID
  const currentUserId = profileUser?.id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50/50">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-blue-500 ml-1" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Your Messages</h2>
          <p className="text-slate-500 text-sm max-w-[280px]">
            Select a conversation from the sidebar to start chatting or create a new one.
          </p>
        </div>
      </div>
    );
  }

  const displayName = conversation.participantName || conversation.userName || conversation.name || `User ${conversation.participantId || "Unknown"}`;
  const avatarSrc = getImageUrl(conversation.participantAvatar || conversation.userAvatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  return (
    <div className="flex-1 flex flex-col bg-slate-50/30 h-full relative">
      {/* Header */}
      <div className="h-[72px] px-6 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <img src={avatarSrc} alt={displayName} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
          <div>
            <h2 className="font-semibold text-slate-800 leading-tight">{displayName}</h2>
            <span className="text-[12px] text-emerald-500 font-medium">Online</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Phone className="w-5 h-5" /></button>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Video className="w-5 h-5" /></button>
          <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Info className="w-5 h-5" /></button>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <p className="text-sm">No messages yet. Send a message to start!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            // Logic to check if message is sent by me.
            // Adjust based on how your backend indicates sender.
            const isMe = msg.senderId === currentUserId || msg.isMine === true;
            
            return (
              <div
                key={msg.id || idx}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] md:max-w-[60%] flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-[14.5px] leading-relaxed shadow-sm ${
                      isMe
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-slate-800 border border-slate-100 rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 mx-1">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form
          onSubmit={handleSend}
          className="flex items-end gap-2 max-w-4xl mx-auto relative bg-slate-50 p-1.5 rounded-3xl border border-slate-200 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all"
        >
          <button type="button" className="p-2.5 text-slate-400 hover:text-blue-500 transition-colors shrink-0">
            <Smile className="w-5 h-5" />
          </button>
          <button type="button" className="p-2.5 text-slate-400 hover:text-blue-500 transition-colors shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent py-2.5 px-2 text-sm text-slate-800 focus:outline-none"
          />
          
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2.5 rounded-full shrink-0 transition-all ${
              inputText.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
