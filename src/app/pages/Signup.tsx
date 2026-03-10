import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Mail, Lock, User, AlertCircle, UserPlus, Briefcase } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"customer" | "supplier">("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passordene stemmer ikke overens");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Passordet må være minst 6 tegn");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email,
            password,
            name,
            role,
            company: role === "supplier" ? company : undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registrering feilet");
      }

      const data = await response.json();

      // Store session
      localStorage.setItem("accessToken", data.access_token || "");
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      localStorage.setItem("userRole", role);

      // Navigate based on role
      if (role === "customer") {
        navigate("/dashboard");
      } else {
        navigate("/leverandør-dashboard");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err instanceof Error ? err.message : "Kunne ikke opprette konto"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#17384E] via-[#1a4459] to-[#E07B3E]">
      <Header
        variant="simple"
        title="Opprett konto"
        onBack={() => navigate("/")}
      />

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#17384E] to-[#E07B3E] rounded-full mb-4">
              <span className="text-3xl">🔨</span>
            </div>
            <h1 className="text-2xl font-bold text-[#111827] mb-2">
              Bli med på Håndtverkeren!
            </h1>
            <p className="text-[#6B7280]">Opprett din gratis konto</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#111827] mb-3">
              Jeg er:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`h-20 rounded-lg border-2 transition-all ${
                  role === "customer"
                    ? "border-[#17384E] bg-blue-50"
                    : "border-[#E5E7EB] hover:border-[#17384E]/50"
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <User className="w-6 h-6 text-[#17384E]" />
                  <span className="text-sm font-semibold text-[#111827]">
                    Kunde
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("supplier")}
                className={`h-20 rounded-lg border-2 transition-all ${
                  role === "supplier"
                    ? "border-[#E07B3E] bg-orange-50"
                    : "border-[#E5E7EB] hover:border-[#E07B3E]/50"
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <Briefcase className="w-6 h-6 text-[#E07B3E]" />
                  <span className="text-sm font-semibold text-[#111827]">
                    Leverandør
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">
                {role === "supplier" ? "Kontaktperson" : "Navn"}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ola Nordmann"
                  required
                  className="w-full h-12 pl-11 pr-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] focus:border-transparent"
                />
              </div>
            </div>

            {role === "supplier" && (
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Bedriftsnavn
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Din Bedrift AS"
                    required
                    className="w-full h-12 pl-11 pr-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07B3E] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">
                E-post
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@epost.no"
                  required
                  className="w-full h-12 pl-11 pr-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">
                Passord
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minst 6 tegn"
                  required
                  className="w-full h-12 pl-11 pr-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">
                Bekreft passord
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Skriv passord på nytt"
                  required
                  className="w-full h-12 pl-11 pr-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 rounded border-[#E5E7EB] text-[#17384E] focus:ring-[#17384E]"
              />
              <label htmlFor="terms" className="text-xs text-[#6B7280]">
                Jeg godtar{" "}
                <button
                  type="button"
                  className="text-[#E07B3E] hover:underline"
                >
                  vilkårene
                </button>{" "}
                og{" "}
                <button
                  type="button"
                  className="text-[#E07B3E] hover:underline"
                >
                  personvernreglene
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                role === "customer"
                  ? "bg-[#17384E] hover:bg-[#1a4459]"
                  : "bg-[#E07B3E] hover:bg-[#d16f35]"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Oppretter konto...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Opprett {role === "customer" ? "kunde" : "leverandør"}konto
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-[#E5E7EB] text-center">
            <p className="text-[#6B7280]">
              Har du allerede konto?{" "}
              <button
                onClick={() =>
                  navigate(role === "customer" ? "/logg-inn" : "/leverandør-logg-inn")
                }
                className="text-[#E07B3E] font-semibold hover:underline"
              >
                Logg inn her
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
