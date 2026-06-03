import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notificationService, type MockNotification } from "../../services/notificationService";
import { Check, X, Bell } from "lucide-react";

export default memo(function NotificationsPage() {
  const [notifications, setNotifications] = useState<MockNotification[]>([]);
  const navigate = useNavigate();

  const loadNotifications = () => {
    // For demonstration, we show all notifications in the system so you can see the flow
    // In a real app, you would filter by receiverId === currentUser.id
    const allNotifs = notificationService.getNotifications();
    // Sort newest first
    allNotifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setNotifications(allNotifs);
  };

  useEffect(() => {
    loadNotifications();
    // Simple polling to update if changes happen in other tabs
    const interval = setInterval(loadNotifications, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = (id: string) => {
    notificationService.acceptConnection(id);
    loadNotifications();
  };

  const handleDecline = (id: string) => {
    notificationService.declineConnection(id);
    loadNotifications();
  };

  const pendingNotifs = notifications.filter(n => n.status === "pending");
  const pastNotifs = notifications.filter(n => n.status !== "pending");

  const NotificationCard = ({ notif }: { notif: MockNotification }) => (
    <div className={`p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-colors ${notif.status === 'pending' ? 'bg-blue-50/30' : 'bg-white'}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
          {(notif.senderName || "U").substring(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-gray-900 font-medium">
            <span className="font-bold">{notif.senderName}</span> 
            {notif.type === "connection_request" ? " wants to connect with you." : " sent you a new message."}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(notif.createdAt).toLocaleString()}
          </p>
          {notif.type === "connection_request" && notif.status === "accepted" && <span className="inline-block mt-2 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Accepted</span>}
          {notif.type === "connection_request" && notif.status === "declined" && <span className="inline-block mt-2 text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">Declined</span>}
          {notif.type === "message" && <span className="inline-block mt-2 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">New Message</span>}
        </div>
      </div>
      
      {notif.type === "connection_request" && notif.status === "pending" && (
        <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
          <button 
            onClick={() => handleAccept(notif.id)}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Check size={16} />
            Accept
          </button>
          <button 
            onClick={() => handleDecline(notif.id)}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <X size={16} />
            Decline
          </button>
        </div>
      )}

      {notif.type === "message" && (
        <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
          <button 
            onClick={() => navigate("/candidate-page/messages")}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            Open Chat
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <Bell className="text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        </div>

        <div className="flex flex-col">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              You have no notifications.
            </div>
          ) : (
            <>
              {pendingNotifs.map(notif => <NotificationCard key={notif.id} notif={notif} />)}
              {pastNotifs.map(notif => <NotificationCard key={notif.id} notif={notif} />)}
            </>
          )}
        </div>
        
      </div>
    </div>
  );
});
