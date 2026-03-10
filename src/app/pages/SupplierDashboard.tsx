import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Header } from "../components/Header";
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Star,
  Clock,
  CheckCircle,
  FileText,
  MessageSquare,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface SupplierStats {
  totalOffers: number;
  acceptedOffers: number;
  pendingOffers: number;
  totalEarnings: number;
  averageRating: number;
  activeJobs: number;
  completedJobs: number;
  responseRate: number;
}

interface RecentOffer {
  id: string;
  requestId: string;
  requestTitle: string;
  price: number;
  status: string;
  createdAt: string;
}

export function SupplierDashboard() {
  const navigate = useNavigate();
  const supplierId = "supplier-001"; // TODO: Get from auth
  const supplierName = "Ole Hansen Tømrer"; // TODO: Get from auth

  const [stats, setStats] = useState<SupplierStats>({
    totalOffers: 0,
    acceptedOffers: 0,
    pendingOffers: 0,
    totalEarnings: 0,
    averageRating: 4.9,
    activeJobs: 0,
    completedJobs: 0,
    responseRate: 95,
  });

  const [recentOffers, setRecentOffers] = useState<RecentOffer[]>([]);
  const [availableJobsCount, setAvailableJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load offers for this supplier
      const offersResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/offers?supplierId=${supplierId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (offersResponse.ok) {
        const offersData = await offersResponse.json();
        const offers = offersData.offers || [];

        const acceptedCount = offers.filter((o: any) => o.status === "accepted").length;
        const pendingCount = offers.filter((o: any) => o.status === "pending").length;
        
        // Calculate total earnings from accepted offers
        const earnings = offers
          .filter((o: any) => o.status === "accepted")
          .reduce((sum: number, o: any) => sum + (o.price || 0), 0);

        setStats((prev) => ({
          ...prev,
          totalOffers: offers.length,
          acceptedOffers: acceptedCount,
          pendingOffers: pendingCount,
          totalEarnings: earnings,
          activeJobs: acceptedCount,
        }));

        // Set recent offers (top 5)
        setRecentOffers(offers.slice(0, 5));
      }

      // Load available jobs (requests without offers from this supplier)
      const requestsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/requests`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        const requests = requestsData.requests || [];
        
        // Filter out requests where supplier already sent an offer
        const availableRequests = requests.filter((r: any) => 
          r.status !== "completed" && r.status !== "cancelled"
        );
        
        setAvailableJobsCount(availableRequests.length);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Tilgjengelige jobber",
      value: availableJobsCount,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/tilgjengelige-jobber",
      trend: "+12% denne uken",
    },
    {
      title: "Sendte tilbud",
      value: stats.pendingOffers,
      icon: Clock,
      color: "text-[#E07B3E]",
      bgColor: "bg-orange-50",
      link: "/mine-tilbud",
      trend: `${stats.pendingOffers} venter på svar`,
    },
    {
      title: "Aktive jobber",
      value: stats.activeJobs,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/mine-tilbud",
      trend: `${stats.acceptedOffers} godkjente`,
    },
    {
      title: "Total inntjening",
      value: `${stats.totalEarnings.toLocaleString("nb-NO")} kr`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/mine-tilbud",
      trend: "Denne måneden",
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
            Velkommen tilbake, {supplierName.split(" ")[0]}! 👋
          </h1>
          <p className="text-[#6B7280]">
            Her er en oversikt over dine tilbud og tilgjengelige jobber
          </p>
          <div className="flex gap-3 mt-4">
            <Link
              to={`/leverandør/${supplierId}`}
              className="h-10 px-4 border border-[#E5E7EB] text-[#111827] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              👤 Se min profil
            </Link>
            <Link
              to="/rediger-profil"
              className="h-10 px-4 bg-[#17384E] text-white rounded-lg hover:bg-[#1a4459] transition-colors flex items-center gap-2"
            >
              ✏️ Rediger profil
            </Link>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-[#E5E7EB] flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#111827]">{stats.averageRating}</div>
              <div className="text-sm text-[#6B7280]">Gjennomsnitt rating</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-[#E5E7EB] flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#111827]">{stats.responseRate}%</div>
              <div className="text-sm text-[#6B7280]">Svar-rate</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-[#E5E7EB] flex items-center gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#111827]">{stats.completedJobs}</div>
              <div className="text-sm text-[#6B7280]">Fullførte jobber</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-[#E5E7EB] flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#111827]">3</div>
              <div className="text-sm text-[#6B7280]">Uleste meldinger</div>
            </div>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Find New Jobs */}
          <div className="bg-gradient-to-br from-[#17384E] to-[#1a4459] rounded-lg p-8 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Finn nye jobber</h2>
            <p className="text-white/80 mb-6">
              {availableJobsCount} tilgjengelige jobber i ditt område
            </p>
            <button
              onClick={() => navigate("/tilgjengelige-jobber")}
              className="h-12 px-6 bg-white text-[#17384E] rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Se alle jobber
            </button>
          </div>

          {/* Manage Offers */}
          <div className="bg-gradient-to-br from-[#E07B3E] to-[#d16f35] rounded-lg p-8 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Mine tilbud</h2>
            <p className="text-white/80 mb-6">
              {stats.pendingOffers} tilbud venter på svar fra kunder
            </p>
            <button
              onClick={() => navigate("/mine-tilbud")}
              className="h-12 px-6 bg-white text-[#E07B3E] rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Administrer tilbud
            </button>
          </div>
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
                </div>
                <div className="text-3xl font-bold text-[#111827] mb-1">
                  {card.value}
                </div>
                <div className="text-sm text-[#6B7280] mb-2">{card.title}</div>
                <div className="text-xs text-green-600">{card.trend}</div>
              </Link>
            );
          })}
        </div>

        {/* Pending Offers Alert */}
        {stats.pendingOffers > 0 && (
          <div className="bg-[#FEF3E2] border border-[#E07B3E]/20 rounded-lg p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-[#E07B3E] flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-[#111827] mb-2">
                {stats.pendingOffers} tilbud venter på svar
              </h3>
              <p className="text-sm text-[#6B7280] mb-4">
                Du har sendt {stats.pendingOffers} tilbud som venter på godkjenning fra kunder.
                Følg opp med en melding for å øke sjansen for å få jobben!
              </p>
              <button
                onClick={() => navigate("/mine-tilbud")}
                className="h-10 px-4 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
              >
                Se mine tilbud
              </button>
            </div>
          </div>
        )}

        {/* Recent Offers */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#111827]">Siste tilbud</h2>
            <Link to="/mine-tilbud" className="text-sm text-[#E07B3E] hover:underline">
              Se alle
            </Link>
          </div>

          {recentOffers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#E07B3E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#E07B3E]" />
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">
                Ingen tilbud sendt ennå
              </h3>
              <p className="text-sm text-[#6B7280] mb-6">
                Begynn å sende tilbud på tilgjengelige jobber for å øke inntjeningen
              </p>
              <button
                onClick={() => navigate("/tilgjengelige-jobber")}
                className="h-12 px-6 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors inline-flex items-center gap-2"
              >
                <Briefcase className="w-5 h-5" />
                Se tilgjengelige jobber
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOffers.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => navigate(`/forespørsel/${offer.requestId}`)}
                  className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          offer.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : offer.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {offer.status === "pending"
                          ? "Venter på svar"
                          : offer.status === "accepted"
                          ? "Godkjent"
                          : "Avvist"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[#111827] mb-1">
                      {offer.requestTitle}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(offer.createdAt).toLocaleDateString("nb-NO")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{offer.price.toLocaleString("nb-NO")} kr</span>
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