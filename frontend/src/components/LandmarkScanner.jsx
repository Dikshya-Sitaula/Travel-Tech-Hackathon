import React, { useRef, useState } from "react";
import { Camera, Upload, Loader2, AlertCircle, MapPinned, Sparkles } from "lucide-react";
import { recognizeLandmark } from "../services/onlineLlmService";

export default function LandmarkScanner() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  function handleFileSelected(selected) {
    if (!selected) return;
    setError("");
    setResult(null);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  async function handleScan() {
    if (!file) {
      setError("Please choose or capture a photo first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await recognizeLandmark(file);
      setResult(data);
    } catch (err) {
      setError(err.message || "Landmark recognition failed.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <MapPinned className="w-6 h-6 text-brand-600" />
          Landmark Scanner
        </h2>
        <p className="text-slate-500 mt-1">
          Snap or upload a photo to identify a landmark — powered by a cloud vision model.
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Selected landmark preview"
              className="w-full h-72 object-cover rounded-xl border border-slate-200"
            />
            <button
              onClick={reset}
              className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full shadow"
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="h-72 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400">
            <Camera className="w-10 h-10 mb-2" />
            <p className="text-sm">No photo selected yet</p>
          </div>
        )}

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelected(e.target.files?.[0])}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFileSelected(e.target.files?.[0])}
          />

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <Camera className="w-4 h-4" /> Take Photo
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-medium px-4 py-2.5 rounded-xl border border-slate-300 transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload Image
          </button>
        </div>

        <button
          type="button"
          onClick={handleScan}
          disabled={!file || loading}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing photo…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Identify Landmark
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{result.landmarkName}</h3>
              <p className="text-sm text-slate-500">{result.location}</p>
            </div>
            <span className="text-xs font-medium bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full whitespace-nowrap">
              {Math.round(result.confidence * 100)}% match
            </span>
          </div>

          <p className="text-sm text-slate-600">{result.funFact}</p>

          <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-brand-800 mb-1">Itinerary Idea</p>
            <p className="text-sm text-brand-900">{result.relatedItineraryIdea}</p>
          </div>
        </div>
      )}
    </div>
  );
}
