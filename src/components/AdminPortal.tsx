import React, { useState, useEffect } from 'react';
import { useNeuro } from '../context/NeuroContext';
import { HospitalCollaborationHub } from './HospitalCollaborationHub';
import {
  Shield,
  Phone,
  PhoneCall,
  Video,
  Plus,
  AlertTriangle,
  CheckCircle,
  Activity,
  Maximize2,
  Minimize2,
  RefreshCw,
  Search,
  Eye,
  Lock,
  MessageSquare,
  Radio,
  SlidersHorizontal,
  Mail,
  User,
  Building2,
  MicOff,
  CameraOff,
  LogOut,
  Sparkles,
  ArrowRight,
  MapPin,
  ExternalLink,
  FileText,
  Settings,
  AlertOctagon,
  Clock,
  UserCheck,
  Volume2,
  Bell,
  BellRing,
  X,
  PhoneForwarded,
  CheckCircle2,
  Send
} from 'lucide-react';
import { CCTVCamera, EmergencyRecord } from '../context/NeuroContext';

export const AdminPortal: React.FC = () => {
  const {
    adminUser,
    adminPhone,
    setAdminPhone,
    isAdminLoggedIn,
    loginAdminDirectly,
    verifyAdminOtp,
    sendOtpSms,
    logoutAdmin,
    setCurrentScreen,
    cctvList,
    addCctvCamera,
    activeEmergency,
    slideDownProgress,
    emergencyHistory,
    facialSymmetry,
    armStability,
    earValue,
    doctors,
    triggerEmergency,
    acknowledgeEmergency,
    resolveEmergency,
    callPatientBack,
    adminConfig,
    updateAdminConfig,
    setIsEmergencyCallActive,
    t
  } = useNeuro();

  // Admin login states (Name, Email, Phone - No OTP, No reCAPTCHA)
  const [nameInput, setNameInput] = useState('Dr. Priya Varma');
  const [emailInput, setEmailInput] = useState('priya.varma@apollo-neuro.org');
  const [phoneInput, setPhoneInput] = useState(adminPhone);
  const [loginError, setLoginError] = useState('');

  // CCTV & View states (No emergency alerts tab in admin)
  const [activeTab, setActiveTab] = useState<'patientCam' | 'collaboration' | 'cctvGrid'>('patientCam');
  const [isAddCctvOpen, setIsAddCctvOpen] = useState(false);
  const [newCamName, setNewCamName] = useState('');
  const [newCamLocation, setNewCamLocation] = useState('');
  const [newCamIp, setNewCamIp] = useState('192.168.1.');
  const [nightVision, setNightVision] = useState(false);

  // Emergency Management States
  const [resolvingAlertId, setResolvingAlertId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('Patient attended bedside by clinical nurse team. Vitals stable; motor response restored.');
  const [viewingLogsAlert, setViewingLogsAlert] = useState<EmergencyRecord | null>(null);
  const [callingPatientStatus, setCallingPatientStatus] = useState<string | null>(null);
  const [testAlertSending, setTestAlertSending] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Admin Telephony Settings Form
  const [cfgPrimaryName, setCfgPrimaryName] = useState(adminConfig?.primaryAdmin?.name || 'Dr. Priya Varma');
  const [cfgPrimaryPhone, setCfgPrimaryPhone] = useState(adminConfig?.primaryAdmin?.phone || adminPhone);
  const [cfgPrimaryEmail, setCfgPrimaryEmail] = useState(adminConfig?.primaryAdmin?.email || 'priya.varma@apollo-neuro.org');
  const [cfgBackupName, setCfgBackupName] = useState(adminConfig?.backupAdmin?.name || 'Dr. Arvind Swaminathan (On-Call)');
  const [cfgBackupPhone, setCfgBackupPhone] = useState(adminConfig?.backupAdmin?.phone || '+91 98402 77112');
  const [cfgBackupEmail, setCfgBackupEmail] = useState(adminConfig?.backupAdmin?.email || 'a.swaminathan@apollohospitals.com');
  const [cfgTimeout, setCfgTimeout] = useState(adminConfig?.callTimeoutSeconds || 25);
  const [cfgMaxRetries, setCfgMaxRetries] = useState(adminConfig?.maxRetries || 2);
  const [cfgAutoEscalate, setCfgAutoEscalate] = useState(adminConfig?.autoEscalateToBackup ?? true);
  const [cfgProvider, setCfgProvider] = useState<'TWILIO_VOICE' | 'TELEPHONY_GATEWAY_SERVICE'>(adminConfig?.telephonyProvider || 'TELEPHONY_GATEWAY_SERVICE');
  const [configSaving, setConfigSaving] = useState(false);
  const [configSaveMsg, setConfigSaveMsg] = useState('');

  // Keep settings form synced when adminConfig updates from server
  useEffect(() => {
    if (adminConfig) {
      if (adminConfig.primaryAdmin?.name) setCfgPrimaryName(adminConfig.primaryAdmin.name);
      if (adminConfig.primaryAdmin?.phone) setCfgPrimaryPhone(adminConfig.primaryAdmin.phone);
      if (adminConfig.primaryAdmin?.email) setCfgPrimaryEmail(adminConfig.primaryAdmin.email);
      if (adminConfig.backupAdmin?.name) setCfgBackupName(adminConfig.backupAdmin.name);
      if (adminConfig.backupAdmin?.phone) setCfgBackupPhone(adminConfig.backupAdmin.phone);
      if (adminConfig.backupAdmin?.email) setCfgBackupEmail(adminConfig.backupAdmin.email);
      if (adminConfig.callTimeoutSeconds) setCfgTimeout(adminConfig.callTimeoutSeconds);
      if (adminConfig.maxRetries) setCfgMaxRetries(adminConfig.maxRetries);
      if (typeof adminConfig.autoEscalateToBackup === 'boolean') setCfgAutoEscalate(adminConfig.autoEscalateToBackup);
      if (adminConfig.telephonyProvider) setCfgProvider(adminConfig.telephonyProvider);
    }
  }, [adminConfig]);

  // OTP Countdown timer
  useEffect(() => {
    let timer: any;
    if (otpSent && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, otpCountdown]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim() || !phoneInput.trim()) {
      setLoginError('All details must be filled in to sign in as Administrator. Please enter Doctor Name, Hospital Email, and Mobile Phone.');
      return;
    }
    const result = loginAdminDirectly(nameInput, emailInput, phoneInput);
    if (!result.success) {
      setLoginError(result.message || 'Admin account does not exist. Access denied.');
    } else {
      setLoginError('');
    }
  };

  const handleQuickAdminDemo = () => {
    setNameInput('Dr. Priya Varma');
    setEmailInput('priya.varma@apollo-neuro.org');
    setPhoneInput('+91 98401 23456');
    setLoginError('');
  };

  // If not logged in, render the clean Admin Login Gate (No OTP, No reCAPTCHA)
  if (!isAdminLoggedIn) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/30">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Clinical Admin &amp; Hospital Gate</h2>
                <p className="text-xs text-slate-400">Doctor Authentication &amp; Multi-Hospital Sentinel</p>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('gateway')}
              className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              Back to Portals
            </button>
          </div>

          <div className="rounded-2xl border border-emerald-900/50 bg-emerald-950/30 p-3.5 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
              <Lock className="h-4 w-4" />
              <span>Registered Clinical Staff Only</span>
            </div>
            <p>Enter your registered credentials. All fields must be filled. Existing accounts will be opened immediately.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Field 1: Admin Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Official Doctor / Admin Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-emerald-400" />
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Dr. Priya Varma"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Field 2: Hospital Email ID */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Official Hospital Email ID <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-emerald-400" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. priya.varma@apollo-neuro.org"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Field 3: Mobile Phone Number */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Mobile Phone <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-emerald-400" />
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91 98401 23456"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/60 p-3 text-xs text-rose-300 animate-in fade-in flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-3.5 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              <span>Sign In to Admin Command Center</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleQuickAdminDemo}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 py-2.5 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              Fill Registered Admin: Dr. Priya Varma (Apollo Neuro)
            </button>
          </form>
        </div>
      </div>
    );
  }

  const assignedDoctor = doctors.find((d) => d.currentPatientAssigned) || doctors[0];

  const handleAddCctvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCamName && newCamIp) {
      addCctvCamera({
        name: newCamName,
        location: newCamLocation || 'Ward Surveillance',
        ipAddress: newCamIp,
        type: 'NEARBY_CCTV',
      });
      setIsAddCctvOpen(false);
      setNewCamName('');
      setNewCamLocation('');
      setNewCamIp('192.168.1.');
    }
  };

  const [alertSubTab, setAlertSubTab] = useState<'queue' | 'settings'>('queue');
  const [alertFilter, setAlertFilter] = useState<'ALL' | 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'>('ALL');

  const handleSaveAdminConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSaving(true);
    setConfigSaveMsg('');
    const ok = await updateAdminConfig({
      primaryAdmin: {
        name: cfgPrimaryName,
        phone: cfgPrimaryPhone,
        email: cfgPrimaryEmail,
        role: 'Attending Neurologist & Clinical Administrator'
      },
      backupAdmin: {
        name: cfgBackupName,
        phone: cfgBackupPhone,
        email: cfgBackupEmail,
        role: 'On-Call Vascular Neurosurgeon & Backup Admin'
      },
      callTimeoutSeconds: Number(cfgTimeout),
      maxRetries: Number(cfgMaxRetries),
      autoEscalateToBackup: cfgAutoEscalate,
      telephonyProvider: cfgProvider
    });
    setConfigSaving(false);
    if (ok) {
      setConfigSaveMsg('Emergency Telephony & Backup Admin configurations saved successfully.');
      setTimeout(() => setConfigSaveMsg(''), 4000);
    } else {
      setConfigSaveMsg('Failed to update configurations. Please check network.');
    }
  };

  const handleCallPatient = async (alert: EmergencyRecord) => {
    const targetPhone = alert.patientPhone || '+91 98401 54321';
    setCallingPatientStatus(`Initiating telephony call to ${alert.patientName || 'Patient'} at ${targetPhone}...`);
    try {
      const res = await callPatientBack(alert.id, targetPhone);
      if (res && res.success) {
        setCallingPatientStatus(`Call dispatched! Provider Call SID: ${res.callSid || 'VOICE-OUTBOUND'}`);
      } else {
        setCallingPatientStatus(res?.message || 'Call initiated. Connecting via device dialer...');
      }
      try {
        window.location.href = `tel:${targetPhone.replace(/[\s()-]/g, '')}`;
      } catch {}
    } catch (err: any) {
      setCallingPatientStatus(`Calling error: ${err.message}`);
    }
    setTimeout(() => setCallingPatientStatus(null), 5000);
  };

  const handleConfirmResolve = async () => {
    if (!resolvingAlertId) return;
    await resolveEmergency(resolvingAlertId, resolutionNotes);
    setResolvingAlertId(null);
  };

  const handleTriggerTestEmergency = async () => {
    setTestAlertSending(true);
    await triggerEmergency('FACIAL_DROOP', 'Manual clinical test alert: acute asymmetric motor weakness (admin simulated).');
    setTestAlertSending(false);
  };

  return (
    <div className="space-y-6">
      {/* High-Priority Active Emergency Sentinel Banner for Admin */}
      {activeEmergency && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-rose-500 bg-gradient-to-r from-rose-950/95 via-red-950 to-slate-950 p-5 shadow-2xl shadow-rose-950/80 animate-pulse backdrop-blur-xl">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-xl shadow-rose-600/40 animate-bounce">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-rose-900 px-2.5 py-0.5 text-[10px] font-mono font-black text-rose-200 border border-rose-500 uppercase tracking-widest">
                  URGENT PATIENT ALERT
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  BAY 104 • {activeEmergency.type.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-0.5">
                {activeEmergency.type === 'SLIDE_DOWN'
                  ? 'PATIENT HAS SLID DOWN IN BED! Immediate Attention Needed'
                  : activeEmergency.type === 'ABNORMAL_ACTION'
                  ? 'ABNORMAL MOTOR ACTION / INVOLUNTARY CONVULSION DETECTED'
                  : activeEmergency.details}
              </h3>
              <p className="text-xs text-rose-200/90 font-mono">
                {activeEmergency.details} • Dispatched to {adminPhone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEmergencyCallActive(true)}
              className="rounded-2xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-rose-600/30 flex items-center gap-2 transition"
            >
              <PhoneCall className="h-4 w-4 animate-pulse" />
              <span>Open Patient Intercom</span>
            </button>
            <button
              onClick={() => acknowledgeEmergency()}
              className="rounded-2xl border border-rose-400/60 bg-rose-900/60 hover:bg-rose-800 px-3.5 py-2.5 text-xs font-bold text-white transition"
            >
              Acknowledge &amp; Dispatch Nurse
            </button>
          </div>
        </div>
      )}

      {/* Admin Top Dashboard Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                {adminUser?.name || 'Dr. Priya Varma'}
              </h2>
              <span className="rounded-full bg-emerald-950 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800">
                OTP VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {adminUser?.email || 'priya.varma@apollo-neuro.org'} • Alert Phone: <span className="font-mono font-bold text-emerald-400">{adminPhone}</span>
            </p>
          </div>
        </div>

        {/* Tab Switcher & Logout */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('patientCam')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === 'patientCam'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Video className="h-4 w-4" /> Live Patient CCTV
          </button>

          <button
            onClick={() => setActiveTab('collaboration')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === 'collaboration'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Building2 className="h-4 w-4" /> Hospitals &amp; Doctors
          </button>

          <button
            onClick={() => setActiveTab('cctvGrid')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === 'cctvGrid'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Radio className="h-4 w-4" /> CCTV Grid ({cctvList.length})
          </button>


          <button
            onClick={logoutAdmin}
            className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs text-slate-300 flex items-center gap-1 transition"
            title="Sign out of Admin Portal"
          >
            <LogOut className="h-3.5 w-3.5 text-rose-400" /> Exit
          </button>
        </div>
      </div>

      {/* Hardware Privacy Notice: Camera and Mic are strictly OFF for Admin */}
      <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-2.5 text-xs text-emerald-300">
        <div className="flex items-center gap-2">
          <CameraOff className="h-4 w-4 text-emerald-400" />
          <MicOff className="h-4 w-4 text-emerald-400" />
          <span>
            <strong>Clinician Privacy Enforced:</strong> Admin local camera and microphone are strictly <strong>DISABLED</strong>. You are observing the remote Patient Room 104 stream without broadcasting your own hardware.
          </span>
        </div>
        <span className="font-mono text-[10px] bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700">
          RECEIVER ONLY
        </span>
      </div>

      {/* Tab 1: Live Patient Camera Observation & Telemetry */}
      {activeTab === 'patientCam' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-bold text-white tracking-wider uppercase">
                    Remote Patient Vision Stream • Room 104
                  </span>
                </div>
                <button
                  onClick={() => setIsEmergencyCallActive(true)}
                  className="rounded-xl bg-rose-600 hover:bg-rose-500 px-3 py-1.5 text-xs font-bold text-white flex items-center gap-1.5 shadow"
                >
                  <PhoneCall className="h-3.5 w-3.5" /> Start Emergency Audio Intercom
                </button>
              </div>

              {/* Remote Patient Stream HUD (Simulated remote camera observer) */}
              <div className="relative aspect-video w-full rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center">
                {/* Visual scanlines & CCTV telemetry overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

                <div className="text-center space-y-2 p-6">
                  <Radio className="h-12 w-12 text-emerald-400 mx-auto animate-pulse" />
                  <h4 className="text-base font-bold text-white">Patient Bed 104 • Live Ambient Stream</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Continuous remote ambient CCTV receiving feed from patient bed. Local admin camera/mic remains strictly off.
                  </p>
                  <div className="pt-2 flex justify-center gap-2">
                    <span className="rounded bg-slate-900 px-2.5 py-1 text-[11px] font-mono text-sky-400 border border-slate-800">
                      EAR: {earValue.toFixed(2)} (Blink Sentinel Armed)
                    </span>
                    <span className="rounded bg-slate-900 px-2.5 py-1 text-[11px] font-mono text-emerald-400 border border-slate-800">
                      Face Symmetry: {facialSymmetry}%
                    </span>
                  </div>
                </div>

                {/* Top Video OSD */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded bg-slate-900/90 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-400 border border-slate-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>REMOTE RTSP 1080p @ 30 FPS</span>
                </div>

                <div className="absolute top-3 right-3 rounded bg-slate-900/90 px-2.5 py-1 text-[10px] font-mono text-slate-300 border border-slate-800">
                  IP: 192.168.1.142:554
                </div>
              </div>
            </div>
          </div>

          {/* Patient Quick Vitals & Specialist In-Charge */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Patient Status &amp; Assigned Neurologist
              </h3>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-slate-800 text-xs">
                  <span className="text-slate-400">Patient:</span>
                  <span className="font-bold text-white">{t('patientName')}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-slate-800 text-xs">
                  <span className="text-slate-400">Attending Doctor:</span>
                  <span className="font-bold text-emerald-400">{assignedDoctor.name}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-slate-800 text-xs">
                  <span className="text-slate-400">Eye Aspect Ratio:</span>
                  <span className="font-mono font-bold text-sky-400">{earValue.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-slate-800 text-xs">
                  <span className="text-slate-400">Facial Symmetry:</span>
                  <span
                    className={`font-mono font-bold ${
                      facialSymmetry > 75 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {facialSymmetry}%
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-slate-800 text-xs">
                  <span className="text-slate-400">Motor Tone:</span>
                  <span className="font-mono font-bold text-indigo-400">{armStability}%</span>
                </div>
              </div>

              {/* Manual Dispatch Call Button */}
              <div className="pt-2">
                <button
                  onClick={() => triggerEmergency('SOS_MANUAL', 'Admin manually initiated clinical emergency alert.')}
                  className="w-full rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:from-rose-500 hover:to-red-600 transition flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4" /> Trigger Urgent Call &amp; SMS Dispatch
                </button>
              </div>
            </div>

            {/* Admin Alert Configuration */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-emerald-400" /> Emergency Alert Recipient
              </h4>
              <p className="text-xs text-slate-400">
                Patient emergencies auto-dispatch calls and SMS to verified admin mobile:
              </p>
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Verified Phone:</span>
                <span className="font-mono font-bold text-emerald-400">{adminPhone}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hospital & Doctor Collaboration Hub */}
      {activeTab === 'collaboration' && <HospitalCollaborationHub />}

      {/* Tab 3: CCTV & Nearby IP Camera Monitor */}
      {activeTab === 'cctvGrid' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">{t('nearbyCameras')}</h3>
              <p className="text-xs text-slate-400">
                Live surveillance via hospital network IP addresses, RTSP, and patient room streams
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setNightVision(!nightVision)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1.5 border transition ${
                  nightVision
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Eye className="h-3.5 w-3.5" /> Night Vision IR
              </button>

              <button
                onClick={() => setIsAddCctvOpen(true)}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white flex items-center gap-1.5 shadow"
              >
                <Plus className="h-4 w-4" /> {t('addIpCamera')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cctvList.map((cam) => (
              <div
                key={cam.id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl"
              >
                <div
                  className={`relative aspect-video w-full flex items-center justify-center overflow-hidden ${
                    nightVision ? 'bg-emerald-950/80 grayscale contrast-125' : 'bg-slate-950'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <Radio className="h-10 w-10 text-emerald-400 mb-2 animate-pulse" />
                    <p className="text-xs font-semibold text-white">{cam.name}</p>
                    <p className="text-[10px] font-mono text-emerald-400 mt-1">IP: {cam.ipAddress}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">RTSP H.264 • 1080p @ {cam.fps} FPS</p>
                  </div>

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded bg-slate-950/80 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-slate-800 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>REC {cam.resolution}</span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 rounded bg-slate-950/80 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-800 backdrop-blur">
                    {cam.ipAddress}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-900 border-t border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">{cam.name}</h4>
                    <p className="text-[11px] text-slate-400">{cam.location}</p>
                  </div>
                  <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-800">
                    {cam.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {isAddCctvOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
              <div className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
                <h3 className="text-base font-bold text-white">{t('addIpCamera')}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Connect nearby IP cameras or CCTV through local network IP address.
                </p>

                <form onSubmit={handleAddCctvSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {t('cameraName')}
                    </label>
                    <input
                      type="text"
                      value={newCamName}
                      onChange={(e) => setNewCamName(e.target.value)}
                      placeholder="e.g. Rehab Bay 2 / Hallway East"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Physical Location / Ward
                    </label>
                    <input
                      type="text"
                      value={newCamLocation}
                      onChange={(e) => setNewCamLocation(e.target.value)}
                      placeholder="e.g. Neurology Ward 3"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {t('ipAddressLabel')}
                    </label>
                    <input
                      type="text"
                      value={newCamIp}
                      onChange={(e) => setNewCamIp(e.target.value)}
                      placeholder="192.168.1.185:554 or rtsp://..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddCctvOpen(false)}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow"
                    >
                      Connect Stream
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

          </div>
  );
};
