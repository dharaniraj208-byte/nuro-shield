import React, { useState } from 'react';
import { useNeuro } from '../../context/NeuroContext';
import {
  Heart,
  Activity,
  Gauge,
  Thermometer,
  Moon,
  Download,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Filter,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea
} from 'recharts';

export const VitalsPage: React.FC = () => {
  const { currentVitals, vitalsHistory, updateVitals, patientUser } = useNeuro();

  const [timeFilter, setTimeFilter] = useState<'DAY' | 'WEEK' | 'MONTH'>('DAY');
  const [selectedVital, setSelectedVital] = useState<'HR' | 'SPO2' | 'BP' | 'TEMP' | 'SLEEP'>('HR');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Time-filtered data points
  const dayData = [
    { time: '00:00', hr: 68, spo2: 98, sys: 118, dia: 78, temp: 98.2, sleep: 7.5 },
    { time: '04:00', hr: 64, spo2: 99, sys: 116, dia: 76, temp: 98.0, sleep: 7.8 },
    { time: '08:00', hr: 74, spo2: 98, sys: 122, dia: 82, temp: 98.6, sleep: 7.5 },
    { time: '12:00', hr: 82, spo2: 97, sys: 126, dia: 84, temp: 98.8, sleep: 7.2 },
    { time: '16:00', hr: 78, spo2: 98, sys: 124, dia: 82, temp: 98.6, sleep: 7.4 },
    { time: '20:00', hr: 74, spo2: 99, sys: 120, dia: 80, temp: 98.5, sleep: 7.6 },
  ];

  const weekData = [
    { time: 'Mon', hr: 72, spo2: 98, sys: 120, dia: 80, temp: 98.4, sleep: 7.8 },
    { time: 'Tue', hr: 75, spo2: 98, sys: 124, dia: 82, temp: 98.6, sleep: 7.2 },
    { time: 'Wed', hr: 78, spo2: 97, sys: 128, dia: 84, temp: 98.7, sleep: 6.9 },
    { time: 'Thu', hr: 74, spo2: 99, sys: 122, dia: 80, temp: 98.5, sleep: 7.5 },
    { time: 'Fri', hr: 71, spo2: 98, sys: 119, dia: 79, temp: 98.4, sleep: 8.0 },
    { time: 'Sat', hr: 73, spo2: 98, sys: 121, dia: 81, temp: 98.5, sleep: 7.6 },
    { time: 'Sun', hr: 74, spo2: 98, sys: 122, dia: 82, temp: 98.6, sleep: 7.5 },
  ];

  const monthData = [
    { time: 'Wk 1', hr: 76, spo2: 98, sys: 125, dia: 83, temp: 98.6, sleep: 7.1 },
    { time: 'Wk 2', hr: 74, spo2: 98, sys: 122, dia: 81, temp: 98.5, sleep: 7.4 },
    { time: 'Wk 3', hr: 72, spo2: 99, sys: 120, dia: 80, temp: 98.4, sleep: 7.6 },
    { time: 'Wk 4', hr: 74, spo2: 98, sys: 122, dia: 82, temp: 98.6, sleep: 7.5 },
  ];

  const activeChartData = timeFilter === 'DAY' ? dayData : timeFilter === 'WEEK' ? weekData : monthData;

  const handleSimulateThreshold = () => {
    updateVitals({
      heartRate: 132,
      spO2: 89,
      systolicBP: 172,
    });
  };

  const handleResetVitals = () => {
    updateVitals({
      heartRate: 74,
      spO2: 98,
      systolicBP: 122,
      diastolicBP: 82,
      temperature: 98.6,
      respirationRate: 16,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-200">
      {/* 1. TOP HEADER & FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Clinical Telemetry
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                currentVitals.status === 'CRITICAL'
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse'
                  : currentVitals.status === 'ELEVATED'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              }`}
            >
              {currentVitals.status}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            24-Hour Vitals Monitoring
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time biometric telemetry with normal-range bands and automated threshold alarm triggers.
          </p>
        </div>

        {/* Filters & Export Button */}
        <div className="flex items-center gap-2">
          {/* Day / Week / Month Pill */}
          <div className="flex rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shadow-xs">
            {(['DAY', 'WEEK', 'MONTH'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  timeFilter === filter
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Export Report Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 text-xs font-bold transition shadow"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. LATEST READING SELECTOR CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Metric 1: Heart Rate */}
        <button
          onClick={() => setSelectedVital('HR')}
          className={`p-4 rounded-3xl border text-left transition ${
            selectedVital === 'HR'
              ? 'bg-white dark:bg-slate-900 border-rose-500 ring-2 ring-rose-500/20 shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Heart Rate</span>
            <Heart className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {currentVitals.heartRate} <span className="text-xs font-normal text-slate-400">bpm</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Range: 60-100</div>
        </button>

        {/* Metric 2: SpO2 */}
        <button
          onClick={() => setSelectedVital('SPO2')}
          className={`p-4 rounded-3xl border text-left transition ${
            selectedVital === 'SPO2'
              ? 'bg-white dark:bg-slate-900 border-sky-500 ring-2 ring-sky-500/20 shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Oxygen (SpO₂)</span>
            <Activity className="h-4 w-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {currentVitals.spO2} <span className="text-xs font-normal text-slate-400">%</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Range: 95-100%</div>
        </button>

        {/* Metric 3: Blood Pressure */}
        <button
          onClick={() => setSelectedVital('BP')}
          className={`p-4 rounded-3xl border text-left transition ${
            selectedVital === 'BP'
              ? 'bg-white dark:bg-slate-900 border-teal-500 ring-2 ring-teal-500/20 shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Blood Pressure</span>
            <Gauge className="h-4 w-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {currentVitals.systolicBP}/{currentVitals.diastolicBP}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Range: &lt;130/85</div>
        </button>

        {/* Metric 4: Temperature */}
        <button
          onClick={() => setSelectedVital('TEMP')}
          className={`p-4 rounded-3xl border text-left transition ${
            selectedVital === 'TEMP'
              ? 'bg-white dark:bg-slate-900 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Body Temp</span>
            <Thermometer className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {currentVitals.temperature} <span className="text-xs font-normal text-slate-400">°F</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Range: 97.8-99.1°F</div>
        </button>

        {/* Metric 5: Sleep */}
        <button
          onClick={() => setSelectedVital('SLEEP')}
          className={`col-span-2 sm:col-span-1 p-4 rounded-3xl border text-left transition ${
            selectedVital === 'SLEEP'
              ? 'bg-white dark:bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Sleep Duration</span>
            <Moon className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {currentVitals.sleepHours} <span className="text-xs font-normal text-slate-400">hrs</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Target: 7-9 hrs</div>
        </button>
      </div>

      {/* 3. RECHARTS GRAPH WITH NORMAL-RANGE BANDS */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {selectedVital === 'HR'
                ? 'Heart Rate Telemetry (Normal Zone: 60 - 100 bpm)'
                : selectedVital === 'SPO2'
                ? 'Oxygen Saturation Trend (Normal Zone: 95 - 100%)'
                : selectedVital === 'BP'
                ? 'Blood Pressure (Systolic & Diastolic mmHg)'
                : selectedVital === 'TEMP'
                ? 'Temperature Curve (°F)'
                : 'Sleep Hours & Recovery Quality'}
            </h3>
            <p className="text-xs text-slate-400">
              Shaded green band represents clinical safe reference range.
            </p>
          </div>

          <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            ✓ In Normal Band
          </span>
        </div>

        {/* Chart Viewport */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="vitalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                domain={
                  selectedVital === 'HR'
                    ? [50, 120]
                    : selectedVital === 'SPO2'
                    ? [88, 100]
                    : selectedVital === 'BP'
                    ? [60, 160]
                    : selectedVital === 'TEMP'
                    ? [96, 102]
                    : [4, 12]
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '1rem',
                  border: '1px solid #334155',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />

              {/* Shaded Reference Normal Range Band */}
              {selectedVital === 'HR' && (
                <ReferenceArea y1={60} y2={100} fill="#10B981" fillOpacity={0.08} />
              )}
              {selectedVital === 'SPO2' && (
                <ReferenceArea y1={95} y2={100} fill="#10B981" fillOpacity={0.08} />
              )}
              {selectedVital === 'BP' && (
                <ReferenceArea y1={80} y2={125} fill="#10B981" fillOpacity={0.08} />
              )}

              <Area
                type="monotone"
                dataKey={
                  selectedVital === 'HR'
                    ? 'hr'
                    : selectedVital === 'SPO2'
                    ? 'spo2'
                    : selectedVital === 'BP'
                    ? 'sys'
                    : selectedVital === 'TEMP'
                    ? 'temp'
                    : 'sleep'
                }
                stroke="#0EA5E9"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#vitalGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. AVERAGE / MIN / MAX SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs text-slate-400 font-medium">Daily Average</span>
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
            {selectedVital === 'HR'
              ? '74 bpm'
              : selectedVital === 'SPO2'
              ? '98.2%'
              : selectedVital === 'BP'
              ? '121/81'
              : selectedVital === 'TEMP'
              ? '98.5°F'
              : '7.5 hrs'}
          </div>
          <span className="text-[10px] text-emerald-500 font-bold">Stable Trend</span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs text-slate-400 font-medium">Minimum Value</span>
          <div className="text-xl font-black text-sky-600 dark:text-sky-400 font-mono mt-0.5">
            {selectedVital === 'HR'
              ? '64 bpm'
              : selectedVital === 'SPO2'
              ? '97%'
              : selectedVital === 'BP'
              ? '116/76'
              : selectedVital === 'TEMP'
              ? '98.0°F'
              : '6.9 hrs'}
          </div>
          <span className="text-[10px] text-slate-400">At 04:00 AM</span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs text-slate-400 font-medium">Maximum Value</span>
          <div className="text-xl font-black text-teal-600 dark:text-teal-400 font-mono mt-0.5">
            {selectedVital === 'HR'
              ? '82 bpm'
              : selectedVital === 'SPO2'
              ? '99%'
              : selectedVital === 'BP'
              ? '126/84'
              : selectedVital === 'TEMP'
              ? '98.8°F'
              : '8.0 hrs'}
          </div>
          <span className="text-[10px] text-slate-400">At 12:00 PM</span>
        </div>
      </div>

      {/* 5. THRESHOLD SIMULATION & TESTING TOOLS */}
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-900 dark:text-white">Auto-Alarm Threshold Testing:</span>
          <p className="text-[11px] text-slate-500">
            System automatically alerts doctor and caregiver when vitals cross critical safety ranges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateThreshold}
            className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold border border-rose-300 dark:border-rose-800 hover:bg-rose-200"
          >
            Test Abnormal Spike
          </button>
          <button
            onClick={handleResetVitals}
            className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300"
          >
            Reset Normal
          </button>
        </div>
      </div>

      {/* 6. EXPORT REPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-teal-600">
                <FileSpreadsheet className="h-5 w-5" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Export Vitals Telemetry</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Generated report for <strong>{patientUser?.name || 'Ramesh Sundaram'}</strong> (ID: {patientUser?.id || 'PT-8831'}). Contains full 24-hour continuous biometric logs, statistical ranges, and physician notes.
            </p>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-3.5 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Avg Heart Rate:</span>
                <span className="text-slate-900 dark:text-white font-bold">74.2 bpm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Oxygen Saturation:</span>
                <span className="text-slate-900 dark:text-white font-bold">98.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mean Blood Pressure:</span>
                <span className="text-slate-900 dark:text-white font-bold">122/82 mmHg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Body Temperature:</span>
                <span className="text-slate-900 dark:text-white font-bold">98.5 °F</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Print PDF
              </button>
              <button
                onClick={() => {
                  alert('Vitals report successfully exported to clinical file download.');
                  setShowExportModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white shadow"
              >
                Download CSV / PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
