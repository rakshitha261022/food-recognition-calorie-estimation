import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, Utensils, Loader2, LayoutDashboard } from 'lucide-react';

export default function Journal({ userContext, onBackToDashboard }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      if (!userContext?.email) return;

      try {
        const response = await fetch(`http://127.0.0.1:5000/api/meals?email=${encodeURIComponent(userContext.email)}`);
        const data = await response.json();

        if (response.ok) {
          setLogs(data.meals || []);
        }
      } catch (err) {
        console.error("Error fetching dietary logs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, [userContext]);

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header with Back to Dashboard Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <CalendarDays className="text-purple-400 w-8 h-8" />
            Dietary Journal
          </h1>
          <p className="text-slate-400 mt-1">A historical index of your computer vision logs over time.</p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 font-bold px-5 py-3 rounded-xl shadow-lg hover:border-emerald-400 transition cursor-pointer shrink-0"
        >
          <LayoutDashboard className="w-5 h-5" />
          Back to Dashboard
        </button>
      </div>

      {/* Timeline List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400">
          Logged Timeline Entries
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center items-center text-slate-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-purple-400" /> Loading dietary logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No logged meals found. Scan your meal in the <span className="text-emerald-400 font-semibold">Scanner</span> page to start tracking!
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {logs.map((log) => {
              const itemNames = log.items ? log.items.map(i => i.name).join(', ') : log.title;
              return (
                <div key={log.id} className="p-6 flex justify-between items-center hover:bg-slate-950/40 transition">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-800 text-slate-400 rounded-xl">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200 capitalize">{log.title}</h4>
                      <p className="text-sm text-slate-500 mt-0.5 capitalize">{itemNames}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="block text-sm font-mono text-emerald-400 font-bold">{log.totalCalories} kcal</span>
                    <span className="flex items-center justify-end text-xs text-slate-500 gap-1">
                      <Clock className="w-3 h-3" /> {log.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}