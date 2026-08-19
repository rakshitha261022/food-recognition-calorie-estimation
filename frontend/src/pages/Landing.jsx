import React from 'react';
import { Sparkles, ArrowRight, Target, ShieldCheck } from 'lucide-react';

export default function Landing() {
  return (
    <div className="py-12 space-y-20">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-semibold border border-emerald-500/20">
          <Sparkles className="w-4 h-4" /> Next-Gen Dietary AI
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
          Snap Your Plate. <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Know Your Macros.
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          An advanced computer vision system built to isolate food items, approximate volumetric mass, and deliver complete micro/macro nutrient profiles instantly.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3">
          <Target className="w-8 h-8 text-emerald-400" />
          <h3 className="text-lg font-bold">Precision Tracking</h3>
          <p className="text-slate-400 text-sm">Recognizes diverse food groups and measures relative portion volumes.</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3">
          <Sparkles className="w-8 h-8 text-cyan-400" />
          <h3 className="text-lg font-bold">Instant Estimates</h3>
          <p className="text-slate-400 text-sm">Calculates caloric distribution in real time using foundational templates.</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3">
          <ShieldCheck className="w-8 h-8 text-purple-400" />
          <h3 className="text-lg font-bold">Private & Secure</h3>
          <p className="text-slate-400 text-sm">Your visual logs and history matrices remain entirely contextually private.</p>
        </div>
      </div>
    </div>
  );
}