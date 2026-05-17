import { useState } from 'react';
import ResumeGenerator from '../components/ResumeGenerator';
import { Sparkles, FileText, Zap } from 'lucide-react';

const GeneratorPage = () => {
  const [generatedResume, setGeneratedResume] = useState('');

  return (
    <div className="min-h-screen bg-career-gradient select-none">
      <div className="container mx-auto px-6 py-12 sm:px-8 md:py-16 max-w-6xl">
        {/* Premium Header Section */}
        <div className="text-center mb-16">
          <div className="mb-6 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-2.5 shadow-lg shadow-indigo-500/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-center text-3xl font-extrabold tracking-tighter text-white font-poppins sm:text-4xl md:text-5xl">
              AI Resume Generator
            </h1>
          </div>
          <p className="mx-auto mb-8 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-400 font-semibold">
            Draft customized, ATS-compatible resumes with advanced AI blueprints. Optimize content, edit sections, select premium templates, and export recruiter-ready PDFs instantly.
          </p>
          
          {/* Feature Highlights */}
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-2 shadow-inner">
              <Zap className="w-4 h-4 text-indigo-400 shadow-[0_0_8px_#6366f1]" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">AI Blueprinting</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-2 shadow-inner">
              <FileText className="w-4 h-4 text-emerald-400 shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">ATS Score Certified</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-2 shadow-inner">
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
