import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, Sparkles, Table, Eye, AlertCircle, ChevronRight } from 'lucide-react';

export default function Scanner({ onProceedToAnalytics }) {
  const [isScanning, setIsScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRawFile(file);
      setError('');
      setPredictions(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartScan = async () => {
    if (!rawFile) return;
    setIsScanning(true);
    setError('');
    setPredictions(null);

    const formData = new FormData();
    formData.append('image', rawFile);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/scan', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'AI processing pipeline failed.');
      }

      setPredictions(data.predictions);
    } catch (err) {
      setError(err.message || 'Unable to communicate with the Flask AI engine.');
    } finally {
      setIsScanning(false);
    }
  };

  const totals = predictions ? predictions.reduce((acc, item) => ({
    calories: acc.calories + (item.calories || 0),
    protein: acc.protein + (item.protein || 0),
    carbs: acc.carbs + (item.carbs || 0),
    fat: acc.fat + (item.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 }) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Camera className="text-emerald-400 w-8 h-8" />
            AI Vision Engine
          </h1>
          <p className="text-slate-400 mt-1">
            Snap or upload a photo of your meal. Our computer vision models will identify food items and isolate metrics.
          </p>
        </div>
        
        {imagePreview && !isScanning && !predictions && (
          <button 
            onClick={handleStartScan}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            Analyze Calories
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-medium text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={predictions ? "lg:col-span-1 space-y-4" : "lg:col-span-2 space-y-4"}>
          <div className="relative aspect-[4/3] w-full bg-slate-900 border-2 border-dashed border-slate-800 rounded-2xl overflow-hidden flex flex-col items-center justify-center group transition-all">
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Food Upload" className="w-full h-full object-cover" />
                
                {isScanning && (
                  <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-t-emerald-400 animate-spin"></div>
                    </div>
                    <p className="text-emerald-400 font-mono tracking-widest text-xs font-semibold uppercase animate-pulse">
                      LLaVA Vision Analysis...
                    </p>
                  </div>
                )}

                {!isScanning && (
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button 
                      onClick={() => fileInputRef.current.click()} 
                      className="bg-slate-900/80 hover:bg-slate-900 text-white p-3 rounded-xl backdrop-blur-md border border-slate-700 transition cursor-pointer"
                      title="Replace Image"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-8 space-y-4">
                <div className="mx-auto w-16 h-16 bg-slate-800/50 text-slate-400 flex items-center justify-center rounded-2xl border border-slate-700 group-hover:text-emerald-400 group-hover:border-emerald-500/50 transition-all">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Click to upload
                  </button>
                  <span className="text-slate-500"> or drag and drop your meal photo</span>
                </div>
                <p className="text-xs text-slate-500 font-mono">Supports JPEG, PNG, WEBP (Max 10MB)</p>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        <div className={predictions ? "lg:col-span-2 space-y-6" : "space-y-6"}>
          {predictions ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">Calories</span>
                  <span className="text-lg font-black text-slate-100">{totals.calories} kcal</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                  <span className="block text-[10px] text-emerald-400 font-bold uppercase">Protein</span>
                  <span className="text-lg font-black text-slate-100">{totals.protein}g</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                  <span className="block text-[10px] text-cyan-400 font-bold uppercase">Carbs</span>
                  <span className="text-lg font-black text-slate-100">{totals.carbs}g</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                  <span className="block text-[10px] text-amber-400 font-bold uppercase">Fat</span>
                  <span className="text-lg font-black text-slate-100">{totals.fat}g</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 bg-slate-900/50 border-b border-slate-800 flex items-center gap-2">
                  <Table className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200">Segmented Ingredient Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-bold text-slate-400 uppercase">
                        <th className="p-4">Food Item</th>
                        <th className="p-4 text-center">Est. Weight</th>
                        <th className="p-4 text-center">Calories</th>
                        <th className="p-4 text-center">Protein</th>
                        <th className="p-4 text-center">Carbs</th>
                        <th className="p-4 text-center">Fat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {predictions.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition">
                          <td className="p-4 font-semibold text-slate-200 capitalize">{item.name}</td>
                          <td className="p-4 text-center font-mono text-xs">{item.weight}g</td>
                          <td className="p-4 text-center font-mono text-xs text-red-400">{item.calories} kcal</td>
                          <td className="p-4 text-center font-mono text-xs text-emerald-400">{item.protein}g</td>
                          <td className="p-4 text-center font-mono text-xs text-cyan-400">{item.carbs}g</td>
                          <td className="p-4 text-center font-mono text-xs text-amber-400">{item.fat}g</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                onClick={() => onProceedToAnalytics && onProceedToAnalytics(predictions)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold py-4 rounded-xl shadow-lg shadow-emerald-400/10 transition cursor-pointer"
              >
                Proceed to Calibrate & Log
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" /> AI Optimization Hints
                </h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>Ensure the plate is fully visible from a top-down or 45-degree angle.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>Avoid dark environments; bright lighting produces maximum prediction accuracy.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>Separate overlapping foods when possible so the localization metrics work optimally.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 text-amber-200 rounded-2xl p-5 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1 leading-relaxed">
                  <span className="font-semibold text-amber-300 block">System Parameter Notice</span>
                  Mass estimation is calculated based on standard volumetric templates matching the detected food class labels. Actual food preparation density may vary.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}