import React from 'react';
import BadgeLogo from './BadgeLogo';
import { Phone, MapPin, Shield, Globe } from 'lucide-react';

export default function Header({ lang, setLang }) {
  const isTamil = lang === 'ta';

  return (
    <header className="w-full relative shadow-2xl overflow-hidden">
      {/* Top Official Info Bar */}
      <div className="bg-slate-900 border-b border-amber-500/30 text-xs sm:text-sm py-2 px-4 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-center md:text-left">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {isTamil
                ? "காவலர் குடும்ப நல அறக்கட்டளை • தமிழ்நாடு"
                : "Police Family Welfare Trust • Tamil Nadu"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a href="tel:7200821044" className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition">
              <Phone className="w-3.5 h-3.5" />
              <span className="font-semibold tracking-wider">7200821044</span>
            </a>

            <div className="h-4 w-px bg-slate-700"></div>

            <button
              onClick={() => setLang(isTamil ? 'en' : 'ta')}
              className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold transition"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isTamil ? 'English' : 'தமிழ்'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Hero Banner with Gradient & Badge */}
      <div className="maroon-gradient-header py-8 px-4 sm:px-8 relative">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          
          {/* Left Text Branding */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs px-3.5 py-1 rounded-full font-medium">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{isTamil ? 'தமிழ்நாடு அரசு பதிவு பெற்ற அறக்கட்டளை' : 'Recognized Police Family Welfare Trust • Tamil Nadu'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              காவலர் குடும்ப நல அறக்கட்டளை
            </h1>

            <p className="text-amber-300 font-medium text-sm sm:text-lg tracking-wide">
              Police Family Welfare Trust • Tamil Nadu State
            </p>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              {isTamil
                ? "தமிழ்நாடு காவலர்கள், ஓய்வு பெற்ற காவலர்கள் மற்றும் அவர்களின் குடும்பத்தினரின் நல்வாழ்வு, மருத்துவ உதவி, கல்வி மேம்பாடு மற்றும் பாதுகாப்பு வழங்கும் சேவை அமைப்பு."
                : "Dedicated to providing welfare support, healthcare, education assistance, and family security for serving & retired police personnel across Tamil Nadu."}
            </p>
          </div>

          {/* Central Seal Badge */}
          <div className="shrink-0 relative group">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl group-hover:bg-amber-400/30 transition duration-500"></div>
            <BadgeLogo size="lg" />
          </div>

        </div>
      </div>
    </header>
  );
}
