import React, { useState, useMemo, useRef } from "react";
import {
  Sparkles,
  Upload,
  Sliders,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Settings,
  HelpCircle,
  X,
  RotateCcw,
  FileText,
  TrendingDown,
  Info,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  cardedStatistics,
  combedStatistics,
  gradeYarnParameter,
  getPercentilesForCount,
  interpolateValue,
  UsterParameter
} from "./data/uster_statistics";

// Define strict details of the parameters
const PARAM_INFO: Record<
  string,
  { label: string; description: string; category: string; icon: string }
> = {
  CVm: {
    label: "Mass Variation (CVm)",
    description: "Overall variation of yarn thickness over standard test lengths.",
    category: "Mass Homogeneity",
    icon: "📊"
  },
  CVm_1m: {
    label: "Mass Variation 1m (CVm 1m)",
    description: "Mass variation computed in cuts of exactly 1 meter.",
    category: "Mass Homogeneity",
    icon: "📏"
  },
  CVm_3m: {
    label: "Mass Variation 3m (CVm 3m)",
    description: "Mass variation computed in cuts of exactly 3 meters.",
    category: "Mass Homogeneity",
    icon: "📈"
  },
  CVb_CVm: {
    label: "Between-Bobbin Variation (CVb CVm)",
    description: "Homogeneity of variation across different spinning packages.",
    category: "Mass Homogeneity",
    icon: "🔄"
  },
  Thin_40: {
    label: "Thin Places -40%",
    description: "Occurrences where yarn thickness drops to 60% of average value.",
    category: "Imperfections",
    icon: "📉"
  },
  Thin_50: {
    label: "Thin Places -50% (Strict)",
    description: "Severe thin places; critical cause of yarn breaks during weaving.",
    category: "Imperfections",
    icon: "🛑"
  },
  Thick_35: {
    label: "Thick Places +35%",
    description: "Kinks or swollen zones of density over standard averages.",
    category: "Imperfections",
    icon: "🔺"
  },
  Thick_50: {
    label: "Thick Places +50%",
    description: "Major thick defects easily visible on fabrics.",
    category: "Imperfections",
    icon: "🔼"
  },
  Neps_140: {
    label: "Neps +140%",
    description: "Small raw fiber tangles or seed fragments.",
    category: "Imperfections",
    icon: "⚪"
  },
  Neps_200: {
    label: "Neps +200%",
    description: "Major fiber knots which disrupt dye uniformity and finishing.",
    category: "Imperfections",
    icon: "⚫"
  },
  H: {
    label: "Hairiness Index (H)",
    description: "Total length of protruding loose fibers within a length of 1cm.",
    category: "Surface Quality",
    icon: "🌾"
  },
  sH: {
    label: "Hairiness Std Dev (sH)",
    description: "Fluctuation step deviations of hairy fibers over test spans.",
    category: "Surface Quality",
    icon: "📉"
  },
  S3u: {
    label: "Loose Hair length > 3mm (S3u)",
    description: "Long critical hairs triggering standard pilling defects.",
    category: "Surface Quality",
    icon: "🌾"
  },
  Dst_Cnt: {
    label: "Dust Count /km",
    description: "Micro-dust and trash relics sizing smaller than 500μm.",
    category: "Impurities",
    icon: "💨"
  },
  Tr_Cnt: {
    label: "Trash Count /km",
    description: "Large foreign hulls and vegetable remnants on package.",
    category: "Impurities",
    icon: "🍂"
  }
};

// Preset samples to test AI Scanners beautifully out-of-the-box
const SAMPLE_REPORTS = [
  {
    name: "Standard Ring Lot-30s Carded Primary",
    yarnType: "carded",
    ne: 30,
    parameters: {
      CVm: 14.5,
      Thin_40: 180,
      Thin_50: 9,
      Thick_35: 750,
      Thick_50: 110,
      Neps_140: 1100,
      Neps_200: 220,
      H: 5.8,
      sH: 1.4,
      S3u: 5500,
      Dst_Cnt: 320,
      Tr_Cnt: 2
    }
  },
  {
    name: "Premium Compact Lot-50s Combed Elite",
    yarnType: "combed",
    ne: 50,
    parameters: {
      CVm: 11.8,
      Thin_40: 50,
      Thin_50: 2,
      Thick_35: 160,
      Thick_50: 8,
      Neps_140: 110,
      Neps_200: 21,
      H: 2.7,
      sH: 0.75,
      S3u: 2200,
      Dst_Cnt: 10
    }
  },
  {
    name: "Variation Relic Lot-24s Carded Defective",
    yarnType: "carded",
    ne: 24,
    parameters: {
      CVm: 17.2,
      Thin_40: 680,
      Thin_50: 45,
      Thick_35: 2300,
      Thick_50: 520,
      Neps_140: 3100,
      Neps_200: 680,
      H: 8.1,
      sH: 2.0,
      S3u: 9500,
      Dst_Cnt: 1550,
      Tr_Cnt: 19
    }
  }
];

