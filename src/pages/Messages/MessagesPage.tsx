import React, { useEffect, useState, useRef } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatArea from "./ChatArea";
import { chatService, type Conversation, type Message } from "../../services/chatService";
import { fetchCurrentUser } from "../../services/profileService";
import { notificationService } from "../../services/notificationService";
import { networkService, type NetworkUser } from "../../services/networkService";

const getOtherUserId = (c: any, myId: number) => {
  if (c.user1Id && c.user1Id !== myId) return c.user1Id;
  if (c.user2Id && c.user2Id !== myId) return c.user2Id;
  if (c.participantId && c.participantId !== myId) return c.participantId;
  if (c.otherUserId && c.otherUserId !== myId) return c.otherUserId;
  if (c.receiverId && c.receiverId !== myId) return c.receiverId;
  if (c.senderId && c.senderId !== myId) return c.senderId;
  
  if (c.otherUser && c.otherUser.id) return c.otherUser.id;
  if (c.participant && c.participant.id) return c.participant.id;
  
  // Fallback: look for any key ending in 'Id' that isn't 'id' and isn't myId
  for (const key in c) {
    if (key.toLowerCase().endsWith('id') && key !== 'id' && c[key] !== myId && typeof c[key] === 'number') {
      return c[key];
    }
  }
  return c.participantId || c.otherUserId || c.receiverId;
};

