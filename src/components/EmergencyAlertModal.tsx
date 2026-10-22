import React, { useState, useEffect } from 'react';
import { useNeuro } from '../context/NeuroContext';
import {
  AlertTriangle,
  PhoneCall,
  MessageSquare,
  CheckCircle,
  Activity,
  Mic,
  Volume2,
  Minimize2,
  Maximize2,
  X,
  PhoneForwarded,
  ShieldAlert
} from 'lucide-react';

export const EmergencyAlertModal: React.FC = () => {
  const {
    portal,
    activeEmergency,
    adminPhone,
    acknowledgeEmergency,
    facialSymmetry,
    patientUser,
    t
  } = useNeuro();

  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const callStatus = activeEmergency?.callStatus || 'INITIATING';

  useEffect(() => {
    if (!activeEmergency) {
      setCallDuration(0);
      setIsMinimized(false);
      return;
    }

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [activeEmergency]);

  if (!activeEmergency) return null;
  if (portal === 'admin') return null;

  const formatSecs = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getCallStatusBadge = () => {
    switch (callStatus) {
      case 'INITIATING':
        return { label: 'INITIATING CALL...', color: 'bg-amber-950 text-amber-400 border-amber-800' };
      case 'RINGING':
        return { label: 'RINGING ADMIN MOBILE...', color: 'bg-sky-950 text-sky-400 border-sky-800 animate-pulse' };
      case 'ANSWERED':
      case 'CONNECTED':
        return { label: 'CALL CONNECTED', color: 'bg-emerald-950 text-emerald-400 border-emerald-800' };
      case 'COMPLETED':
        return { label: 'DISPATCH DELIVERED', color: 'bg-slate-900 text-slate-300 border-slate-700' };
      case 'ESCALATED_TO_BACKUP':
        return { label: 'ESCALATED TO BACKUP', color: 'bg-purple-950 text-purple-400 border-purple-800' };
      case 'FAILED':
        return { label: 'FALLBACK SMS DELIVERED', color: 'bg-rose-950 text-rose-400 border-rose-800' };
      default:
        return { label: callStatus, color: 'bg-slate-900 text-slate-400 border-slate-800' };
    }
  };

  const statusBadge = getCallStatusBadge();
  const isPatient = portal === 'patient';

  // -------------------------------------------------------------
  // FLOATING MINIMIZED PILL VIEW (Non-intrusive)
  // -------------------------------------------------------------
  if (isMinimized) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md rounded-2xl border-2 border-rose-500 bg-[#1c0c08]/95 backdrop-blur-xl p-2.5 shadow-2xl shadow-rose-950/60 animate-in slide-in-from-top-4 duration-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500"></span>
            </span>
            <div className="truncate">
              <div className="text-xs font-black text-white flex items-center gap-1.5 truncate">
                <span className="text-rose-400">EMERGENCY:</span>
                <span className="truncate">{activeEmergency.type.replace(/_/g, ' ')}</span>
              </div>
              <div className="text-[10px] text-slate-300 truncate">
                Admin: <strong className="text-white">{activeEmergency.adminPhone || adminPhone}</strong> • {statusBadge.label}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsMinimized(false)}
              className="rounded-xl bg-slate-800 hover:bg-slate-700 p-1.5 text-slate-200 transition"
              title="Expand Emergency Dashboard"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => acknowledgeEmergency()}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white transition shadow"
              title="Dismiss Alert"
            >
              I'm OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // REDUCED COMPACT DASHBOARD (Specially tailored for Patient Mode)
  // -------------------------------------------------------------
  if (isPatient) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-3xl border-2 border-rose-500 bg-[#160a07] text-white shadow-2xl shadow-rose-950/70">
          {/* Compact Urgency Header with Quick Actions */}
          <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 px-4 py-2.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle className="h-5 w-5 text-white shrink-0 animate-bounce" />
              <div className="truncate">
                <h3 className="text-xs font-black tracking-wider uppercase truncate">
                  {t('emergencyDetected')}: {activeEmergency.type.replace(/_/g, ' ')}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsMinimized(true)}
                className="rounded-lg bg-black/25 hover:bg-black/40 p-1 text-rose-100 hover:text-white transition"
                title="Minimize alert to top bar"
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => acknowledgeEmergency()}
                className="rounded-lg bg-black/25 hover:bg-black/40 p-1 text-rose-100 hover:text-white transition"
                title="Close and Dismiss Alert"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Compact Dashboard Content (Zero vertical scroll needed) */}
          <div className="p-3.5 sm:p-4 space-y-3 text-xs">
            {/* Live Dispatch Status Bar */}
            <div className="flex items-center justify-between gap-2 rounded-xl bg-[#28130d] p-2 border border-[#441e15]">
              <div className="flex items-center gap-1.5">
                <PhoneCall className={`h-3.5 w-3.5 text-rose-400 ${callStatus === 'RINGING' || callStatus === 'INITIATING' ? 'animate-spin' : ''}`} />
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold border ${statusBadge.color}`}>
                  {statusBadge.label}
                </span>
              </div>
              <span className="rounded-full bg-emerald-950/90 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-800">
                ✓ {activeEmergency.smsStatus || 'SMS SENT'}
              </span>
            </div>

            {/* Calling Admin Card */}
            <div className="rounded-2xl border border-[#3d1a10] bg-[#1f0e09] p-3 text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white shadow-md shadow-rose-600/30">
                  <PhoneCall className="h-4 w-4 animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">
                    Calling: {adminPhone}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Dr. Priya Varma (Attending Neurologist)
                  </div>
                </div>
              </div>

              {/* Mini Audio Waveform Simulation */}
              <div className="flex items-center justify-center gap-1 h-4">
                {[8, 16, 12, 20, 14, 22, 10, 18, 12, 16].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-emerald-400 animate-pulse"
                    style={{ height: `${h}px`, animationDelay: `${i * 80}ms` }}
                  />
                ))}
                {callDuration > 0 && (
                  <span className="ml-2 text-[10px] font-mono text-emerald-400 font-bold">
                    {formatSecs(callDuration)}
                  </span>
                )}
              </div>
            </div>

            {/* Single-Row Compact Vitals & Location */}
            <div className="flex items-center justify-between rounded-xl bg-[#22100a] px-3 py-2 border border-[#381a12] text-[11px] text-slate-300">
              <div>
                Face: <strong className="text-rose-400 font-mono">{facialSymmetry}%</strong>
              </div>
              <div className="h-3 w-px bg-slate-700" />
              <div>
                HR: <strong className="text-emerald-400 font-mono">94 BPM</strong>
              </div>
              <div className="h-3 w-px bg-slate-700" />
              <div className="truncate max-w-[110px]">
                {activeEmergency.location?.label || 'Bay 104'}
              </div>
            </div>

            {/* Direct Phone Dial Button */}
            <a
              href={`tel:${adminPhone.replace(/[\s()-]/g, '')}`}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-2.5 px-3 text-xs font-black text-white shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 border border-emerald-400/40 text-center"
            >
              <PhoneCall className="h-4 w-4 animate-bounce" />
              <span>Call Doctor Directly ({adminPhone})</span>
            </a>

            {/* Action Buttons: Mute Audio & Fast Acknowledge */}
            <div className="flex items-center gap-2 pt-0.5">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`flex-1 rounded-xl py-2 px-3 text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                  isMuted
                    ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                    : 'border-slate-800 bg-[#28130d] text-slate-300 hover:bg-[#381a12]'
                }`}
              >
                {isMuted ? <Mic className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                <span>{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>

              <button
                onClick={() => acknowledgeEmergency()}
                className="flex-[2] rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 px-3 text-xs font-bold text-white shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>I'm Safe / Dismiss</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STANDARD VIEW (When in Admin Mode or Full Detailed Inspection)
  // -------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in zoom-in-95 duration-150">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-rose-500 bg-slate-950 text-white shadow-2xl shadow-rose-950/70">
        {/* Pulsing emergency strobe */}
        <div className="bg-rose-600 px-5 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-6 w-6 text-white animate-bounce" />
            <div>
              <h2 className="text-sm font-black tracking-wider uppercase">
                {t('emergencyDetected')}
              </h2>
              <p className="text-[11px] font-semibold text-rose-100 truncate">
                {activeEmergency.type.replace(/_/g, ' ')}: {activeEmergency.details}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-rose-700">
            {activeEmergency.severity}
          </span>
        </div>

        {/* Live Admin Mobile Dispatch Box */}
        <div className="p-4 space-y-3 text-xs">
          {/* Patient Details & Location Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 space-y-1 text-slate-300">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>{activeEmergency.patientName || patientUser?.name || 'Ramesh Sundaram'}</span>
                <span className="rounded bg-sky-950 px-1.5 py-0.5 text-[10px] font-mono text-sky-400 border border-sky-800">
                  {activeEmergency.verifiedPhone ? '✓ Verified' : 'Patient'}
                </span>
              </span>
              <span className="font-mono text-slate-400">{activeEmergency.patientPhone || patientUser?.phone || '+91 98401 54321'}</span>
            </div>
            {activeEmergency.location && (
              <div className="text-[11px] text-slate-400">
                <span className="text-rose-400 font-semibold">Location:</span> {activeEmergency.location.label}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-rose-800/80 bg-rose-950/40 p-3 flex items-start gap-2.5">
            <MessageSquare className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300">
                  {t('emergencySmsSent')}
                </span>
                <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-800">
                  {activeEmergency.smsStatus || 'SMS DELIVERED'}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-300">
                Admin Mobile: <span className="font-mono font-bold text-white">{activeEmergency.adminPhone || adminPhone}</span>
              </p>
            </div>
          </div>

          {/* Active Call Status */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 text-white shadow-md">
                <PhoneCall className={`h-5 w-5 ${callStatus === 'RINGING' || callStatus === 'INITIATING' ? 'animate-bounce' : 'animate-pulse'}`} />
              </div>
              <div className="text-left">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold border ${statusBadge.color}`}>
                  {statusBadge.label}
                </span>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Target: <strong className="text-slate-200">{activeEmergency.adminPhone || adminPhone}</strong>
                </div>
              </div>
            </div>

            {callDuration > 0 && (
              <p className="text-xs font-mono font-bold text-emerald-400">
                Call Duration: {formatSecs(callDuration)}
              </p>
            )}
          </div>

          {/* Patient Vitals at Incident */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2">
              <span className="text-[9px] text-slate-400 uppercase font-semibold">Face Symmetry</span>
              <p className="text-sm font-black text-rose-400 font-mono">{facialSymmetry}%</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2">
              <span className="text-[9px] text-slate-400 uppercase font-semibold">Heart Rate</span>
              <p className="text-sm font-black text-emerald-400 font-mono">94 BPM</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2">
              <span className="text-[9px] text-slate-400 uppercase font-semibold">Risk Level</span>
              <p className="text-sm font-black text-amber-400 font-mono">CRITICAL</p>
            </div>
          </div>

          {/* Actions: Acknowledge & Direct Call */}
          <div className="flex gap-2 pt-1">
            <a
              href={`tel:${adminPhone.replace(/[\s()-]/g, '')}`}
              className="flex-1 rounded-xl bg-emerald-700 hover:bg-emerald-600 py-2.5 px-3 text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Call ({adminPhone})</span>
            </a>

            <button
              onClick={() => acknowledgeEmergency()}
              className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 px-3 text-xs font-bold text-slate-200 transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>{t('acknowledge')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
