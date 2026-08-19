import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [signupStep, setSignupStep] = useState(1); // 1: Credentials, 2: Biometrics
  const [error, setError] = useState(''); // Error handling banner state
  
  // Account Information
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Biometric Information
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('maintain');
  const [activity, setActivity] = useState('1.375'); // Default active multiplier

  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Please fill in all identity fields before proceeding.');
      return;
    }
    setSignupStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // --- SIGN IN LOGIC (Real Backend MongoDB Pipeline) ---
    if (isLogin) {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Login verification failed.');
        }

        // Successfully authenticated! Pass the database profile up to application state
        onLoginSuccess({
          name: data.user.name,
          email: data.user.email,
          calorieCap: data.user.calorieCap,
          proteinCap: data.user.proteinCap,
          weight: 70 // default fallback layout value for frontend visualization elements
        });

      } catch (err) {
        setError(err.message || 'Unable to connect to login services. Is the backend running?');
      }
      return;
    }

    // --- SIGN UP LOGIC (Real Backend MongoDB Pipeline) ---
    try {
      const payload = {
        name,
        email,
        password,
        age: parseInt(age),
        gender,
        height: parseFloat(height),
        weight: parseFloat(weight),
        goal,
        activity: parseFloat(activity)
      };

      const response = await fetch('http://127.0.0.1:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register account.');
      }

      // Pass the backend calculated parameters directly up to application state
      onLoginSuccess({
        name: data.user.name,
        email: data.user.email,
        calorieCap: data.user.calorieCap,
        proteinCap: data.user.proteinCap,
        weight: parseFloat(weight)
      });

    } catch (err) {
      setError(err.message || 'Connecting to backend service failed. Is Flask running?');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">
            {isLogin ? 'Welcome Back' : signupStep === 1 ? 'Create Account' : 'Biometric Profile'}
          </h2>
          <p className="text-slate-400 text-sm">
            {isLogin ? 'Access your tracking hub' : signupStep === 1 ? 'Step 1: Security credentials' : 'Step 2: Calibrate target algorithms'}
          </p>
        </div>

        {/* Dynamic Error Message Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-medium text-center">
            {error}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
              <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-emerald-500" />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold py-3 rounded-xl transition text-sm">Sign In <ArrowRight className="w-4 h-4" /></button>
          </form>
        ) : (
          <form onSubmit={signupStep === 1 ? handleNextStep : handleSubmit} className="space-y-4">
            {signupStep === 1 ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                  <input type="text" required placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                  <input type="email" required placeholder="name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                  <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 text-white font-bold py-3 rounded-xl text-sm">Continue Profile <ArrowRight className="w-4 h-4" /></button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-bold text-slate-400 uppercase block mb-1">Age</label><input type="number" required placeholder="22" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-sm focus:outline-none" /></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase block mb-1">Gender</label><select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-sm focus:outline-none"><option value="male">Male</option><option value="female">Female</option></select></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-bold text-slate-400 uppercase block mb-1">Height (cm)</label><input type="number" required placeholder="175" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-sm focus:outline-none" /></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase block mb-1">Weight (kg)</label><input type="number" required placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-sm focus:outline-none" /></div>
                </div>
                <div><label className="text-xs font-bold text-slate-400 uppercase block mb-1">Fitness Goal</label><select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-sm focus:outline-none"><option value="lose">Caloric Deficit (Fat Loss)</option><option value="maintain">Maintain Current Weight</option><option value="gain">Caloric Surplus (Muscle Gain)</option></select></div>
                <div><label className="text-xs font-bold text-slate-400 uppercase block mb-1">Activity Index</label><select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-sm focus:outline-none"><option value="1.2">Sedentary (No Exercise)</option><option value="1.375">Lightly Active (1-3 Days/Wk)</option><option value="1.55">Moderately Active (3-5 Days/Wk)</option></select></div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setSignupStep(1)} className="bg-slate-950 border border-slate-800 text-slate-400 px-4 rounded-xl flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></button>
                  <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold py-3 rounded-xl text-sm">Register Account <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </form>
        )}
        <div className="text-center pt-2 border-t border-slate-800/60">
          <button onClick={() => { setIsLogin(!isLogin); setSignupStep(1); setError(''); }} className="text-xs text-slate-400 hover:text-emerald-400 underline">{isLogin ? "Don't have an account? Sign up" : 'Already registered? Log in'}</button>
        </div>
      </div>
    </div>
  );
}