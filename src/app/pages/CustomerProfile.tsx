import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Header } from "../components/Header";
import {
  Star,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle,
  Mail,
  Phone,
  MessageSquare,
  Settings,
  Shield,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface CustomerProfile {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  location: string;
  memberSince: string;
  email?: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
}

interface Request {
  id: string;
  title: string;
  category: string;
  status: string;
  budget: number;
  createdAt: string;
  offersCount?: number;
}

interface GivenReview {
  id: string;
  supplierId: string;
  supplierName: string;
  rating: number;
  comment: string;
  jobTitle: string;
  createdAt: string;
}

export function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUserId = "customer-001"; // TODO: Get from auth

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [reviews, setReviews] = useState<GivenReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"requests" | "reviews">("requests");

  const isOwnProfile = id === currentUserId;

  useEffect(() => {
    loadProfileData();
  }, [id]);

  const loadProfileData = async () => {
    try {
      // Load customer profile
      const profileResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/profiles/customer/${id}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);
      }

      // Load customer requests
      const requestsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/requests?customerId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setRequests(requestsData.requests || []);
      }

      // Load reviews given by this customer
      const allReviews = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/reviews`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (allReviews.ok) {
        const reviewsData = await allReviews.json();
        // Filter reviews by this customer (we'd need to add customerId to reviews)
        // For now, we'll show all reviews as demo
        setReviews(reviewsData.reviews?.slice(0, 3) || []);
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-[#6B7280]">Laster profil...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#111827] mb-2">
              Profil ikke funnet
            </h2>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-[#E07B3E] hover:underline"
            >
              Gå tilbake
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeRequests = requests.filter((r) => r.status === "open" || r.status === "pending");
  const completedRequests = requests.filter((r) => r.status === "completed");

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      {/* Header Background */}
      <div className="h-48 bg-gradient-to-r from-[#17384E] to-[#1a4459]" />

      <div className="max-w-5xl mx-auto px-4 -mt-24 pb-12">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-[#17384E]">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-3xl font-bold text-[#111827] mb-1">
                    {profile.name}
                  </h1>
                  {profile.bio && (
                    <p className="text-[#6B7280]">{profile.bio}</p>
                  )}
                </div>
                {isOwnProfile && (
                  <Link
                    to="/rediger-kundeprofil"
                    className="flex items-center gap-2 h-10 px-4 border border-[#E5E7EB] text-[#111827] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Rediger</span>
                  </Link>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-[#6B7280]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{profile.location}</span>
                </div>
                <div className="flex items-center gap-1 text-[#6B7280]">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Medlem siden {profile.memberSince}</span>
                </div>
                <div className="flex items-center gap-1 text-[#6B7280]">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">
                    {profile.totalRequests} {profile.totalRequests === 1 ? "forespørsel" : "forespørsler"}
                  </span>
                </div>
              </div>

              {/* Verification Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.emailVerified && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>E-post verifisert</span>
                  </div>
                )}
                {profile.phoneVerified && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Telefon verifisert</span>
                  </div>
                )}
              </div>

              {/* Contact Info (only visible to suppliers or own profile) */}
              {isOwnProfile && (
                <div className="flex flex-wrap gap-3 pt-3 border-t border-[#E5E7EB]">
                  {profile.email && (
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Actions for non-own profiles */}
              {!isOwnProfile && (
                <div className="flex gap-3 pt-3 border-t border-[#E5E7EB]">
                  <Link
                    to="/meldinger"
                    className="h-10 px-4 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send melding
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] mb-6">
              <div className="flex border-b border-[#E5E7EB]">
                <button
                  onClick={() => setActiveTab("requests")}
                  className={`flex-1 h-14 font-semibold transition-colors ${
                    activeTab === "requests"
                      ? "text-[#E07B3E] border-b-2 border-[#E07B3E]"
                      : "text-[#6B7280] hover:text-[#111827]"
                  }`}
                >
                  Forespørsler ({requests.length})
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex-1 h-14 font-semibold transition-colors ${
                    activeTab === "reviews"
                      ? "text-[#E07B3E] border-b-2 border-[#E07B3E]"
                      : "text-[#6B7280] hover:text-[#111827]"
                  }`}
                >
                  Anmeldelser gitt ({reviews.length})
                </button>
              </div>

              <div className="p-6">
                {/* Requests Tab */}
                {activeTab === "requests" && (
                  <div>
                    {requests.length === 0 ? (
                      <div className="text-center py-12">
                        <Briefcase className="w-12 h-12 text-[#E5E7EB] mx-auto mb-3" />
                        <p className="text-[#6B7280] mb-4">
                          Ingen forespørsler lagt ut ennå
                        </p>
                        {isOwnProfile && (
                          <Link
                            to="/opprett-forespørsel"
                            className="inline-flex h-12 px-6 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors items-center gap-2"
                          >
                            Opprett forespørsel
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {requests.map((request) => (
                          <Link
                            key={request.id}
                            to={`/forespørsel/${request.id}`}
                            className="block border border-[#E5E7EB] rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-[#111827]">
                                {request.title}
                              </h3>
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded ${
                                  request.status === "open"
                                    ? "bg-green-100 text-green-700"
                                    : request.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : request.status === "completed"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {request.status === "open"
                                  ? "Åpen"
                                  : request.status === "pending"
                                  ? "Venter"
                                  : request.status === "completed"
                                  ? "Fullført"
                                  : "Kansellert"}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-[#6B7280]">
                              <span className="px-2 py-0.5 bg-[#17384E]/10 text-[#17384E] rounded">
                                {request.category}
                              </span>
                              <span>
                                Budsjett: {request.budget.toLocaleString("nb-NO")} kr
                              </span>
                              <span>
                                {new Date(request.createdAt).toLocaleDateString("nb-NO")}
                              </span>
                              {request.offersCount !== undefined && request.offersCount > 0 && (
                                <span className="font-medium text-[#E07B3E]">
                                  {request.offersCount} {request.offersCount === 1 ? "tilbud" : "tilbud"}
                                </span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div>
                    {reviews.length === 0 ? (
                      <div className="text-center py-12">
                        <Star className="w-12 h-12 text-[#E5E7EB] mx-auto mb-3" />
                        <p className="text-[#6B7280]">Ingen anmeldelser gitt ennå</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-b border-[#E5E7EB] pb-4 last:border-0"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-[#111827]">
                                {review.supplierName}
                              </span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-[#6B7280] mb-2">
                              {review.jobTitle}
                            </p>
                            <p className="text-[#111827] mb-2">{review.comment}</p>
                            <p className="text-xs text-[#6B7280]">
                              {new Date(review.createdAt).toLocaleDateString("nb-NO", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <h3 className="font-bold text-[#111827] mb-4">Statistikk</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#6B7280]">Totalt</span>
                    <span className="font-semibold text-[#111827]">
                      {profile.totalRequests}
                    </span>
                  </div>
                  <div className="text-xs text-[#6B7280]">Forespørsler</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#6B7280]">Aktive</span>
                    <span className="font-semibold text-green-600">
                      {activeRequests.length}
                    </span>
                  </div>
                  <div className="text-xs text-[#6B7280]">Pågående nå</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#6B7280]">Fullført</span>
                    <span className="font-semibold text-blue-600">
                      {completedRequests.length}
                    </span>
                  </div>
                  <div className="text-xs text-[#6B7280]">Vellykkede prosjekter</div>
                </div>
              </div>
            </div>

            {/* Trust & Safety */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Trygg kunde</span>
              </div>
              <p className="text-sm text-blue-700">
                Verifisert identitet og sikker betaling gjennom escrow
              </p>
            </div>

            {/* Quick Actions (own profile only) */}
            {isOwnProfile && (
              <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                <h3 className="font-bold text-[#111827] mb-4">Hurtigvalg</h3>
                <div className="space-y-2">
                  <Link
                    to="/opprett-forespørsel"
                    className="block h-10 px-4 bg-[#E07B3E] text-white rounded-lg font-medium hover:bg-[#d16f35] transition-colors text-center leading-10"
                  >
                    Opprett forespørsel
                  </Link>
                  <Link
                    to="/mine-forespørsler"
                    className="block h-10 px-4 border border-[#E5E7EB] text-[#111827] rounded-lg font-medium hover:bg-gray-50 transition-colors text-center leading-10"
                  >
                    Mine forespørsler
                  </Link>
                  <Link
                    to="/meldinger"
                    className="block h-10 px-4 border border-[#E5E7EB] text-[#111827] rounded-lg font-medium hover:bg-gray-50 transition-colors text-center leading-10"
                  >
                    Meldinger
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
