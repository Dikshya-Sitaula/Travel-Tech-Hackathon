import React, { useState } from "react";
import { Cloud, Cpu, ScanLine, Compass } from "lucide-react";
import OnlineItinerary from "./components/OnlineItinerary";
import OfflineChat from "./components/OfflineChat";
import LandmarkScanner from "./components/LandmarkScanner";

const TABS = [
  { id: "online", label: "Cloud Itinerary Planner", icon: Cloud },
  { id: "offline", label: "Offline AI Assistant", icon: Cpu },
  { id: "scanner", label: "Landmark Scanner", icon: ScanLine },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("online");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Wayfinder</h1>
            <p className="text-xs text-slate-400 leading-tight">Hybrid Online/Offline Travel AI</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar nav (stacks on top for mobile) */}
        <nav className="md:w-64 flex-shrink-0">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors text-left ${
                    isActive
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Active panel */}
        <main className="flex-1 min-w-0">
          {activeTab === "online" && <OnlineItinerary />}
          {activeTab === "offline" && <OfflineChat />}
          {activeTab === "scanner" && <LandmarkScanner />}
        </main>
      </div>
    </div>
  );
}
