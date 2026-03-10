import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Header } from "../components/Header";
import { Eye, EyeOff, Upload, X } from "lucide-react";

type Role = "kunde" | "leverandor";
type Step = "konto" | "detaljer" | "bekreftelse";

export function Registration() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "leverandor" ? "leverandor" : "kunde";
  
  const [currentStep, setCurrentStep] = useState<Step>("konto");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>(initialRole);
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    orgNumber: "",
    phone: "",
    category: "",
    documents: [] as File[],
    portfolioImages: [] as File[],
    hasInsurance: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (currentStep === "konto") {
      if (!formData.name) newErrors.name = "Fullt navn er påkrevd";
      if (!formData.email) newErrors.email = "E-post er påkrevd";
      if (!formData.password || formData.password.length < 6) newErrors.password = "Passord må være minst 6 tegn";
      
      if (role === "leverandor" && !formData.companyName) newErrors.companyName = "Firma navn er påkrevd";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    if (currentStep === "konto") {
      setCurrentStep(role === "leverandor" ? "detaljer" : "bekreftelse");
    } else if (currentStep === "detaljer") {
      setCurrentStep("bekreftelse");
    }
  };

  const handleVerification = () => {
    const code = verificationCode.join("");
    if (code.length === 6) {
      // Simulate verification
      navigate("/");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "documents" | "portfolioImages") => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ...files]
    }));
  };

  const removeFile = (index: number, type: "documents" | "portfolioImages") => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const steps: Step[] = role === "leverandor" ? ["konto", "detaljer", "bekreftelse"] : ["konto", "bekreftelse"];
  const stepLabels = {
    konto: "Konto",
    detaljer: "Detaljer",
    bekreftelse: "Bekreftelse"
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header variant="simple" title="Registrer deg" onBack={() => navigate(-1)} />
      
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentStep === step
                  ? "bg-[#17384E] text-white"
                  : steps.indexOf(currentStep) > index
                  ? "bg-[#17384E]/20 text-[#17384E]"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {stepLabels[step]}
            </div>
          ))}
        </div>

        {/* Step: Konto */}
        {currentStep === "konto" && (
          <div className="space-y-6">
            <div>
              <label className="block text-[13px] text-[#6B7280] mb-2">Fullt navn</label>
              <input
                type="text"
                placeholder="Fullt navn"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full h-12 px-4 border rounded-lg ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#17384E]`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[13px] text-[#6B7280] mb-2">E-post</label>
              <input
                type="email"
                placeholder="navn@epost.no"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full h-12 px-4 border rounded-lg ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#17384E]`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[13px] text-[#6B7280] mb-2">Passord</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minst 6 tegn"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className={`w-full h-12 px-4 pr-12 border rounded-lg ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#17384E]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-[13px] text-[#6B7280] mb-3">Jeg er</label>
              <div className="flex gap-4">
                <label className="flex-1 flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-[#17384E] transition-colors" style={{ borderColor: role === "kunde" ? "#17384E" : "#E5E7EB" }}>
                  <input
                    type="radio"
                    name="role"
                    value="kunde"
                    checked={role === "kunde"}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-5 h-5 text-[#17384E]"
                  />
                  <span className="font-medium text-[#111827]">Kunde</span>
                </label>
                <label className="flex-1 flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-[#17384E] transition-colors" style={{ borderColor: role === "leverandor" ? "#17384E" : "#E5E7EB" }}>
                  <input
                    type="radio"
                    name="role"
                    value="leverandor"
                    checked={role === "leverandor"}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-5 h-5 text-[#17384E]"
                  />
                  <span className="font-medium text-[#111827]">Leverandør</span>
                </label>
              </div>
            </div>

            {role === "leverandor" && (
              <>
                <div>
                  <label className="block text-[13px] text-[#6B7280] mb-2">Firma navn</label>
                  <input
                    type="text"
                    placeholder="Ditt firma navn"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className={`w-full h-12 px-4 border rounded-lg ${
                      errors.companyName ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#17384E]`}
                  />
                  {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-[13px] text-[#6B7280] mb-2">Organisasjonsnummer</label>
                  <input
                    type="text"
                    placeholder="123 456 789"
                    value={formData.orgNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, orgNumber: e.target.value }))}
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] text-[#6B7280] mb-2">Telefon</label>
                  <input
                    type="tel"
                    placeholder="+47 123 45 678"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  />
                </div>
              </>
            )}

            <button
              onClick={handleNext}
              className="w-full h-14 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
            >
              Fortsett
            </button>

            <p className="text-center text-[14px] text-[#6B7280]">
              Har du allerede konto?{" "}
              <button className="text-[#17384E] font-semibold hover:underline">
                Logg inn
              </button>
            </p>
          </div>
        )}

        {/* Step: Detaljer (Leverandør only) */}
        {currentStep === "detaljer" && role === "leverandor" && (
          <div className="space-y-6">
            <div>
              <label className="block text-[13px] text-[#6B7280] mb-2">Bransje</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
              >
                <option value="">Velg bransje</option>
                <option value="tre">Tømrer</option>
                <option value="ror">Rørlegger</option>
                <option value="elektro">Elektro</option>
                <option value="maling">Maling</option>
                <option value="garasjeport">Garasjeport</option>
                <option value="varmepumpe">Varmepumpe</option>
                <option value="annet">Annet</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] text-[#6B7280] mb-2">Sertifikat/Forsikring</label>
              <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-6">
                <input
                  type="file"
                  id="documents"
                  multiple
                  onChange={(e) => handleFileUpload(e, "documents")}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="documents"
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-[#6B7280]" />
                  <p className="text-[13px] text-[#6B7280] text-center">
                    Dra filer hit eller klikk for å velge
                  </p>
                </label>
                {formData.documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.documents.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                        <span className="text-sm text-[#111827] truncate">{file.name}</span>
                        <button
                          onClick={() => removeFile(index, "documents")}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[13px] text-[#6B7280] mb-2">Portefølje bilder (maks 8)</label>
              <div className="grid grid-cols-4 gap-2">
                {formData.portfolioImages.map((file, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFile(index, "portfolioImages")}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.portfolioImages.length < 8 && (
                  <label className="aspect-square border-2 border-dashed border-[#E5E7EB] rounded-lg flex items-center justify-center cursor-pointer hover:border-[#17384E]">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload(e, "portfolioImages")}
                      className="hidden"
                      accept="image/*"
                    />
                    <Upload className="w-6 h-6 text-[#6B7280]" />
                  </label>
                )}
              </div>
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.hasInsurance}
                onChange={(e) => setFormData(prev => ({ ...prev, hasInsurance: e.target.checked }))}
                className="mt-1 w-5 h-5 text-[#17384E] rounded"
              />
              <span className="text-[13px] text-[#111827]">
                Jeg bekrefter at jeg har gyldig forsikring
              </span>
            </label>

            <button
              onClick={handleNext}
              className="w-full h-14 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
            >
              Fortsett
            </button>
          </div>
        )}

        {/* Step: Bekreftelse */}
        {currentStep === "bekreftelse" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E07B3E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#E07B3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">Bekreft din konto</h3>
              <p className="text-[14px] text-[#6B7280] mb-6">
                Vi har sendt en 6-sifret kode til <strong>{formData.email}</strong>
              </p>
            </div>

            <div className="flex justify-center gap-2">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      const newCode = [...verificationCode];
                      newCode[index] = value;
                      setVerificationCode(newCode);
                      
                      // Auto-focus next input
                      if (value && index < 5) {
                        const nextInput = document.getElementById(`code-${index + 1}`);
                        nextInput?.focus();
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !digit && index > 0) {
                      const prevInput = document.getElementById(`code-${index - 1}`);
                      prevInput?.focus();
                    }
                  }}
                  id={`code-${index}`}
                  className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] focus:border-[#17384E]"
                />
              ))}
            </div>

            <button
              onClick={handleVerification}
              disabled={verificationCode.join("").length < 6}
              className="w-full h-14 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Bekreft konto
            </button>

            <p className="text-center text-[13px] text-[#6B7280]">
              Mottok du ikke koden?{" "}
              <button className="text-[#17384E] font-semibold hover:underline">
                Send på nytt
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}