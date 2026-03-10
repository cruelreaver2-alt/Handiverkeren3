import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Bell, Mail, Smartphone, Check, ArrowLeft } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Preferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newOfferEmail: boolean;
  offerAcceptedEmail: boolean;
  newMessageEmail: boolean;
  jobCompletedEmail: boolean;
  reminderEmail: boolean;
  marketingEmail: boolean;
}

export function NotificationPreferences() {
  const navigate = useNavigate();
  const userId = "customer-001"; // TODO: Get from auth

  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    pushNotifications: true,
    newOfferEmail: true,
    offerAcceptedEmail: true,
    newMessageEmail: true,
    jobCompletedEmail: true,
    reminderEmail: true,
    marketingEmail: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/notification-preferences/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/notification-preferences/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(preferences),
        }
      );

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Kunne ikke lagre innstillinger. Prøv igjen.");
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (key: keyof Preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-[#6B7280]">Laster innstillinger...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/varslinger")}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til varsler
          </button>
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Varslingsinnstillinger
          </h1>
          <p className="text-[#6B7280]">
            Velg hvordan og når du vil motta varsler fra Håndtverkeren
          </p>
        </div>

        {/* Main Toggles */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">
            Hovedinnstillinger
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer p-4 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-[#111827]">
                    E-postvarsler
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    Motta varsler på e-post
                  </div>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={() => togglePreference("emailNotifications")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17384E]"></div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer p-4 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-[#111827]">
                    Push-varsler
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    Motta varsler på enheten din
                  </div>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={preferences.pushNotifications}
                  onChange={() => togglePreference("pushNotifications")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17384E]"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Email Preferences */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">
            E-postpreferanser
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-[#F3F4F6] transition-colors">
              <div>
                <div className="font-medium text-[#111827] mb-1">
                  Nye tilbud mottatt
                </div>
                <div className="text-sm text-[#6B7280]">
                  Få beskjed når fagfolk sender tilbud på dine forespørsler
                </div>
              </div>
              <div className="relative ml-4">
                <input
                  type="checkbox"
                  checked={preferences.newOfferEmail}
                  onChange={() => togglePreference("newOfferEmail")}
                  disabled={!preferences.emailNotifications}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17384E] peer-disabled:opacity-50"></div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-[#F3F4F6] transition-colors">
              <div>
                <div className="font-medium text-[#111827] mb-1">
                  Tilbud godkjent
                </div>
                <div className="text-sm text-[#6B7280]">
                  Få beskjed når en kunde godkjenner ditt tilbud
                </div>
              </div>
              <div className="relative ml-4">
                <input
                  type="checkbox"
                  checked={preferences.offerAcceptedEmail}
                  onChange={() => togglePreference("offerAcceptedEmail")}
                  disabled={!preferences.emailNotifications}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17384E] peer-disabled:opacity-50"></div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-[#F3F4F6] transition-colors">
              <div>
                <div className="font-medium text-[#111827] mb-1">
                  Nye meldinger
                </div>
                <div className="text-sm text-[#6B7280]">
                  Få beskjed når du mottar nye meldinger i chatten
                </div>
              </div>
              <div className="relative ml-4">
                <input
                  type="checkbox"
                  checked={preferences.newMessageEmail}
                  onChange={() => togglePreference("newMessageEmail")}
                  disabled={!preferences.emailNotifications}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17384E] peer-disabled:opacity-50"></div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-[#F3F4F6] transition-colors">
              <div>
                <div className="font-medium text-[#111827] mb-1">
                  Arbeid fullført
                </div>
                <div className="text-sm text-[#6B7280]">
                  Få beskjed når et arbeid er markert som fullført
                </div>
              </div>
              <div className="relative ml-4">
                <input
                  type="checkbox"
                  checked={preferences.jobCompletedEmail}
                  onChange={() => togglePreference("jobCompletedEmail")}
                  disabled={!preferences.emailNotifications}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17384E] peer-disabled:opacity-50"></div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-[#F3F4F6] transition-colors">
              <div>
                <div className="font-medium text-[#111827] mb-1">
                  Påminnelser
                </div>
                <div className="text-sm text-[#6B7280]">
                  Få påminnelser om ubesvarte tilbud og ventende handlinger
                </div>
              </div>
              <div className="relative ml-4">
                <input
                  type="checkbox"
                  checked={preferences.reminderEmail}
                  onChange={() => togglePreference("reminderEmail")}
                  disabled={!preferences.emailNotifications}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17384E] peer-disabled:opacity-50"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Marketing */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">
            Markedsføring
          </h2>

          <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-[#F3F4F6] transition-colors">
            <div>
              <div className="font-medium text-[#111827] mb-1">
                Nyhetsbrev og tilbud
              </div>
              <div className="text-sm text-[#6B7280]">
                Motta tips, nyheter og spesialtilbud fra Håndtverkeren
              </div>
            </div>
            <div className="relative ml-4">
              <input
                type="checkbox"
                checked={preferences.marketingEmail}
                onChange={() => togglePreference("marketingEmail")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17384E]"></div>
            </div>
          </label>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/varslinger")}
            className="flex-1 h-12 border-2 border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={savePreferences}
            disabled={saving}
            className="flex-1 h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                Lagret!
              </>
            ) : saving ? (
              "Lagrer..."
            ) : (
              "Lagre innstillinger"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
