import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Upload, X, MapPin, Calendar, HelpCircle } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  category: string;
  productName: string;
  title: string;
  description: string;
  images: File[];
  location: string;
  postalCode: string;
  startDate: string;
  endDate: string;
  asap: boolean;
  budgetMin: number;
  budgetMax: number;
  verifiedOnly: boolean;
  fixedPriceOnly: boolean;
  minRating: boolean;
}

export function CreateRequest() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    category: "",
    productName: "",
    title: "",
    description: "",
    images: [],
    location: "",
    postalCode: "",
    startDate: "",
    endDate: "",
    asap: false,
    budgetMin: 5000,
    budgetMax: 50000,
    verifiedOnly: true,
    fixedPriceOnly: false,
    minRating: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.category) newErrors.category = "Kategori er påkrevd";
      if (!formData.title) newErrors.title = "Tittel er påkrevd";
      if (!formData.description) newErrors.description = "Beskrivelse er påkrevd";
    }

    if (currentStep === 3) {
      if (!formData.location && !formData.postalCode) {
        newErrors.location = "Lokasjon er påkrevd";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.size <= 2 * 1024 * 1024); // 2MB max
    
    if (validFiles.length < files.length) {
      setErrors(prev => ({ ...prev, images: "Noen bilder er for store (maks 2MB)" }));
    } else {
      setErrors(prev => ({ ...prev, images: "" }));
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles].slice(0, 8)
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      const customerId = "customer-001"; // TODO: Get from auth
      
      const requestData = {
        customerId,
        category: formData.category,
        productName: formData.productName,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        postalCode: formData.postalCode,
        startDate: formData.startDate,
        endDate: formData.endDate,
        asap: formData.asap,
        budgetMin: formData.budgetMin,
        budgetMax: formData.budgetMax,
        verifiedOnly: formData.verifiedOnly,
        fixedPriceOnly: formData.fixedPriceOnly,
        minRating: formData.minRating,
        // Note: Images are not stored in KV for now - would need blob storage
        imageCount: formData.images.length,
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create request");
      }

      setShowConfirmation(true);
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Kunne ikke opprette forespørsel. Prøv igjen.");
    }
  };

  const handleSaveDraft = () => {
    // Save as draft logic
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header variant="simple" title="Opprett forespørsel" onBack={() => navigate(-1)} />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= step
                      ? "bg-[#17384E] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step ? "bg-[#17384E]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-[#6B7280]">
            <span>Grunninfo</span>
            <span>Bilder</span>
            <span>Lokasjon</span>
            <span>Preferanser</span>
          </div>
        </div>

        {/* Step 1: Grunninfo */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-[13px] text-[#6B7280] mb-2">Kategori *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full h-12 px-4 pr-10 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
              >
                <option value="">Velg kategori</option>
                <option value="trevare">Tømrer</option>
                <option value="ror">Rørlegger</option>
                <option value="elektrisk">Elektro</option>
                <option value="maling">Maling</option>
                <option value="entreprenor">Entreprenør</option>
                <option value="garasjeport">Garasjeport</option>
                <option value="varmepumpe">Varmepumpe</option>
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>

            {/* Product/Material Search - show for all categories */}
            {formData.category && (
              <div>
                <label className="block text-[13px] text-[#6B7280] mb-2">
                  Produkter eller materialer (valgfritt)
                </label>
                <input
                  type="text"
                  placeholder="F.eks: Nibe F2120 varmepumpe, Jøtul Peisovn F370, Beckers maling hvit matt"
                  value={formData.productName}
                  onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
                <p className="text-[13px] text-[#6B7280] mt-2">
                  💡 Spesifiser merke, modell og størrelse for mer presise tilbud
                </p>
              </div>
            )}

            <div>
              <label className="block text-[13px] text-[#6B7280] mb-2">Kort tittel av jobben *</label>
              <input
                type="text"
                placeholder="Eks: Bytte dørhengsler"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full h-12 px-4 border rounded-lg ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#17384E]`}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-[13px] text-[#6B7280] mb-2">Beskrivelse *</label>
              <textarea
                placeholder="Beskriv jobben detaljert. Legg ved mål, materialer og ønsket tidsrom."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg resize-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#17384E]`}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              <p className="text-[13px] text-[#6B7280] mt-2">
                💡 Tips: ta bilder og mål for raskere tilbud
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Bilder */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-[13px] text-[#6B7280] mb-2">Last opp bilder (valgfritt, maks 8)</label>
              <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-8">
                <input
                  type="file"
                  id="images"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
                <label
                  htmlFor="images"
                  className="flex flex-col items-center gap-3 cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-[#6B7280]" />
                  <p className="text-[14px] text-[#111827] font-medium">
                    Dra bilder hit eller trykk for å velge
                  </p>
                  <p className="text-[13px] text-[#6B7280]">
                    PNG, JPG opptil 2MB per bilde
                  </p>
                </label>
              </div>
              {errors.images && <p className="text-xs text-red-500 mt-2">{errors.images}</p>}
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Lokasjon & tid */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-[13px] text-[#6B7280] mb-2">Lokasjon *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Søk etter adresse..."
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className={`w-full h-12 pl-10 pr-4 border rounded-lg ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#17384E]`}
                />
              </div>
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-[13px] text-[#6B7280] mb-2">Postnummer</label>
              <input
                type="text"
                placeholder="0123"
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={formData.asap}
                  onChange={(e) => setFormData(prev => ({ ...prev, asap: e.target.checked }))}
                  className="w-5 h-5 text-[#17384E] rounded"
                />
                <span className="text-[14px] text-[#111827]">Så snart som mulig (ASAP)</span>
              </label>
            </div>

            {!formData.asap && (
              <>
                <div>
                  <label className="block text-[13px] text-[#6B7280] mb-2">Ønsket startdato</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] text-[#6B7280] mb-2">Ønsket sluttdato (valgfritt)</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 4: Preferanser & budsjett */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-[13px] text-[#6B7280] mb-4">Budsjett (valgfritt)</label>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={formData.budgetMax}
                  onChange={(e) => setFormData(prev => ({ ...prev, budgetMax: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #17384E 0%, #17384E ${(formData.budgetMax / 100000) * 100}%, #E5E7EB ${(formData.budgetMax / 100000) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-[#6B7280] mb-1">Min</label>
                    <input
                      type="number"
                      value={formData.budgetMin}
                      onChange={(e) => setFormData(prev => ({ ...prev, budgetMin: parseInt(e.target.value) || 0 }))}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-[#6B7280] mb-1">Maks</label>
                    <input
                      type="number"
                      value={formData.budgetMax}
                      onChange={(e) => setFormData(prev => ({ ...prev, budgetMax: parseInt(e.target.value) || 0 }))}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[13px] text-[#6B7280] mb-3">Preferanser</label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#17384E] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.verifiedOnly}
                    onChange={(e) => setFormData(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                    className="mt-1 w-5 h-5 text-[#17384E] rounded"
                  />
                  <div>
                    <span className="text-[14px] text-[#111827] font-medium block">Kun verifiserte fagfolk</span>
                    <span className="text-[13px] text-[#6B7280]">Motta kun tilbud fra godkjente håndverkere</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#17384E] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.fixedPriceOnly}
                    onChange={(e) => setFormData(prev => ({ ...prev, fixedPriceOnly: e.target.checked }))}
                    className="mt-1 w-5 h-5 text-[#17384E] rounded"
                  />
                  <div>
                    <span className="text-[14px] text-[#111827] font-medium block">Få faste pris-pakker</span>
                    <span className="text-[13px] text-[#6B7280]">Kun fastpriser, ingen timebaserte tilbud</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#17384E] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.minRating}
                    onChange={(e) => setFormData(prev => ({ ...prev, minRating: e.target.checked }))}
                    className="mt-1 w-5 h-5 text-[#17384E] rounded"
                  />
                  <div>
                    <span className="text-[14px] text-[#111827] font-medium block">Vis kun leverandører med rating ≥ 4.5</span>
                    <span className="text-[13px] text-[#6B7280]">Kun hyt rangerte fagfolk</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="flex-1 h-14 border-2 border-[#17384E] text-[#17384E] rounded-lg font-semibold hover:bg-[#17384E] hover:text-white transition-colors"
            >
              Tilbake
            </button>
          )}
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="flex-1 h-14 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
            >
              Neste
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 h-14 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
            >
              Send forespørsel
            </button>
          )}
        </div>

        {currentStep === 4 && (
          <button
            onClick={handleSaveDraft}
            className="w-full h-12 text-[#17384E] rounded-lg font-semibold hover:bg-gray-100 transition-colors mt-3"
          >
            Lagre som utkast
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowConfirmation(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#111827] mb-2">Forespørsel sendt!</h2>
              <p className="text-[14px] text-[#6B7280]">
                Vi sender forespørselen til relevante fagfolk i ditt område. Du får svar innen 24 timer.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/mine-forespørsler")}
                className="w-full h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
              >
                Gå til mine forespørsler
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setCurrentStep(1);
                  setFormData({
                    category: "",
                    productName: "",
                    title: "",
                    description: "",
                    images: [],
                    location: "",
                    postalCode: "",
                    startDate: "",
                    endDate: "",
                    asap: false,
                    budgetMin: 5000,
                    budgetMax: 50000,
                    verifiedOnly: true,
                    fixedPriceOnly: false,
                    minRating: false,
                  });
                }}
                className="w-full h-12 border border-gray-300 text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Opprett ny forespørsel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}