export default function App() {
  // Input Settings
  const [yarnType, setYarnType] = useState<"carded" | "combed">("carded");
  const [ne, setNe] = useState<number>(30);
  const [measurements, setMeasurements] = useState<Record<string, string>>({
    CVm: "14.5",
    Thin_50: "9",
    Thick_50: "110",
    Neps_200: "220",
    H: "5.8"
  });

  // UI Tabs & state
  const [activeInputTab, setActiveInputTab] = useState<"manual" | "ai">("manual");
  const [learningTab, setLearningTab] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // AI Scanner state variables
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [showFileHelp, setShowFileHelp] = useState<boolean>(false);

  // Reference learning tab select states
  const [studyYarnType, setStudyYarnType] = useState<"carded" | "combed">("carded");
  const [studyNe, setStudyNe] = useState<number>(30);
  const [infoModalKey, setInfoModalKey] = useState<string | null>(null);

  // Fetch reference parameter statistics based on type
  const activeStats = useMemo(() => {
    return yarnType === "carded" ? cardedStatistics : combedStatistics;
  }, [yarnType]);

  // Compute exact grading and percentiles for non-empty measurements
  const gradedResults = useMemo(() => {
    const list: {
      key: string;
      label: string;
      unit: string;
      measured: number;
      percentile: number;
      gradeLabel: string;
      gradeType: "Excellent" | "Good" | "Average" | "Below Average" | "Poor";
      percentiles: number[];
      cols: number[];
    }[] = [];

    Object.entries(measurements).forEach(([key, rawVal]) => {
      const num = parseFloat(rawVal as string);
      if (isNaN(num)) return;

      const pRef = activeStats.find(p => p.key === key);
      if (!pRef) return;

      const info = gradeYarnParameter(pRef, ne, num);
      list.push({
        key,
        label: PARAM_INFO[key]?.label || pRef.name,
        unit: pRef.unit,
        measured: num,
        percentile: info.percentile,
        gradeLabel: info.label,
        gradeType: info.grade,
        percentiles: info.percentiles,
        cols: info.cols
      });
    });

    return list;
  }, [measurements, activeStats, ne]);

  // Combined overall quality grade index
  const overallQualityIndex = useMemo(() => {
    if (gradedResults.length === 0) return null;
    const sum = gradedResults.reduce((acc, curr) => acc + curr.percentile, 0);
    const avg = sum / gradedResults.length;

    let indexGrade: "Excellent" | "Good" | "Average" | "Below Average" | "Poor" = "Average";
    let colorClass = "text-yellow-600 bg-yellow-50 border-yellow-200";
    let desc = "Standard variations. Lot presents typical spinning behavior.";

    if (avg <= 15) {
      indexGrade = "Excellent";
      colorClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
      desc = "Elite yarn uniformity of highest order. Suitable for high-speed automated knitting.";
    } else if (avg <= 40) {
      indexGrade = "Good";
      colorClass = "text-teal-700 bg-teal-50 border-teal-200";
      desc = "Premium quality limits. Excellent weaving and tensile lot stability.";
    } else if (avg <= 65) {
      indexGrade = "Average";
      colorClass = "text-amber-700 bg-amber-50 border-amber-200";
      desc = "Standard mill averages. Consistent with basic trade agreements.";
    } else if (avg <= 85) {
      indexGrade = "Below Average";
      colorClass = "text-orange-700 bg-orange-50 border-orange-200";
      desc = "Elevated variations. Increased potential for looming yarn breakage relics.";
    } else {
      indexGrade = "Poor";
      colorClass = "text-red-700 bg-red-50 border-red-200";
      desc = "Critical defect rates. High mass variations likely causing fabric stripes.";
    }

    return {
      percentile: Math.round(avg),
      grade: indexGrade,
      colorClass,
      desc
    };
  }, [gradedResults]);

  // Categories helper
  const categories = ["All", "Mass Homogeneity", "Imperfections", "Surface Quality", "Impurities"];

  // Handle preset loading
  const loadPresetLot = (preset: typeof SAMPLE_REPORTS[0]) => {
    setYarnType(preset.yarnType as "carded" | "combed");
    setNe(preset.ne);
    const newMeas: Record<string, string> = {};
    Object.entries(preset.parameters).forEach(([k, v]) => {
      newMeas[k] = v.toString();
    });
    setMeasurements(newMeas);
    setScanLogs([`Successfully populated preset lot: ${preset.name}`]);
  };

  // Convert files to base64 and call server scanning API
  const handleUploadedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processScanFile(file);
  };

  const processScanFile = async (file: File) => {
    setIsScanning(true);
    setScanError(null);
    setScanLogs([`Initializing optical analysis of "${file.name}"...`]);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Str = (reader.result as string).split(",")[1];
        setScanLogs(prev => [...prev, `Converting file stream (MimeType: ${file.type})...`]);

        // Interface with Gemini API on backend
        setScanLogs(prev => [...prev, "Sending report payload to Gemini server service..."]);
        const res = await fetch("/api/scan-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileData: base64Str,
            mimeType: file.type
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }

        const data = await res.json();
        setScanLogs(prev => [...prev, "Received extracted data. Matching parameters..."]);

        if (data.yarnType) {
          setYarnType(data.yarnType === "combed" ? "combed" : "carded");
        }
        if (data.ne) {
          setNe(Number(data.ne));
        }

        if (data.parameters && Array.isArray(data.parameters)) {
          const nextMeas: Record<string, string> = {};
          data.parameters.forEach((p: { key: string; measured: number }) => {
            nextMeas[p.key] = p.measured.toString();
          });
          setMeasurements(nextMeas);
          setScanLogs(prev => [
            ...prev,
            `Successfully scanned and configured Ne ${data.ne} ${data.yarnType} lots with ${data.parameters.length} measurements!`
          ]);
        } else {
          throw new Error("Invalid output format returned from reading service.");
        }
      } catch (err: any) {
        console.error(err);
        setScanError(err.message || "Unable to extract report. Please re-check key variables.");
        setScanLogs(prev => [...prev, "Scanning error flagged."]);
      } finally {
        setIsScanning(false);
      }
    };

    reader.onerror = () => {
      setScanError("File reading triggered generic failure hook.");
      setIsScanning(false);
    };

    reader.readAsDataURL(file);
  };

  // Reset measurements
  const handleResetMeasurements = () => {
    setMeasurements({});
    setScanLogs([]);
    setScanError(null);
  };

  // Update specific measurement in lot
  const handleUpdateVal = (key: string, val: string) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: val
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900" id="main_root">
      {/* Top Clean Minimalist Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-xs">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
                <span>QA Decision Platform</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-500 font-normal normal-case">Uster Stats 2023 Loaded</span>
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                YarnGrade <span className="text-indigo-600">Uster 2023 Grader</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLearningTab(false);
              }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                !learningTab
                  ? "bg-indigo-600 text-white shadow-xs hover:bg-indigo-700"
                  : "bg-white text-slate-650 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Sliders className="h-4 w-4 inline mr-1.5" />
              Yarn Inspector
            </button>
            <button
              onClick={() => {
                setLearningTab(true);
              }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                learningTab
                  ? "bg-indigo-600 text-white shadow-xs hover:bg-indigo-700"
                  : "bg-white text-slate-650 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-1.5" />
              Uster 2023 Directory
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!learningTab ? (
            <motion.div
              key="inspector_mode"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Column: Input Panel - Takes 5 cols */}
              <div className="lg:col-span-5 flex flex-col gap-6" id="input_panel">
                {/* Mode Selector Manual vs AI */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Input Mode
                  </h3>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60">
                    <button
                      onClick={() => setActiveInputTab("manual")}
                      className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                        activeInputTab === "manual"
                          ? "bg-white text-indigo-600 shadow-sm border border-slate-200/40"
                          : "text-slate-505 text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Sliders className="h-4 w-4 inline mr-1.5" />
                      Manual Entry
                    </button>
                    <button
                      onClick={() => setActiveInputTab("ai")}
                      className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                        activeInputTab === "ai"
                          ? "bg-white text-indigo-600 shadow-sm border border-slate-200/40"
                          : "text-slate-505 text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Sparkles className="h-4 w-4 inline mr-1.5" />
                      AI Scan Report
                    </button>
                  </div>

                  {/* Lot Configuration: Common for both inputs */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold tracking-widest text-[#4f46e5]/80 uppercase mb-1.5">
                          Yarn Type
                        </label>
                        <select
                          value={yarnType}
                          onChange={(e) => setYarnType(e.target.value as "carded" | "combed")}
                          className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-200/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                        >
                          <option value="carded">Carded Ring yarn</option>
                          <option value="combed">Combed Compact yarn</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold tracking-widest text-[#4f46e5]/80 uppercase mb-1.5">
                          Lot Count (Ne)
                        </label>
                        <input
                          type="number"
                          min={yarnType === "carded" ? 6 : 20}
                          max={yarnType === "carded" ? 40 : 120}
                          step="0.1"
                          value={ne}
                          onChange={(e) => setNe(Math.max(1, Number(e.target.value)))}
                          className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-200/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono font-bold"
                        />
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] text-indigo-700 bg-indigo-50/50 px-3 py-2 rounded-lg border border-indigo-100/60 flex items-center gap-2 font-medium">
                      <Info className="h-3.5 w-3.5 text-indigo-550 shrink-0" />
                      <span>
                        Count bounds: {yarnType === "carded" ? "Carded Ring 6.0 – 40.0 Ne" : "Combed Compact 20.0 – 120.0 Ne"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tab content area */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex-1">
                  {activeInputTab === "ai" ? (
                    <div className="flex flex-col gap-4 h-full" id="uploader_area">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-indigo-600" />
                          Optical Uster OCR Scanner
                        </h2>
                        <button
                          onClick={() => setShowFileHelp(!showFileHelp)}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <HelpCircle className="h-4.5 w-4.5" />
                        </button>
                      </div>

                      {showFileHelp && (
                        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-xs text-slate-600 space-y-2 leading-relaxed">
                          <p className="font-bold text-slate-800">Supported Files & Images:</p>
                          <p>
                            Take a photograph or upload a PDF snippet of your Uster Tester Lot Report or printout.
                            The server-side intelligence extracts standard count variables and parses lot imperfections safely.
                          </p>
                          <p>
                            Your API secret is kept secure within backend services. Never exposed to browsers.
                          </p>
                        </div>
                      )}

                      {/* Drop area with high fidelity decoration inspired by Design HTML */}
                      <div className="relative border-2 border-dashed border-slate-200/80 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-all p-8 text-center flex flex-col items-center justify-center cursor-pointer group overflow-hidden min-h-[220px]">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleUploadedFile}
                          disabled={isScanning}
                          className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        />
                        
                        {/* Mockup radial dot context decoration */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>
                        
                        {/* Scanning Line Sweep Animation */}
                        {isScanning ? (
                          <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.8)] animate-[bounce_2.5s_infinite] pointer-events-none z-10" />
                        ) : (
                          <div className="absolute top-1/3 left-0 w-full h-[1px] bg-slate-250 bg-slate-200 pointer-events-none opacity-30" />
                        )}

                        <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-100 group-hover:scale-105 transition-transform mb-3 z-10">
                          <Upload className="h-6 w-6 text-indigo-600" />
                        </div>
                        <p className="text-sm font-bold text-slate-800 z-10">
                          Upload your lot report sheet
                        </p>
                        <p className="text-xs text-slate-400 mt-1 z-10">
                          Drop photo, scan PDF lot printout or image
                        </p>
                        <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mt-3 bg-white px-2 py-0.5 rounded border border-slate-200/50 font-mono z-10 shadow-3xs">
                          PNG, JPG, PDF up to 20MB
                        </p>
                      </div>

                      {/* AI Lot Presets */}
                      <div className="mt-2 bg-slate-50/70 p-4.5 p-4 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-extrabold tracking-widest text-[#4f46e5] uppercase">PRACTICE EXAMPLES</span>
                        <p className="text-xs text-slate-500 mt-1 mb-2.5">No report file? Click a test lot preset below to watch the grading lot variations in real-time:</p>
                        <div className="flex flex-col gap-2">
                          {SAMPLE_REPORTS.map((preset, index) => (
                            <button
                              key={index}
                              onClick={() => loadPresetLot(preset)}
                              className="text-left w-full px-3 py-2 bg-white hover:bg-slate-100/55 text-xs font-semibold rounded-lg border border-slate-200/60 flex items-center justify-between group transition-all"
                            >
                              <div className="flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5 text-slate-450 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                <span className="text-slate-700 group-hover:text-indigo-900">{preset.name}</span>
                              </div>
                              <span className="text-[10px] bg-slate-150 bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-500">
                                Ne {preset.ne}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Diagnostic Scan Logs */}
                      {scanLogs.length > 0 && (
                        <div className="mt-2 bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1">
                          <p className="text-indigo-400 font-bold text-[10px] tracking-wider uppercase">Analytic Terminal Logs</p>
                          <div className="max-h-32 overflow-y-auto space-y-1">
                            {scanLogs.map((log, i) => (
                              <p key={i} className="leading-snug">
                                <span className="text-slate-500">&gt;</span> {log}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Error display */}
                      {scanError && (
                        <div className="bg-red-50 border border-red-150 border-red-100 text-red-800 rounded-xl p-3.5 text-xs flex items-start gap-2.5">
                          <AlertTriangle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-red-950">Scout Engine Interrupt</p>
                            <p className="mt-0.5 text-red-700 leading-relaxed">{scanError}</p>
                          </div>
                        </div>
                      )}

                      {/* Scanning placeholder */}
                      {isScanning && (
                        <div className="my-auto flex flex-col items-center justify-center py-6 text-center">
                          <div className="relative mb-3 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent"></div>
                            <Sparkles className="h-4 w-4 text-indigo-650 text-indigo-600 absolute animate-pulse" />
                          </div>
                          <p className="text-xs font-bold animate-pulse text-indigo-600">
                            Analyzing textiles and alignments...
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4" id="manual_form">
                      <div className="flex items-center justify-between pointer-events-auto">
                        <h2 className="text-base font-bold text-slate-900">
                          Lot Parameters Entry
                        </h2>
                        <button
                          onClick={handleResetMeasurements}
                          className="text-xs bg-slate-100/80 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200/60 font-bold transition-all flex items-center gap-1.5 shadow-3xs"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Clear Inputs
                        </button>
                      </div>

                      {/* Categories filter button rows */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                        {categories.map((cat, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                              activeCategory === cat
                                ? "bg-indigo-600 text-white shadow-xs border border-indigo-600"
                                : "bg-slate-50 border border-slate-200/60 text-slate-505 text-slate-550 hover:bg-slate-100 hover:text-slate-800"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Inputs list scroll */}
                      <div className="space-y-3 max-h-120 overflow-y-auto pr-1">
                        {activeStats
                          .filter(
                            (p) =>
                              activeCategory === "All" ||
                              PARAM_INFO[p.key]?.category === activeCategory
                          )
                          .map((p) => {
                            const info = PARAM_INFO[p.key];
                            return (
                              <div
                                key={p.key}
                                className="p-3.5 bg-slate-50/50 border border-slate-200/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-indigo-200 hover:bg-white transition-all duration-200 shadow-3xs"
                              >
                                <div className="sm:max-w-3/5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500 inline-block group-hover:scale-110 transition-transform">
                                      {info?.icon || "📊"}
                                    </span>
                                    <span className="text-sm font-bold text-slate-800">
                                      {info?.label || p.name}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 mt-1 leading-normal group-hover:text-slate-555 transition-colors">
                                    {info?.description || p.name}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                                  <input
                                    type="text"
                                    placeholder="--"
                                    value={measurements[p.key] || ""}
                                    onChange={(e) => handleUpdateVal(p.key, e.target.value)}
                                    className="w-24 px-2.5 py-1.5 bg-white border border-slate-200/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-sm text-center font-extrabold text-slate-850 shadow-3xs group-hover:border-indigo-200 transition-colors"
                                  />
                                  <span className="text-xs text-slate-400 font-bold w-10">
                                    {p.unit}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Calculations & Results - Takes 7 cols */}
              <div className="lg:col-span-7 flex flex-col gap-6" id="results_panel">
                {/* Overall Quality Banner */}
                {overallQualityIndex ? (
                  <div
                    className={`rounded-2xl border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center gap-5 transition-all ${overallQualityIndex.colorClass}`}
                  >
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 text-slate-900 w-24 h-24 shrink-0 shadow-xs self-center sm:self-auto">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 text-slate-400">Quality Score</span>
                      <span className="text-3xl font-black font-mono tracking-tight text-indigo-600">
                        {overallQualityIndex.percentile}%
                      </span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 font-semibold">
                        Uster scale
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">OVERALL ASSESSMENT</span>
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                      <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                        {overallQualityIndex.grade} Quality Standard
                      </h2>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {overallQualityIndex.desc}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-8 text-center flex flex-col items-center justify-center min-h-[140px] shadow-3xs">
                    <Sliders className="h-8 w-8 text-slate-350 text-slate-300 mb-3" />
                    <h3 className="text-base font-bold text-slate-900">
                      No measurements submitted
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                      Please enter measured values in the Lot Parameters Entry on the left, or drop/select a photo to scan your yarn printout sheet.
                    </p>
                  </div>
                )}

                {/* Grid Visualizers */}
                {gradedResults.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex-1 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <h2 className="text-base font-bold text-slate-900">
                          Quality Parameters Breakdown
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-medium">
                          How each measured element sits globally on the Uster percentile scale (Lower percentiles represent superior quality limits).
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 flex-wrap">
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                          <span className="w-2.5 h-2.5 rounded bg-indigo-600"></span> 5% (World Class)
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                          <span className="w-2.5 h-2.5 rounded bg-indigo-400"></span> 25% (Excellent)
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                          <span className="w-2.5 h-2.5 rounded bg-slate-350 bg-slate-300"></span> 75% (Average)
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                          <span className="w-2.5 h-2.5 rounded bg-slate-400"></span> 95% (Poor)
                        </div>
                      </div>
                    </div>

                    {/* SVG Fingerprint chart: A brilliant visualizer comparing multiple parameters in the lot! */}
                    <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/50 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold tracking-widest text-[#4f46e5]/80 uppercase">YARN VARIATION FINGERPRINT</span>
                        <span className="text-[10px] text-slate-450 text-slate-400 flex items-center gap-1 font-bold">
                          <Info className="h-3 w-3 inline text-slate-400" />
                          Compare percentile variances.
                        </span>
                      </div>

                      {/* Fingerprint Chart representation */}
                      <div className="relative h-44 bg-white rounded-xl border border-slate-200/50 flex items-end justify-around px-2 py-4">
                        {/* 5%, 25%, 50%, 75%, 95% levels bg markers */}
                        {[5, 25, 50, 75, 95].map((pLevel) => (
                          <div
                            key={pLevel}
                            className="absolute left-0 right-0 border-t border-dashed border-slate-100 pr-2 pointer-events-none"
                            style={{
                              bottom: `${100 - pLevel}%`,
                            }}
                          >
                            <span className="absolute right-2 -top-1.5 text-[8px] font-extrabold font-mono text-slate-400">
                              U{pLevel}
                            </span>
                          </div>
                        ))}

                        {gradedResults.map((item, idx) => {
                          const displayPercentile = Math.min(100, Math.max(1, item.percentile));
                          
                          // Determine matching theme color presets
                          let colorClass = "bg-slate-400 hover:bg-slate-500"; // Poor
                          if (displayPercentile <= 5) {
                            colorClass = "bg-indigo-650 bg-indigo-600 hover:bg-indigo-700"; // World Class
                          } else if (displayPercentile <= 25) {
                            colorClass = "bg-indigo-400 hover:bg-indigo-500"; // Excellent
                          } else if (displayPercentile <= 75) {
                            colorClass = "bg-slate-300 hover:bg-slate-400"; // Average
                          }

                          return (
                            <div key={idx} className="relative group flex flex-col items-center w-full max-w-[40px] z-10">
                              {/* Hover data label card */}
                              <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center text-center bg-slate-900 border border-slate-850 text-white text-[10px] py-1.5 px-2.5 rounded-lg shadow-md shrink-0 w-24 select-none pointer-events-none z-30 leading-normal font-medium">
                                <span className="font-extrabold font-mono text-indigo-300 text-[11px]">U{displayPercentile}% Match</span>
                                <span className="text-slate-350 text-slate-300 mt-0.5">{item.measured} {item.unit}</span>
                              </div>

                              {/* Bar itself */}
                              <div className="w-3.5 sm:w-5 bg-slate-55 bg-slate-50 rounded-full h-32 flex items-end overflow-hidden border border-slate-200/50">
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: `${100 - displayPercentile}%` }} // taller is better (less imperfection!)
                                  transition={{ duration: 0.4 }}
                                  className={`w-full rounded-full ${colorClass}`}
                                />
                              </div>

                              <span className="text-[9px] font-bold text-slate-500 truncate mt-1.5 w-full text-center">
                                {item.key}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Detailed parameter list rows */}
                    <div className="space-y-2.5">
                      {gradedResults.map((item) => {
                        let badgeColor = "text-slate-400 bg-slate-50 border-slate-200/45"; // Default Poor
                        if (item.gradeType === "Excellent" || item.gradeType === "Elite") {
                          badgeColor = "text-indigo-650 bg-indigo-50/55 border-indigo-150 font-bold shadow-3xs";
                        } else if (item.gradeType === "Good") {
                          badgeColor = "text-indigo-500 bg-indigo-50/35 border-indigo-100 font-bold";
                        } else if (item.gradeType === "Average") {
                          badgeColor = "text-slate-650 bg-slate-100/50 border-slate-200/50 font-semibold";
                        } else if (item.gradeType === "Below Average") {
                          badgeColor = "text-slate-550 bg-slate-55 bg-slate-50 border-slate-200/40 font-medium";
                        }

                        // Determine index ranges to visualize Uster thresholds
                        return (
                          <div
                            key={item.key}
                            className="bg-slate-50 hover:bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex flex-col gap-3 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-500 text-xs">
                                  {PARAM_INFO[item.key]?.icon || "📊"}
                                </span>
                                <span className="text-sm font-bold text-slate-950">
                                  {item.label}
                                </span>
                              </div>

                              <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border tracking-wide transition-all ${badgeColor}`}>
                                {item.gradeType} · U{item.percentile}%
                              </span>
                            </div>

                            {/* Measured value vs Nominal standard levels list */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-3 rounded-lg border border-slate-150/60 shadow-3xs">
                              <div>
                                <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">Lot Measured</span>
                                <span className="text-sm font-extrabold font-mono text-indigo-600">
                                  {item.measured} <span className="text-[10px] font-bold text-slate-400">{item.unit}</span>
                                </span>
                              </div>

                              {item.percentiles[0] !== undefined && (
                                <div>
                                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">5% Limit (Elite)</span>
                                  <span className="text-sm font-semibold font-mono text-slate-700">
                                    {item.percentiles[0]} <span className="text-[10px] font-normal text-slate-400">{item.unit}</span>
                                  </span>
                                </div>
                              )}

                              {item.percentiles[2] !== undefined && (
                                <div>
                                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">50% Limit (Avg)</span>
                                  <span className="text-sm font-semibold font-mono text-slate-700">
                                    {item.percentiles[2]} <span className="text-[10px] font-normal text-slate-400">{item.unit}</span>
                                  </span>
                                </div>
                              )}

                              {item.percentiles[item.percentiles.length - 1] !== undefined && (
                                <div>
                                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">95% Limit (Poor)</span>
                                  <span className="text-sm font-semibold font-mono text-slate-700">
                                    {item.percentiles[item.percentiles.length - 1]} <span className="text-[10px] font-normal text-slate-400">{item.unit}</span>
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Gauges slider */}
                            <div className="relative h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              {/* Left represent elite, right poor */}
                              <div
                                className="absolute top-0 bottom-0 left-0 bg-emerald-500 rounded-full"
                                style={{
                                  width: `${Math.max(1, 100 - item.percentile)}%`
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="learning_mode"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs"
            >
              {/* Reference lookup browser tab */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 mb-6 gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-slate-950" />
                    USTER® STATISTICS 2023 - Interactive reference
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Select a core yarn configuration count Lot to browse nominal target metrics and standard thresholds instantly.
                  </p>
                </div>

                {/* Browser Study Form */}
                <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 self-start sm:self-auto shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Yarn:</span>
                    <select
                      value={studyYarnType}
                      onChange={(e) => setStudyYarnType(e.target.value as "carded" | "combed")}
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden font-medium"
                    >
                      <option value="carded">Carded Ring yarn</option>
                      <option value="combed">Combed Compact yarn</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Count (Ne):</span>
                    <input
                      type="number"
                      min={studyYarnType === "carded" ? 6 : 20}
                      max={studyYarnType === "carded" ? 40 : 120}
                      value={studyNe}
                      onChange={(e) => setStudyNe(Math.max(1, Number(e.target.value)))}
                      className="w-16 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden font-mono font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Grid representation */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(studyYarnType === "carded" ? cardedStatistics : combedStatistics).map((param) => {
                  const { cols, values } = getPercentilesForCount(param, studyNe);
                  const info = PARAM_INFO[param.key];

                  return (
                    <div
                      key={param.key}
                      onClick={() => setInfoModalKey(param.key)}
                      className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition-all group hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 text-sm">
                            {info?.icon || "📊"}
                          </span>
                          <span className="text-xs font-bold text-slate-950 group-hover:text-indigo-600 transition-colors">
                            {info?.label || param.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0">
                          {param.unit}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-4">
                        {info?.description || param.name}
                      </p>

                      {/* Display percentile table */}
                      <div className="grid grid-cols-5 text-center bg-white p-2 rounded-lg border border-slate-200 font-mono text-[10px]">
                        {cols.map((col, idx) => (
                          <div key={idx} className="border-r border-slate-100 last:border-r-0">
                            <span className="block text-slate-400 text-[8px] font-bold">U{col}%</span>
                            <span className="block font-bold text-slate-950 mt-0.5 text-xs">
                              {values[idx] || "--"}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 text-[10px] font-bold text-indigo-600 hover:underline flex items-center justify-end">
                        Learn index details <ChevronRight className="h-3 w-3 ml-0.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Parameter Detailed Information popup Modal */}
      {infoModalKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            onClick={() => setInfoModalKey(null)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-md rounded-2xl border border-slate-200 p-6 shadow-xl z-10 space-y-4">
            <button
              onClick={() => setInfoModalKey(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            {(() => {
              const pRef = (studyYarnType === "carded" ? cardedStatistics : combedStatistics).find(
                (p) => p.key === infoModalKey
              );
              if (!pRef) return null;
              const info = PARAM_INFO[pRef.key];

              return (
                <div className="space-y-3">
                  <span className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-wider">USTER STUDY DEFINITION</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{info?.icon || "📊"}</span>
                    <h2 className="text-lg font-bold text-slate-950">
                      {info?.label || pRef.name}
                    </h2>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {info?.description || pRef.name}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">
                      Nominal ranges for {studyNe} Ne {studyYarnType}
                    </h4>

                    <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                      <div className="flex justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                        <span>Excellent limit (5%):</span>
                        <span className="font-bold font-mono text-slate-900">
                          {getPercentilesForCount(pRef, studyNe).values[0]} {pRef.unit}
                        </span>
                      </div>
                      <div className="flex justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                        <span>Standard average (50%):</span>
                        <span className="font-bold font-mono text-slate-900">
                          {getPercentilesForCount(pRef, studyNe).values[2] || getPercentilesForCount(pRef, studyNe).values[1]} {pRef.unit}
                        </span>
                      </div>
                      <div className="flex justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                        <span>Lower bound margin (95%):</span>
                        <span className="font-bold font-mono text-slate-900">
                          {getPercentilesForCount(pRef, studyNe).values[pRef.cols.length - 1]} {pRef.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setInfoModalKey(null)}
                      className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-slate-800 transition-colors"
                    >
                      Dismiss View
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Footer Branding line */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1">
          <p>© Uster Technologies AG data source lookup equivalent. Developed for on-site spin mill QC operators.</p>
          <p className="text-[10px] text-slate-400 font-mono">
            Compliance level UTC 2026-05-26 | Secured backend proxies activated.
          </p>
        </div>
      </footer>
    </div>
  );
}
