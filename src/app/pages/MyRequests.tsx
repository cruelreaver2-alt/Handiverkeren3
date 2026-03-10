import { Link, useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Clock, CheckCircle, MessageSquare, Plus, Shield, AlertCircle, Check } from "lucide-react";

const mockRequests = [
  {
    id: 1,
    title: "Bytte dørhengsler",
    category: "Tømrer",
    status: "waiting",
    offers: 3,
    createdAt: "2 timer siden",
    escrowStatus: null,
  },
  {
    id: 2,
    title: "Reparere lekkasje i badet",
    category: "Rørlegger",
    status: "active",
    offers: 5,
    createdAt: "1 dag siden",
    escrowStatus: "awaiting_dual_approval",
    escrowAmount: 15375,
    supplier: "Kari Johansen Rørlegger",
    customerApproved: false,
    supplierApproved: false,
  },
  {
    id: 3,
    title: "Installere nye stikkontakter",
    category: "Elektro",
    status: "quote_accepted",
    offers: 4,
    createdAt: "3 dager siden",
    escrowStatus: "funded",
    escrowAmount: 8713, // 8500 + 2.5% fee
    supplier: "Erik Nilsen Elektro",
    depositPercent: 50,
  },
  {
    id: 4,
    title: "Male stue",
    category: "Maler",
    status: "completed",
    offers: 6,
    createdAt: "5 dager siden",
    escrowStatus: "completed",
    escrowAmount: 20500,
    supplier: "Ola Nordmann Malerbedrift",
    customerApproved: true,
    supplierApproved: true,
  },
];

export function MyRequests() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#111827]">Mine forespørsler</h1>
          <Link
            to="/opprett-forespørsel"
            className="flex items-center gap-2 h-10 px-4 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Ny forespørsel
          </Link>
        </div>

        {mockRequests.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center" style={{ boxShadow: '0 6px 18px rgba(23, 56, 78, 0.08)' }}>
            <div className="w-16 h-16 bg-[#E07B3E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-[#E07B3E]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827] mb-2">Ingen forespørsler ennå</h2>
            <p className="text-[14px] text-[#6B7280] mb-6">
              Opprett din første forespørsel for å få tilbud fra kvalifiserte fagfolk
            </p>
            <Link
              to="/opprett-forespørsel"
              className="inline-flex items-center gap-2 h-12 px-6 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Opprett forespørsel
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mockRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
                style={{ boxShadow: '0 6px 18px rgba(23, 56, 78, 0.08)' }}
                onClick={() => navigate(`/forespørsel/${request.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-[#E07B3E] bg-[#E07B3E]/10 px-2 py-1 rounded">
                        {request.category}
                      </span>
                      {request.status === "waiting" && (
                        <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                          <Clock className="w-3 h-3" />
                          Venter på tilbud
                        </span>
                      )}
                      {request.status === "active" && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          Aktiv
                        </span>
                      )}
                      {request.status === "quote_accepted" && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          Tilbud godtatt
                        </span>
                      )}
                      {request.status === "completed" && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          Fullført
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-[#111827] mb-1">{request.title}</h3>
                    <p className="text-sm text-[#6B7280]">{request.createdAt}</p>
                    {request.supplier && (
                      <p className="text-sm text-[#6B7280] mt-1">Fagperson: {request.supplier}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#17384E]">{request.offers}</div>
                    <div className="text-xs text-[#6B7280]">tilbud</div>
                  </div>
                </div>

                {/* Escrow Status */}
                {request.escrowStatus && (
                  <div className="mb-4" onClick={(e) => e.stopPropagation()}>
                    {request.escrowStatus === "funded" && (
                      <div className="bg-[#F0FDF4] border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-green-900 mb-1">
                              Pengene er sikret på sperret konto
                            </p>
                            <p className="text-xs text-green-700">
                              {request.escrowAmount?.toLocaleString('nb-NO')} kr venter på godkjenning av arbeid
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {request.escrowStatus === "awaiting_dual_approval" && (
                      <div className="bg-[#FEF3E2] border border-[#E07B3E]/20 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <AlertCircle className="w-5 h-5 text-[#E07B3E] flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#111827] mb-2">
                              Arbeidet er ferdig - godkjenn for utbetaling
                            </p>
                            <div className="flex items-center gap-4 text-xs mb-2">
                              <div className="flex items-center gap-2">
                                {request.customerApproved ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Clock className="w-4 h-4 text-[#6B7280]" />
                                )}
                                <span className={request.customerApproved ? "text-green-700" : "text-[#6B7280]"}>
                                  Kunde {request.customerApproved ? "godkjent" : "venter"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {request.supplierApproved ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Clock className="w-4 h-4 text-[#6B7280]" />
                                )}
                                <span className={request.supplierApproved ? "text-green-700" : "text-[#6B7280]"}>
                                  Fagperson {request.supplierApproved ? "godkjent" : "venter"}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-[#6B7280]">
                              {request.escrowAmount?.toLocaleString('nb-NO')} kr frigjøres når begge parter har godkjent
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/godkjenn-arbeid?jobId=${request.id}&userType=customer`);
                          }}
                          className="w-full h-10 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-5 h-5" />
                          Godkjenn eller avvis arbeid
                        </button>
                      </div>
                    )}

                    {request.escrowStatus === "completed" && (
                      <div className="bg-[#F0FDF4] border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-green-900 mb-1">
                              Pengene er utbetalt
                            </p>
                            <p className="text-xs text-green-700">
                              {request.escrowAmount?.toLocaleString('nb-NO')} kr er utbetalt til {request.supplier}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <button className="w-full h-10 border border-[#17384E] text-[#17384E] rounded-lg font-semibold hover:bg-[#17384E] hover:text-white transition-colors">
                  Se tilbud
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}