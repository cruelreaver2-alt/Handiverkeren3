import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Bell, X, Check, MessageSquare, FileText, DollarSign, CheckCircle } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  icon?: string;
  createdAt: string;
  read: boolean;
}

export function NotificationBell() {
  const userId = "customer-001"; // TODO: Get from auth
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    
    // Poll for new notifications every 10 seconds
    const interval = setInterval(loadNotifications, 10000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/notifications?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const notifs = data.notifications || [];
        setNotifications(notifs.slice(0, 10)); // Show latest 10
        setUnreadCount(notifs.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        loadNotifications();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/notifications/read-all`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.ok) {
        loadNotifications();
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        loadNotifications();
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_offer":
        return <FileText className="w-5 h-5 text-[#E07B3E]" />;
      case "offer_accepted":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "new_message":
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case "payment":
        return <DollarSign className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-[#6B7280]" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Nå";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m siden`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}t siden`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d siden`;
    return date.toLocaleDateString("nb-NO");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center border border-gray-300 text-[#6B7280] rounded-lg hover:bg-gray-50 transition-colors"
        title="Varsler"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-[#E5E7EB] z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <h3 className="font-semibold text-[#111827]">
              Varsler
              {unreadCount > 0 && (
                <span className="ml-2 text-xs text-[#6B7280]">
                  ({unreadCount} uleste)
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="text-xs text-[#E07B3E] hover:underline"
                >
                  {loading ? "..." : "Merk alle som lest"}
                </button>
              )}
              <Link
                to="/varslinger"
                onClick={() => setIsOpen(false)}
                className="text-xs text-[#E07B3E] hover:underline"
              >
                Se alle
              </Link>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-[#6B7280]">
                <Bell className="w-12 h-12 mx-auto mb-3 text-[#E5E7EB]" />
                <p className="text-sm">Ingen varsler</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.link || "#"}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                    setIsOpen(false);
                  }}
                  className={`block p-4 border-b border-[#E5E7EB] hover:bg-[#F3F4F6] transition-colors ${
                    !notification.read ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-sm text-[#111827]">
                          {notification.title}
                        </h4>
                        <button
                          onClick={(e) => deleteNotification(notification.id, e)}
                          className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <X className="w-3 h-3 text-[#6B7280]" />
                        </button>
                      </div>
                      <p className="text-sm text-[#6B7280] line-clamp-2 mb-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#6B7280]">
                          {getTimeAgo(notification.createdAt)}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-[#E5E7EB]">
              <Link
                to="/varslinger"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-[#E07B3E] hover:underline"
              >
                Se alle varsler
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
