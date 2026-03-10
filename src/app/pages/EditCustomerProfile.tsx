import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Save, CheckCircle, Upload, X } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function EditCustomerProfile() {
  const navigate = useNavigate();
  const customerId = "customer-001"; // TODO: Get from auth

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    phone: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/profiles/customer/${customerId}`,
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
            bio: data.profile.bio || "",
            location: data.profile.location || "",
            phone: data.profile.phone || "",
            email: data.profile.email || "",
            avatar: data.profile.avatar || "",
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
        id: customerId,
        memberSince: "2024",
        emailVerified: true,
        phoneVerified: true,
        totalRequests: 5,
        activeRequests: 2,
        completedRequests: 3,
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/profiles/customer/${customerId}`,
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
        setTimeout(() => {
          navigate(`/kunde/${customerId}`);
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Kunne ikke lagre profil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Rediger profil
          </h1>
          <p className="text-[#6B7280]">
            Oppdater din informasjon og innstillinger
          </p>
        </div>

        {/* Profile Picture */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">Profilbilde</h2>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#17384E] flex items-center justify-center text-white text-3xl font-bold">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                formData.name.charAt(0) || "?"
              )}
            </div>

            <div className="flex-1">
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, avatar: e.target.value }))
                }
                placeholder="Avatar URL (https://...)"
                className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] mb-2"
              />
              <p className="text-xs text-[#6B7280]">
                Bruk en bilde-URL eller la feltet stå tomt for å bruke initialer
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">
            Grunnleggende informasjon
          </h2>

          <div className="space-y-4">
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
                placeholder="Kari Johansen"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Om meg
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                placeholder="Fortell litt om deg selv..."
              />
              <p className="text-xs text-[#6B7280] mt-1">
                Synlig for leverandører du kommuniserer med
              </p>
            </div>

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
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">
            Kontaktinformasjon
          </h2>

          <div className="space-y-4">
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
                placeholder="kari@example.com"
              />
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">E-post verifisert</span>
              </div>
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
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">Telefon verifisert</span>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">🔒 Personvern</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Kontaktinformasjonen din deles kun med leverandører du kommuniserer med</li>
            <li>• Du kan når som helst endre eller slette din informasjon</li>
            <li>• Vi selger aldri dine personopplysninger til tredjeparter</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/kunde/${customerId}`)}
            className="flex-1 h-12 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={saveProfile}
            disabled={saving || !formData.name || !formData.location}
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

        {/* Delete Account */}
        <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
          <h3 className="text-lg font-bold text-[#111827] mb-2">Slett konto</h3>
          <p className="text-sm text-[#6B7280] mb-4">
            Når du sletter kontoen din, vil alle dine forespørsler og data bli permanent
            fjernet. Denne handlingen kan ikke angres.
          </p>
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Er du sikker på at du vil slette kontoen din? Denne handlingen kan ikke angres."
                )
              ) {
                alert("Konto-sletting er ikke implementert i denne demoen");
              }
            }}
            className="h-10 px-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            Slett min konto
          </button>
        </div>
      </div>
    </div>
  );
}
