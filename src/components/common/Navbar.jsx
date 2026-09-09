import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { SEED_STUDENTS, SEED_ADMIN } from '../../services/seedData';
import {
  Cloud,
  Sun,
  Moon,
  Bell,
  Search,
  Check,
  ChevronDown,
  LogOut,
  User,
  ShieldCheck,
  Sparkles,
  Menu,
  X,
  Layers,
} from 'lucide-react';
import { Button } from './Button';
import { clsx } from 'clsx';

export function Navbar({ onNavigate, activePage, toggleSidebar, isSidebarOpen }) {
  const { currentUser, logout, switchDemoUser, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const demoAccounts = [...SEED_STUDENTS.slice(0, 3), SEED_ADMIN];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && onNavigate) {
      onNavigate('projects', { search: searchQuery });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-4">
          {/* Left: Sidebar Toggle & Brand */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-white/10"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <div
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 p-0.5 shadow-glow-sm group-hover:shadow-glow-cyan transition-all duration-300">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-display font-extrabold text-white tracking-tight">
                    SkillMatch
                  </span>
                  <span className="text-xs px-1.5 py-0.2 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/40 font-mono">
                    Cloud
                  </span>
                </div>
                <span className="hidden sm:inline text-[10px] text-slate-400 font-medium tracking-wide">
                  Find the right project. Build the right team.
                </span>
              </div>
            </div>
          </div>

          {/* Middle: Global Search (Desktop) */}
          {currentUser && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, skills, technologies..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all"
                />
              </form>
            </div>
          )}

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 1-Click Demo Profile Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowDemoMenu(!showDemoMenu);
                  setShowNotifMenu(false);
                  setShowUserMenu(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-brand-500/20 hover:from-purple-500/30 hover:to-brand-500/30 border border-purple-500/30 text-purple-200 text-xs font-semibold shadow-glow-sm transition-all"
                title="Switch Demo Profile"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                <span className="hidden sm:inline">Demo Switcher</span>
                <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel border border-white/10 shadow-card-3d p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5">
                    Switch Active Persona
                  </div>
                  <div className="mt-1 space-y-1">
                    {demoAccounts.map((account) => {
                      const isSelected = currentUser?.id === account.id;
                      return (
                        <button
                          key={account.id}
                          onClick={() => {
                            switchDemoUser(account.id);
                            setShowDemoMenu(false);
                          }}
                          className={clsx(
                            "w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-colors",
                            isSelected
                              ? "bg-brand-500/20 text-white font-semibold border border-brand-500/40"
                              : "hover:bg-white/5 text-slate-300"
                          )}
                        >
                          <img
                            src={account.avatar}
                            alt={account.name}
                            className="w-7 h-7 rounded-lg object-cover"
                          />
                          <div className="flex-1 truncate">
                            <p className="truncate text-xs text-white">{account.name}</p>
                            <p className="text-[10px] text-slate-400 capitalize">
                              {account.role === 'admin' ? 'Faculty Admin' : `${account.year || 'Student'}`}
                            </p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-brand-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Notifications Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifMenu(!showNotifMenu);
                    setShowDemoMenu(false);
                    setShowUserMenu(false);
                  }}
                  className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-white/10 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-glow-cyan animate-pulse" />
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel border border-white/10 shadow-card-3d p-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-display font-bold text-white">Notifications</span>
                      <span className="text-[10px] text-cyan-400 font-medium">{unreadCount} new</span>
                    </div>

                    <div className="mt-2 max-h-64 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No notifications yet.</p>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={clsx(
                              "p-2.5 rounded-xl text-xs cursor-pointer transition-colors border",
                              notif.read
                                ? "bg-slate-900/40 border-transparent text-slate-400"
                                : "bg-brand-500/10 border-brand-500/20 text-slate-200"
                            )}
                          >
                            <p className="font-semibold text-white text-xs mb-0.5">{notif.title}</p>
                            <p className="text-[11px] text-slate-300 leading-tight">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setShowNotifMenu(false);
                        onNavigate('notifications');
                      }}
                      className="w-full mt-2 pt-2 border-t border-white/10 text-center text-xs font-semibold text-brand-400 hover:text-brand-300"
                    >
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Login CTA */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowDemoMenu(false);
                    setShowNotifMenu(false);
                  }}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 transition-colors"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover"
                  />
                  <span className="hidden lg:inline text-xs font-semibold text-slate-200 truncate max-w-[100px]">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-white/10 shadow-card-3d p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="p-2.5 border-b border-white/5">
                      <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <span className={clsx(
                        "mt-1.5 inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider",
                        isAdmin ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      )}>
                        {isAdmin ? 'Faculty Admin' : 'Student'}
                      </span>
                    </div>

                    <div className="mt-1 space-y-0.5 text-xs">
                      {!isAdmin && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onNavigate('profile');
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5"
                        >
                          <User className="w-4 h-4 text-brand-400" />
                          My Skill Profile
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onNavigate('admin_dashboard');
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-400" />
                          Admin Console
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate('settings');
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5"
                      >
                        <Layers className="w-4 h-4 text-slate-400" />
                        Settings
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          onNavigate('landing');
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => onNavigate('login')}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={() => onNavigate('register')}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
