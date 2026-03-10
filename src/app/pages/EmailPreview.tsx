import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Mail, Eye, Send, ArrowLeft } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface EmailTemplate {
  type: string;
  name: string;
  description: string;
  icon: string;
  sampleData: any;
}

export function EmailPreview() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewSubject, setPreviewSubject] = useState("");
  const [testEmail, setTestEmail] = useState("test@example.com");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const templates: EmailTemplate[] = [
    {
      type: "welcome_customer",
      name: "Velkommen - Kunde",
      description: "Sendes når en ny kunde registrerer seg",
      icon: "🎉",
      sampleData: {
        name: "Kari Johansen",
        dashboardUrl: "https://håndtverkeren.no/dashboard",
      },
    },
    {
      type: "welcome_supplier",
      name: "Velkommen - Leverandør",
      description: "Sendes når en ny leverandør registrerer seg",
      icon: "🔨",
      sampleData: {
        name: "Ole Hansen",
        dashboardUrl: "https://håndtverkeren.no/leverandør-dashboard",
      },
    },
    {
      type: "new_request",
      name: "Ny forespørsel",
      description: "Sendes til leverandører når en ny jobb legges ut",
      icon: "📝",
      sampleData: {
        title: "Bytte dørhengsler i Oslo",
        category: "Tømrer",
        description:
          "Trenger hjelp til å bytte hengsler på to innerdører. Dørene står ferdig.",
        budget: 3500,
        location: "Oslo",
        startDate: "Snarest",
        requestUrl: "https://håndtverkeren.no/tilgjengelige-jobber",
      },
    },
    {
      type: "new_offer",
      name: "Nytt tilbud mottatt",
      description: "Sendes til kunde når en leverandør sender tilbud",
      icon: "🎉",
      sampleData: {
        supplierName: "Ole Hansen Tømrer",
        requestTitle: "Bytte dørhengsler",
        price: 3200,
        description:
          "Jeg kan utføre dette arbeidet i løpet av 2 timer. Inkluderer nye hengsler av god kvalitet.",
        rating: 4.9,
        reviewCount: 28,
        duration: "2-3 timer",
        offerUrl: "https://håndtverkeren.no/forespørsel/1",
        totalOffers: 3,
      },
    },
    {
      type: "offer_accepted",
      name: "Tilbud godkjent",
      description: "Sendes til leverandør når kunde godkjenner tilbud",
      icon: "✅",
      sampleData: {
        customerName: "Kari Johansen",
        price: 3200,
        requestTitle: "Bytte dørhengsler",
        jobUrl: "https://håndtverkeren.no/mine-tilbud",
        customerPhone: "+47 987 65 432",
        customerEmail: "kari@example.com",
      },
    },
    {
      type: "job_completed",
      name: "Jobb fullført",
      description: "Sendes til kunde når leverandør markerer jobb som fullført",
      icon: "🎉",
      sampleData: {
        supplierName: "Ole Hansen",
        requestTitle: "Bytte dørhengsler",
        price: 3200,
        approvalUrl: "https://håndtverkeren.no/godkjenn-arbeid",
        reviewUrl: "https://håndtverkeren.no/leverandør/supplier-001",
      },
    },
    {
      type: "payment_released",
      name: "Betaling frigjort",
      description: "Sendes til leverandør når betaling frigis fra escrow",
      icon: "💰",
      sampleData: {
        amount: 3200,
        requestTitle: "Bytte dørhengsler",
        customerName: "Kari Johansen",
        dashboardUrl: "https://håndtverkeren.no/leverandør-dashboard",
      },
    },
    {
      type: "new_message",
      name: "Ny melding",
      description: "Sendes når noen sender en melding",
      icon: "💬",
      sampleData: {
        senderName: "Kari Johansen",
        requestTitle: "Bytte dørhengsler",
        messagePreview: "Hei! Når kan du tidligst komme for å se på jobben?",
        messageUrl: "https://håndtverkeren.no/meldinger",
      },
    },
    {
      type: "new_review",
      name: "Ny anmeldelse",
      description: "Sendes til leverandør når de mottar en anmeldelse",
      icon: "⭐",
      sampleData: {
        customerName: "Kari Johansen",
        requestTitle: "Bytte dørhengsler",
        rating: 5,
        comment:
          "Fantastisk jobb! Ole var profesjonell, punktlig og leverte perfekt kvalitet.",
        profileUrl: "https://håndtverkeren.no/leverandør/supplier-001",
        averageRating: 4.9,
        totalReviews: 29,
      },
    },
  ];

  useEffect(() => {
    if (selectedTemplate) {
      loadPreview();
    }
  }, [selectedTemplate]);

  const loadPreview = async () => {
    const template = templates.find((t) => t.type === selectedTemplate);
    if (!template) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/emails/preview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            type: template.type,
            data: template.sampleData,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPreviewHtml(data.html);
        setPreviewSubject(data.subject);
      }
    } catch (error) {
      console.error("Error loading preview:", error);
    }
  };

  const sendTestEmail = async () => {
    const template = templates.find((t) => t.type === selectedTemplate);
    if (!template) return;

    setSending(true);
    setMessage(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/emails/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            type: template.type,
            to: testEmail,
            data: template.sampleData,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage({
          type: "success",
          text: `Test-e-post sendt! (ID: ${data.email.id}) - Sjekk console for output`,
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Kunne ikke sende test-e-post",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header
        variant="simple"
        title="E-post Templates"
        onBack={() => navigate("/admin")}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            📧 E-post System (Demo Mode)
          </h3>
          <p className="text-sm text-blue-800">
            Dette systemet logger e-poster til console. For å aktivere faktisk
            sending med Resend, legg til RESEND_API_KEY som miljøvariabel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
              <h2 className="text-lg font-bold text-[#111827] mb-4">
                Velg template
              </h2>

              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.type}
                    onClick={() => setSelectedTemplate(template.type)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedTemplate === template.type
                        ? "border-[#E07B3E] bg-orange-50"
                        : "border-[#E5E7EB] hover:border-[#E07B3E]/50 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#111827] text-sm">
                          {template.name}
                        </div>
                        <div className="text-xs text-[#6B7280] mt-1">
                          {template.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Send Test */}
            {selectedTemplate && (
              <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 mt-4">
                <h3 className="font-bold text-[#111827] mb-3">
                  Send test-e-post
                </h3>

                {message && (
                  <div
                    className={`mb-3 p-3 rounded-lg text-sm ${
                      message.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="din@epost.no"
                  className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] mb-3"
                />

                <button
                  onClick={sendTestEmail}
                  disabled={sending || !testEmail}
                  className="w-full h-10 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sending ? "Sender..." : "Send test"}
                </button>

                <p className="text-xs text-[#6B7280] mt-2">
                  E-posten vil bli logget til console (ikke faktisk sendt)
                </p>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            {!selectedTemplate ? (
              <div className="bg-white rounded-lg border border-[#E5E7EB] p-12 text-center">
                <Mail className="w-16 h-16 text-[#E5E7EB] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#111827] mb-2">
                  Velg en template
                </h3>
                <p className="text-[#6B7280]">
                  Velg en e-post-template fra listen til venstre for å se
                  forhåndsvisning
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
                {/* Email Header */}
                <div className="border-b border-[#E5E7EB] p-4 bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-2">
                    <Mail className="w-4 h-4" />
                    <span>Fra: noreply@håndtverkeren.no</span>
                  </div>
                  <div className="text-sm text-[#6B7280] mb-2">
                    Til: {testEmail}
                  </div>
                  <div className="font-semibold text-[#111827]">
                    {previewSubject}
                  </div>
                </div>

                {/* Email Content */}
                <div
                  className="p-0 overflow-auto"
                  style={{ maxHeight: "calc(100vh - 300px)" }}
                >
                  {previewHtml ? (
                    <iframe
                      srcDoc={previewHtml}
                      className="w-full border-0"
                      style={{ height: "800px" }}
                      title="Email Preview"
                    />
                  ) : (
                    <div className="p-12 text-center text-[#6B7280]">
                      Laster forhåndsvisning...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
}
