import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import {
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  Camera,
  CheckCircle,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function EditSupplierProfile() {
  const navigate = useNavigate();
  const supplierId = "supplier-001"; // TODO: Get from auth

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    bio: "",
    location: "",
    phone: "",
    email: "",
    website: "",
    categories: [] as string[],
    certifications: [] as string[],
    insurance: false,
  });

  const [newCategory, setNewCategory] = useState("");
  const [newCertification, setNewCertification] = useState("");

  const [newPortfolio, setNewPortfolio] = useState({
    title: "",
    description: "",
    category: "",
    completedDate: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/profiles/supplier/${supplierId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setFormData({
            name: data.profile.name || "",
            company: data.profile.company || "",
            bio: data.profile.bio || "",
            location: data.profile.location || "",
            phone: data.profile.phone || "",
            email: data.profile.email || "",
            website: data.profile.website || "",
            categories: data.profile.categories || [],
            certifications: data.profile.certifications || [],
            insurance: data.profile.insurance || false,
          });
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const profileData = {
        ...formData,
        id: supplierId,
        verified: true, // Set by admin
        memberSince: "2024",
        completedJobs: 42,
        rating: 4.9,
        reviewCount: 28,
        responseTime: "< 1 time",
        responseRate: 98,
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/profiles/supplier/${supplierId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(profileData),
        }
      );

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Kunne ikke lagre profil");
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => {
    if (newCategory && !formData.categories.includes(newCategory)) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
      setNewCategory("");
    }
  };

  const removeCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  const addCertification = () => {
    if (newCertification && !formData.certifications.includes(newCertification)) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification],
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (cert: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== cert),
    }));
  };

  const addPortfolioItem = async () => {
    try {
      const portfolioData = {
        supplierId,
        ...newPortfolio,
        images: newPortfolio.imageUrl ? [newPortfolio.imageUrl] : [],
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/portfolio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(portfolioData),
        }
      );

      if (response.ok) {
        setShowAddPortfolio(false);
        setNewPortfolio({
          title: "",
          description: "",
          category: "",
          completedDate: "",
          imageUrl: "",
        });
        alert("Porteføljeprosjekt lagt til!");
      }
    } catch (error) {
      console.error("Error adding portfolio:", error);
      alert("Kunne ikke legge til porteføljeprosjekt");
    }
  };

  const categoryOptions = [
    "Tømrer",
    "Rørlegger",
    "Elektriker",
    "Maler",
    "Garasjeport",
    "Varmepumpe",
    "Tak",
    "Flislegger",
    "Snekker",
    "VVS",
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Rediger profil
          </h1>
          <p className="text-[#6B7280]">
            Oppdater din profil for å tiltrekke flere kunder
          </p>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">
            Grunnleggende informasjon
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Fullt navn *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  placeholder="Ole Hansen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Firma *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, company: e.target.value }))
                  }
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  placeholder="Hansen Tømrer AS"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Om meg *
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={4}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                placeholder="Fortell litt om deg selv og din erfaring..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Lokasjon *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  placeholder="Oslo, Norge"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  placeholder="+47 123 45 678"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  E-post
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  placeholder="ole@hansen.no"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Nettside
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, website: e.target.value }))
                  }
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  placeholder="https://www.hansen.no"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">Kategorier</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {formData.categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#17384E] text-white rounded-full"
              >
                <span className="text-sm">{category}</span>
                <button
                  onClick={() => removeCategory(category)}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
            >
              <option value="">Velg kategori</option>
              {categoryOptions
                .filter((cat) => !formData.categories.includes(cat))
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
            <button
              onClick={addCategory}
              disabled={!newCategory}
              className="h-10 px-4 bg-[#E07B3E] text-white rounded-lg hover:bg-[#d16f35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Legg til
            </button>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">
            Sertifiseringer
          </h2>

          <div className="space-y-2 mb-4">
            {formData.certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg"
              >
                <span className="text-sm text-[#111827]">{cert}</span>
                <button
                  onClick={() => removeCertification(cert)}
                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="F.eks: Autorisert elektriker"
              className="flex-1 h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
            />
            <button
              onClick={addCertification}
              disabled={!newCertification}
              className="h-10 px-4 bg-[#E07B3E] text-white rounded-lg hover:bg-[#d16f35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Legg til
            </button>
          </div>
        </div>

        {/* Insurance */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.insurance}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, insurance: e.target.checked }))
              }
              className="mt-1 w-5 h-5 text-[#17384E]"
            />
            <div>
              <div className="font-semibold text-[#111827] mb-1">
                Jeg har ansvarsforsikring
              </div>
              <div className="text-sm text-[#6B7280]">
                Dette gir kundene trygghet og øker sjansen for å få jobber
              </div>
            </div>
          </label>
        </div>

        {/* Portfolio */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#111827]">Portefølje</h2>
            <button
              onClick={() => setShowAddPortfolio(true)}
              className="flex items-center gap-2 h-10 px-4 bg-[#E07B3E] text-white rounded-lg hover:bg-[#d16f35] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Legg til prosjekt
            </button>
          </div>

          {showAddPortfolio && (
            <div className="border border-[#E5E7EB] rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-[#111827] mb-3">
                Nytt porteføljeprosjekt
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newPortfolio.title}
                  onChange={(e) =>
                    setNewPortfolio((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Prosjekttittel"
                  className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
                <textarea
                  value={newPortfolio.description}
                  onChange={(e) =>
                    setNewPortfolio((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Beskrivelse"
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={newPortfolio.category}
                    onChange={(e) =>
                      setNewPortfolio((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  >
                    <option value="">Velg kategori</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={newPortfolio.completedDate}
                    onChange={(e) =>
                      setNewPortfolio((prev) => ({
                        ...prev,
                        completedDate: e.target.value,
                      }))
                    }
                    className="h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  />
                </div>
                <input
                  type="url"
                  value={newPortfolio.imageUrl}
                  onChange={(e) =>
                    setNewPortfolio((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
                  }
                  placeholder="Bilde URL (https://...)"
                  className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addPortfolioItem}
                    className="flex-1 h-10 bg-[#17384E] text-white rounded-lg hover:bg-[#1a4459] transition-colors"
                  >
                    Lagre prosjekt
                  </button>
                  <button
                    onClick={() => setShowAddPortfolio(false)}
                    className="h-10 px-4 border border-[#E5E7EB] text-[#111827] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm text-[#6B7280]">
            Vis frem dine beste prosjekter for å tiltrekke flere kunder
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/leverandør/${supplierId}`)}
            className="flex-1 h-12 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="flex-1 h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Lagret!
              </>
            ) : saving ? (
              "Lagrer..."
            ) : (
              <>
                <Save className="w-5 h-5" />
                Lagre profil
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
