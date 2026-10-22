import React, { useState, useEffect } from 'react';
import { useNeuro } from '../context/NeuroContext';
import { HomePage } from './pages/HomePage';
import { ExercisePage } from './pages/ExercisePage';
import { CameraViewPage } from './pages/CameraViewPage';
import { VitalsPage } from './pages/VitalsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ProfilePage } from './pages/ProfilePage';
import { BottomNavigationBar } from './BottomNavigationBar';
import { AlertCountdownModal } from './AlertCountdownModal';
import { NotificationDrawer } from './NotificationDrawer';
import { PatientLoginGate } from './PatientLoginGate';
import {
  Camera,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const {
    isPatientLoggedIn,
    activeNavTab,
    setActiveNavTab,
    cameraActive,
    startMedia
  } = useNeuro();

  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);

  // Plain-Language First Launch Consent State
  const [consentRecord, setConsentRecord] = useState<{ agreed: boolean; timestamp: string } | null>(() => {
    try {
      const stored = localStorage.getItem('neurolife_patient_consent_v1');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [showConsentModal, setShowConsentModal] = useState<boolean>(!consentRecord);

  // If patient is not logged in, show the mobile phone OTP login gate
  if (!isPatientLoggedIn) {
    return <PatientLoginGate />;
  }

  // Handle granting consent
  const handleGrantConsent = async () => {
    const newRecord = {
      agreed: true,
      timestamp: new Date().toISOString()
    };
    try {
      localStorage.setItem('neurolife_patient_consent_v1', JSON.stringify(newRecord));
    } catch {}
    setConsentRecord(newRecord);
    setShowConsentModal(false);
    await startMedia();
  };

  return (
    <div className="min-h-[85vh] flex flex-col relative">
      {/* First-Launch Privacy & Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl border border-sky-300 dark:border-sky-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                <Camera className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Camera &amp; Vision Sentinel Consent
                </h3>
                <p className="text-xs text-slate-500">
                  On-device ML stroke symptom &amp; emergency detection
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-800 dark:text-white">
                How NeuroShield protects you:
              </p>
              <ul className="space-y-1.5 list-disc pl-4 text-[11px]">
                <li>Monitors 3 slow eye blinks as an automated help signal.</li>
                <li>Monitors sudden bed slides, falls, and patient absence.</li>
                <li>Provides a 10-second cancel window before notifying your doctor.</li>
                <li>All video frames are processed locally in your browser memory.</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={handleGrantConsent}
                className="w-full rounded-2xl bg-sky-600 hover:bg-sky-500 py-3 text-xs font-bold text-white shadow-lg shadow-sky-600/30 transition flex items-center justify-center gap-2"
              >
                <span>Accept &amp; Enable Monitoring</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Screen Rendering based on activeNavTab (6 Tabs) */}
      <div className="flex-1">
        {activeNavTab === 'home' && (
          <HomePage onOpenNotifications={() => setIsNotificationDrawerOpen(true)} />
        )}
        {activeNavTab === 'exercise' && <ExercisePage />}
        {activeNavTab === 'camera' && <CameraViewPage />}
        {activeNavTab === 'vitals' && <VitalsPage />}
        {activeNavTab === 'documents' && <DocumentsPage />}
        {activeNavTab === 'profile' && <ProfilePage />}
      </div>

      {/* Always-Visible 6-Tab Bottom Navigation Bar */}
      <BottomNavigationBar />

      {/* 10-Second Cancel Countdown Alert Modal */}
      <AlertCountdownModal />

      {/* Top Notification Bell Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />
    </div>
  );
};
