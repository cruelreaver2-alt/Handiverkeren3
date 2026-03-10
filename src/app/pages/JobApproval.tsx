import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Header } from "../components/Header";
import { CheckCircle2, X, Shield, Info, MessageSquare, Camera, FileText } from "lucide-react";

export function JobApproval() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId") || "12345";
  const userType = searchParams.get("userType") || "customer"; // "customer" or "supplier"
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [approved, setApproved] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");

  // Mock data - in real app this would come from backend
  const jobData = {
    title: "Reparere lekkasje i badet",
    supplier: "Kari Johansen Rørlegger",
    customer: "Lars Petersen",
    amount: 15000,
    escrowAmount: 15375, // includes 2.5% fee
    completedDate: "5. mars 2026",
    customerApproved: userType === "supplier", // If we're the supplier viewing, customer has already approved
    supplierApproved: false,
  };

  const handleApprove = () => {
    setApproved(true);
    setShowConfirmation(true);
  };

  const handleReject = () => {
    setApproved(false);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (approved) {
      // Simulate approval
      alert(
        userType === "customer"
          ? "Takk for godkjenningen! Fagpersonen må nå også godkjenne før pengene utbetales."
          : "Takk for godkjenningen! Pengene vil bli utbetalt innen 1-2 virkedager."
      );
      navigate("/mine-forespørsler");
    } else {
      // Simulate rejection
      alert("En tvisteløsningsprosess har blitt startet. Vi vil kontakte begge parter innen 24 timer.");
      navigate("/mine-forespørsler");
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header variant="simple" title="Bekreft godkjenning" />
        
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-8">
            {approved ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-[#111827] text-center mb-3">
                  Bekreft godkjenning
                </h2>
                
                <p className="text-[15px] text-[#6B7280] text-center mb-6">
                  {userType === "customer"
                    ? "Ved å godkjenne bekrefter du at arbeidet er utført tilfredsstillende. Fagpersonen må også godkjenne før pengene utbetales."
                    : "Ved å godkjenne bekrefter du at jobben er ferdigstilt og at du er fornøyd med resultatet. Pengene vil bli utbetalt innen 1-2 virkedager."}
                </p>

                <div className="bg-[#F3F4F6] rounded-lg p-5 mb-6">
                  <div className="flex justify-between text-[14px] mb-2">
                    <span className="text-[#6B7280]">Jobb:</span>
                    <span className="font-medium text-[#111827]">{jobData.title}</span>
                  </div>
                  <div className="flex justify-between text-[14px] mb-2">
                    <span className="text-[#6B7280]">{userType === "customer" ? "Fagperson:" : "Kunde:"}</span>
                    <span className="font-medium text-[#111827]">
                      {userType === "customer" ? jobData.supplier : jobData.customer}
                    </span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#6B7280]">Beløp:</span>
                    <span className="font-bold text-[#111827]">{jobData.amount.toLocaleString('nb-NO')} kr</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 h-12 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 h-12 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Bekreft godkjenning
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <X className="w-10 h-10 text-red-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-[#111827] text-center mb-3">
                  Bekreft avvisning
                </h2>
                
                <p className="text-[15px] text-[#6B7280] text-center mb-6">
                  Ved å avvise starter du en tvisteløsningsprosess. Pengene vil bli holdt på sperret konto til tvisten er løst.
                </p>

                <div className="mb-6">
                  <label className="block text-[14px] font-medium text-[#111827] mb-2">
                    Grunn til avvisning (valgfritt)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Beskriv hvorfor du ikke er fornøyd..."
                    className="w-full h-32 px-4 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07B3E] resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 h-12 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 h-12 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Start tvisteløsning
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header variant="simple" title="Godkjenn arbeid" onBack={() => navigate(-1)} />
      
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {/* Status Header */}
        <div className="bg-gradient-to-br from-[#17384E] to-[#2a5570] rounded-lg p-6 text-white mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">Arbeidet er ferdig</h1>
              <p className="text-[14px] opacity-90">Vennligst godkjenn eller avvis arbeidet</p>
            </div>
          </div>
        </div>

        {/* Job Info */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h2 className="font-semibold text-[#111827] mb-4">Jobbdetaljer</h2>
          <div className="space-y-3 text-[14px]">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Jobb ID:</span>
              <span className="font-medium text-[#111827]">#{jobId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Tittel:</span>
              <span className="font-medium text-[#111827]">{jobData.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">{userType === "customer" ? "Fagperson:" : "Kunde:"}</span>
              <span className="font-medium text-[#111827]">
                {userType === "customer" ? jobData.supplier : jobData.customer}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Ferdigstilt:</span>
              <span className="font-medium text-[#111827]">{jobData.completedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Beløp på sperret konto:</span>
              <span className="font-bold text-[#111827] text-lg">{jobData.escrowAmount.toLocaleString('nb-NO')} kr</span>
            </div>
          </div>
        </div>

        {/* Approval Status */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h2 className="font-semibold text-[#111827] mb-4">Godkjenningsstatus</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#F3F4F6] rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  jobData.customerApproved ? "bg-green-100" : "bg-gray-100"
                }`}>
                  {jobData.customerApproved ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-[#111827]">Kunde</p>
                  <p className="text-[13px] text-[#6B7280]">{jobData.customer}</p>
                </div>
              </div>
              <span className={`text-[13px] font-medium ${
                jobData.customerApproved ? "text-green-600" : "text-[#6B7280]"
              }`}>
                {jobData.customerApproved ? "Godkjent" : "Venter"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F3F4F6] rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  jobData.supplierApproved ? "bg-green-100" : "bg-gray-100"
                }`}>
                  {jobData.supplierApproved ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-[#111827]">Fagperson</p>
                  <p className="text-[13px] text-[#6B7280]">{jobData.supplier}</p>
                </div>
              </div>
              <span className={`text-[13px] font-medium ${
                jobData.supplierApproved ? "text-green-600" : "text-[#6B7280]"
              }`}>
                {jobData.supplierApproved ? "Godkjent" : "Venter"}
              </span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#FEF3E2] border border-[#E07B3E]/20 rounded-lg p-5 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#E07B3E] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[#111827] mb-2">Hvordan fungerer dobbel godkjenning?</h3>
              <ul className="text-[13px] text-[#6B7280] space-y-1">
                <li>• Både kunde og fagperson må godkjenne at jobben er utført tilfredsstillende</li>
                <li>• Pengene utbetales først når begge parter har godkjent</li>
                <li>• Ved uenighet starter vi en tvisteløsningsprosess</li>
                <li>• Pengene forblir på sperret konto til saken er løst</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h3 className="font-semibold text-[#111827] mb-4">
            {userType === "customer" ? "Er du fornøyd med arbeidet?" : "Er du fornøyd med resultatet?"}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={handleApprove}
              className="h-32 border-2 border-green-200 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex flex-col items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-10 h-10 text-green-600" />
              <span className="font-semibold text-green-900">Godkjenn</span>
              <span className="text-[12px] text-green-700">Arbeidet er utført godt</span>
            </button>

            <button
              onClick={handleReject}
              className="h-32 border-2 border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex flex-col items-center justify-center gap-2"
            >
              <X className="w-10 h-10 text-red-600" />
              <span className="font-semibold text-red-900">Avvis</span>
              <span className="text-[12px] text-red-700">Jeg er ikke fornøyd</span>
            </button>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 h-11 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span>Send melding</span>
            </button>
            <button className="flex-1 h-11 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Camera className="w-5 h-5" />
              <span>Last opp bilder</span>
            </button>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-[#17384E]" />
            <h3 className="font-semibold text-[#111827]">Dokumentasjon</h3>
          </div>
          <p className="text-[14px] text-[#6B7280] mb-3">
            Last opp bilder av det ferdige arbeidet før du godkjenner
          </p>
          <button className="w-full h-11 border-2 border-dashed border-[#D1D5DB] text-[#6B7280] rounded-lg font-medium hover:border-[#E07B3E] hover:text-[#E07B3E] transition-colors">
            + Last opp dokumentasjon
          </button>
        </div>
      </div>
    </div>
  );
}
