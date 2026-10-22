import React, { useState } from 'react';
import { useNeuro } from '../../context/NeuroContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Heart,
  Activity,
  Wind,
  Thermometer,
  Gauge,
  PhoneCall,
  Camera,
  UploadCloud,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface HomePageProps {
  onOpenNotifications: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenNotifications }) => {
  const {
    patientUser,
    themeMode,
    toggleThemeMode,
    unreadNotificationCount,
    currentVitals,
    dailyTasks,
    exercisePlans,
    activeEmergency,
    setActiveNavTab,
    callAdminPhoneRealtime,
    adminPhone,
    exerciseStreak
  } = useNeuro();

  const [searchQuery, setSearchQuery] = useState('');
  const completedTaskCount = dailyTasks.filter((t) => t.completed).length;
  const totalTasks = dailyTasks.length;
  const taskPercent = Math.round((completedTaskCount / totalTasks) * 100);

  // Next exercise finder
  const nextExercise = exercisePlans.find((e) => !e.completedToday) || exercisePlans[0];

  // Mini sparkline data simulation
  const sparklinePoints = '0,18 8,14 16,16 24,10 32,14 40,8 48,12 56,6 64,10 72,4 80,8';

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Patient Care Sentinel
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Hello, {patientUser?.name || 'Ramesh Sundaram'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Room: <strong className="text-slate-700 dark:text-slate-300">{patientUser?.room || 'Rehab Bay 104'}</strong> • ID: {patientUser?.id || 'PT-8831'}
          </p>
        </div>

        {/* Top Controls: Search, Theme Toggle, Notification Bell */}
        <div className="flex items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search health, vitals, plan..."
              className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
            />
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleThemeMode}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 shadow-xs transition"
            title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {themeMode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 shadow-xs transition"
            title="Notifications & Alerts"
          >
            <Bell className="h-4 w-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. QUICK ACTION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Quick Action 1: Emergency Call */}
        <button
          onClick={callAdminPhoneRealtime}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-md shadow-rose-500/25 transition-all text-left active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 shrink-0">
            <PhoneCall className="h-5 w-5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold leading-tight">Emergency Call</div>
            <div className="text-[11px] text-rose-100 truncate">Dr. Priya Varma ({adminPhone})</div>
          </div>
        </button>

        {/* Quick Action 2: Start Camera */}
        <button
          onClick={() => setActiveNavTab('camera')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-md shadow-sky-500/25 transition-all text-left active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 shrink-0">
            <Camera className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold leading-tight">Start Camera AI</div>
            <div className="text-[11px] text-sky-100 truncate">Blink, Fall &amp; Presence Sentinel</div>
          </div>
        </button>

        {/* Quick Action 3: Upload Report */}
        <button
          onClick={() => setActiveNavTab('documents')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-md shadow-teal-500/25 transition-all text-left active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 shrink-0">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold leading-tight">Upload Report</div>
            <div className="text-[11px] text-teal-100 truncate">OCR &amp; AI Document Analysis</div>
          </div>
        </button>
      </div>

      {/* 3. VITALS DASHBOARD SUMMARY (5 Cards with live values, status colors, sparklines) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Live Vitals Dashboard
            </h2>
            <span className="rounded-full bg-sky-100 dark:bg-sky-950 px-2 py-0.5 text-[10px] font-bold text-sky-600 dark:text-sky-400">
              5 Parameters
            </span>
          </div>

          <button
            onClick={() => setActiveNavTab('vitals')}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>View Full Trends</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Card 1: Heart Rate */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Heart Rate</span>
              <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-500">
                <Heart className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {currentVitals.heartRate}
                </span>
                <span className="text-xs text-slate-500">bpm</span>
              </div>
              <span className="inline-block mt-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Normal (60-100)
              </span>
            </div>

            {/* Mini Sparkline */}
            <div className="pt-1">
              <svg className="w-full h-5 stroke-rose-500 fill-none stroke-[2]" viewBox="0 0 80 20">
                <polyline points={sparklinePoints} />
              </svg>
            </div>
          </div>

          {/* Card 2: SpO2 */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Blood Oxygen</span>
              <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-500">
                <Activity className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {currentVitals.spO2}
                </span>
                <span className="text-xs text-slate-500">%</span>
              </div>
              <span className="inline-block mt-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Optimal (&gt;95%)
              </span>
            </div>

            <div className="pt-1">
              <svg className="w-full h-5 stroke-sky-500 fill-none stroke-[2]" viewBox="0 0 80 20">
                <polyline points="0,10 12,12 24,8 36,9 48,6 60,8 72,5 80,6" />
              </svg>
            </div>
          </div>

          {/* Card 3: Blood Pressure */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Blood Pressure</span>
              <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-500">
                <Gauge className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {currentVitals.systolicBP}/{currentVitals.diastolicBP}
                </span>
                <span className="text-xs text-slate-500">mmHg</span>
              </div>
              <span className="inline-block mt-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Normotensive
              </span>
            </div>

            <div className="pt-1">
              <svg className="w-full h-5 stroke-teal-500 fill-none stroke-[2]" viewBox="0 0 80 20">
                <polyline points="0,14 15,10 30,12 45,9 60,11 75,7 80,8" />
              </svg>
            </div>
          </div>

          {/* Card 4: Temperature */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Temperature</span>
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-500">
                <Thermometer className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {currentVitals.temperature}
                </span>
                <span className="text-xs text-slate-500">°F</span>
              </div>
              <span className="inline-block mt-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Normal Afebrile
              </span>
            </div>

            <div className="pt-1">
              <svg className="w-full h-5 stroke-amber-500 fill-none stroke-[2]" viewBox="0 0 80 20">
                <polyline points="0,12 20,11 40,13 60,10 80,11" />
              </svg>
            </div>
          </div>

          {/* Card 5: Respiration Rate */}
          <div className="col-span-2 lg:col-span-1 rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Respiration</span>
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500">
                <Wind className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {currentVitals.respirationRate}
                </span>
                <span className="text-xs text-slate-500">br/min</span>
              </div>
              <span className="inline-block mt-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Optimal Eupnea
              </span>
            </div>

            <div className="pt-1">
              <svg className="w-full h-5 stroke-indigo-500 fill-none stroke-[2]" viewBox="0 0 80 20">
                <polyline points="0,16 16,12 32,15 48,11 64,13 80,10" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TODAY'S OVERVIEW (Tasks, Next Exercise, Last Alert) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Box A: Tasks Completed */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Daily Tasks</span>
            <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
              {completedTaskCount} of {totalTasks} ({taskPercent}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-teal-500 transition-all duration-500"
              style={{ width: `${taskPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Streak: <strong className="text-amber-500">{exerciseStreak} Days Active</strong></span>
            <button
              onClick={() => setActiveNavTab('exercise')}
              className="text-sky-600 dark:text-sky-400 font-bold hover:underline"
            >
              Open Checklist
            </button>
          </div>
        </div>

        {/* Box B: Next Scheduled Exercise */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Next Exercise</span>
            <span className="rounded-full bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 text-[10px] font-bold text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
              {nextExercise?.duration || '10 min'}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {nextExercise?.name || 'Bilateral Upper Limb Lift'}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {nextExercise?.targetArea || 'Motor recovery & shoulder flexion'}
            </p>
          </div>

          <button
            onClick={() => setActiveNavTab('exercise')}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/50 text-xs font-bold text-sky-600 dark:text-sky-400 transition flex items-center justify-center gap-1.5"
          >
            <span>Start Practice</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Box C: Last Alert Status */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Sentinel Status</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Armed
            </span>
          </div>

          {activeEmergency ? (
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 p-2 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-bold">
              Active: {activeEmergency.type} ({activeEmergency.details})
            </div>
          ) : (
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                All Telemetry Nominal
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Ear distress blink, fall detection &amp; absence sensors armed.
              </p>
            </div>
          )}

          <div className="text-[11px] text-slate-400">
            Attending: <strong className="text-slate-700 dark:text-slate-300">Dr. Priya Varma</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
