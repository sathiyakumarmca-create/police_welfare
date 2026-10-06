import React, { useState, useEffect } from 'react';
import { User, Phone, CreditCard, MapPin, Building, ShieldCheck, CheckCircle2, AlertTriangle, Loader2, Sparkles, HeartHandshake, Award, Calendar, Users } from 'lucide-react';
import { registerMember, checkDuplicates } from '../api';

export default function RegistrationForm({ lang, onRegistrationSuccess }) {
  const isTamil = lang === 'ta';

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    aadhaar_number: '',
    district: 'Tamil Nadu',
    police_unit: '',
    designation: 'Police Constable (PC)',
    police_officer_name: '',
    police_belt_no: '',
    relationship: 'மனைவி',
    is_retired: 'No',
    retirement_year: '',
    family_details: ''
  });

  const [validationState, setValidationState] = useState({
    mobileChecking: false,
    mobileDuplicate: false,
    mobileValid: false,
    aadhaarChecking: false,
    aadhaarDuplicate: false,
    aadhaarValid: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Debounced check for Mobile Uniqueness
  useEffect(() => {
    const cleanMobile = formData.mobile_number.replace(/\D/g, '');
    if (cleanMobile.length === 10 && ['6','7','8','9'].includes(cleanMobile[0])) {
      setValidationState(prev => ({ ...prev, mobileChecking: true, mobileValid: true }));
      const timer = setTimeout(async () => {
        const res = await checkDuplicates(cleanMobile, null);
        setValidationState(prev => ({
          ...prev,
          mobileChecking: false,
          mobileDuplicate: res.mobile_exists,
        }));
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setValidationState(prev => ({
        ...prev,
        mobileChecking: false,
        mobileDuplicate: false,
        mobileValid: false,
      }));
    }
  }, [formData.mobile_number]);

  // Debounced check for Aadhaar Uniqueness
  useEffect(() => {
    const cleanAadhaar = formData.aadhaar_number.replace(/\D/g, '');
    if (cleanAadhaar.length === 12) {
      setValidationState(prev => ({ ...prev, aadhaarChecking: true, aadhaarValid: true }));
      const timer = setTimeout(async () => {
        const res = await checkDuplicates(null, cleanAadhaar);
        setValidationState(prev => ({
          ...prev,
          aadhaarChecking: false,
          aadhaarDuplicate: res.aadhaar_exists,
        }));
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setValidationState(prev => ({
        ...prev,
        aadhaarChecking: false,
        aadhaarDuplicate: false,
        aadhaarValid: false,
      }));
    }
  }, [formData.aadhaar_number]);

  const handleMobileChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 10) val = val.slice(0, 10);
    setFormData({ ...formData, mobile_number: val });
  };

  const handleAadhaarChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 12) val = val.slice(0, 12);
    setFormData({ ...formData, aadhaar_number: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanMobile = formData.mobile_number.replace(/\D/g, '');
    const cleanAadhaar = formData.aadhaar_number.replace(/\D/g, '');

    if (!formData.first_name.trim()) {
      setErrorMsg(isTamil ? 'முதல் பெயரை உள்ளிடவும்.' : 'Please enter First Name.');
      return;
    }

    if (cleanMobile.length !== 10 || !['6','7','8','9'].includes(cleanMobile[0])) {
      setErrorMsg(isTamil 
        ? '10 இலக்க செல்லுபடியாகும் கைப்பேசி எண்ணை உள்ளிடவும் (6, 7, 8, அல்லது 9-ல் தொடங்க வேண்டும். எ.கா: 9876543210).' 
        : 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9 (e.g. 9876543210).');
      return;
    }

    if (cleanAadhaar.length !== 12) {
      setErrorMsg(isTamil ? '12 இலக்க ஆதார் கார்டு எண்ணை உள்ளிடவும்.' : 'Please enter a valid 12-digit Aadhaar Card number.');
      return;
    }

    if (validationState.mobileDuplicate) {
      setErrorMsg(isTamil ? 'இந்த கைப்பேசி எண் ஏற்கனவே பதிவாகியுள்ளது!' : 'This Mobile Number is already registered in our database!');
      return;
    }

    if (validationState.aadhaarDuplicate) {
      setErrorMsg(isTamil ? 'இந்த ஆதார் கார்டு எண் ஏற்கனவே பதிவாகியுள்ளது!' : 'This Aadhaar Card Number is already registered in our database!');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        mobile_number: cleanMobile,
        aadhaar_number: cleanAadhaar,
        state: 'Tamil Nadu',
        district: formData.district,
        police_unit: formData.police_unit.trim(),
        designation: formData.designation,
        police_officer_name: formData.police_officer_name.trim(),
        police_belt_no: formData.police_belt_no.trim(),
        relationship: formData.relationship,
        is_retired: formData.is_retired,
        retirement_year: formData.retirement_year.trim(),
        family_details: formData.family_details.trim()
      };

      const result = await registerMember(payload);
      setSubmitting(false);
      setSuccessData(result.data);
      if (onRegistrationSuccess) onRegistrationSuccess(result.data);
    } catch (err) {
      setSubmitting(false);
      const errMsg = typeof err === 'string' ? err : (err.message || 'Registration failed. Please try again.');
      setErrorMsg(errMsg);
    }
  };

  const resetForm = () => {
    setSuccessData(null);
    setFormData({
      first_name: '',
      last_name: '',
      mobile_number: '',
      aadhaar_number: '',
      district: 'Tamil Nadu',
      police_unit: '',
      designation: 'Police Constable (PC)',
      police_officer_name: '',
      police_belt_no: '',
      relationship: 'மனைவி',
      is_retired: 'No',
      retirement_year: '',
      family_details: ''
    });
    setErrorMsg('');
  };

  // Generate Retirement Years List (1970 to 2026)
  const yearsList = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1970; y--) {
    yearsList.push(y);
  }

  const tamilNaduDistricts = [
    "Tamil Nadu (தமிழ்நாடு)",
    "Ariyalur (அரியலூர்)",
    "Chengalpattu (செங்கல்பட்டு)",
    "Chennai (சென்னை)",
    "Coimbatore (கோயம்புத்தூர்)",
    "Cuddalore (கடலூர்)",
    "Dharmapuri (தருமபுரி)",
    "Dindigul (திண்டுக்கல்)",
    "Erode (ஈரோடு)",
    "Kallakurichi (கள்ளக்குறிச்சி)",
    "Kanchipuram (காஞ்சீபுரம்)",
    "Kanyakumari (கன்னியாகுமரி)",
    "Karur (கரூர்)",
    "Krishnagiri (கிருஷ்ணகிரி)",
    "Madurai (மதுரை)",
    "Mayiladuthurai (மயிலாடுதுறை)",
    "Nagapattinam (நாகப்பட்டினம்)",
    "Namakkal (நாமக்கல்)",
    "Nilgiris (நீலகிரி)",
    "Perambalur (பெரம்பலூர்)",
    "Pudukkottai (புதுக்கோட்டை)",
    "Ramanathapuram (இராமநாதபுரம்)",
    "Ranipet (ராணிப்பேட்டை)",
    "Salem (சேலம்)",
    "Sivagangai (சிவகாங்கை)",
    "Tenkasi (தென்காசி)",
    "Thanjavur (தஞ்சாவூர்)",
    "Theni (தேனி)",
    "Thoothukudi (தூத்துக்குடி)",
    "Tiruchirappalli (திருச்சிராப்பள்ளி)",
    "Tirunelveli (திருநெல்வேலி)",
    "Tirupathur (திருப்பத்தூர்)",
    "Tiruppur (திருப்பூர்)",
    "Tiruvallur (திருவள்ளூர்)",
    "Tiruvannamalai (திருவண்ணாமலை)",
    "Tiruvarur (திருவாரூர்)",
    "Vellore (வேலூர்)",
    "Viluppuram (விழுப்புரம்)",
    "Virudhunagar (விருதுநகர்)"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* Success Confirmation Card */}
      {successData ? (
        <div className="glass-panel rounded-2xl p-8 border-2 border-emerald-500/40 text-center space-y-6 shadow-2xl animate-fade-in">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 glow-active">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isTamil ? 'பதிவு வெற்றிகரமாக முடிந்தது!' : 'Registration Successful!'}
            </h2>
            <p className="text-emerald-300 text-sm font-medium">
              {isTamil ? 'தமிழ்நாடு காவலர் குடும்ப நல அறக்கட்டளை தரவுத்தளத்தில் சேமிக்கப்பட்டது.' : 'Member details stored securely in Tamil Nadu database.'}
            </p>
          </div>

          {/* Member Card Slip */}
          <div className="bg-slate-900/90 rounded-xl p-6 border border-amber-500/30 text-left max-w-lg mx-auto space-y-3 shadow-inner">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
                {isTamil ? 'உறுப்பினர் அடையாள எண் / Member ID' : 'Member ID'}
              </span>
              <span className="bg-amber-500/20 text-amber-300 font-mono text-sm px-2.5 py-0.5 rounded border border-amber-500/30">
                #TN-POLICE-{String(successData.id).padStart(4, '0')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 block text-xs">{isTamil ? 'உறுப்பினர் பெயர்' : 'Member Name'}</span>
                <span className="font-semibold text-white">{successData.first_name} {successData.last_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">{isTamil ? 'உறவு முறை' : 'Relationship'}</span>
                <span className="font-semibold text-amber-300">{successData.relationship}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">{isTamil ? 'காவலர் பெயர்' : 'Officer Name'}</span>
                <span className="text-slate-200">{successData.police_officer_name || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">{isTamil ? 'காவலர் எண் (Belt/GPF)' : 'Belt/ID No'}</span>
                <span className="font-mono text-emerald-400">{successData.police_belt_no || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">{isTamil ? 'கைப்பேசி' : 'Mobile'}</span>
                <span className="font-mono text-emerald-400">{successData.mobile_number}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">{isTamil ? 'ஆதார் கார்டு' : 'Aadhaar'}</span>
                <span className="font-mono text-slate-200">XXXX-XXXX-{successData.aadhaar_number.slice(-4)}</span>
              </div>
              {successData.retirement_year && (
                <div>
                  <span className="text-slate-400 block text-xs">{isTamil ? 'ஓய்வு பெற்ற வருடம்' : 'Retirement Year'}</span>
                  <span className="font-mono text-amber-400">{successData.retirement_year}</span>
                </div>
              )}
              <div>
                <span className="text-slate-400 block text-xs">{isTamil ? 'மாவட்டம்' : 'District'}</span>
                <span className="text-slate-200">{successData.district}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={resetForm}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg transition transform active:scale-95"
            >
              {isTamil ? '+ புதிய உறுப்பினர் பதிவு' : '+ Register Another Member'}
            </button>
          </div>
        </div>
      ) : (
        /* Main Registration Form */
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl">
          
          {/* Header Banner */}
          <div className="flex items-center gap-3 border-b border-slate-700/60 pb-5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>{isTamil ? 'தமிழ்நாடு காவலர் நல உறுப்பினர் விண்ணப்பம்' : 'Tamil Nadu Police Family Registration Form'}</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                {isTamil ? 'கட்டாய தனித்துவமான புலங்கள்: கைப்பேசி எண் & ஆதார் எண்' : 'Mandatory Unique Fields: Mobile Number & Aadhaar Number'}
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-sm flex items-start gap-3 animate-shake">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">{isTamil ? 'பிழை எச்சரிக்கை' : 'Validation Error'}</span>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Applicant Personal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span>{isTamil ? '1. விண்ணப்பதாரர் அடிப்படை விவரங்கள்' : '1. Applicant Personal Details'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-1.5">
                    <span>{isTamil ? 'விண்ணப்பதாரர் பெயர் (First Name)' : 'First Name'}</span>
                    <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isTamil ? 'எ.கா. இரமேஷ்' : 'e.g. Ramesh'}
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-1.5">
                    <span>{isTamil ? 'கடைசி பெயர் / இனிஷியல்' : 'Last Name / Initial'}</span>
                  </label>
                  <input
                    type="text"
                    placeholder={isTamil ? 'எ.கா. குமார்' : 'e.g. Kumar'}
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
              </div>

              {/* Mandatory Unique Fields Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                
                {/* Mobile Number */}
                <div className="space-y-2 relative">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-amber-400" />
                      <span>{isTamil ? 'கைப்பேசி எண் (Mobile)' : 'Mobile Number'}</span>
                      <span className="text-rose-400 font-bold">*</span>
                    </label>
                    
                    {validationState.mobileChecking && (
                      <span className="text-xs text-amber-400 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> {isTamil ? 'சரிபார்க்கிறது...' : 'Checking...'}
                      </span>
                    )}
                    {!validationState.mobileChecking && validationState.mobileValid && !validationState.mobileDuplicate && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {isTamil ? 'தனித்துவமானது (Unique)' : 'Available'}
                      </span>
                    )}
                    {validationState.mobileDuplicate && (
                      <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {isTamil ? 'ஏற்கனவே பதிவாகியுள்ளது!' : 'Already Registered!'}
                      </span>
                    )}
                  </div>

                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="e.g. 9876543210 (10 digits)"
                    value={formData.mobile_number}
                    onChange={handleMobileChange}
                    className={`w-full bg-slate-900/80 border rounded-xl px-4 py-3 font-mono text-slate-100 placeholder-slate-500 focus:outline-none transition ${
                      validationState.mobileDuplicate
                        ? 'border-rose-500 focus:border-rose-400 focus:ring-rose-500'
                        : validationState.mobileValid && !validationState.mobileDuplicate
                        ? 'border-emerald-500/70 focus:border-emerald-400'
                        : 'border-slate-700 focus:border-amber-400'
                    }`}
                  />
                  <p className="text-[11px] text-slate-400">
                    {isTamil ? '10 இலக்க எண் (6, 7, 8, அல்லது 9-ல் தொடங்க வேண்டும்)' : 'Must be 10 digits starting with 6, 7, 8, or 9'}
                  </p>
                </div>

                {/* Aadhaar Number */}
                <div className="space-y-2 relative">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>{isTamil ? 'ஆதார் கார்டு எண்' : 'Aadhaar Card Number'}</span>
                      <span className="text-rose-400 font-bold">*</span>
                    </label>

                    {validationState.aadhaarChecking && (
                      <span className="text-xs text-amber-400 flex items-center gap-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> {isTamil ? 'சரிபார்க்கிறது...' : 'Checking...'}
                      </span>
                    )}
                    {!validationState.aadhaarChecking && validationState.aadhaarValid && !validationState.aadhaarDuplicate && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {isTamil ? 'தனித்துவமானது (Unique)' : 'Available'}
                      </span>
                    )}
                    {validationState.aadhaarDuplicate && (
                      <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {isTamil ? 'ஏற்கனவே பதிவாகியுள்ளது!' : 'Already Registered!'}
                      </span>
                    )}
                  </div>

                  <input
                    type="text"
                    required
                    maxLength={12}
                    placeholder="12 digit Aadhaar number"
                    value={formData.aadhaar_number}
                    onChange={handleAadhaarChange}
                    className={`w-full bg-slate-900/80 border rounded-xl px-4 py-3 font-mono text-slate-100 placeholder-slate-500 focus:outline-none transition ${
                      validationState.aadhaarDuplicate
                        ? 'border-rose-500 focus:border-rose-400 focus:ring-rose-500'
                        : validationState.aadhaarValid && !validationState.aadhaarDuplicate
                        ? 'border-emerald-500/70 focus:border-emerald-400'
                        : 'border-slate-700 focus:border-amber-400'
                    }`}
                  />
                  <p className="text-[11px] text-slate-400">
                    {isTamil ? 'கட்டாய தனித்துவமான ஆதார் எண் (12 இலக்கங்கள்)' : 'Mandatory unique 12-digit Aadhaar'}
                  </p>
                </div>

              </div>
            </div>

            {/* Section 2: Police Officer Connection & Relationship */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{isTamil ? '2. காவலர் விவரங்கள் & உறவு முறை (Police Details)' : '2. Police Officer & Relationship Details'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                
                {/* Police Officer Name */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-slate-200">
                    {isTamil ? 'பணிபுரியும் / ஓய்வு பெற்ற காவலர் பெயர்' : 'Serving/Retired Police Officer Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={isTamil ? 'எ.கா. K. செல்வம்' : 'e.g. K. Selvam'}
                    value={formData.police_officer_name}
                    onChange={(e) => setFormData({ ...formData, police_officer_name: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Designation / Rank */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-slate-200">
                    {isTamil ? 'பதவி (Rank / Designation)' : 'Designation / Rank'}
                  </label>
                  <select
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Police Constable (PC)">Police Constable (PC)</option>
                    <option value="Head Constable (HC)">Head Constable (HC)</option>
                    <option value="Special Sub-Inspector (SSI)">Special Sub-Inspector (SSI)</option>
                    <option value="Sub-Inspector (SI)">Sub-Inspector (SI)</option>
                    <option value="Inspector of Police">Inspector of Police</option>
                    <option value="Deputy Superintendent (DSP)">Deputy Superintendent (DSP)</option>
                    <option value="Superintendent of Police (SP)">Superintendent of Police (SP)</option>
                    <option value="Retired Police Officer">Retired Officer (ஓய்வு பெற்ற காவலர்)</option>
                  </select>
                </div>

                {/* Belt Number / Police ID */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-slate-200">
                    {isTamil ? 'காவலர் எண் (Belt / GPF / ID No)' : 'Police Belt / ID / GPF No.'}
                  </label>
                  <input
                    type="text"
                    placeholder={isTamil ? 'எ.கா. HC 1420 / GPF 58210' : 'e.g. HC 1420 / GPF 58210'}
                    value={formData.police_belt_no}
                    onChange={(e) => setFormData({ ...formData, police_belt_no: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

              </div>

              {/* Relationship & Retirement Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                
                {/* Relationship Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-amber-300 font-semibold flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-amber-400" />
                    <span>{isTamil ? 'உறுப்பினருக்கு உறவு முறை' : 'Relationship to Officer'}</span>
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full bg-slate-900/90 border border-amber-500/40 rounded-xl px-4 py-3 text-amber-200 font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="கணவன்">கணவன் (Husband)</option>
                    <option value="மனைவி">மனைவி (Wife)</option>
                    <option value="அம்மா">அம்மா (Mother)</option>
                    <option value="அப்பா">அப்பா (Father)</option>
                    <option value="பிள்ளைகள் (18 வயதுக்கு மேல்)">பிள்ளைகள் - 18 வயதுக்கு மேல் (Children &gt; 18)</option>
                    <option value="ஓய்வு பெற்ற காவலர் (சுய விவரம்)">ஓய்வு பெற்ற காவலர் - சுய (Retired Officer)</option>
                    <option value="பணிபுரியும் காவலர் (சுய விவரம்)">பணிபுரியும் காவலர் - சுய (Serving Officer)</option>
                  </select>
                </div>

                {/* Retirement Status */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-slate-200">
                    {isTamil ? 'ஓய்வு பெற்ற காவலரா?' : 'Is Retired Police Officer?'}
                  </label>
                  <select
                    value={formData.is_retired}
                    onChange={(e) => setFormData({ ...formData, is_retired: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="No">No / இல்லை (பணிபுரிகிறார்)</option>
                    <option value="Yes">Yes / ஆம் (பணி ஓய்வு பெற்றார்)</option>
                  </select>
                </div>

                {/* Retirement Year (If Retired or selected) */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{isTamil ? 'எந்த வருடம் பணி ஓய்வு பெற்றார்?' : 'Year of Retirement'}</span>
                  </label>
                  <select
                    value={formData.retirement_year}
                    onChange={(e) => setFormData({ ...formData, retirement_year: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="">-- {isTamil ? 'வருடத்தை தேர்ந்தெடுக்கவும்' : 'Select Year'} --</option>
                    {yearsList.map(y => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Section 3: Family Details & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                
                {/* District Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{isTamil ? 'மாவட்டம் (District)' : 'Tamil Nadu District'}</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    {tamilNaduDistricts.map((dist, idx) => (
                      <option key={idx} value={dist.split(" ")[0]}>{dist}</option>
                    ))}
                  </select>
                </div>

                {/* Police Unit / Station */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-slate-400" />
                    <span>{isTamil ? 'காவல் நிலையம் / பிரிவு (Station/Unit)' : 'Police Station / Unit'}</span>
                  </label>
                  <input
                    type="text"
                    placeholder={isTamil ? 'எ.கா. ஆயுதப்படை / திருப்பரங்குன்றம் நிலையம்' : 'e.g. Armed Reserve / Station'}
                    value={formData.police_unit}
                    onChange={(e) => setFormData({ ...formData, police_unit: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

              </div>

              {/* Family Members Details */}
              <div className="space-y-2 pt-2">
                <label className="text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>{isTamil ? 'அவரது கணவர், மனைவி பிள்ளைகள் பற்றிய விவரங்கள்' : 'Spouse & Children Family Details'}</span>
                </label>
                <textarea
                  rows={3}
                  placeholder={isTamil ? 'கணவர்/மனைவி பெயர், பிள்ளைகளின் பெயர் மற்றும் வயது விவரங்களை உள்ளிடவும்...' : 'Enter details of spouse and children (names, ages...)'}
                  value={formData.family_details}
                  onChange={(e) => setFormData({ ...formData, family_details: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting || validationState.mobileDuplicate || validationState.aadhaarDuplicate}
                className={`w-full py-4 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-xl transition transform active:scale-98 ${
                  validationState.mobileDuplicate || validationState.aadhaarDuplicate
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isTamil ? 'பதிவு செய்யப்படுகிறது...' : 'Processing Registration...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{isTamil ? 'உறுப்பினராக பதிவு செய்' : 'Submit Member Registration'}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}
