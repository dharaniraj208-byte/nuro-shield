import React from 'react';
import { useNeuro } from '../context/NeuroContext';
import {
  User,
  Shield,
  Activity,
  Globe,
  ArrowRight,
  Camera,
  Mic,
  Video,
  Hospital,
  Lock,
  PhoneCall,
  Eye,
  Sun,
  Moon,
  Sparkles,
  HeartPulse
} from 'lucide-react';
import { LANGUAGES } from '../i18n/translations';

export const PortalGateway: React.FC = () => {
  const {
    setCurrentScreen,
    setPortal,
    startMedia,
    language,
    setLanguage,
    isAdminLoggedIn,
    themeMode,
    toggleThemeMode,
    t
  } = useNeuro();

  const handleChoosePatient = () => {
    setPortal('patient');
    setCurrentScreen('patient_portal');
    startMedia();
  };

  const handleChooseAdmin = () => {
    setPortal('admin');
    setCurrentScreen('admin_portal');
  };

  const isDark = themeMode === 'dark';

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 sm:p-8 transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      {/* Top Navigation Bar */}
      <header className={`max-w-6xl w-full mx-auto flex items-center justify-between py-4 px-6 rounded-2xl border transition-colors shadow-sm ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 backdrop-blur-md'
          : 'bg-white/95 border-slate-200/80 backdrop-blur-md'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#E06B52] via-[#C9573E] to-[#8F3F2F] text-white shadow-lg shadow-[#E06B52]/20">
            <HeartPulse className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">
                Neuro<span className="text-[#E06B52]">Shield</span>
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold border ${
                isDark
                  ? 'bg-orange-950/60 text-orange-300 border-orange-800'
                  : 'bg-orange-50 text-orange-700 border-orange-200'
              }`}>
                CLINICAL GATEWAY
              </span>
            </div>
            <p className={`text-[11px] hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {/* Right Actions: Theme Toggle & Language Picker */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleThemeMode}
            aria-label="Toggle Theme"
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-[#E06B52]" />
            <div className={`flex rounded-xl p-1 border ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition ${
                    language === lang.code
                      ? 'bg-[#E06B52] text-white shadow-sm'
                      : isDark
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang.flag} {lang.nativeName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Dual-Portal Selection Gate */}
      <main className="max-w-5xl w-full mx-auto my-auto py-10 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/50 text-[#C9573E] dark:text-orange-300 font-semibold text-xs px-3.5 py-1 rounded-full border border-orange-200 dark:border-orange-800">
            <Sparkles className="h-3.5 w-3.5 text-[#E06B52]" />
            <span>Role-Based Clinical Governance &amp; AI Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Select Your Clinical Gateway
          </h1>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            NeuroShield delivers partitioned healthcare environments with hardware isolation. Patients receive continuous on-device AI vision, vitals telemetry, and rehabilitation plans, while medical administrators oversee ward networks and emergency dispatches.
          </p>
        </div>

        {/* Dual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Patient Recovery Portal */}
          <div
            onClick={handleChoosePatient}
            className={`group cursor-pointer rounded-3xl border p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between ${
              isDark
                ? 'bg-slate-900 border-slate-800 hover:border-[#E06B52]'
                : 'bg-white border-slate-200/90 hover:border-[#E06B52]'
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#E06B52] to-[#8F3F2F] text-white shadow-lg shadow-[#E06B52]/25 group-hover:scale-110 transition-transform">
                  <User className="h-7 w-7" />
                </div>
                <span className="rounded-full bg-orange-50 dark:bg-orange-950/60 px-3 py-1 text-xs font-bold text-[#C9573E] dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                  CAMERA &amp; SENSORS READY
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold group-hover:text-[#E06B52] transition-colors">
                  {t('patientPortal')}
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  For Patients, Bedside Caregivers &amp; At-Home Recovery
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-md bg-orange-100 dark:bg-orange-950/50 text-[#E06B52]">
                    <Camera className="h-3.5 w-3.5" />
                  </div>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    AI Automated Camera Monitoring (Blink SOS, Fall Detection, Absence)
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-md bg-teal-100 dark:bg-teal-950/50 text-[#8F3F2F]">
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Continuous Vitals Telemetry (Heart Rate, SpO₂, BP, Temp, Sleep)
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/50 text-amber-500">
                    <Shield className="h-3.5 w-3.5" />
                  </div>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    10-Second Cancel Countdown Gate Before Admin Escalation
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-md bg-rose-100 dark:bg-rose-950/50 text-rose-500">
                    <PhoneCall className="h-3.5 w-3.5" />
                  </div>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Automated SMS &amp; Telephony Voice Dispatch to Caregivers
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-950/50 text-indigo-500">
                    <Eye className="h-3.5 w-3.5" />
                  </div>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Full 6-Tab Navigation (Home, Exercise, Camera, Vitals, Docs, Profile)
                  </span>
                </div>
              </div>
            </div>

            <div className={`pt-6 border-t mt-6 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <button
                type="button"
                className="w-full rounded-2xl bg-gradient-to-r from-[#E06B52] to-[#C9573E] hover:from-[#C9573E] hover:to-[#0369A1] py-3.5 text-xs font-bold text-white shadow-md shadow-[#E06B52]/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Patient Portal</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: Clinical Admin & Hospital Network */}
          <div
            onClick={handleChooseAdmin}
            className={`group cursor-pointer rounded-3xl border p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between ${
              isDark
                ? 'bg-slate-900 border-slate-800 hover:border-[#8F3F2F]'
                : 'bg-white border-slate-200/90 hover:border-[#8F3F2F]'
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#8F3F2F] to-emerald-600 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7" />
                </div>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  SECURE OTP VERIFICATION
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold group-hover:text-[#8F3F2F] transition-colors">
                  {t('adminPortal')}
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  For Hospital Directors, Attending Neurologists &amp; Staff Nurses
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600">
                    <Hospital className="h-3.5 w-3.5" />
                  </div>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Hospital Collaboration Network (Apollo, CMC, AIIMS, Fortis)
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-md bg-orange-100 dark:bg-orange-950/50 text-orange-600">
                    <Video className="h-3.5 w-3.5" />
                  </div>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Remote Patient Bed CCTV &amp; Ward IP Camera Monitor
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Admin Local Camera/Mic Isolated for Strict Clinician Privacy
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-md bg-rose-100 dark:bg-rose-950/50 text-rose-500">
                    <PhoneCall className="h-3.5 w-3.5" />
                  </div>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Dispatch Telephony &amp; Automatic Retry Escalation Protocol
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-md bg-teal-100 dark:bg-teal-950/50 text-[#8F3F2F]">
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Real-time Incident Logging, Patient Triage &amp; Clinical Audit
                  </span>
                </div>
              </div>
            </div>

            <div className={`pt-6 border-t mt-6 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <button
                type="button"
                className="w-full rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 py-3.5 text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>{isAdminLoggedIn ? 'Enter Admin Command Center' : 'Admin Login (OTP Verification)'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className={`max-w-6xl w-full mx-auto py-4 text-center text-xs border-t ${
        isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-500'
      }`}>
        NeuroShield Clinical Architecture • Hardware-Isolated Sensor Governance • HIPAA &amp; Stroke Guidelines Compliant
      </footer>
    </div>
  );
};

