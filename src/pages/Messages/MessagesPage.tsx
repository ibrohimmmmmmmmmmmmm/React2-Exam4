import React, { useEffect, useState, useRef } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatArea from "./ChatArea";
import { chatService, type Conversation, type Message } from "../../services/chatService";

const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allOrganizations, setAllOrganizations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [activeOrg, setActiveOrg] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Use refs to keep latest state in the setInterval closure
  const activeConversationRef = useRef(activeConversation);
  activeConversationRef.current = activeConversation;

  // Fetch Conversations and Organizations initially
  const fetchData = async () => {
    try {
      const [convData, orgsData] = await Promise.all([
        chatService.getConversations(),
        chatService.getAllOrganizations().catch(() => []) // fallback if endpoint fails
      ]);
      const convs = Array.isArray(convData) ? convData : convData.data || [];
      const orgs = Array.isArray(orgsData) ? orgsData : orgsData.data || [];
      setConversations(convs);
      setAllOrganizations(orgs);
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

  // Polling logic - 3 seconds interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Refresh active conversation's messages
      if (activeConversationRef.current) {
        fetchMessages(activeConversationRef.current.id, true);
      }
      // Optionally refresh conversations list to show new last messages
      chatService.getConversations().then(data => {
        const convs = Array.isArray(data) ? data : data.data || [];
        setConversations(convs);
      }).catch(() => {});
    }, 3000);

    return () => clearInterval(intervalId);
  }, []); // Run on mount

  const handleSelectOrganization = async (org: any) => {
    setActiveOrg(org);
    // Find existing conversation with the organization's owner
    const existingConv = conversations.find(
      (c) => c.participantId === org.ownerId || c.senderId === org.ownerId || c.receiverId === org.ownerId
    );

    if (existingConv) {
      setActiveConversation(existingConv);
      setMessages([]);
      fetchMessages(existingConv.id);
    } else {
      // Create new conversation
      try {
        const newConvData = await chatService.createConversation(org.ownerId);
        const newConv = newConvData.data || newConvData;
        setConversations(prev => [...prev, newConv]);
        setActiveConversation(newConv);
        setMessages([]);
      } catch (error) {
        console.error("Failed to create conversation:", error);
        // Fallback: create a dummy conversation state so user can send first message
        const dummyConv = { id: Date.now(), participantId: org.ownerId, participantName: org.name };
        setActiveConversation(dummyConv);
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

    try {
      await chatService.sendMessage({
        conversationId: activeConversation.id,
        content: text,
        receiverId: activeOrg?.ownerId, // just in case the backend needs it for a new conversation
      });
      // Do not refetch here, let the 3-second polling do it or manually refetch
      fetchMessages(activeConversation.id, true);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Revert optimistic update on failure
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
    }
  };

  return (
    <div className="w-full h-[calc(100vh-60px)] bg-white flex overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        allOrganizations={allOrganizations}
        activeConversation={activeConversation}
        onSelectOrganization={handleSelectOrganization}
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
