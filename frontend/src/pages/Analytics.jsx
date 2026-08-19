import React, { useState, useEffect } from 'react';
import { BarChart3, Sliders, ChevronRight, Activity, Trash2 } from 'lucide-react';

export default function Analytics({ scannedData, userContext, onNavigate }) {
  const [portions, setPortions] = useState([]);
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    if (scannedData && Array.isArray(scannedData)) {
      const formatted = scannedData.map((item, index) => {
        const w = item.weight || 150;
        const cal = item.calories || 200;
        const p = item.protein || 10;
        const c = item.carbs || 20;
        const f = item.fat || 5;

        return {
          id: index + 1,
          name: item.name,
          weight: w,
          calories: cal,
          protein: p,
          carbs: c,
          fat: f,
          baseCal: cal / w,
          baseProt: p / w,
          baseCarb: c / w,
          baseFat: f / w,
        };
      });
      setPortions(formatted);
    }
  }, [scannedData]);

  const handleWeightChange = (id, newWeight) => {
    setPortions(portions.map(item => {
      if (item.id === id) {
        return {
          ...item,
          weight: Math.round(newWeight),
          calories: Math.round(item.baseCal * newWeight),
          protein: Math.round(item.baseProt * newWeight),
          carbs: Math.round(item.baseCarb * newWeight),
          fat: Math.round(item.baseFat * newWeight),
        };
      }
      return item;
    }));
  };

  const handleDeleteItem = (id) => {
    setPortions(portions.filter(item => item.id !== id));
  };

  const totalCalories = portions.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = portions.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = portions.reduce((sum, item) => sum + item.carbs, 0);
  const totalFat = portions.reduce((sum, item) => sum + item.fat, 0);

  const handleLogMeal = async () => {
    if (!userContext?.email) {
      alert("User context missing. Please sign in again.");
      return;
    }

    setIsLogging(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/meals/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userContext.email,
          items: portions,
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat
        })
      });

      if (!response.ok) {
        throw new Error("Failed to persist meal in MongoDB");
      }

      // Switch view to Journal tab upon success
      if (onNavigate) {
        onNavigate('journal');
      }
    } catch (err) {
      alert(err.message || "Could not log meal.");
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <BarChart3 className="text-cyan-400 w-8 h-8" />
          AI Macro Analysis
        </h1>
        <p className="text-slate-400 mt-1">
          Review detected items, calibrate serving weights, and log them into your dietary record.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              Calibrate Portion Weights
            </h2>
            
            {portions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-medium">
                No active scan loaded. Upload and scan a photo in the <span className="text-emerald-400">Scanner</span> tab first!
              </div>
            ) : (
              <div className="space-y-6">
                {portions.map((item) => (
                  <div key={item.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-200 capitalize">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {item.weight}g
                        </span>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-slate-500 hover:text-red-400 transition cursor-pointer p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <input 
                      type="range" 
                      min="10" 
                      max="500" 
                      value={item.weight}
                      onChange={(e) => handleWeightChange(item.id, Number(e.target.value))}
                      className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                    
                    <div className="flex gap-4 text-xs text-slate-400 font-mono">
                      <span>🔥 {item.calories} kcal</span>
                      <span>🥩 P: {item.protein}g</span>
                      <span>🌾 C: {item.carbs}g</span>
                      <span>🥑 F: {item.fat}g</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Meal Aggregates
            </h3>
            <div className="mt-4">
              <span className="text-5xl font-black text-white tracking-tight">{totalCalories}</span>
              <span className="text-slate-400 ml-2 font-medium">Total kcal</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-slate-800/60 text-center">
              <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                <span className="block text-xs text-slate-500 uppercase font-bold">Protein</span>
                <span className="text-base font-bold text-slate-200">{totalProtein}g</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                <span className="block text-xs text-slate-500 uppercase font-bold">Carbs</span>
                <span className="text-base font-bold text-slate-200">{totalCarbs}g</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                <span className="block text-xs text-slate-500 uppercase font-bold">Fat</span>
                <span className="text-base font-bold text-slate-200">{totalFat}g</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogMeal}
            disabled={portions.length === 0 || isLogging}
            className="w-full flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold py-4 rounded-xl shadow-lg shadow-emerald-400/10 transition cursor-pointer"
          >
            {isLogging ? "Logging Meal..." : "Log Meal to Journal"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}