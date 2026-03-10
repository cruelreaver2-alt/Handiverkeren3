import { useNavigate } from "react-router";
import { useSubscription, SubscriptionTier } from "../contexts/SubscriptionContext";
import { Check, Star, Zap, Sparkles, ArrowLeft } from "lucide-react";

export function SubscriptionSettings() {
  const navigate = useNavigate();
  const { tier, setTier, hasAccess } = useSubscription();

  const plans: { id: SubscriptionTier; name: string; price: number; icon: any }[] = [
    { id: "light", name: "Light", price: 499, icon: Star },
    { id: "medium", name: "Medium", price: 799, icon: Zap },
    { id: "pro", name: "Pro", price: 1499, icon: Sparkles },
  ];

  const features = [
    { id: "basic-offers", name: "Grunnleggende tilbud", tiers: ["light", "medium", "pro"] },
    { id: "portfolio", name: "Porteføljesider", tiers: ["medium", "pro"] },
    { id: "advanced-offers", name: "Avanserte tilbud", tiers: ["pro"] },
    { id: "material-database", name: "Materialdatabase", tiers: ["pro"] },
    { id: "calculators", name: "Kalkulatorer", tiers: ["pro"] },
    { id: "ai-assistant", name: "AI-assistent", tiers: ["pro"] },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => navigate("/leverandør-dashboard")}
              className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-[#111827]" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#111827]">Abonnementsinnstillinger</h1>
              <p className="text-xs md:text-sm text-[#6B7280]">Administrer ditt abonnement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Current Plan */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 md:p-6 mb-6">
          <h2 className="text-base md:text-lg font-bold text-[#111827] mb-4">Din nåværende plan</h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xl md:text-2xl font-bold text-[#17384E] mb-1">
                {plans.find(p => p.id === tier)?.name || "Pro"}
              </div>
              <div className="text-sm text-[#6B7280]">
                {plans.find(p => p.id === tier)?.price || 1499} kr / måned
              </div>
            </div>
            <button
              onClick={() => navigate("/pris")}
              className="h-10 px-4 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors w-full sm:w-auto"
            >
              Se alle planer
            </button>
          </div>
        </div>

        {/* Test Plans (Development Only) */}
        <div className="bg-gradient-to-br from-[#17384E] to-[#2a5570] rounded-lg p-4 md:p-6 mb-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-[#E07B3E] text-white text-xs font-bold rounded">DEV</span>
            <h2 className="text-base md:text-lg font-bold">Test subscription tiers</h2>
          </div>
          <p className="text-xs md:text-sm opacity-90 mb-4">
            Bytt mellom planer for å teste funksjonalitet (kun synlig i utviklingsmiljø)
          </p>

          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isActive = tier === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setTier(plan.id)}
                  className={`p-3 md:p-4 rounded-lg border-2 transition-all ${
                    isActive
                      ? "bg-white text-[#17384E] border-white"
                      : "bg-white/10 border-white/20 hover:bg-white/20"
                  }`}
                >
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 ${isActive ? "text-[#E07B3E]" : ""}`} />
                  <div className={`text-sm md:text-base font-bold mb-1 ${isActive ? "" : "opacity-90"}`}>
                    {plan.name}
                  </div>
                  <div className={`text-xs md:text-sm ${isActive ? "" : "opacity-75"}`}>
                    {plan.price} kr
                  </div>
                  {isActive && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-[#E07B3E] text-white text-xs font-semibold rounded">
                      <Check className="w-3 h-3" />
                      Aktiv
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Access Matrix */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
          <h2 className="text-lg font-bold text-[#111827] mb-4">Funksjonstilgang</h2>
          <div className="space-y-2">
            {features.map((feature) => {
              const hasTierAccess = feature.tiers.includes(tier);
              return (
                <div
                  key={feature.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    hasTierAccess ? "bg-green-50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {hasTierAccess ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={`font-medium ${hasTierAccess ? "text-[#111827]" : "text-[#6B7280]"}`}>
                      {feature.name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {feature.tiers.map((t) => (
                      <span
                        key={t}
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          t === tier
                            ? "bg-[#17384E] text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {plans.find(p => p.id === t)?.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/bygg-tilbud/req-demo-001")}
            className="h-12 px-6 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
          >
            Test tilbudsbygger
          </button>
          <button
            onClick={() => navigate("/leverandør/supplier-001")}
            className="h-12 px-6 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-[#F3F4F6] transition-colors"
          >
            Se min profil
          </button>
        </div>
      </div>
    </div>
  );
}