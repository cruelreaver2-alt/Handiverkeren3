import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Header } from "../components/Header";
import { useSubscription } from "../contexts/SubscriptionContext";
import { UpgradePrompt } from "../components/UpgradePrompt";
import {
  Star,
  MapPin,
  Briefcase,
  CheckCircle,
  Award,
  Calendar,
  MessageSquare,
  Share2,
  Shield,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface SupplierProfile {
  id: string;
  name: string;
  avatar?: string;
  coverImage?: string;
  bio: string;
  company: string;
  location: string;
  categories: string[];
  verified: boolean;
  memberSince: string;
  completedJobs: number;
  rating: number;
  reviewCount: number;
  responseTime: string;
  responseRate: number;
  phone?: string;
  email?: string;
  website?: string;
  certifications: string[];
  insurance: boolean;
}

interface PortfolioItem {
  id: string;
  supplierId: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  completedDate: string;
  createdAt: string;
}

interface Review {
  id: string;
  supplierId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  images?: string[];
  jobTitle: string;
  createdAt: string;
}

export function SupplierProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<SupplierProfile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"portfolio" | "reviews">("portfolio");

  useEffect(() => {
    loadProfileData();
  }, [id]);

  const loadProfileData = async () => {
    try {
      // Load profile
      const profileResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/profiles/supplier/${id}`,
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

      // Load portfolio
      const portfolioResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/portfolio?supplierId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (portfolioResponse.ok) {
        const portfolioData = await portfolioResponse.json();
        setPortfolio(portfolioData.portfolio || []);
      }

      // Load reviews
      const reviewsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/reviews?supplierId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews || []);
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
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
              onClick={() => navigate("/tilgjengelige-jobber")}
              className="text-[#E07B3E] hover:underline"
            >
              Gå tilbake
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      {/* Cover Image */}
      <div
        className="h-64 bg-gradient-to-r from-[#17384E] to-[#1a4459]"
        style={
          profile.coverImage
            ? {
                backgroundImage: `url(${profile.coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      />

      <div className="max-w-6xl mx-auto px-4 -mt-20 pb-12">
        {/* Profile Header */}
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
              {profile.verified && (
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-[#E07B3E] rounded-full border-4 border-white flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-3xl font-bold text-[#111827] mb-1">
                    {profile.name}
                  </h1>
                  <p className="text-lg text-[#6B7280]">{profile.company}</p>
                </div>
                <button className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-gray-50">
                  <Share2 className="w-5 h-5 text-[#6B7280]" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-[#111827]">
                    {profile.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-[#6B7280]">
                    ({profile.reviewCount} anmeldelser)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#6B7280]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{profile.location}</span>
                </div>
                <div className="flex items-center gap-1 text-[#6B7280]">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">
                    {profile.completedJobs} fullførte jobber
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#6B7280]">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Medlem siden {profile.memberSince}</span>
                </div>
              </div>

              <p className="text-[#6B7280] mb-4">{profile.bio}</p>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#17384E]/10 text-[#17384E] rounded-full text-sm font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  to="/meldinger"
                  className="flex-1 md:flex-initial h-12 px-6 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Send melding
                </Link>
                <Link
                  to="/tilgjengelige-jobber"
                  className="flex-1 md:flex-initial h-12 px-6 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  Se jobber
                </Link>
              </div>
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
                  onClick={() => setActiveTab("portfolio")}
                  className={`flex-1 h-14 font-semibold transition-colors ${
                    activeTab === "portfolio"
                      ? "text-[#E07B3E] border-b-2 border-[#E07B3E]"
                      : "text-[#6B7280] hover:text-[#111827]"
                  }`}
                >
                  Portefølje ({portfolio.length})
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex-1 h-14 font-semibold transition-colors ${
                    activeTab === "reviews"
                      ? "text-[#E07B3E] border-b-2 border-[#E07B3E]"
                      : "text-[#6B7280] hover:text-[#111827]"
                  }`}
                >
                  Anmeldelser ({reviews.length})
                </button>
              </div>

              <div className="p-6">
                {/* Portfolio Tab */}
                {activeTab === "portfolio" && (
                  <div>
                    {portfolio.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-[#6B7280]">
                          Ingen porteføljeprosjekter lagt til ennå
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {portfolio.map((item) => (
                          <div
                            key={item.id}
                            className="border border-[#E5E7EB] rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                          >
                            <div className="aspect-video bg-gray-200 relative">
                              {item.images && item.images[0] ? (
                                <img
                                  src={item.images[0]}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  Ingen bilde
                                </div>
                              )}
                              {item.images && item.images.length > 1 && (
                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                                  +{item.images.length - 1} bilder
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-[#111827] mb-1">
                                {item.title}
                              </h3>
                              <p className="text-sm text-[#6B7280] line-clamp-2 mb-2">
                                {item.description}
                              </p>
                              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                                <span>{item.category}</span>
                                <span>
                                  {new Date(item.completedDate).toLocaleDateString(
                                    "nb-NO"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
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
                        <p className="text-[#6B7280]">Ingen anmeldelser ennå</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-b border-[#E5E7EB] pb-4 last:border-0"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-10 h-10 bg-[#17384E] rounded-full flex items-center justify-center text-white font-semibold">
                                {review.customerName.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-[#111827]">
                                    {review.customerName}
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
                                {review.images && review.images.length > 0 && (
                                  <div className="flex gap-2">
                                    {review.images.map((img, i) => (
                                      <img
                                        key={i}
                                        src={img}
                                        alt=""
                                        className="w-20 h-20 object-cover rounded"
                                      />
                                    ))}
                                  </div>
                                )}
                                <p className="text-xs text-[#6B7280] mt-2">
                                  {new Date(review.createdAt).toLocaleDateString(
                                    "nb-NO",
                                    {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Svar-rate</span>
                  </div>
                  <span className="font-semibold text-[#111827]">
                    {profile.responseRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Svartid</span>
                  </div>
                  <span className="font-semibold text-[#111827]">
                    {profile.responseTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">Anbefalt</span>
                  </div>
                  <span className="font-semibold text-[#111827]">
                    {Math.round((reviews.filter((r) => r.rating >= 4).length /
                      reviews.length) *
                      100) || 0}
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Certifications */}
            {profile.certifications && profile.certifications.length > 0 && (
              <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                <h3 className="font-bold text-[#111827] mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#E07B3E]" />
                  Sertifiseringer
                </h3>
                <div className="space-y-2">
                  {profile.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-[#6B7280]"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insurance */}
            {profile.insurance && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Forsikret håndverker</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Denne leverandøren har gyldig ansvarsforsikring
                </p>
              </div>
            )}

            {/* Rating Distribution */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                <h3 className="font-bold text-[#111827] mb-4">
                  Vurderingsfordeling
                </h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                    const percentage = (count / reviews.length) * 100;
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm text-[#6B7280] w-12">
                          {rating} ★
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-[#6B7280] w-8 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}