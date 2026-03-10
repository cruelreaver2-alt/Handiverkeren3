import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Header } from "../components/Header";
import { Star, MapPin, Calendar, Shield, Check, MessageSquare, Phone, Info } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const mockOffers = [
  {
    id: 1,
    supplier: {
      name: "Ole Hansen Tømrer",
      rating: 4.9,
      reviews: 47,
      image: "https://images.unsplash.com/photo-1667922578520-61558e79aa7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFmdHNtYW4lMjBjYXJwZW50ZXIlMjB3b3JraW5nfGVufDF8fHx8MTc3MzA3NzEwMXww&ixlib=rb-4.1.0&q=80&w=1080",
      verified: true,
    },
    price: 12000,
    description: "Jeg kan utføre arbeidet profesjonelt og raskt. Har lang erfaring med dette type jobber.",
    timeline: "2-3 dager",
    warranty: "2 år garanti",
    paymentOption: "upfront", // "upfront" or "postpaid"
    depositPercentage: 50, // 25, 50, or 100
  },
  {
    id: 2,
    supplier: {
      name: "Kari Johansen Rørlegger",
      rating: 5.0,
      reviews: 62,
      image: "https://images.unsplash.com/photo-1764328165995-0624c280a6d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzMwNzcxMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      verified: true,
    },
    price: 15000,
    description: "Kan starte i morgen. Inkluderer alle materialer og oppussing etter arbeid.",
    timeline: "1-2 dager",
    warranty: "5 år garanti",
    paymentOption: "upfront",
    depositPercentage: 25,
  },
  {
    id: 3,
    supplier: {
      name: "Erik Nilsen Elektro",
      rating: 4.8,
      reviews: 38,
      image: "https://images.unsplash.com/photo-1659353588580-8da374e328a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHByb2Zlc3Npb25hbCUyMG1hbGV8ZW58MXx8fHwxNzczMDc3MTAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      verified: true,
    },
    price: 13500,
    description: "Autorisert elektriker med lang erfaring. God pris på materialer.",
    timeline: "3-4 dager",
    warranty: "3 år garanti",
    paymentOption: "postpaid",
    depositPercentage: 100,
  },
];

