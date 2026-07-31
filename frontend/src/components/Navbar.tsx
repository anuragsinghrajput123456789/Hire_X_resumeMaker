import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Menu, 
  X, 
  FileText, 
  Search, 
  Globe, 
  Mail, 
  MessageCircle,
  Brain,
  LogOut,
  User,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const logout = authContext?.logout || (() => {});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/generator', label: 'Generator', icon: FileText, description: 'Create Resume' },
    { path: '/analyzer', label: 'Analyzer', icon: Search, description: 'Analyze & Improve' },
    { path: '/job-match', label: 'Job Portals', icon: Globe, description: 'Find Perfect Jobs' },
    { path: '/cold-email', label: 'Cold Email', icon: Mail, description: 'Write Emails' },
    { path: '/cover-letter', label: 'Cover Letter', icon: Sparkles, description: 'Write Cover Letters' },
    { path: '/chat', label: 'AI Chat', icon: MessageCircle, description: 'Career Assistant' }
  ];

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4",
      scrolled 
        ? "py-3 bg-[#050816]/75 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)]" 
        : "py-6 bg-transparent"
    )}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group select-none"
          >
            <div className="p-1.5 bg-gradient-to-br from-[#00F2FE] via-[#8B5CF6] to-[#EC4899] rounded-lg shadow-[0_0_15px_rgba(0,242,254,0.3)] group-hover:scale-105 transition-all duration-300 relative">
              <Brain className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-extrabold tracking-tighter leading-none text-white">HIRE-X</span>
              <span className="text-[9px] font-semibold text-slate-500 leading-none mt-0.5">AI Workspace</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 bg-white/[0.02] border border-white/[0.05] p-1 rounded-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative flex items-center gap-2.5 px-4 py-2 rounded-lg transition-all duration-300 group select-none",
                    isActive ? "text-white" : "text-slate-400 hover:text-slate-100"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-white/[0.03] border border-white/[0.08] rounded-lg shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={cn(
                    "w-4 h-4 shrink-0 transition-transform duration-300 relative z-10",
                    isActive ? "text-[#00F2FE] scale-105" : "text-slate-400 group-hover:text-[#00F2FE]/80 group-hover:scale-105"
                  )} />
                  <div className="flex flex-col text-left relative z-10">
                    <span className="text-[11px] font-extrabold leading-tight tracking-wide">
                      {item.label}
                    </span>
                    <span className={cn(
                      "text-[9px] leading-none mt-0.5 font-medium",
                      isActive ? "text-[#00F2FE]/80" : "text-slate-500 group-hover:text-slate-400"
                    )}>
                      {item.description}
                    </span>
                  </div>
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00f2fe]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3.5">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 pr-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 group focus:outline-none">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00F2FE] to-[#8B5CF6] flex items-center justify-center text-white shadow-md">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-200 hidden md:block">{user.name.split(' ')[0]}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-card border border-white/10 mt-2 p-2 rounded-2xl shadow-2xl">
                  <DropdownMenuLabel className="p-3">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="p-3 rounded-xl cursor-pointer hover:bg-white/10 text-gray-200 focus:bg-white/10 focus:text-white transition-colors">
                    <User className="w-4 h-4 mr-2 text-[#00F2FE]" />
                    <span className="font-bold">My Profile & Quotas</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={onLogout} className="p-3 rounded-xl cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 transition-colors">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="font-bold">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2.5">
                <Link to="/login">
                  <Button variant="ghost" className="rounded-xl font-bold text-slate-300 hover:text-white hover:bg-white/5">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white font-extrabold px-5 shadow-lg shadow-pink-500/15 transition-all duration-300">Sign Up</Button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/5 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-5 h-5 text-[#EC4899]" /> : <Menu className="w-5 h-5 text-[#00F2FE]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden container mx-auto mt-3 overflow-hidden"
          >
            <div className="glass-card border border-white/[0.08] rounded-2xl p-3 flex flex-col gap-2 bg-[#050816]/95 backdrop-blur-xl">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl transition-all duration-300 border border-transparent",
                      isActive 
                        ? "bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-lg border-white/10" 
                        : "hover:bg-white/5 text-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-4.5">
                      <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-[#00F2FE]")} />
                      <div className="text-left">
                        <p className="text-sm font-bold leading-tight">{item.label}</p>
                        <p className={cn(
                          "text-[10px] mt-0.5 font-medium",
                          isActive ? "text-white/80" : "text-gray-500"
                        )}>{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-55 text-gray-400" />
                  </Link>
                );
              })}
              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:bg-white/5 text-gray-300 border border-white/5 mt-2"
                >
                  <div className="flex items-center gap-4.5">
                    <User className="w-5 h-5 text-[#00F2FE]" />
                    <div className="text-left">
                      <p className="text-sm font-bold leading-tight">My Profile & Quotas</p>
                      <p className="text-[10px] mt-0.5 font-medium text-gray-500">View Usage & Account Settings</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-55 text-gray-400" />
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-white/5">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-white/5">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
