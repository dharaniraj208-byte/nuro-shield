import React, { useState, useEffect, useRef } from 'react';
import { useNeuro } from '../../context/NeuroContext';
import {
  Camera,
  CameraOff,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Eye,
  Activity,
  UserX,
  Play,
  Square,
  Clock,
  CheckCircle2,
  Lock,
  RefreshCw,
  Zap,
  Info,
  Sliders
} from 'lucide-react';

export const CameraViewPage: React.FC = () => {
  const {
    mediaStream,
    cameraActive,
    startMedia,
    stopMedia,
    cameraError,
    videoRef,
    earValue,
    blinkCount,
    eyeState,
    facialSymmetry,
    cameraEventLogs,
    simulateThreeSlowBlinksSOS,
    simulateFallDetection,
    simulatePersonDisappeared,
    startCountdownAlert,
    presenceTimeoutSeconds,
    setPresenceTimeoutSeconds,
    isPersonInFrame,
    setIsPersonInFrame,
    absenceSeconds,
    setAbsenceSeconds,
    countdownAlert
  } = useNeuro();

  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [slowBlinkCounter, setSlowBlinkCounter] = useState<number>(0);

  // Absence timer simulation when camera active
  useEffect(() => {
    if (!cameraActive) {
      setAbsenceSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      if (!isPersonInFrame) {
        setAbsenceSeconds((prev) => {
          const next = prev + 1;
          if (next >= presenceTimeoutSeconds && !countdownAlert) {
            simulatePersonDisappeared();
          }
          return next;
        });
      } else {
        setAbsenceSeconds(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cameraActive, isPersonInFrame, presenceTimeoutSeconds, countdownAlert, setAbsenceSeconds, simulatePersonDisappeared]);

  // Connect mediaStream to videoRef
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [videoRef, mediaStream]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-200">
      {/* 1. HEADER & CAMERA CONTROL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              AI Continuous Monitoring
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                cameraActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
              }`}
            >
              {cameraActive ? 'MONITORING ACTIVE' : 'CAMERA STANDBY'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Automated Vision Sentinel
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time on-device ML: 3 slow blinks help signal, sudden fall detection &amp; absence alerts.
          </p>
        </div>

        {/* Start / Stop Camera Toggle & Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 shadow-xs transition"
            title="Configure Thresholds"
          >
            <Sliders className="h-4 w-4" />
          </button>

          <button
            onClick={() => (cameraActive ? stopMedia() : startMedia())}
            className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition shadow-md ${
              cameraActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30'
            }`}
          >
            {cameraActive ? (
              <>
                <CameraOff className="h-4 w-4" />
                <span>Stop Camera</span>
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                <span>Start Monitoring</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* THRESHOLD CONFIGURATION DRAWER IF OPEN */}
      {showConfig && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-800 p-4 shadow-md space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Sentinel Sensitivity Settings
            </span>
            <span className="text-[11px] text-sky-600 dark:text-sky-400 font-mono">
              On-Device Model v2.4
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Absence Timeout: <strong className="text-sky-600">{presenceTimeoutSeconds}s</strong>
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={presenceTimeoutSeconds}
                onChange={(e) => setPresenceTimeoutSeconds(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
              <span className="text-[10px] text-slate-400">Trigger alert if person missing from bed</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Presence Simulation</div>
                <div className="text-[10px] text-slate-500">Toggle person presence in frame</div>
              </div>
              <button
                onClick={() => setIsPersonInFrame(!isPersonInFrame)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  isPersonInFrame ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {isPersonInFrame ? 'Present' : 'Absent'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. LIVE CAMERA VIEWPORT */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 aspect-video sm:aspect-16/9 border-2 border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-center">
        {/* Actual Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover transition-opacity ${
            cameraActive ? 'opacity-100 scale-x-[-1]' : 'opacity-0'
          }`}
        />

        {/* Standby / Permission placeholder if camera is off */}
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-900 text-slate-400">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800 text-sky-400 shadow-inner">
              <Camera className="h-8 w-8" />
            </div>
            <div className="max-w-sm">
              <h3 className="text-base font-bold text-white">Camera Standby</h3>
              <p className="text-xs text-slate-400 mt-1">
                Click <strong>"Start Monitoring"</strong> to engage automated 3-blink help signals, fall detection, and bed presence tracking.
              </p>
            </div>
            <button
              onClick={() => startMedia()}
              className="rounded-xl bg-sky-600 hover:bg-sky-500 text-white px-5 py-2 text-xs font-bold transition shadow"
            >
              Enable Camera
            </button>
          </div>
        )}

        {/* Live HUD Telemetry Overlays when camera is active */}
        {cameraActive && (
          <>
            {/* Top Status HUD Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-2xl bg-slate-900/85 backdrop-blur-md px-3 py-1.5 border border-slate-700 text-white text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold">Monitoring Active</span>
              <span className="text-slate-400 font-mono">| EAR: {earValue.toFixed(2)}</span>
            </div>

            {/* Top Right Presence HUD */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-2xl bg-slate-900/85 backdrop-blur-md px-3 py-1.5 border border-slate-700 text-xs">
              <span className="text-slate-400">Subject:</span>
              <span className={`font-bold ${isPersonInFrame ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                {isPersonInFrame ? 'In Bed (Safe)' : `Absent (${absenceSeconds}s / ${presenceTimeoutSeconds}s)`}
              </span>
            </div>

            {/* Bottom Left AI Detection Telemetry Card */}
            <div className="absolute bottom-4 left-4 z-10 rounded-2xl bg-slate-900/90 backdrop-blur-md p-3 border border-slate-700 text-white space-y-1.5 max-w-xs text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Eye Aspect Ratio (EAR):</span>
                <span className="font-mono font-bold text-sky-400">{earValue.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Slow Blinks Detected:</span>
                <span className="font-mono font-bold text-amber-400">{slowBlinkCounter} / 3 for Help</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Facial Symmetry:</span>
                <span className="font-mono font-bold text-emerald-400">{facialSymmetry}%</span>
              </div>
            </div>

            {/* Center Grid Reference Target Reticle */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
              <div className="h-44 w-44 rounded-full border-2 border-dashed border-sky-400" />
            </div>
          </>
        )}
      </div>

      {/* 3. INTERACTIVE SIMULATION TESTING CONTROLS */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Interactive AI Detection Triggers (Test 10s Countdown &amp; Auto-Call)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Clinician Testing Panel</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Simulation 1: 3 Slow Blinks */}
          <button
            onClick={simulateThreeSlowBlinksSOS}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs font-bold transition text-left active:scale-[0.98]"
          >
            <Eye className="h-4 w-4 text-sky-600 shrink-0" />
            <div>
              <div>3 Slow Blinks SOS</div>
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-normal">Triggers help signal alert</span>
            </div>
          </button>

          {/* Simulation 2: Sudden Fall */}
          <button
            onClick={simulateFallDetection}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs font-bold transition text-left active:scale-[0.98]"
          >
            <Activity className="h-4 w-4 text-rose-600 shrink-0" />
            <div>
              <div>Sudden Fall / Drop</div>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-normal">Triggers collapse alert</span>
            </div>
          </button>

          {/* Simulation 3: Disappeared / Absence */}
          <button
            onClick={simulatePersonDisappeared}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold transition text-left active:scale-[0.98]"
          >
            <UserX className="h-4 w-4 text-amber-600 shrink-0" />
            <div>
              <div>Person Disappeared (&gt;10s)</div>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">Triggers absence alert</span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. EVENT LOG LIST BELOW FEED */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Sentinel Event History Log
            </h3>
          </div>
          <span className="text-xs text-slate-400">{cameraEventLogs.length} events logged</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {cameraEventLogs.map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{log.type}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      log.status === 'CANCELLED'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        : log.status === 'ESCALATED'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">{log.details}</p>
              </div>

              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. PRIVACY & COMPLIANCE NOTE */}
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
        <Lock className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">On-Device Privacy &amp; HIPAA-Aligned Design:</strong>
          <p className="text-[11px] mt-0.5 leading-relaxed">
            All facial landmark mapping, blink detection, and posture coordinates are evaluated locally in your browser’s WebAssembly memory. Raw video is never stored or broadcast unless an emergency alert countdown expires, at which point an encrypted clinical telemetry packet is dispatched to your attending doctor.
          </p>
        </div>
      </div>
    </div>
  );
};
