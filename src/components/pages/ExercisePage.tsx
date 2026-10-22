import React, { useState } from 'react';
import { useNeuro } from '../../context/NeuroContext';
import {
  CheckCircle2,
  Circle,
  Bell,
  BellOff,
  Flame,
  Award,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Pill,
  Droplets,
  Footprints,
  Activity,
  Mic,
  Calendar,
  Smile,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ExercisePage: React.FC = () => {
  const {
    dailyTasks,
    toggleDailyTask,
    toggleTaskReminder,
    exercisePlans,
    toggleExerciseCompleted,
    exerciseStreak,
    bestStreak,
    recordExerciseCompletion,
    startMedia
  } = useNeuro();

  const [activePlanModal, setActivePlanModal] = useState<any | null>(null);
  const [activeRepCount, setActiveRepCount] = useState<number>(0);

  const completedCount = dailyTasks.filter((t) => t.completed).length;
  const totalCount = dailyTasks.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const getTaskIcon = (category: string) => {
    switch (category) {
      case 'MEDICINE':
        return <Pill className="h-4 w-4 text-sky-500" />;
      case 'WATER':
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'WALK':
        return <Footprints className="h-4 w-4 text-amber-500" />;
      case 'PHYSIO':
        return <Activity className="h-4 w-4 text-teal-500" />;
      case 'SPEECH':
        return <Volume2 className="h-4 w-4 text-rose-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    }
  };

  const handleCompleteActivePlan = (plan: any) => {
    toggleExerciseCompleted(plan.id);
    recordExerciseCompletion(plan.name, 'Upper Limb');
    setActivePlanModal(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-200">
      {/* 1. HEADER & DAILY PROGRESS RING + STREAK */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Neuromuscular Rehabilitation
            </span>
            <span className="rounded-full bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              🔥 {exerciseStreak}-Day Streak
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Daily Therapy &amp; Task Routine
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            Consistent motor repetition promotes bilateral neuroplastic reorganization after stroke hemiparesis.
          </p>
        </div>

        {/* Progress Circular Ring Card */}
        <div className="flex items-center gap-5 shrink-0 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <svg className="h-full w-full -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="34"
                className="stroke-slate-200 dark:stroke-slate-700 fill-none stroke-[6]"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                className="stroke-teal-500 fill-none stroke-[6] transition-all duration-700"
                strokeDasharray={213}
                strokeDashoffset={213 - (213 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                {progressPercent}%
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {completedCount} of {totalCount} Completed
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Best record: <strong>{bestStreak} days</strong>
            </div>
            <div className="text-[10px] text-teal-600 dark:text-teal-400 font-bold mt-1">
              {progressPercent === 100 ? '🎉 All Tasks Done!' : 'Keep going today!'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. DAILY TASKS CHECKLIST (Animated Ticks & Reminders) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Daily Health Checklist
            </h3>
          </div>
          <span className="text-xs text-slate-400">Tap item to check off</span>
        </div>

        <div className="space-y-2.5">
          {dailyTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                task.completed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div
                onClick={() => toggleDailyTask(task.id)}
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 select-none"
              >
                {/* Animated Tick Button */}
                <button
                  type="button"
                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-transform active:scale-75 ${
                    task.completed
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                  }`}
                >
                  {task.completed && <CheckCircle2 className="h-4 w-4 stroke-[3]" />}
                </button>

                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {getTaskIcon(task.category)}
                </div>

                <div className="min-w-0">
                  <h4
                    className={`text-xs font-bold truncate transition-all ${
                      task.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{task.time}</p>
                </div>
              </div>

              {/* Reminder Bell Toggle */}
              <button
                onClick={() => toggleTaskReminder(task.id)}
                className={`p-2 rounded-xl transition ${
                  task.reminderEnabled
                    ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50'
                    : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'
                }`}
                title={task.reminderEnabled ? 'Reminder Armed' : 'Mute Reminder'}
              >
                {task.reminderEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. EXERCISE PLAN CARDS (Name, Duration, Reps, Demo Image, Start/Complete) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-teal-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Targeted Rehabilitation Plans
            </h3>
          </div>
          <span className="text-xs text-slate-400">4 Modules Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exercisePlans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Demo Image & Duration Pill */}
              <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={plan.demoImage}
                  alt={plan.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white">
                  {plan.category}
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-teal-600/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-bold text-white">
                  {plan.duration} • {plan.reps}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Target: <strong className="text-slate-700 dark:text-slate-300">{plan.targetArea}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setActivePlanModal(plan);
                      setActiveRepCount(0);
                      startMedia();
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow transition flex items-center justify-center gap-1.5"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Start Exercise</span>
                  </button>

                  <button
                    onClick={() => toggleExerciseCompleted(plan.id)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                      plan.completedToday
                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{plan.completedToday ? 'Done' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ACTIVE EXERCISE MODAL PLAYER */}
      {activePlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400">Active Session</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{activePlanModal.name}</h3>
              </div>
              <button
                onClick={() => setActivePlanModal(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-1"
              >
                Close
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 h-48 w-full">
              <img
                src={activePlanModal.demoImage}
                alt={activePlanModal.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="font-bold text-slate-900 dark:text-white">Guidance Steps:</div>
              <ul className="list-disc pl-5 space-y-1">
                {activePlanModal.instructions.map((ins: string, i: number) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs">
                Reps: <strong className="text-base text-sky-600 dark:text-sky-400 font-mono">{activeRepCount}</strong> / 12
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveRepCount((prev) => prev + 1)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200"
                >
                  +1 Rep
                </button>
                <button
                  onClick={() => handleCompleteActivePlan(activePlanModal)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow"
                >
                  Finish &amp; Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
