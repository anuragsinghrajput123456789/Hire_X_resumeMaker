import { Link } from 'react-router-dom';
import { Brain, Github, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.03] bg-[#050814] z-10 select-none">
      {/* Background Decorative Glows */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-64 w-64 rounded-full bg-indigo-500/5 blur-[120px]"></div>
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/5 blur-[120px]"></div>

      <div className="container mx-auto px-6 py-16 relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-lg shadow-lg group-hover:scale-105 transition-all duration-300">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-black tracking-tighter leading-none text-white">HIRE-X</span>
                <span className="text-[9px] font-semibold text-slate-500 leading-none mt-0.5">AI Workspace</span>
              </div>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs font-medium">
              Empowering your career journey with cutting-edge AI. Build resumes, analyze performance, and land your dream job.
            </p>
            <div className="flex items-center gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="rounded-lg p-2 bg-white/[0.02] border border-white/[0.04] text-slate-400 transition-colors duration-300 hover:bg-white/10 hover:text-white">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Platform</h3>
            <ul className="space-y-3">
              {[
                { label: 'Resume Builder', path: '/generator' },
                { label: 'AI Analyzer', path: '/analyzer' },
                { label: 'Job Matching', path: '/job-match' },
                { label: 'Career Chat', path: '/chat' }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="group flex items-center text-xs text-slate-400 font-medium transition-colors duration-300 hover:text-indigo-400">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Resources</h3>
            <ul className="space-y-3">
              {['Blog', 'Career Tips', 'Templates', 'Support'].map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-xs text-slate-400 font-medium transition-colors duration-300 hover:text-indigo-400">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Stay Updated</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">Get the latest career tips and AI updates.</p>
            <div className="group flex gap-2 rounded-xl border border-white/5 bg-[#0A0F1D]/80 p-1.5 transition-all focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs px-2.5 w-full text-white placeholder-slate-600 outline-none"
              />
              <Button size="icon" className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md h-8 w-8">
                <Mail className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500 font-medium">
          <p>© 2026 HIRE-X AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-indigo-400">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-indigo-400">Terms of Service</a>
            <a href="#" className="transition-colors hover:text-indigo-400">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
