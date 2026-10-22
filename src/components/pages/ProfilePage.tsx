import React, { useState } from 'react';
import { useNeuro } from '../../context/NeuroContext';
import {
  User,
  Shield,
  Phone,
  Mail,
  Heart,
  Pill,
  AlertCircle,
  Settings,
  LogOut,
  Edit3,
  Check,
  X,
  BellRing,
  Volume2,
  Clock,
  UserCheck,
  Building2,
  Save
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    patientUser,
    updatePatientProfile,
    logoutPatient,
    adminPhone,
    t
  } = useNeuro();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: patientUser?.name || 'Ramesh Sundaram',
    age: patientUser?.age || 64,
    gender: patientUser?.gender || 'Male',
    bloodGroup: patientUser?.bloodGroup || 'O+',
    phone: patientUser?.phone || '+91 98401 54321',
    email: patientUser?.email || 'ramesh.sundaram@gmail.com',
    room: patientUser?.room || 'Rehab Bay 104',
    doctorName: patientUser?.doctorName || 'Dr. Priya Varma',
    doctorPhone: patientUser?.doctorPhone || '+91 98401 23456',
    caregiverContact: patientUser?.caregiverContact || '+91 98402 77112',
    emergencyContact: patientUser?.emergencyContact || 'Kavitha Sundaram (+91 98403 99221)',
  });

  const [alertPreferences, setAlertPreferences] = useState(
    patientUser?.alertPreferences || {
      soundEnabled: true,
      smsAlerts: true,
      autoCallAdmin: true,
      cancelCountdownSeconds: 10,
      presenceTimeoutSeconds: 10,
    }
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatientProfile({
      ...formData,
      alertPreferences,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 animate-in fade-in duration-200">
      {/* 1. PROFILE HEADER CARD */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={patientUser?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80'}
            alt={patientUser?.name || 'Patient'}
            className="h-24 w-24 rounded-full object-cover ring-4 ring-sky-500/20 shadow-md"
          />
          <span className="absolute bottom-1 right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
          </span>
        </div>

        {/* Identity & Main Info */}
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {patientUser?.name || 'Ramesh Sundaram'}
            </h1>
            <span className="rounded-full bg-sky-100 dark:bg-sky-950 px-2.5 py-0.5 text-xs font-mono font-bold text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
              {patientUser?.id || 'PT-8831'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {patientUser?.age || 64} yrs • {patientUser?.gender || 'Male'} • Blood Group: <strong className="text-rose-600 dark:text-rose-400 font-bold">{patientUser?.bloodGroup || 'O+'}</strong>
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Room: <strong className="text-slate-900 dark:text-white">{patientUser?.room || 'Rehab Bay 104'}</strong> • Apollo Speciality Hospitals (Neurology)
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-mono">
              <Phone className="h-3.5 w-3.5 text-sky-500" /> {patientUser?.phone || '+91 98401 54321'}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-teal-500" /> {patientUser?.email || 'ramesh.sundaram@gmail.com'}
            </span>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="shrink-0 flex items-center gap-1.5 rounded-2xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-400 px-4 py-2 text-xs font-bold transition shadow-xs border border-sky-200 dark:border-sky-800"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* EDIT MODAL / INLINE FORM IF ACTIVE */}
      {isEditing && (
        <form onSubmit={handleSave} className="rounded-3xl bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-800 p-6 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-sky-500" /> Edit Patient Demographics &amp; Contacts
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Blood Group</label>
              <input
                type="text"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Attending Physician Phone</label>
              <input
                type="text"
                value={formData.doctorPhone}
                onChange={(e) => setFormData({ ...formData, doctorPhone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Caregiver Emergency Contact</label>
              <input
                type="text"
                value={formData.caregiverContact}
                onChange={(e) => setFormData({ ...formData, caregiverContact: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> Save Changes
            </button>
          </div>
        </form>
      )}

      {/* 2. MEDICAL DETAILS (Conditions, Allergies, Current Medications) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Conditions */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <Heart className="h-5 w-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Medical Conditions</h3>
          </div>
          <div className="space-y-1.5">
            {patientUser?.conditions ? (
              patientUser.conditions.map((cond, i) => (
                <span
                  key={i}
                  className="block rounded-xl bg-sky-50 dark:bg-sky-950/60 px-3 py-1.5 text-xs font-medium text-sky-900 dark:text-sky-200 border border-sky-100 dark:border-sky-900"
                >
                  • {cond}
                </span>
              ))
            ) : (
              <span className="block rounded-xl bg-sky-50 dark:bg-sky-950/60 px-3 py-1.5 text-xs font-medium text-sky-900 dark:text-sky-200">
                • Ischemic Stroke (Left Hemiparesis)
              </span>
            )}
          </div>
        </div>

        {/* Allergies */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-5 w-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Allergies &amp; Alerts</h3>
          </div>
          <div className="space-y-1.5">
            {(patientUser?.allergies || ['Penicillin', 'Sulfa Antibiotics']).map((al, i) => (
              <span
                key={i}
                className="block rounded-xl bg-rose-50 dark:bg-rose-950/60 px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900"
              >
                ⚠ {al}
              </span>
            ))}
          </div>
        </div>

        {/* Current Medications */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
            <Pill className="h-5 w-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Medications</h3>
          </div>
          <div className="space-y-1.5">
            {(patientUser?.medications || ['Aspirin 81mg (Daily)', 'Atorvastatin 20mg (Night)', 'Amlodipine 5mg (Morning)']).map((med, i) => (
              <span
                key={i}
                className="block rounded-xl bg-teal-50 dark:bg-teal-950/60 px-3 py-1.5 text-xs font-medium text-teal-900 dark:text-teal-200 border border-teal-100 dark:border-teal-900"
              >
                💊 {med}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. CLINICAL & EMERGENCY NETWORK CONTACTS */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="h-4 w-4 text-sky-500" /> Care Network &amp; Emergency Contacts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Attending Neurologist</span>
            <div className="font-bold text-slate-900 dark:text-white">{patientUser?.doctorName || 'Dr. Priya Varma'}</div>
            <div className="text-sky-600 dark:text-sky-400 font-mono">{patientUser?.doctorPhone || adminPhone}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Caregiver Contact</span>
            <div className="font-bold text-slate-900 dark:text-white">Primary Rehab Nurse</div>
            <div className="text-teal-600 dark:text-teal-400 font-mono">{patientUser?.caregiverContact || '+91 98402 77112'}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Family Emergency Contact</span>
            <div className="font-bold text-slate-900 dark:text-white">Kavitha Sundaram (Spouse)</div>
            <div className="text-rose-600 dark:text-rose-400 font-mono">+91 98403 99221</div>
          </div>
        </div>
      </div>

      {/* 4. ALERT PREFERENCES & AUTOMATED SENTINEL SETTINGS */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="h-4 w-4 text-sky-500" /> Automated Alert Preferences
        </h3>

        <div className="space-y-3">
          {/* Toggle 1: Audible Siren */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-sky-500" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Audible Alert Tone</div>
                <div className="text-[11px] text-slate-500">Play local audio chime on symptom detection</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={alertPreferences.soundEnabled}
              onChange={(e) => setAlertPreferences({ ...alertPreferences, soundEnabled: e.target.checked })}
              className="h-4 w-4 rounded accent-sky-500"
            />
          </div>

          {/* Toggle 2: SMS Dispatch */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <BellRing className="h-4 w-4 text-teal-500" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Automated SMS Dispatches</div>
                <div className="text-[11px] text-slate-500">Auto-send SMS to doctor on uncancelled alert</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={alertPreferences.smsAlerts}
              onChange={(e) => setAlertPreferences({ ...alertPreferences, smsAlerts: e.target.checked })}
              className="h-4 w-4 rounded accent-teal-500"
            />
          </div>

          {/* Cancel Countdown Duration */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-amber-500" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Cancel Countdown Window</div>
                <div className="text-[11px] text-slate-500">Patient safety window to cancel false alarms</div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg">
              10 Seconds
            </span>
          </div>
        </div>
      </div>

      {/* 5. LOGOUT */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={logoutPatient}
          className="flex items-center gap-2 rounded-2xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 px-5 py-2.5 text-xs font-bold transition shadow-xs"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out of Patient Portal</span>
        </button>
      </div>
    </div>
  );
};
