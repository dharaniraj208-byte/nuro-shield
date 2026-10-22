import React, { useState } from 'react';
import { useNeuro } from '../../context/NeuroContext';
import {
  FileText,
  Upload,
  Camera,
  Share2,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  FileCheck,
  Eye,
  Info,
  Clock,
  PhoneCall,
  X
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const {
    documents,
    uploadDocument,
    shareDocumentWithDoctor,
    patientUser,
    adminPhone
  } = useNeuro();

  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadName, setUploadName] = useState<string>('');
  const [uploadType, setUploadType] = useState<'PDF' | 'IMAGE' | 'LAB_REPORT' | 'PRESCRIPTION'>('LAB_REPORT');
  const [shareSuccessMessage, setShareSuccessMessage] = useState<string | null>(null);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      uploadDocument({
        name: uploadName.endsWith('.pdf') ? uploadName : `${uploadName}.pdf`,
        type: uploadType,
        fileSize: '1.8 MB',
        ocrText: `Patient Name: ${patientUser?.name || 'Ramesh Sundaram'}. Test Type: Post-Stroke Neurological Follow-Up. Findings: Patient demonstrating positive bilateral response to physical mirror exercises. Cranial nerve VII examination confirms 84% symmetrical smile recovery. BP: 122/82 mmHg. Recommendations: Continue scheduled motor therapy and monitor blood pressure.`,
        summary: `Recent clinical review for ${patientUser?.name || 'Ramesh Sundaram'}. Shows remarkable facial symmetry improvement up to 84% and steady bilateral motor recovery. Medication adherence is commended.`,
        abnormalValues: [
          { parameter: 'Systolic BP (Post-Walk)', value: '136 mmHg', normalRange: '< 130 mmHg', severity: 'Mild' },
        ],
        riskLevel: 'LOW',
        treatmentGuidance: [
          'Maintain regular medication schedule.',
          'Continue scheduled speech articulation exercises.',
          'Next clinic consult in 2 weeks.'
        ],
        doctorShared: false,
      });

      setIsUploading(false);
      setShowUploadModal(false);
      setUploadName('');
    }, 1200);
  };

  const handleShare = async (id: string) => {
    await shareDocumentWithDoctor(id);
    setShareSuccessMessage('Report & clinical analysis securely dispatched to Dr. Priya Varma via SMS portal.');
    setTimeout(() => setShareSuccessMessage(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-200">
      {/* 1. HEADER & UPLOAD BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Medical Intelligence
            </span>
            <span className="rounded-full bg-teal-50 dark:bg-teal-950/70 px-2 py-0.5 text-[10px] font-bold text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
              AI OCR &amp; Clinical Extraction
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Documentation &amp; AI Analysis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload hospital summaries, prescriptions, or lab panels for immediate plain-language clinical translation.
          </p>
        </div>

        {/* Upload Trigger Button */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-xs font-bold transition shadow-md shadow-teal-600/30"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Share Toast Feedback */}
      {shareSuccessMessage && (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 p-4 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-2 text-xs text-emerald-800 dark:text-emerald-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{shareSuccessMessage}</span>
          </div>
          <button onClick={() => setShareSuccessMessage(null)} className="text-emerald-600 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. UPLOADED DOCUMENTS LIST (Horizontal Chips / Selector) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Patient Document Archive ({documents.length} Records)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {documents.map((doc) => {
            const isSelected = selectedDoc?.id === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`p-4 rounded-3xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {doc.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">{doc.uploadedAt} • {doc.fileSize}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      doc.status === 'Completed'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    Risk: {doc.riskLevel}
                  </span>
                  {doc.doctorShared ? (
                    <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                      <CheckCircle className="h-3 w-3 text-emerald-500" /> Shared with Doctor
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[10px]">Private Record</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. DETAILED AI ANALYSIS CARD */}
      {selectedDoc && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
          {/* Header & Risk Level Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400">
                Active Document Analysis
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {selectedDoc.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold border ${
                  selectedDoc.riskLevel === 'HIGH'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300'
                    : selectedDoc.riskLevel === 'MODERATE'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                }`}
              >
                Clinical Risk: {selectedDoc.riskLevel}
              </span>

              <button
                onClick={() => handleShare(selectedDoc.id)}
                className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 px-3.5 py-1.5 text-xs font-bold transition"
                title="Share this analysis with Dr. Priya Varma"
              >
                <Share2 className="h-3.5 w-3.5 text-teal-600" />
                <span>Share with Doctor</span>
              </button>
            </div>
          </div>

          {/* Simple Language AI Summary */}
          <div className="rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 p-4 border border-teal-100 dark:border-teal-900/60 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Plain-Language Clinical Summary
              </h4>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedDoc.summary}
            </p>
          </div>

          {/* Highlighted Abnormal Values */}
          {selectedDoc.abnormalValues.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Highlighted Out-of-Range Parameters
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {selectedDoc.abnormalValues.map((val, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{val.parameter}</span>
                      <span className="rounded bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-300">
                        {val.severity}
                      </span>
                    </div>
                    <div className="text-base font-black text-rose-600 dark:text-rose-400 font-mono">
                      {val.value}
                    </div>
                    <div className="text-[10px] text-slate-400">Target Range: {val.normalRange}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Treatment & Follow-Up Guidance */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> Suggested Actionable Follow-Up
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedDoc.treatmentGuidance.map((guidance, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                >
                  <span className="text-teal-600 font-bold">•</span>
                  <span>{guidance}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Raw OCR Text (Collapsible) */}
          <details className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-200 dark:border-slate-800 text-xs">
            <summary className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
              View Extracted OCR Text Content
            </summary>
            <p className="mt-2 text-[11px] font-mono text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              {selectedDoc.ocrText}
            </p>
          </details>

          {/* 4. CLEAR MANDATORY DISCLAIMER */}
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-3.5 border border-amber-200 dark:border-amber-900/60 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300">
            <Info className="h-4 w-4 shrink-0 text-amber-600" />
            <p className="font-semibold text-[11px]">
              AI-generated, not a substitute for a doctor. Always consult your attending physician before modifying prescribed medication or therapy routines.
            </p>
          </div>
        </div>
      )}

      {/* 5. UPLOAD DOCUMENT MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-teal-600">
                <Upload className="h-5 w-5" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Upload Medical Report</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSimulateUpload} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Document Title / Hospital Name
                </label>
                <input
                  type="text"
                  required
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Brain MRI Follow-Up Report"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Document Category
                </label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="LAB_REPORT">Lab &amp; Blood Panel</option>
                  <option value="PDF">Physician Discharge Summary</option>
                  <option value="PRESCRIPTION">Pharmacy Prescription</option>
                  <option value="IMAGE">Scanned Radiology / Imaging</option>
                </select>
              </div>

              {/* Upload Dropzone Preview */}
              <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 text-center space-y-2 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600">
                  <Camera className="h-6 w-6" />
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Camera Capture or File Selection
                </div>
                <p className="text-[10px] text-slate-400">
                  Supports PDF, JPEG, PNG, TIFF up to 25MB
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white shadow flex items-center gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5 animate-spin" />
                      <span>Extracting OCR...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Process AI Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
