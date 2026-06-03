import { UserPlus } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { networkService, type NetworkUser } from "../../services/networkService";
import { notificationService } from "../../services/notificationService";
import { fetchCurrentUser } from "../../services/profileService";

export default memo(function NetworkPage() {
  const [activeTab, setActiveTab] = useState<"discover" | "pending" | "connections">("discover");
  const [users, setUsers] = useState<NetworkUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Local state to mock connections via unified notification service
  const [pendingIds, setPendingIds] = useState<number[]>([]);
  const [connectionIds, setConnectionIds] = useState<number[]>([]);
  const [currentUser, setCurrentUser] = useState<NetworkUser | null>(null);

  const loadLocalState = useCallback((currentUserId: number) => {
    setPendingIds(notificationService.getPendingSentRequests(currentUserId));
    setConnectionIds(notificationService.getUserConnections(currentUserId));
  }, []);

  useEffect(() => {
    // Attempt to get current user to use as Sender. Fallback to mock user ID 1
    fetchCurrentUser()
      .then(res => {
        const user = res.data;
        setCurrentUser(user);
        loadLocalState(user.id || 1);
      })
      .catch(() => {
        const fallbackUser = { id: 1, userName: "Me (Candidate)" } as NetworkUser;
        setCurrentUser(fallbackUser);
        loadLocalState(1);
      });

    // Fetch users
    networkService.getDirectory()
      .then((data) => setUsers(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [loadLocalState]);

  // Polling to sync state if we switch tabs and accept a notification
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => loadLocalState(currentUser.id || 1), 2000);
    return () => clearInterval(interval);
  }, [currentUser, loadLocalState]);

  const handleConnect = useCallback((targetUser: NetworkUser) => {
    if (!currentUser) return;
    
    if (!pendingIds.includes(targetUser.id)) {
      notificationService.sendConnectionRequest(currentUser, targetUser.id);
      loadLocalState(currentUser.id || 1);
      alert(`Connection request sent to ${targetUser.firstName || targetUser.userName}! They can accept it in the Notifications page.`);
    }
  }, [pendingIds, currentUser, loadLocalState]);

  // Derived state
  const discoverUsers = users.filter(u => !pendingIds.includes(u.id) && !connectionIds.includes(u.id) && u.id !== currentUser?.id);
  const pendingUsers = users.filter(u => pendingIds.includes(u.id));
  const connectedUsers = users.filter(u => connectionIds.includes(u.id));

  // Helper to get initials
  const getInitials = (user: NetworkUser) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.userName?.substring(0, 2).toUpperCase() || "U";
  };

  const getAvatarColor = (id: number) => {
    const colors = ["bg-orange-500", "bg-green-600", "bg-red-500", "bg-yellow-400", "bg-slate-700", "bg-emerald-600", "bg-gray-800", "bg-olive-600", "bg-lime-200"];
    return colors[id % colors.length];
  };

  const UserCard = ({ user, type }: { user: NetworkUser, type: "discover" | "pending" | "connection" }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 ${getAvatarColor(user.id)}`}>
        {getInitials(user)}
      </div>
      <h3 className="font-semibold text-gray-900 text-lg text-center leading-tight mb-1">
        {user.firstName} {user.lastName || user.userName}
      </h3>
      <p className="text-gray-500 text-sm mb-6 text-center">{user.role || "Network Member"}</p>
      
      <div className="flex gap-3 w-full justify-center">
        {type === "discover" && (
          <button 
            onClick={() => handleConnect(user)}
            className="flex items-center gap-1.5 px-4 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            <UserPlus size={16} />
            Connect
          </button>
        )}
        
        {type === "pending" && (
          <button 
            className="flex items-center gap-1.5 px-4 py-2 text-gray-500 border border-gray-300 rounded-full bg-gray-50 cursor-default text-sm font-medium"
          >
            Pending...
          </button>
        )}

        {type === "connection" && (
          <button 
            className="flex items-center gap-1.5 px-4 py-2 text-gray-600 border border-gray-300 rounded-full bg-gray-100 cursor-default text-sm font-medium"
          >
            Connected
          </button>
        )}

        <button className="flex items-center gap-1.5 px-4 py-2 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium">
          Message
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header Area */}
        <div className="px-8 pt-8 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Network</h1>
          
          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200">
            <button 
              onClick={() => setActiveTab("discover")}
              className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === "discover" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              Discover People
              {activeTab === "discover" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
            </button>
            <button 
              onClick={() => setActiveTab("pending")}
              className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === "pending" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              Pending Invitations ({pendingIds.length})
              {activeTab === "pending" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
            </button>
            <button 
              onClick={() => setActiveTab("connections")}
              className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === "connections" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              My Connections ({connectionIds.length})
              {activeTab === "connections" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 bg-gray-50/50">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {activeTab === "discover" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {discoverUsers.length > 0 ? (
                    discoverUsers.map(user => <UserCard key={user.id} user={user} type="discover" />)
                  ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">No more people to discover.</div>
                  )}
                </div>
              )}
              
              {activeTab === "pending" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingUsers.length > 0 ? (
                    pendingUsers.map(user => <UserCard key={user.id} user={user} type="pending" />)
                  ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">No pending invitations.</div>
                  )}
                </div>
              )}

              {activeTab === "connections" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {connectedUsers.length > 0 ? (
                    connectedUsers.map(user => <UserCard key={user.id} user={user} type="connection" />)
                  ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">You have no connections yet.</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        
      </div>
    </div>
  );
});
