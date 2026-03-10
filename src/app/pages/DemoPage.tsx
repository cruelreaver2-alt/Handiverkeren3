import { Link } from "react-router";
import { Header } from "../components/Header";
import { User, Briefcase, ArrowRight } from "lucide-react";

export function DemoPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#111827] mb-4">
            Velkommen til Håndtverkeren Demo
          </h1>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            Test hele plattformen som kunde eller leverandør. Alle features er
            fullt funksjonelle med demo-data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Customer Journey */}
          <div className="bg-white rounded-lg border-2 border-[#E07B3E] p-8">
            <div className="w-16 h-16 bg-[#E07B3E] rounded-lg flex items-center justify-center mb-6">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-4">
              Test som Kunde
            </h2>
            <p className="text-[#6B7280] mb-6">
              Opprett forespørsler, motta tilbud fra fagfolk, chat i sanntid og
              godkjenn arbeid med escrow-betaling.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#E07B3E] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="font-medium text-[#111827]">Se dashboard</div>
                  <div className="text-sm text-[#6B7280]">
                    Oversikt over forespørsler og aktivitet
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#E07B3E] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="font-medium text-[#111827]">
                    Opprett forespørsel
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    4-stegs skjema med bilder og preferanser
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#E07B3E] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-medium text-[#111827]">Se tilbud</div>
                  <div className="text-sm text-[#6B7280]">
                    Sammenlign priser og fagfolk
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#E07B3E] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <div className="font-medium text-[#111827]">
                    Chat og godkjenn
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    Kommuniser og betal via escrow
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/dashboard"
                className="w-full h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors flex items-center justify-center gap-2"
              >
                Gå til Kunde Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/opprett-forespørsel"
                className="w-full h-12 border-2 border-[#E07B3E] text-[#E07B3E] rounded-lg font-semibold hover:bg-[#E07B3E] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                Opprett forespørsel
              </Link>
              <Link
                to="/mine-forespørsler"
                className="w-full h-12 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                Se forespørsler (demo data)
              </Link>
              <Link
                to="/meldinger"
                className="w-full h-12 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                Åpne chat
              </Link>
            </div>
          </div>

          {/* Supplier Journey */}
          <div className="bg-white rounded-lg border-2 border-[#17384E] p-8">
            <div className="w-16 h-16 bg-[#17384E] rounded-lg flex items-center justify-center mb-6">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-4">
              Test som Leverandør
            </h2>
            <p className="text-[#6B7280] mb-6">
              Finn jobber, send tilbud med priser og betingelser, chat med
              kunder og administrer aktive prosjekter.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#17384E] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="font-medium text-[#111827]">Se dashboard</div>
                  <div className="text-sm text-[#6B7280]">
                    Statistikk, inntjening og aktivitet
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#17384E] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="font-medium text-[#111827]">Finn jobber</div>
                  <div className="text-sm text-[#6B7280]">
                    Søk, filtrer og sorter tilgjengelige jobber
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#17384E] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-medium text-[#111827]">Send tilbud</div>
                  <div className="text-sm text-[#6B7280]">
                    Sett pris, tidslinje og betalingsbetingelser
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#17384E] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <div className="font-medium text-[#111827]">
                    Administrer tilbud
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    Følg opp og se status på alle tilbud
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/leverandør-dashboard"
                className="w-full h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors flex items-center justify-center gap-2"
              >
                Gå til Leverandør Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/tilgjengelige-jobber"
                className="w-full h-12 border-2 border-[#17384E] text-[#17384E] rounded-lg font-semibold hover:bg-[#17384E] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                Se tilgjengelige jobber
              </Link>
              <Link
                to="/mine-tilbud"
                className="w-full h-12 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                Se mine tilbud (demo data)
              </Link>
              <Link
                to="/meldinger"
                className="w-full h-12 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                Åpne chat
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-8">
          <h3 className="text-xl font-bold text-[#111827] mb-6">
            Andre features å utforske
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/sperret-konto?jobId=demo&amount=15000&supplier=Demo Leverandør&depositPercent=50&paymentType=upfront"
              className="p-4 border border-[#E5E7EB] rounded-lg hover:border-[#17384E] transition-colors"
            >
              <h4 className="font-semibold text-[#111827] mb-2">
                💰 Escrow-betaling
              </h4>
              <p className="text-sm text-[#6B7280]">
                Test sikker betalingsflyt med sperret konto
              </p>
            </Link>
            <Link
              to="/godkjenn-arbeid?jobId=demo&userType=customer"
              className="p-4 border border-[#E5E7EB] rounded-lg hover:border-[#17384E] transition-colors"
            >
              <h4 className="font-semibold text-[#111827] mb-2">
                ✅ Godkjenn arbeid
              </h4>
              <p className="text-sm text-[#6B7280]">
                Dual-approval system for utbetaling
              </p>
            </Link>
            <Link
              to="/pris"
              className="p-4 border border-[#E5E7EB] rounded-lg hover:border-[#17384E] transition-colors"
            >
              <h4 className="font-semibold text-[#111827] mb-2">
                📊 Prising & Abonnement
              </h4>
              <p className="text-sm text-[#6B7280]">
                4 nivåer fra gratis til premium
              </p>
            </Link>
          </div>
        </div>

        {/* Tech Stack Info */}
        <div className="mt-8 p-6 bg-[#17384E] text-white rounded-lg">
          <h3 className="text-xl font-bold mb-4">🚀 Teknisk stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-1">Frontend</div>
              <div className="text-white/80">React + TypeScript</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Routing</div>
              <div className="text-white/80">React Router v7</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Backend</div>
              <div className="text-white/80">Supabase Edge Functions</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Database</div>
              <div className="text-white/80">KV Store (Supabase)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
