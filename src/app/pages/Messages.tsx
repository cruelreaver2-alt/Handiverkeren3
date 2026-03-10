import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Header } from "../components/Header";
import { Send, ArrowLeft, CheckCheck, Clock, Calculator } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Message {
  id: string;
  requestId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  requestId: string;
  requestTitle: string;
  otherUser: {
    id: string;
    name: string;
    image: string;
  };
  lastMessage?: Message;
  unreadCount: number;
}

export function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const requestId = jobId || searchParams.get("requestId");
  const userId = "customer-001"; // TODO: Get from auth

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(requestId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      // Poll for new messages every 3 seconds
      const interval = setInterval(() => {
        loadMessages(selectedConversation);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      // This is a simplified version - in production, you'd get conversations from backend
      // For now, we'll show mock data with valid demo job IDs
      setConversations([
        {
          requestId: "req-demo-001",
          requestTitle: "Nytt tak på enebolig - 150 kvm",
          otherUser: {
            id: "supplier-001",
            name: "Ole Hansen Tømrer",
            image: "https://images.unsplash.com/photo-1667922578520-61558e79aa7e?w=100",
          },
          unreadCount: 2,
        },
        {
          requestId: "req-demo-005",
          requestTitle: "Nytt bad - rørleggerarbeid",
          otherUser: {
            id: "supplier-002",
            name: "Kari Johansen Rørlegger",
            image: "https://images.unsplash.com/photo-1764328165995-0624c280a6d2?w=100",
          },
          unreadCount: 0,
        },
      ]);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (requestId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/messages?requestId=${requestId}&userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load messages");
      }

      const data = await response.json();
      setMessages(data.messages || []);

      // Mark messages as read
      for (const msg of data.messages || []) {
        if (!msg.read && msg.receiverId === userId) {
          await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/messages/${msg.id}/read`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${publicAnonKey}`,
              },
            }
          );
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const conversation = conversations.find((c) => c.requestId === selectedConversation);
    if (!conversation) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            requestId: selectedConversation,
            senderId: userId,
            receiverId: conversation.otherUser.id,
            content: newMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setNewMessage("");
      loadMessages(selectedConversation);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Kunne ikke sende melding. Prøv igjen.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectedConv = conversations.find((c) => c.requestId === selectedConversation);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-[#6B7280]">Laster meldinger...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6 h-[calc(100vh-160px)]">
          {/* Conversations List */}
          <div className="w-80 bg-white rounded-lg border border-[#E5E7EB] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-bold text-[#111827]">Meldinger</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-[#6B7280]">
                  Ingen meldinger ennå
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.requestId}
                    onClick={() => setSelectedConversation(conv.requestId)}
                    className={`p-4 border-b border-[#E5E7EB] cursor-pointer hover:bg-[#F3F4F6] transition-colors ${
                      selectedConversation === conv.requestId ? "bg-[#F3F4F6]" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <ImageWithFallback
                        src={conv.otherUser.image}
                        alt={conv.otherUser.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-[#111827] text-sm truncate">
                            {conv.otherUser.name}
                          </h3>
                          {conv.unreadCount > 0 && (
                            <div className="w-5 h-5 bg-[#E07B3E] text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                              {conv.unreadCount}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-[#6B7280] mb-1 truncate">
                          {conv.requestTitle}
                        </p>
                        {conv.lastMessage && (
                          <p className="text-xs text-[#6B7280] truncate">
                            {conv.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-white rounded-lg border border-[#E5E7EB] overflow-hidden flex flex-col">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-[#E5E7EB] flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <ImageWithFallback
                    src={selectedConv.otherUser.image}
                    alt={selectedConv.otherUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#111827]">
                      {selectedConv.otherUser.name}
                    </h3>
                    <p className="text-xs text-[#6B7280]">{selectedConv.requestTitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/bygg-tilbud/${selectedConv.requestId}`)}
                      className="flex items-center gap-2 h-9 px-4 bg-[#17384E] text-white rounded-lg hover:bg-[#1a4459] transition-colors text-sm font-medium"
                    >
                      <Calculator className="w-4 h-4" />
                      <span className="hidden sm:inline">Opprett tilbud</span>
                    </button>
                    <button
                      onClick={() => navigate(`/forespørsel/${selectedConv.requestId}`)}
                      className="text-sm text-[#E07B3E] hover:underline whitespace-nowrap"
                    >
                      Se forespørsel
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-[#6B7280]">
                      Ingen meldinger ennå. Send den første!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderId === userId;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              isMe
                                ? "bg-[#17384E] text-white"
                                : "bg-[#F3F4F6] text-[#111827]"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <div
                              className={`flex items-center gap-1 mt-1 text-xs ${
                                isMe ? "text-white/70" : "text-[#6B7280]"
                              }`}
                            >
                              <span>
                                {new Date(msg.createdAt).toLocaleTimeString("nb-NO", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {isMe && (
                                <>
                                  {msg.read ? (
                                    <CheckCheck className="w-3 h-3" />
                                  ) : (
                                    <Clock className="w-3 h-3" />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-[#E5E7EB]">
                  <div className="flex gap-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Skriv en melding..."
                      rows={1}
                      className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] resize-none"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="w-12 h-12 bg-[#E07B3E] text-white rounded-lg flex items-center justify-center hover:bg-[#d16f35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-[#6B7280]">
                Velg en samtale for å se meldinger
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}