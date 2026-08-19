import React, { useState, useEffect } from 'react';
import { Activity, Flame, Apple, Wheat, Cookie, Droplet, Loader2, Plus, Minus } from 'lucide-react';

export default function Dashboard({ userContext }) {
  const [todaySummary, setTodaySummary] = useState({ 
    consumedCalories: 0, 
    consumedProtein: 0,
    consumedCarbs: 0,
    consumedFat: 0 
  });
  const [isLoading, setIsLoading] = useState(true);

  // -------------------------------------------------------------------------
  // 💧 PERSISTED WATER INTAKE STATE
  // -------------------------------------------------------------------------
  const [waterIntake, setWaterIntake] = useState(() => {
    const saved = localStorage.getItem('nutrivision_water');
    return saved ? parseFloat(saved) : 1.2;
  });

  useEffect(() => {
    localStorage.setItem('nutrivision_water', waterIntake.toString());
  }, [waterIntake]);

  // -------------------------------------------------------------------------
  // 📊 FETCH TODAY'S SUMMARY FROM FLASK
  // -------------------------------------------------------------------------
  useEffect(() => {
    const fetchTodaySummary = async () => {
      if (!userContext?.email) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:5000/api/meals/today?email=${encodeURIComponent(userContext.email)}`);
        const data = await response.json();

        if (response.ok) {
          setTodaySummary(data);
        }
      } catch (err) {
        console.error("Failed to load today's summary:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodaySummary();
  }, [userContext]);

  // Dynamic Caps calculated from user context or default standards
  const calorieCap = userContext?.calorieCap || 2200;
  const proteinCap = userContext?.proteinCap || 120;
  const carbCap = Math.round((calorieCap * 0.5) / 4); // 50% calories from carbs
  const fatCap = Math.round((calorieCap * 0.3) / 9);  // 30% calories from fat

  // -------------------------------------------------------------------------
  // 💡 ADVISORY LOGIC FOR ALERT BANNERS
  // -------------------------------------------------------------------------
  const getDietaryAdvice = (consumed, target) => {
    if (target === 0) return null;
    const ratio = consumed / target;

    if (ratio === 0) {
      return {
        title: "⚡ Ready for Your First Meal?",
        message: "No meals logged today yet. Snap your meal in the Scanner page to analyze metrics!",
        style: "bg-slate-900 border-slate-800 text-slate-300"
      };
    } else if (ratio < 0.5) {
      return {
        title: "🔵 Caloric Intake Low",
        message: "You've consumed less than 50% of your daily energy target. Ensure you log your upcoming meals to keep energy levels high!",
        style: "bg-blue-500/10 border-blue-500/30 text-blue-300"
      };
    } else if (ratio >= 0.85 && ratio <= 1.05) {
      return {
        title: "🟢 Perfect Diet Balance",
        message: "Spot on! You are maintaining your ideal calorie target window today. Excellent job!",
        style: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
      };
    } else if (ratio > 1.05 && ratio <= 1.2) {
      return {
        title: "🟠 Approaching Upper Limit",
        message: "You are slightly above your recommended calorie goal. Keep your next snacks light!",
        style: "bg-amber-500/10 border-amber-500/30 text-amber-300"
      };
    } else {
      return {
        title: "🔴 High Calorie Limit Alert",
        message: "You have exceeded your daily calorie target. Consider balancing with light physical activity or adjusting your target tomorrow.",
        style: "bg-red-500/10 border-red-500/30 text-red-300"
      };
    }
  };

  const advice = getDietaryAdvice(todaySummary.consumedCalories, calorieCap);

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Activity className="text-emerald-400 w-8 h-8" />
          Command Center
        </h1>
        <p className="text-slate-400 mt-1">
          Welcome back, <span className="text-emerald-400 font-semibold">{userContext?.name || 'User'}</span>. Here is your real-time breakdown based on your biometrics.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 flex justify-center items-center text-slate-500 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> Updating dashboard...
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* DYNAMIC ALERT BANNER */}
          {advice && (
            <div className={`p-5 rounded-2xl border ${advice.style} flex flex-col gap-1 transition-all shadow-lg`}>
              <h3 className="font-bold text-sm tracking-wide">{advice.title}</h3>
              <p className="text-xs opacity-90 leading-relaxed">{advice.message}</p>
            </div>
          )}

          {/* METRIC CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Energy Consumed Card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-red-500/10 text-red-400 rounded-xl shrink-0">
                <Flame className="w-6 h-6" />
              </div>
              <div className="w-full">
                <span className="block text-xs uppercase font-bold text-slate-500">Energy Consumed</span>
                <span className="text-2xl font-black text-slate-100">
                  {todaySummary.consumedCalories} <span className="text-sm font-normal text-slate-400">/ {calorieCap} kcal</span>
                </span>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-red-400 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (todaySummary.consumedCalories / calorieCap) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* 2. Protein Target Card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
                <Apple className="w-6 h-6" />
              </div>
              <div className="w-full">
                <span className="block text-xs uppercase font-bold text-slate-500">Protein Target</span>
                <span className="text-2xl font-black text-slate-100">
                  {todaySummary.consumedProtein} <span className="text-sm font-normal text-slate-400">/ {proteinCap} g</span>
                </span>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (todaySummary.consumedProtein / proteinCap) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* 3. Carbohydrates Card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl shrink-0">
                <Wheat className="w-6 h-6" />
              </div>
              <div className="w-full">
                <span className="block text-xs uppercase font-bold text-slate-500">Carbohydrates</span>
                <span className="text-2xl font-black text-slate-100">
                  {todaySummary.consumedCarbs || 0} <span className="text-sm font-normal text-slate-400">/ {carbCap} g</span>
                </span>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-cyan-400 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, ((todaySummary.consumedCarbs || 0) / carbCap) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* 4. Healthy Fats Card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
                <Cookie className="w-6 h-6" />
              </div>
              <div className="w-full">
                <span className="block text-xs uppercase font-bold text-slate-500">Fats Limit</span>
                <span className="text-2xl font-black text-slate-100">
                  {todaySummary.consumedFat || 0} <span className="text-sm font-normal text-slate-400">/ {fatCap} g</span>
                </span>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, ((todaySummary.consumedFat || 0) / fatCap) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* 5. Hydration Progress Card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 md:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-4 w-full">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl shrink-0">
                  <Droplet className="w-6 h-6" />
                </div>
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <span className="block text-xs uppercase font-bold text-slate-500">Hydration Progress</span>
                    <span className="text-xs font-mono text-blue-400 font-semibold">
                      {Math.round((waterIntake / 3.5) * 100)}% Goal
                    </span>
                  </div>
                  <span className="text-2xl font-black text-slate-100">
                    {waterIntake.toFixed(2)} <span className="text-sm font-normal text-slate-400">/ 3.5 L</span>
                  </span>
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-blue-400 h-full transition-all duration-300" 
                      style={{ width: `${Math.min(100, (waterIntake / 3.5) * 100)}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Quick Log Buttons */}
              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0">
                <button
                  onClick={() => setWaterIntake(prev => Math.max(0, parseFloat((prev - 0.25).toFixed(2))))}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-xl border border-slate-800 transition cursor-pointer"
                  title="Undo / Subtract 250ml"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setWaterIntake(prev => parseFloat((prev + 0.25).toFixed(2)))}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-bold rounded-xl border border-blue-500/30 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Log Glass (+250ml)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}