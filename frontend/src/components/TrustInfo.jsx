import React from 'react';
import { HeartHandshake, Stethoscope, GraduationCap, ShieldAlert, MapPin, Phone, Clock, Award } from 'lucide-react';

export default function TrustInfo({ lang }) {
  const isTamil = lang === 'ta';

  const initiatives = [
    {
      icon: Stethoscope,
      titleTa: "மருத்துவ உதவி திட்டங்கள்",
      titleEn: "Medical Emergency Aid",
      descTa: "காவலர்கள் மற்றும் குடும்பத்தினருக்கு அவசர மருத்துவ சிகிச்சை நிதி மற்றும் மருத்துவ முகாம்கள்.",
      descEn: "Financial coverage for specialized medical treatment and health checkup camps."
    },
    {
      icon: GraduationCap,
      titleTa: "கல்வி நிதியுதவி",
      titleEn: "Children Education Grant",
      descTa: "காவலர்களின் குழந்தைகளின் உயர் கல்வி மற்றும் தொழில்முறை படிப்புகளுக்கான கல்வி உதவித்தொகை.",
      descEn: "Scholarships and educational support for children pursuing higher professional degrees."
    },
    {
      icon: HeartHandshake,
      titleTa: "குடும்ப நல்வாழ்வு பாதுகாப்பு",
      titleEn: "Family Welfare & Security",
      descTa: "பணியின் போது உயிர்நீத்த அல்லது காயம் அடைந்த காவலர் குடும்பத்தினருக்கு உடனடி வாழ்வாதார உதவி.",
      descEn: "Immediate emergency relief and livelihood support for families of martyrs and injured staff."
    },
    {
      icon: ShieldAlert,
      titleTa: "24/7 உதவி மையம்",
      titleEn: "24/7 Helpline Support",
      descTa: "மதுரை திருப்பரங்குன்றம் தலைமை அலுவலகத்தில் செயல்படும் 24/7 காவல் நல உதவி மையம்.",
      descEn: "Round-the-clock emergency support line based at Madurai Thirupparankundram Trust HQ."
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-6 px-4 space-y-8">
      
      {/* Welfare Initiatives Grid */}
      <div>
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isTamil ? 'நமது நலத்திட்டங்கள் & சேவைகள்' : 'Welfare Services & Initiatives'}
          </h2>
          <p className="text-amber-300 text-sm font-medium">
            {isTamil ? 'காவலர் குடும்பங்களின் எதிர்காலத்தை பாதுகாக்கும் உயரிய பணிகள்' : 'Empowering police families through dedicated community programs'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {initiatives.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-card rounded-2xl p-6 border border-slate-700/80 hover:border-amber-500/50 transition duration-300 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">
                    {isTamil ? item.titleTa : item.titleEn}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {isTamil ? item.descTa : item.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Location & Official Details Slip */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-amber-500/40 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{isTamil ? 'தலைமை அலுவலக முகவரி' : 'Headquarters Address'}</span>
            </h4>
            <p className="text-slate-200 text-sm leading-relaxed font-medium">
              காவலர் குடும்ப நல அறக்கட்டளை<br />
              எண்: 1/155, இராப்பண் நகர், விளாச்சேரி ரோடு,<br />
              பசுமலை, திருப்பரங்குன்றம்,<br />
              மதுரை - 625004, தமிழ்நாடு.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              <span>{isTamil ? 'தொடர்பு எண்கள்' : 'Contact Numbers'}</span>
            </h4>
            <div className="space-y-1.5 text-sm">
              <a href="tel:7200821044" className="block text-emerald-400 font-mono font-bold hover:underline">
                📞 7200821044
              </a>
              <p className="text-slate-400 text-xs">
                {isTamil ? 'அலுவலக நேரம்: காலை 9:00 - மாலை 6:00' : 'Office Hours: 9:00 AM - 6:00 PM'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>{isTamil ? 'பாதுகாப்பான தரவுத்தளம்' : 'Secure Database'}</span>
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              {isTamil
                ? 'உங்கள் கைப்பேசி எண் மற்றும் ஆதார் எண் தரவுத்தளத்தில் குறியாக்கம் செய்யப்பட்டு தனித்துவமாக பாதுகாக்கப்படுகிறது.'
                : 'All member records, mobile numbers, and Aadhaar identifiers are securely indexed with strict unique constraints.'}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
