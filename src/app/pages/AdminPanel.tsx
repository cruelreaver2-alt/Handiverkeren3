import { useState } from "react";
import { Header } from "../components/Header";
import { useNavigate } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function AdminPanel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const userId = "customer-001"; // For demo notifications

  const initializeProducts = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/products/init`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Kunne ikke initialisere produkter");
      }

      const data = await response.json();
      setMessage({
        type: "success",
        text: `Produktdatabase initialisert med ${data.count} produkter!`,
      });
      
      // Fetch products to verify
      await fetchProducts();
    } catch (error) {
      console.error("Error initializing products:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Ukjent feil",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/products`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Kunne ikke hente produkter");
      }

      const data = await response.json();
      setProducts(data.products || []);
      
      if (data.products && data.products.length > 0) {
        setMessage({
          type: "success",
          text: `Fant ${data.products.length} produkter i databasen`,
        });
      } else {
        setMessage({
          type: "error",
          text: "Ingen produkter funnet. Trykk 'Initialiser produktdatabase' først.",
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Kunne ikke hente produkter",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDemoNotification = async (type: string) => {
    setLoading(true);
    try {
      const notifications: Record<string, any> = {
        new_offer: {
          userId,
          type: "new_offer",
          title: "Nytt tilbud mottatt! 🎉",
          message: "Ole Hansen Tømrer har sendt deg et tilbud på 12 000 kr for 'Bytte dørhengsler'",
          link: "/forespørsel/1",
        },
        offer_accepted: {
          userId,
          type: "offer_accepted",
          title: "Tilbudet ditt ble godkjent! ✅",
          message: "Kunde har godkjent ditt tilbud på 15 000 kr. Start arbeidet så snart som mulig.",
          link: "/mine-tilbud",
        },
        new_message: {
          userId,
          type: "new_message",
          title: "Ny melding fra kunde 💬",
          message: "Kari Johansen har sendt deg en melding angående 'Reparere lekkasje'",
          link: "/meldinger",
        },
        payment: {
          userId,
          type: "payment",
          title: "Betaling mottatt 💰",
          message: "20 500 kr er frigjort til din konto for fullført arbeid.",
          link: "/mine-tilbud",
        },
      };

      const notification = notifications[type];
      
      if (!notification) {
        throw new Error("Ukjent notifikasjonstype");
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(notification),
        }
      );

      if (!response.ok) {
        throw new Error("Kunne ikke opprette notifikasjon");
      }

      setMessage({
        type: "success",
        text: `Demo-notifikasjon opprettet: "${notification.title}"`,
      });
    } catch (error) {
      console.error("Error creating notification:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Kunne ikke opprette notifikasjon",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header variant="simple" title="Admin Panel" onBack={() => navigate("/")} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">Produktdatabase administrasjon</h2>
          
          {message && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={initializeProducts}
              disabled={loading}
              className="w-full h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Initialiserer..." : "Initialiser produktdatabase"}
            </button>

            <button
              onClick={fetchProducts}
              disabled={loading}
              className="w-full h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Henter..." : "Hent produkter (sjekk database)"}
            </button>
          </div>
        </div>

        {products.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-[#111827] mb-4">
              Produkter i database ({products.length})
            </h3>
            
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-start gap-4"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-[14px] text-[#111827]">
                      {product.name}
                    </h4>
                    <p className="text-[12px] text-[#6B7280]">
                      {product.brand} - {product.model}
                    </p>
                    <p className="text-[11px] text-[#9CA3AF] mt-1">
                      Kategori: {product.category} / {product.subcategory}
                    </p>
                    <p className="text-[13px] font-semibold text-[#17384E] mt-1">
                      {product.price.toLocaleString("no-NO")} kr
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-[14px] text-blue-900 mb-2">
            ℹ️ Instruksjoner
          </h3>
          <ol className="text-[13px] text-blue-800 space-y-1 list-decimal list-inside">
            <li>Trykk "Initialiser produktdatabase" for å legge til 15+ produkter</li>
            <li>Trykk "Hent produkter" for å verifisere at produktene er lagret</li>
            <li>Gå til "Opprett forespørsel" og velg kategori (Varmepumpe, Elektrisk, etc.)</li>
            <li>Produktsøk skal nå vises automatisk</li>
          </ol>
        </div>

        {/* Notification Testing */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">🔔 Test notifikasjoner</h2>
          
          <p className="text-sm text-[#6B7280] mb-4">
            Opprett demo-notifikasjoner for å teste notifikasjonssystemet. 
            Notifikasjoner vises i bell-ikonet øverst til høyre.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => createDemoNotification("new_offer")}
              disabled={loading}
              className="h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              📄 Nytt tilbud
            </button>

            <button
              onClick={() => createDemoNotification("offer_accepted")}
              disabled={loading}
              className="h-12 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              ✅ Tilbud godkjent
            </button>

            <button
              onClick={() => createDemoNotification("new_message")}
              disabled={loading}
              className="h-12 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              💬 Ny melding
            </button>

            <button
              onClick={() => createDemoNotification("payment")}
              disabled={loading}
              className="h-12 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              💰 Betaling
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => navigate("/varslinger")}
              className="text-sm text-[#E07B3E] hover:underline"
            >
              Se alle notifikasjoner →
            </button>
            <button
              onClick={() => navigate("/varslinger/innstillinger")}
              className="text-sm text-[#6B7280] hover:text-[#111827]"
            >
              ⚙️ Innstillinger
            </button>
          </div>
        </div>

        {/* Profile Testing */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">👤 Demo profiler & portefølje</h2>
          
          <p className="text-sm text-[#6B7280] mb-4">
            Test profilsystemet med demo-data. Opprett en komplett leverandørprofil med portefølje og anmeldelser.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  // Create demo supplier profile
                  const profileData = {
                    id: "supplier-001",
                    name: "Ole Hansen",
                    company: "Hansen Tømrer AS",
                    bio: "Erfaren tømrer med over 15 års erfaring. Spesialiserer meg på terrasser, carporter og generelt tømrerarbeid. Alltid profesjonelt arbeid med fokus på kvalitet og kundetilfredshet.",
                    location: "Oslo, Norge",
                    categories: ["Tømrer", "Snekker", "Tak"],
                    verified: true,
                    memberSince: "2020",
                    completedJobs: 127,
                    rating: 4.9,
                    reviewCount: 45,
                    responseTime: "< 1 time",
                    responseRate: 98,
                    phone: "+47 123 45 678",
                    email: "ole@hansen.no",
                    website: "https://www.hansen.no",
                    certifications: [
                      "Fagbrev tømrer",
                      "Kurs i energieffektivt bygg",
                      "Fallsikring A og B"
                    ],
                    insurance: true,
                  };

                  const response = await fetch(
                    `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/profiles/supplier/supplier-001`,
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
                    setMessage({
                      type: "success",
                      text: "Demo-profil opprettet for supplier-001!",
                    });
                  }
                } catch (error) {
                  setMessage({
                    type: "error",
                    text: "Kunne ikke opprette demo-profil",
                  });
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              👤 Opprett demo-profil
            </button>

            <button
              onClick={async () => {
                setLoading(true);
                try {
                  // Add demo portfolio items
                  const portfolioItems = [
                    {
                      supplierId: "supplier-001",
                      title: "Ny terrasse i Oslo vest",
                      description: "Bygget en stor terrasse i massiv furu med trapp og rekkverk. Inkludert drenering og fundamentarbeid.",
                      category: "Tømrer",
                      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600"],
                      completedDate: "2024-08-15",
                    },
                    {
                      supplierId: "supplier-001",
                      title: "Carport i Bærum",
                      description: "Oppført carport for 2 biler med oppbevaringsrom. Isolert tak og god finish.",
                      category: "Tømrer",
                      images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"],
                      completedDate: "2024-07-20",
                    },
                    {
                      supplierId: "supplier-001",
                      title: "Takoppussing med nye takstein",
                      description: "Komplett takoppussing inkludert undertak og montering av nye Icopal takstein.",
                      category: "Tak",
                      images: ["https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600"],
                      completedDate: "2024-06-10",
                    },
                  ];

                  for (const item of portfolioItems) {
                    await fetch(
                      `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/portfolio`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${publicAnonKey}`,
                        },
                        body: JSON.stringify(item),
                      }
                    );
                  }

                  setMessage({
                    type: "success",
                    text: `${portfolioItems.length} porteføljeprosjekter lagt til!`,
                  });
                } catch (error) {
                  setMessage({
                    type: "error",
                    text: "Kunne ikke legge til porteføljeprosjekter",
                  });
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              📸 Legg til portefølje
            </button>

            <button
              onClick={async () => {
                setLoading(true);
                try {
                  // Add demo reviews
                  const reviews = [
                    {
                      supplierId: "supplier-001",
                      customerId: "customer-001",
                      customerName: "Kari Johansen",
                      rating: 5,
                      comment: "Fantastisk jobb! Ole var profesjonell, punktlig og leverte perfekt kvalitet. Terassen ble akkurat som vi ønsket. Anbefales på det sterkeste!",
                      jobTitle: "Terrasse i Oslo vest",
                    },
                    {
                      supplierId: "supplier-001",
                      customerId: "customer-002",
                      customerName: "Per Andersen",
                      rating: 5,
                      comment: "Veldig fornøyd med carport. Solid arbeid og god kommunikasjon hele veien. Takk for hjelpen!",
                      jobTitle: "Carport",
                    },
                    {
                      supplierId: "supplier-001",
                      customerId: "customer-003",
                      customerName: "Line Berg",
                      rating: 4,
                      comment: "Bra jobb med taket. Ett par mindre ting som måtte rettes, men alt ble ordnet kjapt. God håndverker.",
                      jobTitle: "Takoppussing",
                    },
                  ];

                  for (const review of reviews) {
                    await fetch(
                      `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/reviews`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${publicAnonKey}`,
                        },
                        body: JSON.stringify(review),
                      }
                    );
                  }

                  setMessage({
                    type: "success",
                    text: `${reviews.length} anmeldelser lagt til!`,
                  });
                } catch (error) {
                  setMessage({
                    type: "error",
                    text: "Kunne ikke legge til anmeldelser",
                  });
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="h-12 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              ⭐ Legg til anmeldelser
            </button>

            <button
              onClick={() => navigate("/leverandør/supplier-001")}
              className="h-12 border-2 border-[#17384E] text-[#17384E] rounded-lg font-semibold hover:bg-[#17384E] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              👀 Se demo-profil
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => navigate("/rediger-profil")}
              className="text-sm text-[#E07B3E] hover:underline"
            >
              Rediger profil →
            </button>
            <p className="text-xs text-[#6B7280]">
              Profil-ID: supplier-001
            </p>
          </div>
        </div>

        {/* Customer Profile Testing */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">👥 Demo kundeprofil</h2>
          
          <p className="text-sm text-[#6B7280] mb-4">
            Opprett en demo kundeprofil med forespørsler og anmeldelser.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  // Create demo customer profile
                  const profileData = {
                    id: "customer-001",
                    name: "Kari Johansen",
                    bio: "Liker å holde hjemmet i god stand og setter pris på profesjonelle håndverkere som leverer kvalitetsarbeid.",
                    location: "Oslo, Norge",
                    email: "kari@example.com",
                    phone: "+47 987 65 432",
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
                    memberSince: "2024",
                    emailVerified: true,
                    phoneVerified: true,
                    totalRequests: 5,
                    activeRequests: 2,
                    completedRequests: 3,
                  };

                  const response = await fetch(
                    `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/profiles/customer/customer-001`,
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
                    setMessage({
                      type: "success",
                      text: "Demo kundeprofil opprettet for customer-001!",
                    });
                  }
                } catch (error) {
                  setMessage({
                    type: "error",
                    text: "Kunne ikke opprette kundeprofil",
                  });
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              👥 Opprett kundeprofil
            </button>

            <button
              onClick={() => navigate("/kunde/customer-001")}
              className="h-12 border-2 border-[#17384E] text-[#17384E] rounded-lg font-semibold hover:bg-[#17384E] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              👀 Se kundeprofil
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => navigate("/rediger-kundeprofil")}
              className="text-sm text-[#E07B3E] hover:underline"
            >
              Rediger kundeprofil →
            </button>
            <p className="text-xs text-[#6B7280]">
              Profil-ID: customer-001
            </p>
          </div>
        </div>

        {/* Email System Testing */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">📧 E-post System & Templates</h2>
          
          <p className="text-sm text-[#6B7280] mb-4">
            Test e-post-systemet med 9 forskjellige templates. E-poster logges til console (demo mode).
          </p>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => navigate("/email-preview")}
              className="h-12 bg-gradient-to-r from-[#17384E] to-[#1a4459] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              📧 Åpne E-post Template Viewer
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">����</div>
              <div className="text-xs font-medium text-[#111827]">Velkommen</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">📝</div>
              <div className="text-xs font-medium text-[#111827]">Ny forespørsel</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">🎉</div>
              <div className="text-xs font-medium text-[#111827]">Nytt tilbud</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">✅</div>
              <div className="text-xs font-medium text-[#111827]">Godkjent</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">🎉</div>
              <div className="text-xs font-medium text-[#111827]">Fullført</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">💰</div>
              <div className="text-xs font-medium text-[#111827]">Betaling</div>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Demo Mode:</strong> E-poster sendes ikke faktisk, men logges til console. 
              For å aktivere faktisk sending med Resend, legg til RESEND_API_KEY.
            </p>
          </div>
        </div>

        {/* Authentication Testing */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">🔐 Autentisering & Innlogging</h2>
          
          <p className="text-sm text-[#6B7280] mb-4">
            Test innloggingssystemet med separate portaler for kunder og leverandører.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/logg-inn")}
              className="h-12 border-2 border-[#17384E] text-[#17384E] rounded-lg font-semibold hover:bg-[#17384E] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              👤 Kundeinnlogging
            </button>

            <button
              onClick={() => navigate("/leverandør-logg-inn")}
              className="h-12 border-2 border-[#E07B3E] text-[#E07B3E] rounded-lg font-semibold hover:bg-[#E07B3E] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              🔨 Leverandørinnlogging
            </button>

            <button
              onClick={() => navigate("/registrer")}
              className="h-12 bg-gradient-to-r from-[#17384E] to-[#E07B3E] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              ✨ Opprett ny bruker
            </button>
          </div>

          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <h3 className="font-semibold text-green-900 text-sm mb-2">
              ✅ Funksjonalitet
            </h3>
            <ul className="text-xs text-green-800 space-y-1">
              <li>✓ Email/passord autentisering med Supabase Auth</li>
              <li>✓ Automatisk profil-opprettelse (kunde/leverandør)</li>
              <li>✓ Velkommen-e-post sendes automatisk</li>
              <li>✓ Session management med localStorage</li>
              <li>✓ Google OAuth (krever oppsett)</li>
              <li>✓ Separate dashboards for hver rolle</li>
            </ul>
          </div>

          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>OAuth:</strong> For å aktivere Google-innlogging, følg{" "}
              <a
                href="https://supabase.com/docs/guides/auth/social-login/auth-google"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                disse instruksjonene
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}