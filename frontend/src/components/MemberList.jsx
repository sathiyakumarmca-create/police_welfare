import React, { useState, useEffect } from 'react';
import { Search, Users, RefreshCw, Shield, Phone, CreditCard, Calendar, HeartHandshake, Award } from 'lucide-react';
import { fetchMembers } from '../api';

export default function MemberList({ lang, refreshTrigger }) {
  const isTamil = lang === 'ta';

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await fetchMembers();
    setMembers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const filteredMembers = members.filter(m => {
    const term = searchTerm.toLowerCase();
    return (
      m.first_name.toLowerCase().includes(term) ||
      (m.last_name && m.last_name.toLowerCase().includes(term)) ||
      m.mobile_number.includes(term) ||
      m.aadhaar_number.includes(term) ||
      (m.district && m.district.toLowerCase().includes(term)) ||
      (m.police_officer_name && m.police_officer_name.toLowerCase().includes(term)) ||
      (m.relationship && m.relationship.toLowerCase().includes(term))
    );
  });

  const maskAadhaar = (num) => {
    if (!num || num.length < 12) return 'XXXX-XXXX-XXXX';
    return `XXXX-XXXX-${num.slice(-4)}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-6 px-4">
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-6">
        
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {isTamil ? 'தமிழ்நாடு காவலர் நல உறுப்பினர்கள் பட்டியல்' : 'Registered Members Directory (Tamil Nadu)'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {isTamil ? `மொத்த உறுப்பினர்கள்: ${members.length}` : `Total Registered Members: ${members.length}`}
              </p>
            </div>
          </div>

          {/* Search & Refresh */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={isTamil ? 'தேடுக (பெயர், போன், உறவு...)' : 'Search members...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={loadData}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-amber-400 rounded-xl transition"
              title={isTamil ? 'புதுப்பிக்கவும்' : 'Refresh'}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Member Table */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-400" />
            <p className="text-sm">{isTamil ? 'உறுப்பினர்கள் பட்டியல் ஏற்றப்படுகிறது...' : 'Fetching member records...'}</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2 border border-dashed border-slate-800 rounded-xl">
            <Users className="w-10 h-10 mx-auto text-slate-600" />
            <p className="font-semibold text-slate-300">
              {isTamil ? 'உறுப்பினர்கள் எவரும் கிடைக்கவில்லை.' : 'No member records found.'}
            </p>
            <p className="text-xs text-slate-500">
              {searchTerm ? (isTamil ? 'வேறு தேடலை முயற்சி செய்யவும்.' : 'Try adjusting your search criteria.') : (isTamil ? 'படிவம் மூலம் புதிய உறுப்பினரை சேர்க்கவும்.' : 'Register a member using the form.')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-200 border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-amber-300 border-b border-slate-800 text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">ID</th>
                  <th className="py-3.5 px-4 font-semibold">{isTamil ? 'உறுப்பினர் & உறவு முறை' : 'Member & Relationship'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isTamil ? 'காவலர் & எண்' : 'Police Officer & Belt'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isTamil ? 'கைப்பேசி' : 'Mobile Number'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isTamil ? 'ஆதார் (Protected)' : 'Aadhaar'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isTamil ? 'ஓய்வு/மாவட்டம்' : 'Status / District'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono text-xs text-amber-400">
                      #TN-{String(m.id).padStart(4, '0')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{m.first_name} {m.last_name}</div>
                      {m.relationship && (
                        <span className="inline-block bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] px-2 py-0.5 rounded mt-0.5 font-medium">
                          {m.relationship}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">{m.police_officer_name || m.first_name}</div>
                      <div className="text-xs text-slate-400">
                        {m.designation} {m.police_belt_no && `• ${m.police_belt_no}`}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        {m.mobile_number}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <span className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800 w-fit text-xs">
                        <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                        {maskAadhaar(m.aadhaar_number)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="text-slate-200">{m.district || 'Tamil Nadu'}</div>
                      {m.retirement_year && (
                        <div className="text-amber-400 font-mono text-[11px]">
                          ஓய்வு: {m.retirement_year}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
