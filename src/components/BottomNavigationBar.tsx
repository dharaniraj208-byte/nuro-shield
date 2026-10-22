import React from 'react';
import { useNeuro } from '../context/NeuroContext';
import {
  Home,
  Activity,
  Camera,
  HeartPulse,
  FileText,
  User,
  ShieldAlert
} from 'lucide-react';

export const BottomNavigationBar: React.FC = () => {
  const { activeNavTab, setActiveNavTab, countdownAlert, activeEmergency } = useNeuro();

  const tabs = [
    {
      id: 'home' as const,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'exercise' as const,
      label: 'Exercise',
      icon: Activity,
    },
    {
      id: 'camera' as const,
      label: 'Camera',
      icon: Camera,
      badge: countdownAlert || activeEmergency ? '!' : undefined,
    },
    {
      id: 'vitals' as const,
      label: 'Vitals',
      icon: HeartPulse,
    },
    {
      id: 'documents' as const,
      label: 'Documents',
      icon: FileText,
    },
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav
      aria-label="Patient Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] transition-colors"
    >
      <div className="max-w-xl mx-auto px-2 sm:px-4 h-16 sm:h-18 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeNavTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveNavTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 sm:px-3 rounded-2xl transition-all duration-200 select-none group ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {/* Active Indicator Glow Background */}
              {isActive && (
                <span className="absolute inset-0 bg-sky-50 dark:bg-sky-950/70 rounded-2xl -z-10 animate-in fade-in zoom-in-95 duration-150" />
              )}

              {/* Icon with alert badge if present */}
              <div className="relative">
                <Icon
                  className={`h-5 w-5 sm:h-5.5 sm:w-5.5 transition-transform group-hover:scale-105 ${
                    isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] sm:text-xs mt-1 tracking-tight transition-all ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
