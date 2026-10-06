import React, { useState } from 'react';
import Header from './components/Header';
import RegistrationForm from './components/RegistrationForm';
import MemberList from './components/MemberList';
import TrustInfo from './components/TrustInfo';
import { UserPlus, Users, Info, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('ta'); // 'ta' for Tamil, 'en' for English
  const [activeTab, setActiveTab] = useState('register'); // 'register', 'members', 'info'
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const isTamil = lang === 'ta';

  const handleRegistrationSuccess = (newMember) => {
    // Trigger auto refresh of member list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <Header lang={lang} setLang={setLang} />

      {/* Navigation Bar */}
      <div className="bg-slate-900/90 border-b border-amber-500/30 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 flex justify-center sm:justify-start gap-2 py-3 overflow-x-auto">
          
          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition duration-200 shrink-0 ${
              activeTab === 'register'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{isTamil ? 'உறுப்பினர் பதிவு' : 'Member Registration'}</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition duration-200 shrink-0 ${
              activeTab === 'members'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isTamil ? 'உறுப்பினர்கள் பட்டியல்' : 'Members Directory'}</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition duration-200 shrink-0 ${
              activeTab === 'info'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>{isTamil ? 'நலத்திட்டங்கள்' : 'Welfare Schemes'}</span>
          </button>

        </div>
      </div>

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'register' && (
          <RegistrationForm
            lang={lang}
            onRegistrationSuccess={handleRegistrationSuccess}
          />
        )}

        {activeTab === 'members' && (
          <MemberList
            lang={lang}
            refreshTrigger={refreshTrigger}
          />
        )}

        {activeTab === 'info' && (
          <TrustInfo
            lang={lang}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>காவலர் குடும்ப நல அறக்கட்டளை - மதுரை</span>
          </div>
          <p>© 2026 Police Family Welfare Trust, Madurai. All Rights Reserved.</p>
          <p className="text-slate-500">
            Designated database storage with unique validation for Mobile Number & Aadhaar Card.
          </p>
        </div>
      </footer>
    </div>
  );
}