export function JobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  const [showEscrowModal, setShowEscrowModal] = useState(false);

  const handleAcceptOffer = (offerId: number) => {
    setSelectedOffer(offerId);
    setShowEscrowModal(true);
  };

  const handlePayWithEscrow = () => {
    const offer = mockOffers.find(o => o.id === selectedOffer);
    if (offer) {
      const params = new URLSearchParams({
        jobId: id || "12345",
        amount: offer.price.toString(),
        supplier: offer.supplier.name,
        depositPercent: offer.depositPercentage.toString(),
        paymentType: offer.paymentOption,
      });
      navigate(`/sperret-konto?${params.toString()}`);
    }
  };

  const handlePayDirectly = () => {
    setShowEscrowModal(false);
    alert("Du kan avtale betalingsdetaljer direkte med fagpersonen via chat eller telefon.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header variant="simple" title="Tilbud på jobb" onBack={() => navigate(-1)} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Job Info */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h1 className="text-2xl font-bold text-[#111827] mb-3">Bytte dørhengsler</h1>
          <div className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Oslo</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Opprettet: 2 timer siden</span>
            </div>
          </div>
          <p className="mt-4 text-[15px] text-[#111827]">
            Trenger å bytte ut dørhengsler på innerdør. Døren henger ikke riktig og må justeres.
          </p>
        </div>

        {/* Offers Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#111827]">
            {mockOffers.length} tilbud mottatt
          </h2>
          <div className="text-sm text-[#6B7280]">
            Sortert etter pris
          </div>
        </div>

        {/* Offers List */}
        <div className="space-y-4">
          {mockOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-lg border border-[#E5E7EB] p-6"
            >
              {/* Supplier Info */}
              <div className="flex items-start gap-4 mb-4">
                <ImageWithFallback
                  src={offer.supplier.image}
                  alt={offer.supplier.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[#111827]">{offer.supplier.name}</h3>
                    {offer.supplier.verified && (
                      <div className="flex items-center gap-1 bg-[#17384E] text-white text-xs px-2 py-0.5 rounded">
                        <Shield className="w-3 h-3" />
                        <span>Verifisert</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{offer.supplier.rating}</span>
                    </div>
                    <span className="text-[#6B7280]">({offer.supplier.reviews} anmeldelser)</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#17384E]">
                    {offer.price.toLocaleString('nb-NO')} kr
                  </div>
                  <div className="text-xs text-[#6B7280]">Inkl. mva</div>
                </div>
              </div>

              {/* Offer Details */}
              <div className="mb-4">
                <p className="text-[14px] text-[#111827] mb-3">{offer.description}</p>
                <div className="flex flex-wrap gap-4 text-[13px] mb-3">
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <Calendar className="w-4 h-4" />
                    <span>{offer.timeline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <Shield className="w-4 h-4" />
                    <span>{offer.warranty}</span>
                  </div>
                </div>

                {/* Payment Terms */}
                <div className="bg-[#F3F4F6] rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#17384E] flex-shrink-0 mt-0.5" />
                    <div className="text-[13px]">
                      {offer.paymentOption === "upfront" ? (
                        <span className="text-[#111827]">
                          <strong>Forskuddsbetaling:</strong> {offer.depositPercentage}% ({(offer.price * offer.depositPercentage / 100).toLocaleString('nb-NO')} kr) 
                          betales til sperret konto før oppstart
                          {offer.depositPercentage < 100 && (
                            <span>, resterende {100 - offer.depositPercentage}% ({(offer.price * (100 - offer.depositPercentage) / 100).toLocaleString('nb-NO')} kr) ved ferdigstillelse</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-[#111827]">
                          <strong>Etterskuddsbetaling:</strong> Betaling til sperret konto ved ferdigstillelse
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAcceptOffer(offer.id)}
                  className="flex-1 h-11 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Godta tilbud
                </button>
                <button className="h-11 px-4 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button className="h-11 px-4 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escrow Payment Modal */}
      {showEscrowModal && selectedOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEscrowModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#111827] mb-4">Velg betalingsmåte</h2>
            
            <p className="text-[14px] text-[#6B7280] mb-6">
              Du har godtatt tilbudet fra {mockOffers.find(o => o.id === selectedOffer)?.supplier.name} 
              på {mockOffers.find(o => o.id === selectedOffer)?.price.toLocaleString('nb-NO')} kr.
            </p>

            {/* Escrow Option */}
            <div className="border-2 border-[#17384E] rounded-lg p-5 mb-4 bg-[#17384E]/5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-[#17384E] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827] mb-1">Betal til sperret konto (Anbefalt)</h3>
                  <p className="text-[13px] text-[#6B7280]">
                    Pengene holdes sikkert til du godkjenner arbeidet. Gir trygghet for både deg og fagpersonen.
                  </p>
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-[13px]">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[#6B7280]">Pengene utbetales kun når du godkjenner</span>
                </li>
                <li className="flex items-start gap-2 text-[13px]">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[#6B7280]">Fagpersonen vet at betalingen er sikret</span>
                </li>
                <li className="flex items-start gap-2 text-[13px]">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[#6B7280]">Tvisteløsning inkludert hvis nødvendig</span>
                </li>
              </ul>
              <button
                onClick={handlePayWithEscrow}
                className="w-full h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
              >
                Betal til sperret konto
              </button>
            </div>

            {/* Direct Payment Option */}
            <div className="border-2 border-[#E5E7EB] rounded-lg p-5 mb-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-[#E5E7EB] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-[#6B7280]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827] mb-1">Betal direkte til fagperson</h3>
                  <p className="text-[13px] text-[#6B7280]">
                    Avtal betalingsdetaljer direkte med fagpersonen. Ingen gebyr fra Håndtverkeren.
                  </p>
                </div>
              </div>
              <button
                onClick={handlePayDirectly}
                className="w-full h-12 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Avtal direkte betaling
              </button>
            </div>

            <button
              onClick={() => setShowEscrowModal(false)}
              className="w-full text-[14px] text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}