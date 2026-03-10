import { useState } from "react";
import { Link } from "react-router";
import {
  Hammer,
  Wrench,
  Zap,
  Paintbrush,
  Star,
  ChevronLeft,
  ChevronRight,
  Mail,
  Home,
  Wind,
  Construction,
  CheckCircle,
  Shield,
  Award,
  ClipboardList,
  Users,
  ThumbsUp
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Header } from "../components/Header";

const categories = [
  { name: "Tømrer", icon: Hammer, color: "#E07B3E" },
  { name: "Rørlegger", icon: Wrench, color: "#17384E" },
  { name: "Elektro", icon: Zap, color: "#E07B3E" },
  { name: "Maling", icon: Paintbrush, color: "#17384E" },
  { name: "Entreprenør", icon: Construction, color: "#E07B3E" },
  { name: "Garasjeport", icon: Home, color: "#17384E" },
  { name: "Varmepumpe", icon: Wind, color: "#E07B3E" },
];

const professionals = [
  {
    id: 1,
    name: "Ole Hansen",
    rating: 4.9,
    reviews: 47,
    specialty: "Tømrer",
    image: "https://images.unsplash.com/photo-1667922578520-61558e79aa7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFmdHNtYW4lMjBjYXJwZW50ZXIlMjB3b3JraW5nfGVufDF8fHx8MTc3MzA3NzEwMXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    name: "Kari Johansen",
    rating: 5.0,
    reviews: 62,
    specialty: "Rørlegger",
    image: "https://images.unsplash.com/photo-1764328165995-0624c280a6d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzMwNzcxMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 3,
    name: "Erik Nilsen",
    rating: 4.8,
    reviews: 38,
    specialty: "Elektriker",
    image: "https://images.unsplash.com/photo-1659353588580-8da374e328a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHByb2Zlc3Npb25hbCUyMG1hbGV8ZW58MXx8fHwxNzczMDc3MTAzfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
];

export function Landing() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [currentProfessional, setCurrentProfessional] = useState(0);

  const nextProfessional = () => {
    setCurrentProfessional((prev) => (prev + 1) % professionals.length);
  };

  const prevProfessional = () => {
    setCurrentProfessional((prev) => (prev - 1 + professionals.length) % professionals.length);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-6 pb-8 px-4 lg:px-24 max-w-[1366px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex-1">
            <h1 className="text-[32px] md:text-[36px] lg:text-[42px] font-bold leading-[1.2] text-[#111827] mb-3">
              Finn lokale fagfolk — raskt, trygt og fagmessig.
            </h1>
            <p className="text-[16px] md:text-[17px] text-[#6B7280] leading-[1.47] mb-6">
              Få kuraterte, fastpris- eller detaljtilbud fra godkjente håndverkere i ditt område.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/registrer"
                className="flex items-center justify-center h-14 px-6 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
              >
                Bli kunde - Gratis
              </Link>
              <button
                onClick={() => setShowHowItWorks(true)}
                className="flex items-center justify-center h-14 px-6 text-[#17384E] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Se hvordan det fungerer
              </button>
            </div>
          </div>
          
          <div className="flex-1 lg:max-w-[500px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1771122453274-d3270e73cf94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwd29yayUyMHRvb2xzfGVufDF8fHx8MTc3MzA3NzEwMnww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Fagfolk på arbeid"
              className="w-full h-[240px] md:h-[280px] lg:h-[300px] object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
        
        {/* Trust Strip */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-12 mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-6 h-6 text-[#17384E]" />
            <span className="text-[13px] text-[#6B7280]">Verifiserte fagfolk</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Shield className="w-6 h-6 text-[#17384E]" />
            <span className="text-[13px] text-[#6B7280]">Prisgaranti</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Award className="w-6 h-6 text-[#17384E]" />
            <span className="text-[13px] text-[#6B7280]">1 års garanti</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 px-4 lg:px-24 bg-white">
        <div className="max-w-[1366px] mx-auto">
          <h2 className="text-[24px] lg:text-[32px] font-bold text-center text-[#111827] mb-8">
            Hvordan det fungerer
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ClipboardList,
                title: "1. Beskriv jobben",
                description: "Fyll ut et enkelt skjema om hva du trenger hjelp til."
              },
              {
                icon: Users,
                title: "2. Motta tilbud",
                description: "Få tilbud fra kvalifiserte fagfolk i ditt område innen 24 timer."
              },
              {
                icon: ThumbsUp,
                title: "3. Velg og fullfør",
                description: "Sammenlign, velg det beste tilbudet og få jobben gjort."
              }
            ].map((step, index) => (
              <div
                key={index}
                onClick={() => setSelectedStep(index)}
                className="bg-white rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
                style={{ boxShadow: '0 6px 18px rgba(23, 56, 78, 0.08)' }}
              >
                <div className="w-10 h-10 bg-[#E07B3E] rounded-lg flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-[16px] font-semibold text-[#111827] mb-2">{step.title}</h3>
                <p className="text-[13px] text-[#6B7280] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 lg:px-24">
        <div className="max-w-[1366px] mx-auto">
          <h2 className="text-[24px] lg:text-[32px] font-bold text-[#111827] mb-6">
            Populære kategorier
          </h2>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[120px] h-[120px] bg-white rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-lg transition-all"
                style={{ boxShadow: '0 6px 18px rgba(23, 56, 78, 0.08)' }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: category.color }}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[14px] font-medium text-[#111827]">{category.name}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-[14px] text-[#17384E] font-semibold hover:underline">
              Se alle kategorier →
            </button>
          </div>
        </div>
      </section>

      {/* Featured Professionals Carousel */}
      <section className="py-12 px-4 lg:px-24 bg-white">
        <div className="max-w-[1366px] mx-auto">
          <h2 className="text-[24px] lg:text-[32px] font-bold text-[#111827] mb-6">
            Utvalgte fagfolk
          </h2>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex gap-4 transition-transform duration-300" style={{ transform: `translateX(-${currentProfessional * 100}%)` }}>
                {professionals.map((professional) => (
                  <div
                    key={professional.id}
                    className="flex-shrink-0 w-full md:w-[260px] bg-white rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    style={{ boxShadow: '0 6px 18px rgba(23, 56, 78, 0.08)' }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <ImageWithFallback
                        src={professional.image}
                        alt={professional.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-[16px] font-semibold text-[#111827]">{professional.name}</h3>
                        <p className="text-[13px] text-[#6B7280]">{professional.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-[14px] font-semibold text-[#111827]">{professional.rating}</span>
                      <span className="text-[13px] text-[#6B7280]">({professional.reviews} anmeldelser)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={prevProfessional}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hidden lg:flex"
            >
              <ChevronLeft className="w-6 h-6 text-[#17384E]" />
            </button>
            <button
              onClick={nextProfessional}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hidden lg:flex"
            >
              <ChevronRight className="w-6 h-6 text-[#17384E]" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 lg:px-24 bg-[#17384E] text-white">
        <div className="max-w-[1366px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Om Fagfolk</h4>
              <ul className="space-y-2 text-[13px] text-gray-300">
                <li><a href="#" className="hover:text-white">Om oss</a></li>
                <li><a href="#" className="hover:text-white">Hvordan det fungerer</a></li>
                <li><a href="#" className="hover:text-white">Karriere</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For kunder</h4>
              <ul className="space-y-2 text-[13px] text-gray-300">
                <li><Link to="/opprett-forespørsel" className="hover:text-white">Opprett forespørsel</Link></li>
                <li><a href="#" className="hover:text-white">Finn fagfolk</a></li>
                <li><Link to="/priser-og-vilkår" className="hover:text-white">Vilkår</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For leverandører</h4>
              <ul className="space-y-2 text-[13px] text-gray-300">
                <li><Link to="/registrering?role=leverandor" className="hover:text-white">Bli leverandør</Link></li>
                <li><Link to="/pris" className="hover:text-white">Våre tilbud</Link></li>
                <li><Link to="/priser-og-vilkår" className="hover:text-white">Priser og vilkår</Link></li>
                <li><a href="#" className="hover:text-white">Ressurser</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Nyhetsbrev</h4>
              <p className="text-[13px] text-gray-300 mb-3">Få tips og tilbud på epost</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Din epost"
                  className="flex-1 h-10 px-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 text-sm"
                />
                <button className="h-10 w-10 bg-[#E07B3E] rounded-lg flex items-center justify-center hover:bg-[#d16f35]">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/20 text-center text-[13px] text-gray-400">
            <p>© 2026 Fagfolk. Alle rettigheter reservert.</p>
          </div>
        </div>
      </footer>

      {/* How It Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowHowItWorks(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-[24px] font-bold text-[#111827] mb-4">Hvordan Fagfolk fungerer</h2>
            <div className="space-y-4 mb-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#E07B3E] rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827] mb-1">Beskriv jobben din</h3>
                  <p className="text-[14px] text-[#6B7280]">Fortell oss hva du trenger hjelp til ved å fylle ut et enkelt skjema. Ta gjerne bilder og gi detaljerte beskrivelser for de beste tilbudene.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#E07B3E] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827] mb-1">Motta tilbud fra kvalifiserte fagfolk</h3>
                  <p className="text-[14px] text-[#6B7280]">Vi matcher deg med verifiserte håndverkere i ditt område. Du mottar flere tilbud innen 24 timer som du kan sammenligne.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#E07B3E] rounded-lg flex items-center justify-center flex-shrink-0">
                  <ThumbsUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827] mb-1">Velg og få jobben gjort</h3>
                  <p className="text-[14px] text-[#6B7280]">Sammenlign priser, vurderinger og profiler. Velg den håndverkeren som passer best for deg og få jobben gjort trygt og effektivt.</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowHowItWorks(false)}
              className="w-full h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
            >
              Lukk
            </button>
          </div>
        </div>
      )}
    </div>
  );
}