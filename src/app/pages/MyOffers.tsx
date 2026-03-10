import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import {
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  MessageSquare,
  Filter,
  TrendingUp,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Offer {
  id: string;
  requestId: string;
  requestTitle: string;
  price: number;
  description: string;
  timeline: string;
  warranty: string;
  status: string;
  createdAt: string;
  paymentOption: string;
  depositPercentage: number;
}

export function MyOffers() {
  const navigate = useNavigate();
  const supplierId = "supplier-001"; // TODO: Get from auth

  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    filterOffers();
  }, [offers, statusFilter]);

  const loadOffers = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/offers?supplierId=${supplierId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load offers");
      }

      const data = await response.json();
      setOffers(data.offers || []);
    } catch (error) {
      console.error("Error loading offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOffers = () => {
    if (statusFilter === "all") {
      setFilteredOffers(offers);
    } else {
      setFilteredOffers(offers.filter((offer) => offer.status === statusFilter));
    }
  };

  const stats = {
    total: offers.length,
    pending: offers.filter((o) => o.status === "pending").length,
    accepted: offers.filter((o) => o.status === "accepted").length,
    rejected: offers.filter((o) => o.status === "rejected").length,
    totalValue: offers.reduce((sum, o) => sum + o.price, 0),
    acceptedValue: offers
      .filter((o) => o.status === "accepted")
      .reduce((sum, o) => sum + o.price, 0),
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Venter på svar",
          color: "text-yellow-700",
          bg: "bg-yellow-100",
          icon: Clock,
        };
      case "accepted":
        return {
          label: "Godkjent",
          color: "text-green-700",
          bg: "bg-green-100",
          icon: CheckCircle,
        };
      case "rejected":
        return {
          label: "Avvist",
          color: "text-red-700",
          bg: "bg-red-100",
          icon: XCircle,
        };
      default:
        return {
          label: status,
          color: "text-gray-700",
          bg: "bg-gray-100",
          icon: Clock,
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-[#6B7280]">Laster tilbud...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">Mine tilbud</h1>
          <p className="text-[#6B7280]">
            Oversikt over alle tilbud du har sendt til kunder
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6B7280]">Totalt sendt</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-[#111827]">{stats.total}</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6B7280]">Venter på svar</span>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-[#111827]">{stats.pending}</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6B7280]">Godkjent</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-[#111827]">{stats.accepted}</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6B7280]">Total verdi</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-[#111827]">
              {stats.acceptedValue.toLocaleString("nb-NO")} kr
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              Av {stats.totalValue.toLocaleString("nb-NO")} kr totalt
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-2 mb-6 flex gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`flex-1 h-10 rounded-lg font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-[#17384E] text-white"
                : "text-[#6B7280] hover:bg-[#F3F4F6]"
            }`}
          >
            Alle ({stats.total})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`flex-1 h-10 rounded-lg font-medium transition-colors ${
              statusFilter === "pending"
                ? "bg-yellow-600 text-white"
                : "text-[#6B7280] hover:bg-[#F3F4F6]"
            }`}
          >
            Venter ({stats.pending})
          </button>
          <button
            onClick={() => setStatusFilter("accepted")}
            className={`flex-1 h-10 rounded-lg font-medium transition-colors ${
              statusFilter === "accepted"
                ? "bg-green-600 text-white"
                : "text-[#6B7280] hover:bg-[#F3F4F6]"
            }`}
          >
            Godkjent ({stats.accepted})
          </button>
          <button
            onClick={() => setStatusFilter("rejected")}
            className={`flex-1 h-10 rounded-lg font-medium transition-colors ${
              statusFilter === "rejected"
                ? "bg-red-600 text-white"
                : "text-[#6B7280] hover:bg-[#F3F4F6]"
            }`}
          >
            Avvist ({stats.rejected})
          </button>
        </div>

        {/* Offers List */}
        {filteredOffers.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-12 text-center">
            <div className="w-16 h-16 bg-[#E07B3E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-[#E07B3E]" />
            </div>
            <h3 className="text-lg font-semibold text-[#111827] mb-2">
              Ingen tilbud funnet
            </h3>
            <p className="text-sm text-[#6B7280] mb-6">
              {statusFilter === "all"
                ? "Du har ikke sendt noen tilbud ennå"
                : `Du har ingen tilbud med status "${statusFilter}"`}
            </p>
            {statusFilter === "all" && (
              <button
                onClick={() => navigate("/tilgjengelige-jobber")}
                className="h-12 px-6 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
              >
                Finn jobber
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOffers.map((offer) => {
              const statusConfig = getStatusConfig(offer.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-lg border border-[#E5E7EB] p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${statusConfig.bg} ${statusConfig.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                        <span className="text-xs text-[#6B7280]">
                          {new Date(offer.createdAt).toLocaleDateString("nb-NO", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#111827] mb-2">
                        {offer.requestTitle}
                      </h3>
                      <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">
                        {offer.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{offer.timeline}</span>
                        </div>
                        {offer.warranty && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>{offer.warranty}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-[#17384E] mb-1">
                        {offer.price.toLocaleString("nb-NO")} kr
                      </div>
                      <div className="text-xs text-[#6B7280]">Inkl. mva</div>
                      {offer.paymentOption === "upfront" && (
                        <div className="text-xs text-[#E07B3E] mt-1">
                          Forskudd: {offer.depositPercentage}%
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                    <button
                      onClick={() => navigate(`/forespørsel/${offer.requestId}`)}
                      className="flex-1 h-10 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Se detaljer
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/meldinger?requestId=${offer.requestId}`
                        )
                      }
                      className="flex-1 h-10 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Send melding
                    </button>
                  </div>

                  {/* Status-specific messages */}
                  {offer.status === "pending" && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                      💡 Tips: Send en melding til kunden for å øke sjansen for å få
                      jobben
                    </div>
                  )}
                  {offer.status === "accepted" && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                      🎉 Gratulerer! Kunden har godkjent tilbudet ditt. Avtal oppstart
                      via chat.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
