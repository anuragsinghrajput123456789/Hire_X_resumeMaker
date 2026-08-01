import { useState } from 'react';
import ResumeGenerator from '../components/ResumeGenerator';
import { Sparkles, FileText, Zap } from 'lucide-react';

const GeneratorPage = () => {
  const [generatedResume, setGeneratedResume] = useState('');

  return (
    <div className="min-h-screen bg-career-gradient select-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-16 max-w-7xl">
        {/* Premium Header Section */}
        <div className="text-center mb-8">
          <div className="mb-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-2.5 shadow-lg shadow-indigo-500/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-center text-3xl font-extrabold tracking-tighter text-white font-poppins sm:text-4xl md:text-5xl">
              AI Resume Generator
            </h1>
          </div>
          <p className="mx-auto mb-6 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-400 font-semibold">
            Draft customized, ATS-compatible resumes with advanced AI blueprints. Optimize content, edit sections, select premium templates, and export recruiter-ready PDFs instantly.
          </p>
          
          {/* Feature Highlights */}
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 shadow-inner">
              <Zap className="w-4 h-4 text-indigo-400 shadow-[0_0_8px_#6366f1]" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">AI Blueprinting</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 shadow-inner">
              <FileText className="w-4 h-4 text-emerald-400 shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">ATS Score Certified</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 shadow-inner">
              <Sparkles className="w-4 h-4 text-purple-400 shadow-[0_0_8px_#8b5cf6]" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Geometric Themes</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <ResumeGenerator onResumeGenerated={setGeneratedResume} />
      </div>
    </div>
  );
};

export default GeneratorPage;
