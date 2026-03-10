import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Header } from "../components/Header";
import {
  DollarSign,
  Calendar,
  Shield,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface JobDetails {
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
  createdAt: string;
}

export function SendOffer() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const supplierId = "supplier-001"; // TODO: Get from auth
  const supplierName = "Ole Hansen Tømrer"; // TODO: Get from auth

  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    price: "",
    description: "",
    timeline: "",
    warranty: "2 år garanti",
    paymentOption: "postpaid" as "upfront" | "postpaid",
    depositPercentage: 50,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/requests/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "Failed to load job details. Status:",
          response.status,
          "Error:",
          errorData
        );
        throw new Error(errorData.error || "Failed to load job details");
      }

      const data = await response.json();

      if (!data.request) {
        console.error("No request data in response:", data);
        throw new Error("No request data returned");
      }

      setJob(data.request);
    } catch (error) {
      console.error("Error loading job:", error);
      setError(`Kunne ikke laste jobbdetaljer for ID: ${jobId}`);
      // Don't navigate away, let the error state show
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Pris må være større enn 0";
    }

    if (!formData.description || formData.description.length < 20) {
      newErrors.description = "Beskrivelsen må være minst 20 tegn";
    }

    if (!formData.timeline) {
      newErrors.timeline = "Tidslinje er påkrevd";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const offerData = {
        requestId: jobId,
        supplierId,
        supplierName,
        price: parseFloat(formData.price),
        description: formData.description,
        timeline: formData.timeline,
        warranty: formData.warranty,
        paymentOption: formData.paymentOption,
        depositPercentage: formData.depositPercentage,
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/offers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(offerData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send offer");
      }

      setShowSuccess(true);
    } catch (error) {
      console.error("Error sending offer:", error);
      alert("Kunne ikke sende tilbud. Prøv igjen.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-[#6B7280]">Laster jobbdetaljer...</div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header
          variant="simple"
          title="Feil"
          onBack={() => navigate("/tilgjengelige-jobber")}
        />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-3">
              Jobben ble ikke funnet
            </h2>
            <p className="text-[#6B7280] mb-2">
              {error || "Vi kunne ikke laste jobbdetaljer."}
            </p>
            <p className="text-sm text-[#6B7280] mb-6">
              Jobb-ID: <code className="bg-gray-100 px-2 py-1 rounded">{jobId}</code>
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/tilgjengelige-jobber")}
                className="w-full h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
              >
                Se tilgjengelige jobber
              </button>
              <button
                onClick={() => navigate("/debug-jobs")}
                className="w-full h-12 border border-gray-300 text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Gå til debug-side
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header variant="simple" title="Send tilbud" onBack={() => navigate(-1)} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Job Summary */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#111827] mb-2">
                {job.title}
              </h2>
              <p className="text-sm text-[#6B7280] mb-3">{job.description}</p>
              <div className="flex flex-wrap gap-3 text-sm text-[#6B7280]">
                <span>📍 {job.location}</span>
                {job.budgetMax && (
                  <span>
                    💰 Budsjett: {job.budgetMin?.toLocaleString("nb-NO")} -{" "}
                    {job.budgetMax.toLocaleString("nb-NO")} kr
                  </span>
                )}
                {job.asap && <span className="text-red-600 font-medium">⚡ ASAP</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Offer Form */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h3 className="text-xl font-bold text-[#111827] mb-6">Ditt tilbud</h3>

          <div className="space-y-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Pris (inkl. mva) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="number"
                  placeholder="15000"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className={`w-full h-12 pl-10 pr-16 border rounded-lg ${
                    errors.price ? "border-red-500" : "border-[#E5E7EB]"
                  } focus:outline-none focus:ring-2 focus:ring-[#17384E]`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                  kr
                </span>
              </div>
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{errors.price}</p>
              )}
              {job.budgetMax && parseFloat(formData.price) > job.budgetMax && (
                <div className="flex items-start gap-2 mt-2 text-sm text-[#E07B3E]">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Prisen er over kundens budsjett. Vurder å justere tilbudet.
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Beskrivelse av tilbudet *
              </label>
              <textarea
                placeholder="Beskriv hvordan du vil utføre jobben, hvilke materialer som inkluderes, osv."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg resize-none ${
                  errors.description ? "border-red-500" : "border-[#E5E7EB]"
                } focus:outline-none focus:ring-2 focus:ring-[#17384E]`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-[#6B7280] mt-1">
                {formData.description.length}/500 tegn
              </p>
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Tidsramme *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="F.eks: 2-3 dager, 1 uke"
                  value={formData.timeline}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, timeline: e.target.value }))
                  }
                  className={`w-full h-12 pl-10 pr-4 border rounded-lg ${
                    errors.timeline ? "border-red-500" : "border-[#E5E7EB]"
                  } focus:outline-none focus:ring-2 focus:ring-[#17384E]`}
                />
              </div>
              {errors.timeline && (
                <p className="text-xs text-red-500 mt-1">{errors.timeline}</p>
              )}
            </div>

            {/* Warranty */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Garanti
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="F.eks: 2 år garanti, 5 år garanti"
                  value={formData.warranty}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, warranty: e.target.value }))
                  }
                  className="w-full h-12 pl-10 pr-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-3">
                Betalingsbetingelser
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border-2 border-[#E5E7EB] rounded-lg cursor-pointer hover:border-[#17384E] transition-colors">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="postpaid"
                    checked={formData.paymentOption === "postpaid"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentOption: e.target.value as "upfront" | "postpaid",
                      }))
                    }
                    className="mt-1 w-5 h-5 text-[#17384E]"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-[#111827] mb-1">
                      Etterskuddsbetaling (Anbefalt)
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      Kunden betaler til sperret konto ved ferdigstillelse
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-[#E5E7EB] rounded-lg cursor-pointer hover:border-[#17384E] transition-colors">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="upfront"
                    checked={formData.paymentOption === "upfront"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentOption: e.target.value as "upfront" | "postpaid",
                      }))
                    }
                    className="mt-1 w-5 h-5 text-[#17384E]"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-[#111827] mb-1">
                      Forskuddsbetaling
                    </div>
                    <div className="text-sm text-[#6B7280] mb-3">
                      Kunden betaler forskudd til sperret konto før oppstart
                    </div>
                    {formData.paymentOption === "upfront" && (
                      <div className="flex gap-2">
                        {[25, 50, 100].map((percent) => (
                          <button
                            key={percent}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                depositPercentage: percent,
                              }))
                            }
                            className={`flex-1 h-10 rounded-lg font-medium transition-colors ${
                              formData.depositPercentage === percent
                                ? "bg-[#17384E] text-white"
                                : "bg-[#F3F4F6] text-[#111827] hover:bg-[#E5E7EB]"
                            }`}
                          >
                            {percent}%
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        {formData.price && (
          <div className="bg-[#F3F4F6] rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-[#111827] mb-4">Prisoppsummering</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Pris ekskl. mva</span>
                <span className="font-medium text-[#111827]">
                  {(parseFloat(formData.price) / 1.25).toLocaleString("nb-NO", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  kr
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">MVA (25%)</span>
                <span className="font-medium text-[#111827]">
                  {(parseFloat(formData.price) * 0.2).toLocaleString("nb-NO", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  kr
                </span>
              </div>
              <div className="border-t border-[#E5E7EB] pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#111827]">
                    Total (inkl. mva)
                  </span>
                  <span className="font-bold text-[#17384E] text-lg">
                    {parseFloat(formData.price).toLocaleString("nb-NO")} kr
                  </span>
                </div>
              </div>
              {formData.paymentOption === "upfront" && (
                <div className="flex justify-between text-[#E07B3E] pt-2">
                  <span>Forskudd ({formData.depositPercentage}%)</span>
                  <span className="font-semibold">
                    {(
                      (parseFloat(formData.price) * formData.depositPercentage) /
                      100
                    ).toLocaleString("nb-NO")}{" "}
                    kr
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 h-14 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 h-14 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              "Sender tilbud..."
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Send tilbud
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] mb-2">
                Tilbud sendt!
              </h2>
              <p className="text-sm text-[#6B7280]">
                Kunden har mottatt ditt tilbud. Du får beskjed når de svarer.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/mine-tilbud")}
                className="w-full h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
              >
                Se mine tilbud
              </button>
              <button
                onClick={() => navigate("/tilgjengelige-jobber")}
                className="w-full h-12 border border-gray-300 text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Finn flere jobber
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}