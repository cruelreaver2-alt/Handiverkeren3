import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Check, Star, Zap, Sparkles, Users, Brain } from "lucide-react";

export function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // In real app, navigate to signup/payment
    if (planId === "customer") {
      navigate("/registrering?role=kunde");
    } else {
      navigate(`/registrering?role=fagfolk&plan=${planId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
            Velg riktig plan for deg
          </h1>
          <p className="text-base md:text-lg text-[#6B7280] max-w-2xl mx-auto px-4">
            Få tilgang til Norges beste håndverkere eller finn nye kunder som fagperson
          </p>
        </div>

        {/* Customer Free Plan */}
        <div className="mb-12 md:mb-16">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#17384E] to-[#2a5570] text-white px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5" />
              <span className="font-semibold text-sm md:text-base">For kunder</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#111827]">Helt gratis å bruke</h2>
          </div>

          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg border-2 border-[#E07B3E] p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#E07B3E] text-white px-4 py-1 text-xs md:text-sm font-semibold">
                ANBEFALT
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#111827] mb-2">Kunde</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-[#17384E]">0 kr</span>
                  <span className="text-[#6B7280]">/ for alltid</span>
                </div>
                <p className="text-[15px] text-[#6B7280]">
                  Opprett ubegrenset antall forespørsler og få tilbud fra verifiserte fagfolk
                </p>
              </div>

              <div className="mb-8">
                <p className="text-sm font-semibold text-[#111827] mb-3">Inkludert:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827]">Ubegrenset antall forespørsler</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827]">Motta tilbud fra verifiserte fagfolk</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827]">Sikker betaling med sperret konto</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827]">Chat direkte med fagfolk</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827]">Anmeldelser og vurderinger</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827]">Ingen skjulte kostnader</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan("customer")}
                className="w-full h-14 bg-[#E07B3E] text-white rounded-lg font-semibold text-lg hover:bg-[#d16f35] transition-colors"
              >
                Kom i gang gratis
              </button>
            </div>
          </div>
        </div>

        {/* Supplier Plans */}
        <div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E07B3E] to-[#d16f35] text-white px-4 py-2 rounded-full mb-4">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">For fagfolk</span>
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-2">Velg riktig pakke for din bedrift</h2>
            <p className="text-[15px] text-[#6B7280]">
              Alle planer inkluderer 14 dagers gratis prøveperiode
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Light Plan */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-[#E07B3E]" />
                  <h3 className="text-xl font-bold text-[#111827]">Fagfolk Light</h3>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-[#17384E]">499</span>
                  <span className="text-[#6B7280]">kr / mnd</span>
                </div>
                <p className="text-[14px] text-[#6B7280]">
                  Perfekt for små bedrifter som er i startfasen
                </p>
              </div>

              <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                <div className="inline-flex items-center gap-2 bg-[#17384E] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  15 poeng / mnd
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm font-semibold text-[#111827] mb-3">Inkludert:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827]">15 poeng per måned</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827]">Profil i fagperson-katalog</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827] font-semibold">Forenklet tilbudsbygger</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#6B7280]">Manuell input av timer og materialer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827]">Chat med kunder</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827]">Grunnleggende statistikk</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827]">Kundeservice via e-post</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan("light")}
                className="w-full h-12 border-2 border-[#17384E] text-[#17384E] rounded-lg font-semibold hover:bg-[#17384E] hover:text-white transition-colors"
              >
                Velg Light
              </button>
            </div>

            {/* Medium Plan */}
            <div className="bg-white rounded-lg border-2 border-[#E07B3E] p-6 relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E07B3E] text-white px-4 py-1 rounded-full text-sm font-semibold">
                POPULÆR
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-[#E07B3E]" />
                  <h3 className="text-xl font-bold text-[#111827]">Fagfolk Medium</h3>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-[#17384E]">799</span>
                  <span className="text-[#6B7280]">kr / mnd</span>
                </div>
                <p className="text-[14px] text-[#6B7280]">
                  For voksende bedrifter som vil ha flere jobber
                </p>
              </div>

              <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                <div className="inline-flex items-center gap-2 bg-[#E07B3E] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  25 poeng / mnd
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm font-semibold text-[#111827] mb-3">Alt i Light, pluss:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827]">25 poeng per måned</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827] font-semibold">Porteføljesider</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827] font-semibold">Tilbudsbygger med ekstra felt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#6B7280]">Manuell input av materialer (ingen database)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827] font-semibold">Boligmappa integrasjon</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827]">Fremhevet profil</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827]">Avansert statistikk</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#111827]">Prioritert kundeservice</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan("medium")}
                className="w-full h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
              >
                Velg Medium
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-[#17384E] to-[#2a5570] rounded-lg p-6 text-white">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-[#E07B3E]" />
                  <h3 className="text-xl font-bold">Fagfolk Pro</h3>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">1499</span>
                  <span className="opacity-80">kr / mnd</span>
                </div>
                <p className="text-[14px] opacity-90">
                  For etablerte bedrifter som vil maksimere sin vekst
                </p>
              </div>

              <div className="mb-6 pb-6 border-b border-white/20">
                <div className="inline-flex items-center gap-2 bg-[#E07B3E] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  50 poeng / mnd
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm font-semibold mb-3">Alt i Medium, pluss:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E07B3E] flex-shrink-0 mt-0.5" />
                    <span className="text-[14px]">50 poeng per måned</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E07B3E] flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] font-semibold">Avansert tilbudsbygger med materialdatabase</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E07B3E] flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] font-semibold">Smarte kalkulatorer (tak, gulv, maling)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-[#E07B3E] flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] font-semibold">AI-assistent for tilbudskriving</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E07B3E] flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] font-semibold">Integrasjoner til Boligmappa og regnskapssystemer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E07B3E] flex-shrink-0 mt-0.5" />
                    <span className="text-[14px]">Premium plassering i søk</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E07B3E] flex-shrink-0 mt-0.5" />
                    <span className="text-[14px]">Dedikert kontaktperson</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan("pro")}
                className="w-full h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
              >
                Velg Pro
              </button>
            </div>
          </div>
        </div>

        {/* FAQ / Additional Info */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-[#111827] text-center mb-8">
            Spørsmål om abonnement?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <h4 className="font-semibold text-[#111827] mb-2">Kan jeg bytte plan senere?</h4>
              <p className="text-[14px] text-[#6B7280]">
                Ja, du kan når som helst oppgradere eller nedgradere din plan. 
                Endringer trer i kraft ved neste faktureringsperiode.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <h4 className="font-semibold text-[#111827] mb-2">Hva skjer med ubrukte poeng?</h4>
              <p className="text-[14px] text-[#6B7280] mb-2">
                Ubrukte poeng kan rulles over til neste måned, avhengig av din plan:
              </p>
              <ul className="text-[13px] text-[#6B7280] space-y-1">
                <li>• <strong>Light:</strong> Ingen rollover - bruk dem eller mist dem</li>
                <li>• <strong>Medium:</strong> Får rollover på 5 poeng per måned</li>
                <li>• <strong>Pro:</strong> Får rollover på 10 poeng per måned</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <h4 className="font-semibold text-[#111827] mb-2">Er det bindingstid?</h4>
              <p className="text-[14px] text-[#6B7280]">
                Nei, ingen bindingstid. Du kan si opp når som helst uten ekstra kostnader. 
                Du beholder tilgang ut inneværende betalingsperiode.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <h4 className="font-semibold text-[#111827] mb-2">Hva er 14 dagers gratis prøveperiode?</h4>
              <p className="text-[14px] text-[#6B7280]">
                Alle nye fagfolk får 14 dager gratis for å teste plattformen. 
                Ingen kredittkort påkrevd for å starte prøveperioden.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-[#17384E] to-[#2a5570] rounded-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-3">
              Klar til å komme i gang?
            </h3>
            <p className="text-[15px] text-white/90 mb-6">
              Bli med tusenvis av fornøyde kunder og fagfolk på Håndtverkeren
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/registrering?role=kunde")}
                className="h-12 px-8 bg-white text-[#17384E] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Registrer som kunde
              </button>
              <button
                onClick={() => navigate("/registrering?role=fagfolk")}
                className="h-12 px-8 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
              >
                Registrer som fagperson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}