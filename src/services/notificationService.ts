import type { NetworkUser } from "./networkService";

export interface MockNotification {
  id: string;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  receiverId: number;
  type: "connection_request" | "message";
  status: "pending" | "accepted" | "declined" | "unread" | "read";
  createdAt: string;
}

// In-memory/localStorage mockup for notifications and connections
type Listener = (notifications: MockNotification[]) => void;
const listeners: Listener[] = [];

export const notificationService = {
  subscribe: (listener: Listener) => {
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx > -1) listeners.splice(idx, 1);
    };
  },

  notifyListeners: () => {
    const notifs = notificationService.getNotifications();
    listeners.forEach(l => l(notifs));
  },

  getNotifications: (): MockNotification[] => {
    try {
      return JSON.parse(localStorage.getItem("mock_notifications") || "[]");
    } catch {
      return [];
    }
  },

  sendConnectionRequest: (sender: NetworkUser, receiverId: number) => {
    const notifications = notificationService.getNotifications();
    
    // Check if already sent
    const existing = notifications.find(
      (n) => n.senderId === sender.id && n.receiverId === receiverId && n.type === "connection_request"
    );
    if (existing) return; // already sent

    const newNotification: MockNotification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      senderId: sender.id,
      senderName: `${sender.firstName || ''} ${sender.lastName || ''}`.trim() || sender.userName,
      senderAvatar: sender.avatar,
      receiverId: receiverId,
      type: "connection_request",
      status: "pending",
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("mock_notifications", JSON.stringify([...notifications, newNotification]));
    notificationService.notifyListeners();
  },

  sendMessageNotification: (senderId: number, senderName: string, receiverId: number, content: string) => {
    const notifications = notificationService.getNotifications();
    const newNotification: MockNotification = {
      id: `msg-notif-${Date.now()}-${Math.random()}`,
      senderId,
      senderName,
      receiverId,
      type: "message",
      status: "unread",
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("mock_notifications", JSON.stringify([...notifications, newNotification]));
    notificationService.notifyListeners();
  },

  acceptConnection: (notificationId: string) => {
    const notifications = notificationService.getNotifications();
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, status: "accepted" as const } : n
    );
    localStorage.setItem("mock_notifications", JSON.stringify(updated));
    notificationService.notifyListeners();

    // Update connections list
    const notif = notifications.find(n => n.id === notificationId);
    if (notif) {
      notificationService.addConnection(notif.senderId, notif.receiverId);
    }
  },

  declineConnection: (notificationId: string) => {
    const notifications = notificationService.getNotifications();
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, status: "declined" as const } : n
    );
    localStorage.setItem("mock_notifications", JSON.stringify(updated));
    notificationService.notifyListeners();
  },

  markAllAsRead: (receiverId: number) => {
    const notifications = notificationService.getNotifications();
    const updated = notifications.map(n => 
      n.receiverId === receiverId && n.status === "unread" ? { ...n, status: "read" as const } : n
    );
    localStorage.setItem("mock_notifications", JSON.stringify(updated));
    notificationService.notifyListeners();
  },

  getUnreadCount: (receiverId: number): number => {
    return notificationService.getNotifications().filter(n => n.receiverId === receiverId && n.status === "unread").length;
  },

  addConnection: (userA: number, userB: number) => {
    const connections = notificationService.getConnections();
    const newConnections = [...connections, { userA, userB }];
    localStorage.setItem("mock_connections", JSON.stringify(newConnections));
  },

  getConnections: (): { userA: number, userB: number }[] => {
    try {
      return JSON.parse(localStorage.getItem("mock_connections") || "[]");
    } catch {
      return [];
    }
  },
  
  getUserConnections: (userId: number): number[] => {
    const connections = notificationService.getConnections();
    return connections
      .filter(c => c.userA === userId || c.userB === userId)
      .map(c => c.userA === userId ? c.userB : c.userA);
  },

  getPendingSentRequests: (senderId: number): number[] => {
    return notificationService.getNotifications()
      .filter(n => n.senderId === senderId && n.type === "connection_request" && n.status === "pending")
      .map(n => n.receiverId);
  }
};
