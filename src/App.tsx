import React from 'react';
import { NeuroProvider, useNeuro } from './context/NeuroContext';
import { PortalGateway } from './components/PortalGateway';
import { PatientPortal } from './components/PatientPortal';
import { AdminPortal } from './components/AdminPortal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { EmergencyAlertModal } from './components/EmergencyAlertModal';
import { ProfileViewWidget } from './components/ProfileViewWidget';
import { RealtimeSmsToast } from './components/RealtimeSmsToast';
import { LANGUAGES } from './i18n/translations';
import {
  Shield,
  Activity,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Globe,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  User,
  Building2,
  LogOut,
  Radio
} from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    portal,
    setPortal,
    adminUser,
    language,
    setLanguage,
    cameraActive,
    micActive,
    triggerVoiceAssistant,
    triggerEmergency,
    adminPhone,
    t
  } = useNeuro();

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // If on initial landing gateway, show the distinct dual-portal selection
  if (currentScreen === 'gateway') {
    return (
      <>
        <RealtimeSmsToast />
        <PortalGateway />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white transition-colors duration-200">
      {/* Top Universal Navbar in signature medical blue & clean white */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Clinical Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentScreen('gateway')}
              className="flex items-center gap-3 text-left group"
              title="Return to Portal Gateway"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 via-[#c9573e] to-[#8f3f2f] text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                <Activity className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    Neuro<span className="text-[#c9573e] dark:text-[#f2947f]">Shield</span>
                  </h1>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold border ${
                      portal === 'patient'
                        ? 'bg-orange-50 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-[#713022]'
                        : 'bg-[#fef0ed] dark:bg-[#3a1710] text-[#b94f39] dark:text-[#f2947f] border-[#f4b8aa] dark:border-[#713022]'
                    }`}
                  >
                    {portal === 'patient' ? 'PATIENT SENTINEL' : 'ADMIN COMMAND'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  {portal === 'patient' ? t('appSubtitle') : 'Multi-Hospital Doctor Network & CCTV Central'}
                </p>
              </div>
            </button>
          </div>

          {/* Portal Switcher & Top Actions */}
          <div className="flex items-center gap-2.5">
            {/* Direct Switch to Other Portal or Gateway */}
            <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setPortal('patient')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  portal === 'patient'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('patientPortal')}</span>
              </button>
              <button
                onClick={() => setPortal('admin')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  portal === 'admin'
                    ? 'bg-[#c9573e] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('adminPortal')}</span>
              </button>
            </div>

            {/* "Hey Neuro" Voice Assistant Trigger (Patient Only) */}
            {portal === 'patient' && (
              <button
                onClick={triggerVoiceAssistant}
                className="flex items-center gap-2 rounded-2xl border border-orange-300 dark:border-[#713022] bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-100 dark:hover:bg-[#4d251a] px-3.5 py-2 text-xs font-bold text-orange-700 dark:text-orange-300 transition shadow-xs"
                title="Activate Hey Neuro Voice AI"
              >
                <Sparkles className="h-4 w-4 text-orange-500 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="hidden md:inline">Hey Neuro</span>
              </button>
            )}

            {/* Language Selector Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-400 shadow-xs">
                <span className="text-sm">{currentLangObj.flag}</span>
                <span className="hidden sm:inline">{currentLangObj.nativeName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <div className="absolute right-0 mt-1 hidden group-hover:block w-44 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 shadow-xl z-50 animate-in fade-in">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs text-left transition ${
                      language === lang.code
                        ? 'bg-orange-600 text-white font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{lang.flag} {lang.nativeName}</span>
                    <span className="text-[10px] opacity-75 font-mono">{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Emergency SOS Button */}
            <button
              onClick={() => triggerEmergency('SOS_MANUAL', 'Urgent Emergency SOS button activated.')}
              className="rounded-2xl bg-rose-600 hover:bg-rose-500 px-3 py-2 text-xs font-black text-white shadow-md shadow-rose-600/30 transition flex items-center gap-1.5 active:scale-95"
              title="Emergency SOS"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden lg:inline">SOS</span>
            </button>

            {/* Return to Gateway */}
            <button
              onClick={() => setCurrentScreen('gateway')}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition shadow-xs"
              title="Change Portal Gateway"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live Hardware Status Ticker */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 px-4 py-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {portal === 'patient' ? (
                <>
                  <span className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${cameraActive ? 'bg-orange-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span className="text-slate-700 dark:text-slate-300 font-mono">Patient Cam: {cameraActive ? 'ACTIVE (AI Vision Sentinel)' : 'STANDBY'}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${micActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span className="text-slate-700 dark:text-slate-300 font-mono">Mic: {micActive ? 'ACTIVE (Hey Neuro Wake Word)' : 'STANDBY'}</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CameraOff className="h-3.5 w-3.5" />
                    <span className="font-mono">Admin Cam: DISABLED (Privacy Enforced)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <MicOff className="h-3.5 w-3.5" />
                    <span className="font-mono">Admin Mic: DISABLED (Privacy Enforced)</span>
                  </span>
                  <span className="text-slate-400 font-mono hidden md:inline">
                    Remote CCTV Network: READY
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">Attending Physician Phone:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{adminPhone}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {portal === 'patient' ? <PatientPortal /> : <AdminPortal />}
      </main>

      {/* Persistent Profile View fixed at right bottom */}
      <ProfileViewWidget />

      {/* Hey Neuro Voice Assistant Modal (Active for Patient) */}
      <VoiceAssistantModal />

      {/* Automated Emergency Alert & Admin Calling Modal */}
      <EmergencyAlertModal />

      {/* Real-Time SMS Alert Banner */}
      <RealtimeSmsToast />
    </div>
  );
};

export default function App() {
  return (
    <NeuroProvider>
      <MainApp />
    </NeuroProvider>
  );
}
