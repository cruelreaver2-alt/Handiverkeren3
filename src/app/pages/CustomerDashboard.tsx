import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Header } from "../components/Header";
import {
  Plus,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface DashboardStats {
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  totalOffers: number;
  unreadMessages: number;
  awaitingApproval: number;
}

interface RecentRequest {
  id: string;
  title: string;
  category: string;
  status: string;
  offers: number;
  createdAt: string;
}

export function CustomerDashboard() {
  const navigate = useNavigate();
  const customerId = "customer-001"; // TODO: Get from auth
  
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    totalOffers: 0,
    unreadMessages: 0,
    awaitingApproval: 0,
  });
  
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load requests
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/requests?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const requests = data.requests || [];

        // Calculate stats
        const activeCount = requests.filter(
          (r: any) => r.status === "waiting" || r.status === "active"
        ).length;
        const completedCount = requests.filter((r: any) => r.status === "completed").length;
        const totalOffersCount = requests.reduce((acc: number, r: any) => acc + (r.offers?.length || 0), 0);
        const awaitingCount = requests.filter((r: any) => r.status === "quote_accepted").length;

        setStats({
          totalRequests: requests.length,
          activeRequests: activeCount,
          completedRequests: completedCount,
          totalOffers: totalOffersCount,
          unreadMessages: 3, // TODO: Calculate from messages
          awaitingApproval: awaitingCount,
        });

        // Set recent requests (top 5)
        setRecentRequests(requests.slice(0, 5));
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Aktive forespørsler",
      value: stats.activeRequests,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/mine-forespørsler",
    },
    {
      title: "Totale tilbud",
      value: stats.totalOffers,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/mine-forespørsler",
    },
    {
      title: "Uleste meldinger",
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: "text-[#E07B3E]",
      bgColor: "bg-orange-50",
      link: "/meldinger",
    },
    {
      title: "Fullførte jobber",
      value: stats.completedRequests,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/mine-forespørsler",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-[#6B7280]">Laster dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Velkommen tilbake! 👋
          </h1>
          <p className="text-[#6B7280]">
            Her er en oversikt over dine forespørsler og tilbud
          </p>
          <div className="flex gap-3 mt-4">
            <Link
              to={`/kunde/${customerId}`}
              className="h-10 px-4 border border-[#E5E7EB] text-[#111827] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              👤 Min profil
            </Link>
            <Link
              to="/rediger-kundeprofil"
              className="h-10 px-4 bg-[#17384E] text-white rounded-lg hover:bg-[#1a4459] transition-colors flex items-center gap-2"
            >
              ✏️ Rediger profil
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate("/opprett-forespørsel")}
            className="h-24 bg-[#E07B3E] text-white rounded-lg p-6 flex items-center gap-4 hover:bg-[#d16f35] transition-colors"
          >
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg">Ny forespørsel</div>
              <div className="text-sm text-white/80">Få tilbud fra fagfolk</div>
            </div>
          </button>

          <button
            onClick={() => navigate("/meldinger")}
            className="h-24 bg-white rounded-lg p-6 flex items-center gap-4 hover:shadow-lg transition-shadow border border-[#E5E7EB]"
          >
            <div className="w-12 h-12 bg-[#17384E]/10 rounded-lg flex items-center justify-center relative">
              <MessageSquare className="w-6 h-6 text-[#17384E]" />
              {stats.unreadMessages > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {stats.unreadMessages}
                </div>
              )}
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg text-[#111827]">Meldinger</div>
              <div className="text-sm text-[#6B7280]">
                {stats.unreadMessages} uleste
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/mine-forespørsler")}
            className="h-24 bg-white rounded-lg p-6 flex items-center gap-4 hover:shadow-lg transition-shadow border border-[#E5E7EB]"
          >
            <div className="w-12 h-12 bg-[#17384E]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#17384E]" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg text-[#111827]">Mine forespørsler</div>
              <div className="text-sm text-[#6B7280]">Se alle forespørsler</div>
            </div>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={index}
                to={card.link}
                className="bg-white rounded-lg p-6 border border-[#E5E7EB] hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-[#111827] mb-1">{card.value}</div>
                <div className="text-sm text-[#6B7280]">{card.title}</div>
              </Link>
            );
          })}
        </div>

        {/* Awaiting Approval Alert */}
        {stats.awaitingApproval > 0 && (
          <div className="bg-[#FEF3E2] border border-[#E07B3E]/20 rounded-lg p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-[#E07B3E] flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-[#111827] mb-2">
                {stats.awaitingApproval} jobb{stats.awaitingApproval > 1 ? "er" : ""} venter på godkjenning
              </h3>
              <p className="text-sm text-[#6B7280] mb-4">
                Du har godtatt tilbud på {stats.awaitingApproval} jobb{stats.awaitingApproval > 1 ? "er" : ""}.
                Gå til "Mine forespørsler" for å betale til sperret konto.
              </p>
              <button
                onClick={() => navigate("/mine-forespørsler")}
                className="h-10 px-4 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
              >
                Gå til forespørsler
              </button>
            </div>
          </div>
        )}

        {/* Recent Requests */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#111827]">Siste forespørsler</h2>
            <Link
              to="/mine-forespørsler"
              className="text-sm text-[#E07B3E] hover:underline"
            >
              Se alle
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#E07B3E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#E07B3E]" />
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">
                Ingen forespørsler ennå
              </h3>
              <p className="text-sm text-[#6B7280] mb-6">
                Opprett din første forespørsel for å komme i gang
              </p>
              <button
                onClick={() => navigate("/opprett-forespørsel")}
                className="h-12 px-6 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Opprett forespørsel
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => navigate(`/forespørsel/${request.id}`)}
                  className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-[#E07B3E] bg-[#E07B3E]/10 px-2 py-1 rounded">
                        {request.category}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          request.status === "waiting"
                            ? "bg-yellow-100 text-yellow-700"
                            : request.status === "active"
                            ? "bg-blue-100 text-blue-700"
                            : request.status === "quote_accepted"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {request.status === "waiting"
                          ? "Venter på tilbud"
                          : request.status === "active"
                          ? "Aktiv"
                          : request.status === "quote_accepted"
                          ? "Tilbud godtatt"
                          : "Fullført"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[#111827] mb-1">{request.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(request.createdAt).toLocaleDateString("nb-NO")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{request.offers} tilbud</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}