import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Header } from "../components/Header";
import { Shield, CreditCard, Lock, CheckCircle, AlertCircle, Info, ArrowRight } from "lucide-react";

export function EscrowPayment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId") || "12345";
  const amount = searchParams.get("amount") || "15000";
  const supplierName = searchParams.get("supplier") || "Ole Hansen Tømrer";
  const depositPercent = parseInt(searchParams.get("depositPercent") || "100");
  const paymentType = searchParams.get("paymentType") || "upfront"; // "upfront" or "postpaid"
  
  const [step, setStep] = useState<"info" | "payment" | "confirmation">("info");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "vipps" | "bank">("vipps");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const totalJobAmount = parseInt(amount);
  const depositAmount = paymentType === "upfront" ? Math.round(totalJobAmount * depositPercent / 100) : totalJobAmount;
  const remainingAmount = totalJobAmount - depositAmount;
  const serviceFee = Math.round(depositAmount * 0.025); // 2.5% service fee
  const totalToPay = depositAmount + serviceFee;

  const handlePayment = () => {
    if (!acceptedTerms) {
      alert("Du må akseptere vilkårene for å fortsette");
      return;
    }

    if (paymentMethod === "card" && (!cardNumber || !expiryDate || !cvv || !cardName)) {
      alert("Vennligst fyll ut alle kortdetaljer");
      return;
    }

    // Simulate payment processing
    setTimeout(() => {
      setStep("confirmation");
    }, 1500);
  };

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header variant="simple" title="Betaling Godkjent" />
        
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-[#111827] mb-3">
              Betaling Vellykket!
            </h1>
            
            <p className="text-[15px] text-[#6B7280] mb-6">
              {totalToPay.toLocaleString('nb-NO')} kr er nå sikret på sperret konto
            </p>

            <div className="bg-[#F3F4F6] rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-[#111827] mb-4">Hva skjer nå?</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-[#17384E] rounded-full flex items-center justify-center flex-shrink-0 text-white text-[12px] font-bold">1</div>
                  <div>
                    <p className="text-[14px] text-[#111827] font-medium">Pengene er sikret</p>
                    <p className="text-[13px] text-[#6B7280]">Beløpet holdes på en sperret konto av Håndtverkeren</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-[#17384E] rounded-full flex items-center justify-center flex-shrink-0 text-white text-[12px] font-bold">2</div>
                  <div>
                    <p className="text-[14px] text-[#111827] font-medium">Fagpersonen starter arbeidet</p>
                    <p className="text-[13px] text-[#6B7280]">{supplierName} får beskjed om at finansiering er bekreftet</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-[#17384E] rounded-full flex items-center justify-center flex-shrink-0 text-white text-[12px] font-bold">3</div>
                  <div>
                    <p className="text-[14px] text-[#111827] font-medium">Du godkjenner arbeidet</p>
                    <p className="text-[13px] text-[#6B7280]">Når jobben er ferdig, godkjenner du og pengene utbetales</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FEF3E2] border border-[#E07B3E]/20 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-[#E07B3E] flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-[14px] text-[#111827] font-medium mb-1">100% Trygghet</p>
                  <p className="text-[13px] text-[#6B7280]">
                    Pengene forblir på sperret konto til du godkjenner arbeidet. 
                    Ved uenighet følger vi vår tvisteløsningsprosess.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/mine-forespørsler")}
                className="flex-1 h-12 px-6 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
              >
                Se mine forespørsler
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 h-12 px-6 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Tilbake til forsiden
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header variant="simple" title="Betal til Sperret Konto" onBack={() => setStep("info")} />
        
        <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
          {/* Payment Method Selection */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Velg betalingsmetode</h2>
            
            <div className="space-y-3">
              <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === "vipps" ? "border-[#E07B3E] bg-[#FEF3E2]" : "border-[#E5E7EB] hover:border-[#D1D5DB]"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="vipps"
                  checked={paymentMethod === "vipps"}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-5 h-5"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-[#FF5B24] rounded-lg flex items-center justify-center text-white font-bold">
                    V
                  </div>
                  <div>
                    <p className="font-medium text-[#111827]">Vipps</p>
                    <p className="text-[13px] text-[#6B7280]">Rask og sikker betaling</p>
                  </div>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === "card" ? "border-[#E07B3E] bg-[#FEF3E2]" : "border-[#E5E7EB] hover:border-[#D1D5DB]"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-5 h-5"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-[#17384E] rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-[#111827]">Kort</p>
                    <p className="text-[13px] text-[#6B7280]">Visa, Mastercard, American Express</p>
                  </div>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === "bank" ? "border-[#E07B3E] bg-[#FEF3E2]" : "border-[#E5E7EB] hover:border-[#D1D5DB]"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-5 h-5"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-[#17384E] rounded-lg flex items-center justify-center text-white font-bold text-[12px]">
                    BANK
                  </div>
                  <div>
                    <p className="font-medium text-[#111827]">Bankoverføring</p>
                    <p className="text-[13px] text-[#6B7280]">Behandles innen 1-2 virkedager</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Card Details Form */}
          {paymentMethod === "card" && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
              <h3 className="font-semibold text-[#111827] mb-4">Kortinformasjon</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] font-medium text-[#111827] mb-2">
                    Kortnummer
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full h-12 px-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07B3E]"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#111827] mb-2">
                    Kortholders navn
                  </label>
                  <input
                    type="text"
                    placeholder="NAVN NAVNESEN"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full h-12 px-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07B3E]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-medium text-[#111827] mb-2">
                      Utløpsdato
                    </label>
                    <input
                      type="text"
                      placeholder="MM/ÅÅ"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full h-12 px-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07B3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-medium text-[#111827] mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={3}
                      className="w-full h-12 px-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07B3E]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vipps Instructions */}
          {paymentMethod === "vipps" && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#17384E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] text-[#111827] font-medium mb-2">Slik betaler du med Vipps:</p>
                  <ol className="text-[13px] text-[#6B7280] space-y-1 list-decimal list-inside">
                    <li>Du blir sendt til Vipps når du klikker "Bekreft betaling"</li>
                    <li>Godkjenn betalingen i Vipps-appen</li>
                    <li>Du sendes tilbake når betalingen er godkjent</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Bank Transfer Instructions */}
          {paymentMethod === "bank" && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
              <h3 className="font-semibold text-[#111827] mb-4">Bankoverføring detaljer</h3>
              <div className="space-y-3 text-[14px]">
                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                  <span className="text-[#6B7280]">Kontonummer:</span>
                  <span className="font-medium text-[#111827]">1234.56.78901</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                  <span className="text-[#6B7280]">Mottaker:</span>
                  <span className="font-medium text-[#111827]">Håndtverkeren AS</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                  <span className="text-[#6B7280]">KID-nummer:</span>
                  <span className="font-medium text-[#111827]">{jobId}2026</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#6B7280]">Beløp:</span>
                  <span className="font-medium text-[#111827]">{totalToPay.toLocaleString('nb-NO')} kr</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-[#FEF3E2] rounded-lg">
                <p className="text-[13px] text-[#6B7280]">
                  <strong className="text-[#111827]">Viktig:</strong> Husk å bruke KID-nummer ved betaling. 
                  Pengene vil bli registrert på sperret konto innen 1-2 virkedager.
                </p>
              </div>
            </div>
          )}

          {/* Amount Summary */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
            <h3 className="font-semibold text-[#111827] mb-4">Betalingsoversikt</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#6B7280]">Totalpris for jobben</span>
                <span className="text-[#111827]">{totalJobAmount.toLocaleString('nb-NO')} kr</span>
              </div>
              
              {paymentType === "upfront" && depositPercent < 100 && (
                <>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#6B7280]">Forskudd ({depositPercent}%)</span>
                    <span className="text-[#111827]">{depositAmount.toLocaleString('nb-NO')} kr</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#6B7280]">Restbeløp (betales ved ferdigstillelse)</span>
                    <span className="text-[#111827]">{remainingAmount.toLocaleString('nb-NO')} kr</span>
                  </div>
                </>
              )}
              
              {paymentType === "upfront" && depositPercent === 100 && (
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#6B7280]">Fullbetaling på forskudd</span>
                  <span className="text-[#111827]">{depositAmount.toLocaleString('nb-NO')} kr</span>
                </div>
              )}
              
              {paymentType === "postpaid" && (
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#6B7280]">Etterskuddsbetaling</span>
                  <span className="text-[#111827]">{depositAmount.toLocaleString('nb-NO')} kr</span>
                </div>
              )}
              
              <div className="flex justify-between text-[14px]">
                <span className="text-[#6B7280]">Håndtverkeren gebyr (2,5%)</span>
                <span className="text-[#111827]">{serviceFee.toLocaleString('nb-NO')} kr</span>
              </div>
              <div className="pt-3 border-t border-[#E5E7EB] flex justify-between">
                <span className="font-semibold text-[#111827]">
                  {paymentType === "upfront" && depositPercent < 100 ? "Å betale nå (forskudd)" : "Totalt å betale"}
                </span>
                <span className="font-bold text-[#111827] text-lg">{totalToPay.toLocaleString('nb-NO')} kr</span>
              </div>
            </div>
            
            {paymentType === "upfront" && depositPercent < 100 && (
              <div className="mt-4 p-3 bg-[#F3F4F6] rounded-lg">
                <p className="text-[13px] text-[#6B7280]">
                  <strong className="text-[#111827]">Viktig:</strong> Restbeløpet på {remainingAmount.toLocaleString('nb-NO')} kr 
                  betales til sperret konto når arbeidet er ferdig, før godkjenning.
                </p>
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-5 h-5"
              />
              <span className="text-[14px] text-[#6B7280]">
                Jeg godtar <a href="/priser-og-vilkår" className="text-[#17384E] underline">vilkårene for sperret konto</a> og 
                bekrefter at jeg vil godkjenne arbeidet før pengene utbetales til fagpersonen.
              </span>
            </label>
          </div>

          {/* Fixed Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4 z-40">
            <div className="max-w-2xl mx-auto flex gap-3">
              <button
                onClick={() => setStep("info")}
                className="h-12 px-6 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Tilbake
              </button>
              <button
                onClick={handlePayment}
                disabled={!acceptedTerms}
                className="flex-1 h-12 px-6 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Bekreft betaling - {totalToPay.toLocaleString('nb-NO')} kr
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Info/Intro step
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header variant="simple" title="Sperret Konto" onBack={() => navigate(-1)} />
      
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#17384E] to-[#2a5570] rounded-lg p-8 text-white mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">Trygg Betaling med Sperret Konto</h1>
              <p className="text-[15px] opacity-90">
                Pengene holdes sikkert til du godkjenner det utførte arbeidet
              </p>
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
              <span className="text-[#6B7280]">Fagperson:</span>
              <span className="font-medium text-[#111827]">{supplierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Avtalt pris:</span>
              <span className="font-bold text-[#111827] text-lg">{parseInt(amount).toLocaleString('nb-NO')} kr</span>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h2 className="font-semibold text-[#111827] mb-4">Hvordan fungerer det?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#E07B3E] rounded-full flex items-center justify-center flex-shrink-0 text-white text-[14px] font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium text-[#111827] mb-1">Du betaler til sperret konto</h3>
                <p className="text-[13px] text-[#6B7280]">
                  Beløpet settes på en sikker sperret konto hos Håndtverkeren. 
                  Fagpersonen får beskjed om at finansieringen er bekreftet.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#E07B3E] rounded-full flex items-center justify-center flex-shrink-0 text-white text-[14px] font-bold">
                2
              </div>
              <div>
                <h3 className="font-medium text-[#111827] mb-1">Arbeidet utføres</h3>
                <p className="text-[13px] text-[#6B7280]">
                  Fagpersonen starter arbeidet med trygghet om at betalingen er sikret. 
                  Du følger med på fremdriften.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#E07B3E] rounded-full flex items-center justify-center flex-shrink-0 text-white text-[14px] font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium text-[#111827] mb-1">Du godkjenner arbeidet</h3>
                <p className="text-[13px] text-[#6B7280]">
                  Når jobben er ferdig, inspiserer du resultatet. Hvis du er fornøyd, 
                  godkjenner du arbeidet i appen.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#E07B3E] rounded-full flex items-center justify-center flex-shrink-0 text-white text-[14px] font-bold">
                4
              </div>
              <div>
                <h3 className="font-medium text-[#111827] mb-1">Pengene utbetales</h3>
                <p className="text-[13px] text-[#6B7280]">
                  Etter din godkjenning utbetales pengene til fagpersonen innen 1-2 virkedager.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-[#17384E] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#111827] mb-1">Beskyttelse for deg</h3>
                <p className="text-[13px] text-[#6B7280]">
                  Pengene utbetales kun når du godkjenner arbeidet
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#17384E] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#111827] mb-1">Trygghet for fagfolk</h3>
                <p className="text-[13px] text-[#6B7280]">
                  Fagpersonen vet at betalingen er sikret før arbeid starter
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-[#17384E] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#111827] mb-1">100% Sikkert</h3>
                <p className="text-[13px] text-[#6B7280]">
                  Pengene er beskyttet av norsk lov og våre sikkerhetssystemer
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-[#17384E] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#111827] mb-1">Tvisteløsning</h3>
                <p className="text-[13px] text-[#6B7280]">
                  Ved uenighet hjelper vi med å løse konflikten rettferdig
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-[#FEF3E2] border border-[#E07B3E]/20 rounded-lg p-5 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#E07B3E] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[#111827] mb-2">Viktig informasjon</h3>
              <ul className="text-[13px] text-[#6B7280] space-y-1 list-disc list-inside">
                <li>Gebyr på 2,5% av totalbeløpet for å dekke transaksjonskostnader</li>
                <li>Du har 7 dager etter fullført arbeid til å godkjenne eller klage</li>
                <li>Hvis ingen handling tas innen 7 dager, godkjennes arbeidet automatisk</li>
                <li>Ved tvister holdes pengene til saken er løst</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4 z-40">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setStep("payment")}
              className="w-full h-14 px-6 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors flex items-center justify-center gap-2"
            >
              <span>Fortsett til betaling</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}