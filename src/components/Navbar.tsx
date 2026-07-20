'use client';

import React from 'react';
import { Shield, Sun, Moon, LogOut, UserCheck, HardDrive, Cpu } from 'lucide-react';

interface NavbarProps {
  user: any;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  darkMode,
  onToggleDarkMode,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-6 py-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto neu-outset px-6 py-3.5 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 neu-outset flex items-center justify-center bg-white rounded-xl">
            <img src="/stda-logo.png" alt="SENSO TECH DESIGN AND AUTOMATION" className="h-9 w-auto object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-gray-800 dark:text-white">
                STDA <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">HUB</span>
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold border border-indigo-500/20 hidden md:inline-block">
                Neon DB
              </span>
            </div>
            <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
              SENSO TECH DESIGN &amp; AUTOMATION
            </p>
          </div>
        </div>

        {/* Right Section: Theme Toggle & User Info */}
        <div className="flex items-center gap-4">
          {/* Neomorphic Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="w-11 h-11 neu-button flex items-center justify-center text-gray-700 dark:text-yellow-400 hover:scale-105 transition-transform"
            title={darkMode ? "Switch to Neomorphic Light Mode" : "Switch to Neomorphic Dark Mode"}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Profile Badge */}
          {user && (
            <div className="flex items-center gap-3 neu-inset px-3.5 py-1.5 rounded-full">
              <img
                src={user.photo}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-white/20 shadow-sm"
              />
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-100">{user.name}</p>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                    user.role === 'ADMIN'
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                  {user.jobTitle}
                </p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="neu-button px-4 py-2 flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
