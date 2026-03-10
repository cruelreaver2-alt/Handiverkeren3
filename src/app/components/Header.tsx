import { Link } from "react-router";
import { Hammer, Settings, LayoutDashboard, Menu, X } from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { useState } from "react";

interface HeaderProps {
  variant?: "default" | "simple";
  title?: string;
  onBack?: () => void;
}

export function Header({ variant = "default", title, onBack }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (variant === "simple") {
    return (
      <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="h-full px-4 flex items-center justify-between max-w-[1366px] mx-auto">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {title && <h1 className="text-lg font-semibold text-[#111827] flex-1 text-center">{title}</h1>}
          <div className="w-10" />
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 bg-white shadow-sm sticky top-0 z-50">
      <div className="h-full px-4 lg:px-24 flex items-center justify-between max-w-[1366px] mx-auto">
        <Link to="/" className="flex items-center gap-2 lg:gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#17384E] rounded-lg flex items-center justify-center">
            <Hammer className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <span className="text-lg lg:text-xl font-bold text-[#17384E]">Håndtverkeren</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/logg-inn"
            className="flex items-center justify-center h-10 px-4 text-[#17384E] rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Logg inn
          </Link>
          <Link
            to="/dashboard"
            className="hidden lg:flex items-center justify-center w-10 h-10 border border-gray-300 text-[#6B7280] rounded-lg hover:bg-gray-50 transition-colors"
            title="Kunde Dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
          </Link>
          <Link
            to="/admin"
            className="hidden lg:flex items-center justify-center w-10 h-10 border border-gray-300 text-[#6B7280] rounded-lg hover:bg-gray-50 transition-colors"
            title="Admin Panel"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <Link
            to="/pris"
            className="flex items-center justify-center h-10 px-4 border-[1.5px] border-[#E5E7EB] text-[#111827] rounded-lg font-semibold bg-transparent hover:bg-gray-50 transition-colors"
          >
            Pris
          </Link>
          <Link
            to="/registrer"
            className="flex items-center justify-center h-10 px-4 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
          >
            Bli kunde
          </Link>
          <Link
            to="/leverandør-logg-inn"
            className="flex items-center justify-center h-10 px-4 border-[1.5px] border-[#17384E] text-[#17384E] rounded-lg font-semibold bg-transparent hover:bg-[#17384E] hover:text-white transition-colors"
          >
            For leverandører
          </Link>
          <NotificationBell />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <NotificationBell />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#17384E] hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
          <div className="flex flex-col p-4 gap-2">
            <Link
              to="/logg-inn"
              className="flex items-center justify-center h-12 px-4 text-[#17384E] rounded-lg font-medium hover:bg-gray-50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Logg inn
            </Link>
            <Link
              to="/pris"
              className="flex items-center justify-center h-12 px-4 border-[1.5px] border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pris
            </Link>
            <Link
              to="/registrer"
              className="flex items-center justify-center h-12 px-4 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bli kunde
            </Link>
            <Link
              to="/leverandør-logg-inn"
              className="flex items-center justify-center h-12 px-4 border-[1.5px] border-[#17384E] text-[#17384E] rounded-lg font-semibold hover:bg-[#17384E] hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              For leverandører
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 h-12 px-4 text-[#6B7280] rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Kunde Dashboard</span>
            </Link>
            <Link
              to="/admin"
              className="flex items-center gap-3 h-12 px-4 text-[#6B7280] rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Admin Panel</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}