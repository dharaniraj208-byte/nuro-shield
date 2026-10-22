import React, { useState } from 'react';
import { useNeuro } from '../context/NeuroContext';
import {
  Flame,
  Clock,
  Heart,
  Search,
  Bell,
  Check,
  Home,
  Dumbbell,
  BarChart2,
  User,
  Camera,
  Play,
  ArrowRight,
  Activity,
  Mic,
  ShieldAlert,
  Sparkles,
  PhoneCall,
  ChevronRight
} from 'lucide-react';

interface WarmMobileDashboardProps {
  onNavigateTab: (tab: 'vitalsTelemetry' | 'rehabLibrary' | 'dailyRoutine' | 'docAnalyzer' | 'facial' | 'speech' | 'dashboard') => void;
  onOpenCamModal?: () => void;
}

export const WarmMobileDashboard: React.FC<WarmMobileDashboardProps> = ({ onNavigateTab, onOpenCamModal }) => {
  const {
    patientUser,
    facialSymmetry,
    todayExercisesCompleted,
    dailyExerciseGoal,
    exerciseStreak,
    adminPhone,
    callAdminPhoneRealtime,
    triggerVoiceAssistant,
    triggerEmergency,
    startMedia,
    cameraActive
  } = useNeuro();

  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'workout' | 'telemetry' | 'profile'>('home');
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Dynamic greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
  const displayName = patientUser?.name?.split(' ')[0] || 'Tega';
  const initial = displayName.charAt(0).toUpperCase() || 'T';

  // Metrics from dashboard.jpeg & real state
  const stepsCount = '8,432';
  const stepsGoal = '10,000';
  const goalPercentage = 84;
  const activeCalories = 486;
  const activeMinutes = 42;
  const heartRate = 72;

  // Daily routines matching the screenshot
  const [routines, setRoutines] = useState([
    {
      id: 'routine-1',
      title: 'Morning stretch',
      subtitle: 'Facial symmetry & neck mobility',
      time: '07:00 • 10 min',
      completed: true,
      category: 'stretch',
      bgImg: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'routine-2',
      title: 'Lunchtime walk',
      subtitle: 'Cadence & balance training',
      time: '12:30 • 20 min',
      completed: true,
      category: 'walk',
      bgImg: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'routine-3',
      title: 'Leg workout',
      subtitle: 'Lower extremity motor recovery',
      time: '18:00 • 45 min',
      completed: false,
      isUpNext: true,
      category: 'workout',
      bgImg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=160&auto=format&fit=crop&q=80',
    },
  ]);

  const toggleRoutine = (id: string) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-24">
      {/* Search Bar Popup if open */}
      {isSearchOpen && (
        <div className="rounded-2xl bg-white p-3 shadow-lg border border-[#ede7df] flex items-center gap-2 animate-in fade-in">
          <Search className="h-4 w-4 text-[#e06b52]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises, vitals, therapy..."
            className="flex-1 text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-bold text-slate-400 hover:text-slate-700 px-2"
          >
            Close
          </button>
        </div>
      )}

      {/* TOP HERO CARD - Exactly styled as in dashboard.jpeg */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#2b120a] via-[#1c0c08] to-[#120704] text-white p-6 sm:p-7 shadow-2xl border border-[#3d1a10]">
        {/* Subtle warm radial ambient glow */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#e06b52]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#cb563d]/10 blur-3xl" />

        {/* Top Status Bar: Clock + Signal / Battery Simulation (Mobile Look) */}
        <div className="flex items-center justify-between text-xs text-[#a87f74] font-medium pb-4">
          <span className="font-semibold text-white/90">9:41</span>
          <div className="flex items-center gap-1.5 opacity-80">
            <span className="text-[10px]">5G</span>
            <span className="text-[10px]">100%</span>
          </div>
        </div>

        {/* User Header Row: Avatar, Greeting, Search & Notification Bell */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Terracotta Circular Avatar */}
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#e06b52] text-white text-lg font-bold shadow-md shadow-[#e06b52]/30 ring-2 ring-[#e06b52]/30">
              {initial}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                {greeting}, {displayName}
              </h2>
            </div>
          </div>

          {/* Right Action Icons in Dark Circles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#381a12] text-[#d8a89d] hover:text-white hover:bg-[#4d251a] transition shadow-sm"
              title="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowNotificationPopup(!showNotificationPopup)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#381a12] text-[#d8a89d] hover:text-white hover:bg-[#4d251a] transition shadow-sm"
              title="Alerts & Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#e06b52] ring-2 ring-[#381a12]" />
            </button>
          </div>
        </div>

        {/* Steps / Recovery Goal Section */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#b88c81]">Steps today</span>
            <span className="rounded-full bg-[#381a12] px-3 py-1 text-xs font-semibold text-[#f2947f] border border-[#4d261d]">
              {goalPercentage}% of goal
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              {stepsCount}
            </span>
            <span className="text-base sm:text-lg font-medium text-[#a87f74]">
              / {stepsGoal}
            </span>
          </div>

          {/* Coral Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-[#381a12] overflow-hidden mt-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#e06b52] via-[#ea7e66] to-[#f7826a] transition-all duration-700"
              style={{ width: `${goalPercentage}%` }}
            />
          </div>
        </div>

        {/* 3 Rounded Metric White Cards (Inside Dark Hero Card) */}
        <div className="grid grid-cols-3 gap-3">
          {/* Card 1: Calories */}
          <div className="rounded-3xl bg-white p-3.5 sm:p-4 text-slate-900 shadow-md border border-[#f3eee9] flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
              <Flame className="h-4 w-4 text-[#e06b52]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {activeCalories}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">kcal</div>
            </div>
          </div>

          {/* Card 2: Active Time */}
          <div className="rounded-3xl bg-white p-3.5 sm:p-4 text-slate-900 shadow-md border border-[#f3eee9] flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
              <Clock className="h-4 w-4 text-[#38bdf8]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {activeMinutes}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">min</div>
            </div>
          </div>

          {/* Card 3: Heart Rate */}
          <div className="rounded-3xl bg-white p-3.5 sm:p-4 text-slate-900 shadow-md border border-[#f3eee9] flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
              <Heart className="h-4 w-4 text-[#f43f5e]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {heartRate}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">bpm</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast if toggled */}
      {showNotificationPopup && (
        <div className="rounded-3xl border border-[#ede7df] bg-white p-4 shadow-xl space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#e06b52]" />
              <span className="font-bold text-xs text-slate-900">NeuroShield Patient Reminders</span>
            </div>
            <button
              onClick={() => setShowNotificationPopup(false)}
              className="text-xs text-slate-400 hover:text-slate-700"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs text-slate-600">
            Next scheduled routine: <strong>Leg workout</strong> at 18:00. Attending admin: Dr. Priya Varma ({adminPhone}).
          </p>
        </div>
      )}

      {/* QUICK SENTINEL & LIVE CAMERA CARD */}
      <div className="rounded-3xl bg-white p-5 border border-[#ede7df] shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fef0ed] text-[#e06b52] border border-[#fbd4cb]">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">Patient Vision HUD</h4>
              <span className={`h-2 w-2 rounded-full ${cameraActive ? 'bg-[#e06b52] animate-pulse' : 'bg-amber-400'}`} />
            </div>
            <p className="text-xs text-slate-500">
              Face Symmetry: <strong className="text-slate-900">{facialSymmetry}%</strong> • EAR Eye Sentinel Active
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('facial')}
          className="rounded-2xl bg-[#e06b52] hover:bg-[#cb563d] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#e06b52]/25 transition flex items-center gap-1.5"
        >
          <span>Open HUD</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* DAILY ROUTINE SECTION - Exactly matching dashboard.jpeg */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Daily routine</h3>
          <button
            onClick={() => onNavigateTab('dailyRoutine')}
            className="text-xs font-semibold text-slate-400 hover:text-[#e06b52] transition"
          >
            See all
          </button>
        </div>

        {/* Timeline Routine Container */}
        <div className="rounded-[2rem] bg-white p-5 border border-[#ede7df] shadow-sm space-y-4">
          {routines.map((item, index) => {
            const isLast = index === routines.length - 1;
            return (
              <div key={item.id} className="relative flex items-start gap-3.5 group">
                {/* Checkmark or Hollow Circle */}
                <div className="relative flex flex-col items-center">
                  <button
                    onClick={() => toggleRoutine(item.id)}
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform active:scale-90 ${
                      item.completed
                        ? 'bg-[#18181b] text-white shadow-sm'
                        : 'border-2 border-slate-300 bg-white hover:border-[#e06b52]'
                    }`}
                  >
                    {item.completed && <Check className="h-4 w-4 stroke-[3]" />}
                  </button>

                  {/* Vertical connecting line between routine items */}
                  {!isLast && (
                    <div className="w-0.5 bg-slate-200 h-10 mt-1" />
                  )}
                </div>

                {/* Circular image / Avatar */}
                <div className="h-11 w-11 rounded-full overflow-hidden shrink-0 bg-slate-100 shadow-sm border border-slate-200">
                  <img
                    src={item.bgImg}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h5
                      className={`text-sm font-bold truncate ${
                        item.completed ? 'text-slate-800' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </h5>

                    {/* Up Next Coral Pill Tag */}
                    {item.isUpNext && !item.completed && (
                      <span className="shrink-0 rounded-full bg-[#fef0ed] px-2.5 py-0.5 text-[11px] font-bold text-[#e06b52] border border-[#fbd4cb]">
                        Up next
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK THERAPY SHORTCUTS */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={() => onNavigateTab('speech')}
          className="rounded-3xl bg-white p-4 border border-[#ede7df] shadow-sm hover:border-[#e06b52] transition text-left space-y-1.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fef0ed] text-[#e06b52]">
            <Mic className="h-4 w-4" />
          </div>
          <div className="text-xs font-bold text-slate-900">Speech &amp; Aphasia Center</div>
          <div className="text-[11px] text-slate-400">Multilingual pronunciation therapy</div>
        </button>

        <button
          onClick={() => onNavigateTab('vitalsTelemetry')}
          className="rounded-3xl bg-white p-4 border border-[#ede7df] shadow-sm hover:border-[#e06b52] transition text-left space-y-1.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fef0ed] text-[#e06b52]">
            <BarChart2 className="h-4 w-4" />
          </div>
          <div className="text-xs font-bold text-slate-900">24h Vitals Telemetry</div>
          <div className="text-[11px] text-slate-400">BP, Heart Rate &amp; SpO2 logs</div>
        </button>
      </div>

      {/* FLOATING BOTTOM NAVIGATION DOCK - Exactly matching dashboard.jpeg */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-sm w-[90%] rounded-full bg-white/95 backdrop-blur-xl border border-[#ede7df] shadow-2xl p-1.5 z-40 flex items-center justify-between">
        {/* Home Tab (Active Coral Pill) */}
        <button
          onClick={() => {
            setActiveBottomNav('home');
            onNavigateTab('dashboard');
          }}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all shadow-md ${
            activeBottomNav === 'home'
              ? 'bg-[#e06b52] text-white shadow-[#e06b52]/30'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </button>

        {/* Workouts / Rehab Tab */}
        <button
          onClick={() => {
            setActiveBottomNav('workout');
            onNavigateTab('rehabLibrary');
          }}
          className={`p-2.5 rounded-full transition ${
            activeBottomNav === 'workout'
              ? 'text-[#e06b52] bg-[#fef0ed]'
              : 'text-slate-400 hover:text-slate-700'
          }`}
          title="Rehab Workouts"
        >
          <Dumbbell className="h-5 w-5" />
        </button>

        {/* Telemetry / Analytics Tab */}
        <button
          onClick={() => {
            setActiveBottomNav('telemetry');
            onNavigateTab('vitalsTelemetry');
          }}
          className={`p-2.5 rounded-full transition ${
            activeBottomNav === 'telemetry'
              ? 'text-[#e06b52] bg-[#fef0ed]'
              : 'text-slate-400 hover:text-slate-700'
          }`}
          title="Vitals & Telemetry"
        >
          <BarChart2 className="h-5 w-5" />
        </button>

        {/* Profile / Care Plan Tab */}
        <button
          onClick={() => {
            setActiveBottomNav('profile');
            onNavigateTab('docAnalyzer');
          }}
          className={`p-2.5 rounded-full transition ${
            activeBottomNav === 'profile'
              ? 'text-[#e06b52] bg-[#fef0ed]'
              : 'text-slate-400 hover:text-slate-700'
          }`}
          title="Clinical Summary & Profile"
        >
          <User className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
