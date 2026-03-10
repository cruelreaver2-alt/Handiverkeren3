import { useNavigate } from "react-router";
import { Lock, Sparkles, X } from "lucide-react";
import { useSubscription, SubscriptionTier } from "../contexts/SubscriptionContext";

interface UpgradePromptProps {
  feature: string;
  requiredTier: SubscriptionTier;
  onClose?: () => void;
  inline?: boolean;
}

export function UpgradePrompt({ feature, requiredTier, onClose, inline = false }: UpgradePromptProps) {
  const navigate = useNavigate();
  const { tier } = useSubscription();

  const tierNames = {
    light: "Light",
    medium: "Medium",
    pro: "Pro"
  };

  const tierPrices = {
    light: 499,
    medium: 799,
    pro: 1499
  };

  if (inline) {
    return (
      <div className="bg-gradient-to-br from-[#17384E] to-[#2a5570] rounded-lg p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#E07B3E] rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Oppgrader for å låse opp</h3>
              <p className="text-sm opacity-90">{feature}</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mb-4">
          <p className="text-sm opacity-90 mb-3">
            Du er på <strong>{tierNames[tier]}</strong>-planen. Oppgrader til <strong>{tierNames[requiredTier]}</strong> for å få tilgang til denne funksjonen.
          </p>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#E07B3E]" />
              <span className="font-semibold text-sm">{tierNames[requiredTier]}-plan</span>
            </div>
            <div className="text-2xl font-bold">{tierPrices[requiredTier]} kr/mnd</div>
          </div>
        </div>

        <button
          onClick={() => navigate("/pris")}
          className="w-full h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
        >
          Se alle planer
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#E07B3E]/10 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#E07B3E]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#111827]">Oppgrader planen din</h3>
              <p className="text-sm text-[#6B7280]">For å få tilgang til {feature}</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-[#F3F4F6] rounded transition-colors">
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          )}
        </div>

        <div className="mb-6">
          <p className="text-sm text-[#6B7280] mb-4">
            Du er på <strong className="text-[#111827]">{tierNames[tier]}</strong>-planen. 
            Oppgrader til <strong className="text-[#111827]">{tierNames[requiredTier]}</strong> eller høyere for å få tilgang til denne funksjonen.
          </p>

          <div className="bg-gradient-to-br from-[#17384E] to-[#2a5570] rounded-lg p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#E07B3E]" />
              <span className="font-semibold">{tierNames[requiredTier]}-plan</span>
            </div>
            <div className="text-3xl font-bold mb-1">{tierPrices[requiredTier]} kr</div>
            <div className="text-sm opacity-90">per måned</div>
          </div>
        </div>

        <div className="flex gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 h-12 border-2 border-[#E5E7EB] rounded-lg font-semibold text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
            >
              Avbryt
            </button>
          )}
          <button
            onClick={() => navigate("/pris")}
            className="flex-1 h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
          >
            Se alle planer
          </button>
        </div>
      </div>
    </div>
  );
}
