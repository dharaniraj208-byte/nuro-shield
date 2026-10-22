# NeuroShield — AI Automated Healthcare & Stroke Monitoring Platform

NeuroShield is a clinical monitoring and neurological recovery application designed with a modern, trustworthy healthcare design system, role-based governance, on-device AI computer vision, and real-time telephony alert dispatch.

---

## 1. Design System & Theme

- **Color Palette**:
  - **Primary Medical Blue / Teal**: `#0EA5E9` (Sky Blue) & `#14B8A6` (Medical Teal)
  - **Background**: `#F8FAFC` (Off-white canvas) in Light Mode / `#020617` (Slate 950) in Dark Mode
  - **Semantic Accents**: Success Green (`#10B981`), Warning Amber (`#F59E0B`), Critical Alert Red (`#EF4444`)
- **Card Geometry**: 16–24px border radius (`rounded-2xl` / `rounded-3xl`), soft subtle shadows, and generous breathing whitespace.
- **Typography**: Inter / Poppins with high contrast and readable scale tailored for elderly and recovering patients.
- **Theme Modes**: Seamless Light and Dark mode toggle with persistent local preferences.

---

## 2. 6-Tab Always-Visible Bottom Navigation

The Patient Portal features a persistent 6-tab bottom navigation bar:

1. **Home**: Patient greeting (`Hello, Eleanor Vance`), search bar, unread notification bell, vitals summary with live values and sparklines, today's schedule, and quick emergency actions.
2. **Exercise**: Daily rehabilitation checklist (medication, hydration, physiotherapy, speech) with tick animations, streak counter, progress ring, and exercise plan cards with visual demonstrations.
3. **Camera**: Real-time AI automated sentinel with on-device computer vision. Detects 3 slow eye blinks, sudden falls, and person absence, triggering a 10-second patient cancel countdown.
4. **Vitals**: Recharts area graphs for Heart Rate, SpO₂, Blood Pressure, Body Temperature, and Sleep duration with Day / Week / Month filters, normal-range bands, min/max/average statistics, and exportable PDF summary reports.
5. **Documents**: Clinical report upload (PDF/images), OCR text extraction, plain-language AI summary, abnormal value highlighting, risk assessment, doctor SMS sharing, and mandatory non-diagnostic disclaimer.
6. **Profile**: Comprehensive demographics (Patient ID `PT-8831`, Age, Gender, Blood Group), chronic conditions, allergies, medications, care network contacts, alert preferences, and edit modal.

---

## 3. Camera AI Automated Monitoring Setup

NeuroShield uses client-side, on-device machine learning for zero-latency, privacy-preserving monitoring:

### Detection Capabilities
1. **Three Slow Eye Blinks (SOS Help Signal)**:
   - Calculates **Eye Aspect Ratio (EAR)** using MediaPipe Face Mesh landmark coordinates:
     $$\text{EAR} = \frac{\|p_2 - p_6\| + \|p_3 - p_5\|}{2 \cdot \|p_1 - p_4\|}$$
   - When EAR drops below 0.20 for an extended duration (0.4s to 1.8s) 3 consecutive times within a 6-second sliding window, it triggers an SOS alert.
2. **Fall Detection**:
   - Analyzes MediaPipe Pose vertical displacement ($\Delta Y$) of shoulder and hip keypoints. Sudden drops or horizontal torso alignments trigger an immediate fall alarm.
3. **Person Disappears From Frame**:
   - Detects when face/body landmarks are absent for longer than the configurable timeout (default: 15 seconds) and raises an absence alert.

### 10-Second Cancel Countdown Gate
- Whenever any anomaly is detected, a **full-screen red pulsing alert** appears on the patient's screen with a **10-second cancel countdown** and an audio beep.
- If the patient presses **"I'M OKAY — CANCEL ALERT"**, the alert is cancelled and logged as `CANCELLED_BY_PATIENT`.
- If 10 seconds elapse without cancellation, the system automatically escalates:
  - Dispatches an emergency SMS with patient location, event snapshot, and timestamp.
  - Places an automated emergency phone call to the caregiver/admin phone.
  - Adds an urgent notification to the admin center and patient notification drawer.

---

## 4. Alert & Telephony Calling Architecture

### Alert Pipeline
```
[AI Camera / Vitals Trigger]
           │
           ▼
[10-Second Patient Cancel Modal]
     │                    │
     ├─ (Cancelled) ─────► [Logged as CANCELLED]
     │
     ▼ (Countdown Expires / Instant SOS)
[Escalate Emergency]
     │
     ├──► 1. Trigger Telephony Voice Call to Caregiver
     ├──► 2. Send Emergency SMS with Event Snapshot & GPS
     ├──► 3. Log to Camera Event History & Clinical Audit
     └──► 4. Push Notification to Notification Drawer
```

### Telephony Configuration
NeuroShield includes dual-engine telephony dispatch:
- **Primary**: Twilio Voice & SMS API (configured via server environment variables: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`).
- **Resilient Fallback**: Built-in Telephony Voice/SMS Gateway that automatically takes over if Twilio credentials are unauthenticated, ensuring notifications are never dropped during critical clinical emergencies.

---

## 5. Development & Quickstart

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd neuroshield

# Install dependencies
npm install

# Start local development server (runs on port 3000)
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 6. Privacy & Safety Notice

- **Hardware Isolation**: Patient camera and microphone remain strictly on the patient device. The Clinical Admin portal does not tap into the patient's local sensors without clinical authorization.
- **Medical Disclaimer**: AI-generated summaries and alerts are supplemental clinical aids and do not constitute a substitute for professional medical advice, clinical diagnosis, or hospital emergency services (911/112).
