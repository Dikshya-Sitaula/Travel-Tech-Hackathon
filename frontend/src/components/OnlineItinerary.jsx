import React, { useState } from "react";
import { Sparkles, MapPin, Calendar, Wallet, Heart, Loader2, AlertCircle } from "lucide-react";
import { generateComplexItinerary } from "../services/onlineLlmService";

const BUDGET_OPTIONS = ["budget", "mid-range", "luxury"];

export default function OnlineItinerary() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("mid-range");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [itinerary, setItinerary] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!destination.trim()) {
      setError("Please enter a destination.");
      return;
    }

    setLoading(true);
    setItinerary(null);
    try {
      const result = await generateComplexItinerary(destination, days, budget, preferences);
      setItinerary(result);
    } catch (err) {
      setError(err.message || "Something went wrong generating your itinerary.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-brand-600" />
          Cloud Itinerary Planner
        </h2>
        <p className="text-slate-500 mt-1">
          Powered by a large cloud model — requires an internet connection.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-500" /> Destination
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Kyoto, Japan"
            className="rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-brand-500" /> Duration (days)
          </label>
          <input
            type="number"
            min={1}
            max={30}
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-brand-500" /> Budget
          </label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent bg-white"
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-brand-500" /> Interests
          </label>
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g. food, history, hiking"
            className="rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating itinerary…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate Itinerary
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {itinerary && (
        <div className="mt-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full font-medium">
              {itinerary.destination}
            </span>
            <span className="bg-slate-100 px-3 py-1 rounded-full">{itinerary.days} days</span>
            <span className="bg-slate-100 px-3 py-1 rounded-full capitalize">{itinerary.budget}</span>
            {itinerary.preferences?.map((p) => (
              <span key={p} className="bg-slate-100 px-3 py-1 rounded-full capitalize">
                {p}
              </span>
            ))}
          </div>

          {itinerary.itinerary.map((day) => (
            <div
              key={day.day}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">{day.title}</h3>
                <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
                  {day.estimatedCost}
                </span>
              </div>
              <ul className="space-y-1.5">
                {day.activities.map((act, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-brand-500">•</span>
                    {act}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {itinerary.tips?.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h4 className="font-semibold text-amber-900 mb-2 text-sm">Travel Tips</h4>
              <ul className="space-y-1">
                {itinerary.tips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-amber-800 flex gap-2">
                    <span>💡</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
