'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HardDrive, ShieldCheck, UserCheck, Lock, Mail, ArrowRight, Sun, Moon, Database, FolderCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ensure light mode is default on initial mount
    document.documentElement.classList.remove('dark');

    // Check if user is already logged in
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push('/dashboard');
        }
      })
      .catch(() => {});
  }, [router]);

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Connection error during login');
      setLoading(false);
    }
  };

  const selectDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-6 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      
      {/* Top Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 neu-outset flex items-center justify-center bg-white rounded-2xl">
            <img src="/stda-logo.png" alt="SENSO TECH DESIGN AND AUTOMATION" className="h-10 w-auto object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-800 dark:text-white">
              STDA <span className="text-indigo-600 dark:text-indigo-400">WORKSPACE</span>
            </h1>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              SENSO TECH DESIGN &amp; AUTOMATION
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleTheme}
          className="w-11 h-11 neu-button flex items-center justify-center text-gray-700 dark:text-yellow-400"
          title="Toggle Neomorphic Light/Dark Theme"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Form Center Box */}
      <main className="max-w-md w-full mx-auto my-auto animate-fade-in">
        <div className="neu-outset p-8 sm:p-10 rounded-neu border border-white/20 relative">
          
          <div className="text-center mb-8">
            <div className="p-4 neu-outset mx-auto flex items-center justify-center bg-white rounded-3xl mb-4 max-w-[200px]">
              <img src="/stda-logo.png" alt="SENSO TECH DESIGN AND AUTOMATION" className="h-16 w-auto object-contain" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">
              SENSO TECH DESIGN &amp; AUTOMATION
            </h2>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              STDA Secure Member Console
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs text-center font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@stda.io"
                  className="w-full neu-input px-4 py-3 text-xs text-gray-800 dark:text-white pr-10"
                  required
                />
                <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full neu-input px-4 py-3 text-xs text-gray-800 dark:text-white pr-10"
                  required
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full neu-button py-3.5 px-6 font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 flex items-center justify-center gap-2 mt-6 rounded-2xl"
            >
              {loading ? (
                <span>Authenticating with Neon DB...</span>
              ) : (
                <>
                  <span>Sign In to STDA Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Security Info */}
          <div className="mt-8 pt-4 border-t border-gray-300/30 dark:border-gray-700/30 flex items-center justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-indigo-400" /> Neon PostgreSQL
            </span>
            <span className="flex items-center gap-1">
              <FolderCheck className="w-3.5 h-3.5 text-emerald-400" /> Scoped SDTA Folder
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center py-4 text-xs text-gray-500 font-medium">
        © 2026 SENSO TECH DESIGN &amp; AUTOMATION (STDA) • Built with Next.js, Neon DB &amp; Google Cloud API
      </footer>
    </div>
  );
}
