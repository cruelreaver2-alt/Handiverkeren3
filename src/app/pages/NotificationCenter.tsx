import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Header } from "../components/Header";
import {
  Bell,
  Check,
  X,
  MessageSquare,
  FileText,
  DollarSign,
  CheckCircle,
  Settings,
  Trash2,
  Filter,
} from "lucide-react";
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

export function NotificationCenter() {
  const navigate = useNavigate();
  const userId = "customer-001"; // TODO: Get from auth

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, filter]);

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
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    if (filter === "unread") {
      setFilteredNotifications(notifications.filter((n) => !n.read));
    } else {
      setFilteredNotifications(notifications);
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
        return <FileText className="w-6 h-6 text-[#E07B3E]" />;
      case "offer_accepted":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "new_message":
        return <MessageSquare className="w-6 h-6 text-blue-600" />;
      case "payment":
        return <DollarSign className="w-6 h-6 text-green-600" />;
      default:
        return <Bell className="w-6 h-6 text-[#6B7280]" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Akkurat nå";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? "minutt" : "minutter"} siden`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? "time" : "timer"} siden`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ${days === 1 ? "dag" : "dager"} siden`;
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `${weeks} ${weeks === 1 ? "uke" : "uker"} siden`;
    }
    return date.toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-[#6B7280]">Laster varsler...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#111827] mb-2">Varsler</h1>
            <p className="text-[#6B7280]">
              {unreadCount > 0
                ? `${unreadCount} uleste ${unreadCount === 1 ? "varsel" : "varsler"}`
                : "Alle varsler er lest"}
            </p>
          </div>
          <Link
            to="/varslinger/innstillinger"
            className="flex items-center gap-2 h-10 px-4 border border-[#E5E7EB] text-[#111827] rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Innstillinger</span>
          </Link>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 sm:flex-initial h-10 px-4 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-[#17384E] text-white"
                  : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
              }`}
            >
              Alle ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex-1 sm:flex-initial h-10 px-4 rounded-lg font-medium transition-colors ${
                filter === "unread"
                  ? "bg-[#17384E] text-white"
                  : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
              }`}
            >
              Uleste ({unreadCount})
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 h-10 px-4 text-[#E07B3E] rounded-lg hover:bg-[#E07B3E]/10 transition-colors font-medium"
            >
              <Check className="w-4 h-4" />
              Merk alle som lest
            </button>
          )}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-12 text-center">
            <div className="w-16 h-16 bg-[#E5E7EB] rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-[#6B7280]" />
            </div>
            <h3 className="text-lg font-semibold text-[#111827] mb-2">
              {filter === "unread" ? "Ingen uleste varsler" : "Ingen varsler"}
            </h3>
            <p className="text-sm text-[#6B7280]">
              {filter === "unread"
                ? "Du har lest alle dine varsler"
                : "Du har ikke mottatt noen varsler ennå"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border border-[#E5E7EB] hover:shadow-md transition-shadow ${
                  !notification.read ? "border-l-4 border-l-[#E07B3E]" : ""
                }`}
              >
                <Link
                  to={notification.link || "#"}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                  }}
                  className="block p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        !notification.read ? "bg-[#E07B3E]/10" : "bg-[#F3F4F6]"
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-semibold text-[#111827] text-lg">
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Merk som lest"
                            >
                              <Check className="w-4 h-4 text-[#6B7280]" />
                            </button>
                          )}
                          <button
                            onClick={(e) => deleteNotification(notification.id, e)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Slett varsel"
                          >
                            <Trash2 className="w-4 h-4 text-[#6B7280]" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[#6B7280] mb-3">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-[#6B7280]">
                          {getTimeAgo(notification.createdAt)}
                        </span>
                        {!notification.read && (
                          <span className="flex items-center gap-1 text-[#E07B3E] font-medium">
                            <span className="w-2 h-2 bg-[#E07B3E] rounded-full"></span>
                            Ulest
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
