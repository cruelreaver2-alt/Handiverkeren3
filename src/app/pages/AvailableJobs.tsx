import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import {
  MapPin,
  Calendar,
  DollarSign,
  Filter,
  Search,
  Clock,
  Star,
  Send,
  Calculator,
  Coins,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Job {
  id: string;
  customerId: string;
  category: string;
  title: string;
  description: string;
  location: string;
  postalCode: string;
  budgetMin?: number;
  budgetMax?: number;
  startDate?: string;
  asap: boolean;
  verifiedOnly: boolean;
  status: string;
  createdAt: string;
  imageCount?: number;
}

export function AvailableJobs() {
  const navigate = useNavigate();
  const supplierId = "supplier-001"; // TODO: Get from auth

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [availablePoints, setAvailablePoints] = useState(250); // Demo: supplier has 250 points

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    filterAndSortJobs();
  }, [jobs, searchTerm, selectedCategory, sortBy]);

  const loadJobs = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/requests`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load jobs");
      }

      const data = await response.json();
      // Filter out completed and cancelled jobs
      const availableJobs = (data.requests || []).filter(
        (job: Job) => job.status !== "completed" && job.status !== "cancelled"
      );
      setJobs(availableJobs);
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortJobs = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "budget-high":
        filtered.sort((a, b) => (b.budgetMax || 0) - (a.budgetMax || 0));
        break;
      case "budget-low":
        filtered.sort((a, b) => (a.budgetMax || 0) - (b.budgetMax || 0));
        break;
      case "nearest":
        // TODO: Implement location-based sorting
        break;
    }

    setFilteredJobs(filtered);
  };

  const handleSendOffer = (jobId: string) => {
    navigate(`/send-tilbud/${jobId}`);
  };

  const handleRespondToJob = (job: Job) => {
    setSelectedJob(job);
    setShowPointsModal(true);
  };

  const confirmResponse = async () => {
    if (!selectedJob) return;

    const pointCost = 10; // Cost to respond to a job

    if (availablePoints < pointCost) {
      alert("Du har ikke nok poeng. Oppgrader abonnementet ditt for flere poeng.");
      return;
    }

    // Deduct points
    setAvailablePoints(availablePoints - pointCost);
    setShowPointsModal(false);

    // Navigate to messages with this job/customer
    navigate(`/meldinger?jobId=${selectedJob.id}`);
  };

  const categories = [
    { value: "all", label: "Alle kategorier" },
    { value: "trevare", label: "Tømrer" },
    { value: "ror", label: "Rørlegger" },
    { value: "elektrisk", label: "Elektro" },
    { value: "maling", label: "Maling" },
    { value: "garasjeport", label: "Garasjeport" },
    { value: "varmepumpe", label: "Varmepumpe" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-[#6B7280]">Laster tilgjengelige jobber...</div>
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
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Tilgjengelige jobber
          </h1>
          <p className="text-[#6B7280]">
            {filteredJobs.length} jobber tilgjengelig i ditt område
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Søk etter jobber..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-10 pr-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
            >
              <option value="newest">Nyeste først</option>
              <option value="budget-high">Høyeste budsjett</option>
              <option value="budget-low">Laveste budsjett</option>
              <option value="nearest">Nærmest</option>
            </select>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-4 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden md:inline">Filtre</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-[#6B7280] mb-2">
                    Budsjett min
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#6B7280] mb-2">
                    Budsjett maks
                  </label>
                  <input
                    type="number"
                    placeholder="100000"
                    className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#6B7280] mb-2">
                    Postnummer
                  </label>
                  <input
                    type="text"
                    placeholder="0123"
                    className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-12 text-center">
            <div className="w-16 h-16 bg-[#E07B3E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#E07B3E]" />
            </div>
            <h3 className="text-lg font-semibold text-[#111827] mb-2">
              Ingen jobber funnet
            </h3>
            <p className="text-sm text-[#6B7280]">
              Prøv å endre søkekriteriene eller kom tilbake senere
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg border border-[#E5E7EB] p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-[#E07B3E] bg-[#E07B3E]/10 px-2 py-1 rounded">
                        {categories.find((c) => c.value === job.category)
                          ?.label || job.category}
                      </span>
                      {job.asap && (
                        <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                          <Clock className="w-3 h-3" />
                          ASAP
                        </span>
                      )}
                      {job.verifiedOnly && (
                        <span className="flex items-center gap-1 text-xs font-medium text-[#17384E] bg-[#17384E]/10 px-2 py-1 rounded">
                          <Star className="w-3 h-3" />
                          Kun verifiserte
                        </span>
                      )}
                      <span className="text-xs text-[#6B7280]">
                        {new Date(job.createdAt).toLocaleDateString("nb-NO", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#111827] mb-2">
                      {job.title}
                    </h3>
                    <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {job.location || "Ikke spesifisert"}
                          {job.postalCode && ` (${job.postalCode})`}
                        </span>
                      </div>
                      {job.budgetMax && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>
                            Budsjett: {job.budgetMin?.toLocaleString("nb-NO")} -{" "}
                            {job.budgetMax.toLocaleString("nb-NO")} kr
                          </span>
                        </div>
                      )}
                      {job.startDate && !job.asap && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Start:{" "}
                            {new Date(job.startDate).toLocaleDateString("nb-NO")}
                          </span>
                        </div>
                      )}
                      {job.imageCount && job.imageCount > 0 && (
                        <span className="text-xs text-green-600">
                          📷 {job.imageCount} bilder
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    {job.budgetMax && (
                      <div className="text-2xl font-bold text-[#17384E] mb-1">
                        {job.budgetMax.toLocaleString("nb-NO")} kr
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/forespørsel/${job.id}`)}
                    className="flex-1 h-11 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Se detaljer
                  </button>
                  <button
                    onClick={() => handleRespondToJob(job)}
                    className="flex-1 h-11 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Svar på jobb (10 poeng)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Points Confirmation Modal */}
      {showPointsModal && selectedJob && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPointsModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#111827]">Svar på jobb</h2>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E07B3E]/10 rounded-lg">
                <Coins className="w-5 h-5 text-[#E07B3E]" />
                <span className="font-semibold text-[#E07B3E]">{availablePoints} poeng</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-[#F3F4F6] rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-[#111827] mb-2">{selectedJob.title}</h3>
                <p className="text-sm text-[#6B7280] mb-2">{selectedJob.description}</p>
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedJob.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#E07B3E]/5 border border-[#E07B3E]/20 rounded-lg">
                <div>
                  <div className="font-semibold text-[#111827]">Kostnad for å svare</div>
                  <div className="text-sm text-[#6B7280]">Dette åpner dialog med kunden</div>
                </div>
                <div className="flex items-center gap-2 text-[#E07B3E] font-bold text-lg">
                  <Coins className="w-5 h-5" />
                  10 poeng
                </div>
              </div>

              {availablePoints < 10 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">
                    ⚠️ Du har ikke nok poeng. Oppgrader abonnementet ditt for å få flere poeng.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={confirmResponse}
                disabled={availablePoints < 10}
                className="w-full h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Bekreft - Start dialog
              </button>
              <button
                onClick={() => setShowPointsModal(false)}
                className="w-full h-12 border border-gray-300 text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Avbryt
              </button>
            </div>

            <p className="text-xs text-[#6B7280] text-center mt-4">
              💡 Etter at du har svart kan du lage et detaljert tilbud til kunden
            </p>
          </div>
        </div>
      )}
    </div>
  );
}