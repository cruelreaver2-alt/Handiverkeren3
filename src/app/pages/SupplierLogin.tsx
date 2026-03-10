import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Mail, Lock, AlertCircle, LogIn, Briefcase } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { createClient } from "@supabase/supabase-js";

export function SupplierLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey
      );

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (data.session) {
        // Store session
        localStorage.setItem("accessToken", data.session.access_token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userEmail", data.user.email || "");
        localStorage.setItem("userRole", "supplier");

        // Navigate to supplier dashboard
        navigate("/leverandør-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Innlogging feilet. Sjekk e-post og passord."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey
      );

      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/leverandør-dashboard",
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError(
        "Google-innlogging er ikke aktivert. Vennligst følg instruksjonene for å konfigurere Google OAuth."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E07B3E] via-[#d16f35] to-[#E07B3E]">
      <Header
        variant="simple"
        title="Leverandør-innlogging"
        onBack={() => navigate("/")}
      />

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E07B3E] to-[#17384E] rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#111827] mb-2">
              Leverandørportal
            </h1>
            <p className="text-[#6B7280]">
              Logg inn for å motta jobber og administrere tilbud
            </p>
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

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="din@bedrift.no"
                  required
                  className="w-full h-12 pl-11 pr-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07B3E] focus:border-transparent"
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
                  placeholder="••••••••"
                  required
                  className="w-full h-12 pl-11 pr-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07B3E] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#E07B3E] focus:ring-[#E07B3E]"
                />
                <span className="text-sm text-[#6B7280]">Husk meg</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#E07B3E] hover:underline"
              >
                Glemt passord?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logger inn...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Logg inn som leverandør
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#6B7280]">eller</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-12 border-2 border-[#E5E7EB] rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Fortsett med Google
          </button>

          <p className="text-xs text-[#9CA3AF] mt-4 text-center">
            For å aktivere Google-innlogging, følg{" "}
            <a
              href="https://supabase.com/docs/guides/auth/social-login/auth-google"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E07B3E] hover:underline"
            >
              disse instruksjonene
            </a>
          </p>

          {/* Sign Up Link */}
          <div className="mt-8 pt-6 border-t border-[#E5E7EB] text-center">
            <p className="text-[#6B7280]">
              Ny leverandør?{" "}
              <button
                onClick={() => navigate("/registrering")}
                className="text-[#E07B3E] font-semibold hover:underline"
              >
                Registrer bedrift
              </button>
            </p>
          </div>

          {/* Customer Login Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/logg-inn")}
              className="text-sm text-[#6B7280] hover:text-[#111827]"
            >
              Er du kunde? →
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 text-sm mb-2">
            🔨 Leverandørfordeler
          </h3>
          <ul className="text-xs text-orange-800 space-y-1">
            <li>✓ Motta jobber i ditt område</li>
            <li>✓ Administrer tilbud og prosjekter</li>
            <li>✓ Bygg din portefølje og rykte</li>
            <li>✓ Sikker betaling via escrow</li>
          </ul>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 text-sm mb-2">
            🧪 Demo-pålogging
          </h3>
          <div className="text-xs text-blue-800">
            <p>
              <strong>E-post:</strong> leverandor@test.no
            </p>
            <p>
              <strong>Passord:</strong> passord123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}