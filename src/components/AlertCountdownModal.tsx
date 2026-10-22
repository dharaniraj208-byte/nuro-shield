import React from 'react';
import { useNeuro } from '../context/NeuroContext';
import {
  AlertTriangle,
  CheckCircle,
  PhoneCall,
  ShieldAlert,
  Clock,
  Eye,
  Activity,
  UserX
} from 'lucide-react';

export const AlertCountdownModal: React.FC = () => {
  const {
    countdownAlert,
    cancelCountdownAlert,
    escalateCountdownAlertNow,
    patientUser,
    adminPhone
  } = useNeuro();

  if (!countdownAlert) return null;

  const seconds = countdownAlert.secondsRemaining;
  const progressPercent = ((10 - seconds) / 10) * 100;

  const getAlertIcon = () => {
    switch (countdownAlert.type) {
      case 'THREE_BLINKS':
        return <Eye className="h-10 w-10 text-rose-500 animate-pulse" />;
      case 'FALL_DETECTED':
        return <Activity className="h-10 w-10 text-rose-500 animate-bounce" />;
      case 'DISAPPEARED':
        return <UserX className="h-10 w-10 text-rose-500 animate-pulse" />;
      default:
        return <AlertTriangle className="h-10 w-10 text-rose-500 animate-bounce" />;
    }
  };

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/85 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-rose-500 bg-white dark:bg-slate-900 shadow-2xl shadow-rose-950/70 p-6 text-center space-y-5">
        {/* Pulsing Alert Ring Beacon */}
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/70 alert-pulse-ring">
          {getAlertIcon()}
          
          {/* Circular SVG countdown progress ring */}
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="44"
              className="stroke-rose-200 dark:stroke-rose-900/60 fill-none stroke-[4]"
            />
            <circle
              cx="48"
              cy="48"
              r="44"
              className="stroke-rose-500 fill-none stroke-[4] transition-all duration-1000 ease-linear"
              strokeDasharray={276}
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              strokeLinecap="round"
            />
          </svg>

          {/* Number Display */}
          <span className="absolute text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            {seconds}s
          </span>
        </div>

        {/* Title & Details */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 dark:bg-rose-900/60 px-3 py-1 text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>AI Automated Detection</span>
          </div>

          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {countdownAlert.title}
          </h2>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            {countdownAlert.details}
          </p>
        </div>

        {/* Escalation Warning Notice */}
        <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-3.5 border border-rose-200 dark:border-rose-900/60 text-left space-y-1 text-xs">
          <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-rose-500" />
            <span>Auto-Dispatch in {seconds} seconds:</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300">
            Unless cancelled, emergency voice call &amp; SMS will be placed to attending physician{' '}
            <strong className="text-slate-900 dark:text-white">{patientUser?.doctorName || 'Dr. Priya Varma'}</strong> ({patientUser?.doctorPhone || adminPhone}).
          </p>
        </div>

        {/* Primary Action: CANCEL ("I'm Okay") */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={cancelCountdownAlert}
            className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] py-4 px-6 text-sm font-black text-white shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-5 w-5" />
            <span>I'M OKAY — CANCEL ALERT</span>
          </button>

          {/* Immediate Escalation Button */}
          <button
            onClick={escalateCountdownAlertNow}
            className="w-full rounded-xl border border-rose-300 dark:border-rose-800 bg-transparent hover:bg-rose-50 dark:hover:bg-rose-950/30 py-2.5 px-4 text-xs font-bold text-rose-600 dark:text-rose-400 transition flex items-center justify-center gap-2"
          >
            <PhoneCall className="h-4 w-4" />
            <span>SEND HELP IMMEDIATELY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
