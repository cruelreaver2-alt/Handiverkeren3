import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Plus, X, Send, Clock, Package } from "lucide-react";

interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
}

export function SimplifiedOfferBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId") || "12345";

  // Offer details
  const [offerDescription, setOfferDescription] = useState("");
  const [laborHours, setLaborHours] = useState("");
  const [hourlyRate, setHourlyRate] = useState("950");
  const [estimatedDays, setEstimatedDays] = useState("");

  // Materials (manual input)
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    quantity: "",
    unit: "stk",
    pricePerUnit: "",
  });

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.quantity || !newMaterial.pricePerUnit) {
      alert("Vennligst fyll ut alle felt");
      return;
    }

    const quantity = parseFloat(newMaterial.quantity);
    const pricePerUnit = parseFloat(newMaterial.pricePerUnit);
    const totalPrice = quantity * pricePerUnit;

    const material: MaterialItem = {
      id: Date.now().toString(),
      name: newMaterial.name,
      quantity,
      unit: newMaterial.unit,
      pricePerUnit,
      totalPrice,
    };

    setMaterials([...materials, material]);
    setNewMaterial({ name: "", quantity: "", unit: "stk", pricePerUnit: "" });
    setShowAddMaterial(false);
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const handleSendOffer = () => {
    if (!offerDescription || !laborHours) {
      alert("Vennligst fyll ut beskrivelse og arbeidstimer");
      return;
    }

    alert("Tilbud sendt til kunde! De vil motta en e-post med detaljene.");
    navigate("/leverandør-dashboard");
  };

  // Calculate totals
  const materialsCost = materials.reduce((sum, m) => sum + m.totalPrice, 0);
  const laborCost = parseFloat(laborHours) * parseFloat(hourlyRate) || 0;
  const subtotal = materialsCost + laborCost;
  const vat = subtotal * 0.25;
  const total = subtotal + vat;

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/leverandør-dashboard")}
              className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#111827]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">Lag tilbud</h1>
              <p className="text-sm text-[#6B7280]">Jobb #{jobId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#E07B3E]/10 border border-[#E07B3E]/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-[#E07B3E] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[#111827] mb-1">
                Forenklet tilbudsbygger (Light)
              </h3>
              <p className="text-sm text-[#6B7280]">
                Du bruker Light-planen. Oppgrader til Medium eller Pro for tilgang til materialdatabase og avanserte kalkulatorer.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Offer Description */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-bold text-[#111827] mb-4">
              Beskrivelse av arbeidet
            </h2>
            <textarea
              placeholder="Beskriv arbeidet som skal utføres..."
              value={offerDescription}
              onChange={(e) => setOfferDescription(e.target.value)}
              className="w-full h-32 px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] resize-none"
            />
          </div>

          {/* Labor */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#E07B3E]" />
              <h2 className="text-lg font-bold text-[#111827]">Arbeid</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Antall timer
                </label>
                <input
                  type="number"
                  placeholder="f.eks. 40"
                  value={laborHours}
                  onChange={(e) => setLaborHours(e.target.value)}
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Timepris (kr)
                </label>
                <input
                  type="number"
                  placeholder="f.eks. 950"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Estimert varighet (dager)
                </label>
                <input
                  type="number"
                  placeholder="f.eks. 5"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
              </div>
            </div>

            {laborHours && hourlyRate && (
              <div className="mt-4 p-4 bg-[#F3F4F6] rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">
                    Arbeidskostnad ({laborHours} timer × {hourlyRate} kr)
                  </span>
                  <span className="text-lg font-bold text-[#17384E]">
                    {laborCost.toLocaleString('nb-NO')} kr
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Materials */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#E07B3E]" />
                <h2 className="text-lg font-bold text-[#111827]">Materialer</h2>
              </div>
              <button
                onClick={() => setShowAddMaterial(true)}
                className="flex items-center gap-2 px-4 h-10 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Legg til materiale
              </button>
            </div>

            {/* Add Material Form */}
            {showAddMaterial && (
              <div className="bg-[#F3F4F6] rounded-lg p-4 mb-4">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#111827] mb-2">
                      Materialenavn
                    </label>
                    <input
                      type="text"
                      placeholder="f.eks. Gips 13mm"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                      className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111827] mb-2">
                      Mengde
                    </label>
                    <input
                      type="number"
                      placeholder="10"
                      value={newMaterial.quantity}
                      onChange={(e) => setNewMaterial({ ...newMaterial, quantity: e.target.value })}
                      className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111827] mb-2">
                      Enhet
                    </label>
                    <select
                      value={newMaterial.unit}
                      onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                      className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                    >
                      <option value="stk">stk</option>
                      <option value="m²">m²</option>
                      <option value="m">m</option>
                      <option value="liter">liter</option>
                      <option value="kg">kg</option>
                      <option value="sekk">sekk</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#111827] mb-2">
                      Pris per enhet (kr)
                    </label>
                    <input
                      type="number"
                      placeholder="199"
                      value={newMaterial.pricePerUnit}
                      onChange={(e) => setNewMaterial({ ...newMaterial, pricePerUnit: e.target.value })}
                      className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddMaterial}
                    className="flex-1 h-10 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
                  >
                    Legg til
                  </button>
                  <button
                    onClick={() => setShowAddMaterial(false)}
                    className="h-10 px-4 border border-[#E5E7EB] rounded-lg font-semibold text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            )}

            {/* Materials List */}
            {materials.length === 0 ? (
              <div className="text-center py-8 text-[#6B7280]">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Ingen materialer lagt til ennå</p>
              </div>
            ) : (
              <div className="space-y-2">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-3 bg-[#F3F4F6] rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-[#111827]">{material.name}</div>
                      <div className="text-sm text-[#6B7280]">
                        {material.quantity} {material.unit} × {material.pricePerUnit.toLocaleString('nb-NO')} kr
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#17384E]">
                        {material.totalPrice.toLocaleString('nb-NO')} kr
                      </span>
                      <button
                        onClick={() => handleRemoveMaterial(material.id)}
                        className="p-1 hover:bg-white rounded transition-colors"
                      >
                        <X className="w-5 h-5 text-[#DC2626]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {materials.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#111827]">Total materialkostnad</span>
                  <span className="text-xl font-bold text-[#17384E]">
                    {materialsCost.toLocaleString('nb-NO')} kr
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-bold text-[#111827] mb-4">Oppsummering</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-[#111827]">
                <span>Arbeid</span>
                <span className="font-semibold">{laborCost.toLocaleString('nb-NO')} kr</span>
              </div>
              <div className="flex justify-between text-[#111827]">
                <span>Materialer</span>
                <span className="font-semibold">{materialsCost.toLocaleString('nb-NO')} kr</span>
              </div>
              <div className="flex justify-between text-[#111827] pt-3 border-t border-[#E5E7EB]">
                <span>Subtotal</span>
                <span className="font-semibold">{subtotal.toLocaleString('nb-NO')} kr</span>
              </div>
              <div className="flex justify-between text-[#6B7280]">
                <span>MVA (25%)</span>
                <span>{vat.toLocaleString('nb-NO')} kr</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#17384E] pt-3 border-t border-[#E5E7EB]">
                <span>Total inkl. MVA</span>
                <span>{total.toLocaleString('nb-NO')} kr</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/leverandør-dashboard")}
              className="flex-1 h-12 border-2 border-[#E5E7EB] rounded-lg font-semibold text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
            >
              Avbryt
            </button>
            <button
              onClick={handleSendOffer}
              className="flex-1 h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send tilbud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
