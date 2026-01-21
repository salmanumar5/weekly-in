
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    
    onLogin({
      id: `u_${Date.now()}`,
      name,
      email,
      avatar: `https://picsum.photos/seed/${name}/40/40`
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-6">
      <div className="w-full max-w-md space-y-12 text-center">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-white rounded-[24px] apple-shadow flex items-center justify-center mx-auto text-blue-600 border border-white">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-black">Weekly Tracker</h1>
          <p className="text-lg text-black/40 font-medium">Plan your hybrid work week with ease.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/70 p-10 rounded-[40px] border border-white apple-shadow space-y-6">
          <div className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bold uppercase tracking-widest text-black/30 ml-2">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full h-14 px-6 bg-black/[0.03] border-none rounded-2xl text-base font-medium placeholder:text-black/20 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="e.g. John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bold uppercase tracking-widest text-black/30 ml-2">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full h-14 px-6 bg-black/[0.03] border-none rounded-2xl text-base font-medium placeholder:text-black/20 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="john@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full h-14 bg-black text-white rounded-[20px] text-base font-bold tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10"
          >
            Get Started
          </button>
          
          <p className="text-[11px] text-black/30 font-medium px-4 leading-relaxed uppercase tracking-widest">
            By signing in, you agree to our <span className="underline decoration-black/10 cursor-pointer">Terms</span> and <span className="underline decoration-black/10 cursor-pointer">Privacy Policy</span>.
          </p>
        </form>

        <div className="pt-8">
          <p className="text-sm font-bold text-black/20 tracking-tighter uppercase">Minimalist • Efficient • Transparent</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