const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Use refs to keep latest state in the setInterval closure
  const activeConversationRef = useRef(activeConversation);
  activeConversationRef.current = activeConversation;
  
  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;

  // Fetch Conversations initially
  const fetchData = async () => {
    try {
      // Attempt to get current user to use as Sender for notifications and to identify 'otherUser'
      let myId = 1;
      try {
        const res = await fetchCurrentUser();
        setCurrentUser(res.data);
        myId = res.data?.id || 1;
      } catch {
        const dummyUser = { id: 1, firstName: "Me", lastName: "(Candidate)" };
        setCurrentUser(dummyUser);
        myId = dummyUser.id;
      }

      const [convData, usersData] = await Promise.all([
        chatService.getConversations(),
        networkService.getDirectory().catch(() => [])
      ]);
      const convs = Array.isArray(convData) ? convData : convData.data || [];
      const allUsers = Array.isArray(usersData) ? usersData : usersData.data || [];

      // Enrich conversations with user names and avatars
      const enrichedConvs = convs.map((c: any) => {
        const targetUserId = getOtherUserId(c, myId);
        const matchedUser = allUsers.find((u: any) => u.id === targetUserId);
        
        if (matchedUser) {
          const name = `${matchedUser.firstName || ''} ${matchedUser.lastName || ''}`.trim() || matchedUser.userName;
          return {
            ...c,
            participantId: targetUserId,
            participantName: name,
            participantAvatar: matchedUser.avatar
          };
        }
        return { ...c, participantId: targetUserId };
      });

      setConversations(enrichedConvs);

    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch Messages for active conversation
  const fetchMessages = async (conversationId: number, isPolling = false) => {
    if (!isPolling) setLoadingMessages(true);
    try {
      const data = await chatService.getMessages(conversationId);
      const msgs = Array.isArray(data) ? data : data.data || [];
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      if (!isPolling) setLoadingMessages(false);
    }
  };

  // Polling logic - 3 seconds interval for real-time feel
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Refresh active conversation's messages
      if (activeConversationRef.current) {
        fetchMessages(activeConversationRef.current.id, true);
      }
      
      const myId = currentUserRef.current?.id || 1;
      // Optionally refresh conversations list to show new last messages
      Promise.all([
        chatService.getConversations(),
        networkService.getDirectory().catch(() => [])
      ]).then(([convData, usersData]) => {
        const convs = Array.isArray(convData) ? convData : convData.data || [];
        const allUsers = Array.isArray(usersData) ? usersData : usersData.data || [];
        
        const enrichedConvs = convs.map((c: any) => {
          const targetUserId = getOtherUserId(c, myId);
          const matchedUser = allUsers.find((u: any) => u.id === targetUserId);
          if (matchedUser) {
            const name = `${matchedUser.firstName || ''} ${matchedUser.lastName || ''}`.trim() || matchedUser.userName;
            return {
              ...c,
              participantId: targetUserId,
              participantName: name,
              participantAvatar: matchedUser.avatar
            };
          }
          return { ...c, participantId: targetUserId };
        });
        setConversations(enrichedConvs);
      }).catch(() => {});
    }, 3000);

    return () => clearInterval(intervalId);
  }, []); // Run on mount

  const handleSelectConversation = async (userOrConv: NetworkUser | Conversation) => {
    const isConv = "participantId" in userOrConv && "id" in userOrConv && !("email" in userOrConv);
    
    if (isConv) {
      const conv = userOrConv as Conversation;
      setActiveConversation(conv);
      setMessages([]);
      fetchMessages(conv.id);
    } else {
      const targetUser = userOrConv as NetworkUser;
      // Check if we already have a conversation with this user
      const existingConv = conversations.find(
        (c) => c.participantId === targetUser.id || getOtherUserId(c, currentUser?.id || 1) === targetUser.id
      );

      if (existingConv) {
        setActiveConversation(existingConv);
        setMessages([]);
        fetchMessages(existingConv.id);
      } else {
        // Mock creating a new conversation locally until first message is sent
        const newDummyConv: Conversation = {
          id: Date.now(),
          participantId: targetUser.id,
          participantName: `${targetUser.firstName || ''} ${targetUser.lastName || ''}`.trim() || targetUser.userName,
          participantAvatar: targetUser.avatar,
        };
        
        // We do NOT add dummy to `conversations` list yet until a message is sent to avoid breaking the backend fetching.
        // Just set it as active so the user can type the first message.
        setActiveConversation(newDummyConv);
        setMessages([]);
      }
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!activeConversation) return;

    // Optimistic UI update
    const tempMessage: Message = {
      id: Date.now(), // temporary id
      conversationId: activeConversation.id,
      content: text,
      createdAt: new Date().toISOString(),
      isMine: true, // Custom flag to help UI know it's ours until next poll
    };
    setMessages((prev) => [...prev, tempMessage]);

    // Send mock notification to the receiver
    if (activeConversation.participantId) {
      let senderName = "Me (Candidate)";
      if (currentUser && (currentUser.firstName || currentUser.lastName || currentUser.userName)) {
         senderName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.userName;
      }
      
      notificationService.sendMessageNotification(
        currentUser?.id || 1,
        senderName,
        activeConversation.participantId,
        text
      );
    }

    try {
      let currentConvId = activeConversation.id;

      // If it's a dummy conversation (started from new user search), we need to create it first
      if (!conversations.find(c => c.id === currentConvId)) {
        try {
           const newConvData = await chatService.createConversation(activeConversation.participantId!);
           const realConv = newConvData.data || newConvData;
           currentConvId = realConv.id;
           
           // Ensure it has participant data for immediate render
           realConv.participantId = activeConversation.participantId;
           realConv.participantName = activeConversation.participantName;
           realConv.participantAvatar = activeConversation.participantAvatar;
           
           setConversations(prev => [...prev, realConv]);
           setActiveConversation(realConv);
        } catch(err) {
           console.warn("Could not create real conversation on backend, proceeding with local mock:", err);
        }
      }

      await chatService.sendMessage({
        conversationId: currentConvId,
        content: text,
        receiverId: activeConversation.participantId,
      });

      // Fetch immediately to replace optimistic message with real message
      fetchMessages(currentConvId, true);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Revert optimistic update on failure (only if it wasn't a mock fallback success)
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
    }
  };

  return (
    <div className="w-full h-[calc(100vh-60px)] bg-white flex overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onSelectConversation={handleSelectConversation}
        isLoading={loadingConversations}
      />
      
      <ChatArea
        conversation={activeConversation}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={loadingMessages}
      />
    </div>
  );
};

export default MessagesPage;
