import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useSubscription } from "../contexts/SubscriptionContext";

export function OfferBuilderRouter() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { tier } = useSubscription();

  useEffect(() => {
    // Route to correct offer builder based on subscription tier
    switch (tier) {
      case "light":
        navigate(`/bygg-tilbud-enkel/${jobId}`, { replace: true });
        break;
      case "medium":
        navigate(`/bygg-tilbud-medium/${jobId}`, { replace: true });
        break;
      case "pro":
        navigate(`/bygg-tilbud-pro/${jobId}`, { replace: true });
        break;
      default:
        navigate(`/bygg-tilbud-enkel/${jobId}`, { replace: true });
    }
  }, [tier, jobId, navigate]);

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#17384E] mx-auto mb-4"></div>
        <p className="text-[#6B7280]">Laster tilbudsbygger...</p>
      </div>
    </div>
  );
}
