import JobSuggestions from '../components/JobSuggestions';
import { Target, Briefcase, Users, Sparkles, Zap, Globe, GraduationCap, Laptop, Rocket, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const JobMatchPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-career-gradient">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-grid-soft"></div>
        <div className="absolute top-[10%] -left-[10%] h-[45%] w-[45%] rounded-full bg-indigo-500/5 blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] h-[45%] w-[45%] rounded-full bg-pink-500/5 blur-[120px]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-16 max-w-7xl">
        {/* Enhanced Header Section */}
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="mb-6 text-center flex flex-col items-center"
        >
          <div className="relative mb-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <div className="absolute inset-0 rounded-full bg-pink-500/10 blur-xl"></div>
            <div className="relative rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 p-3.5 shadow-xl shadow-pink-500/10 border border-pink-400/20">
              <Target className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h1 className="text-center text-3xl font-black tracking-tight text-white font-poppins sm:text-4xl md:text-5xl">
              Job Portals & Opportunity Hub
            </h1>
          </div>
          
          <p className="mx-auto mb-6 max-w-3xl text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
            Explore top career channels featuring <span className="font-bold text-[#00F2FE]">Instahyre</span>, <span className="font-bold text-rose-400">Remote Work</span>, <span className="font-bold text-amber-400">Y Combinator Startups</span>, <span className="font-bold text-purple-400">Internships</span>, <span className="font-bold text-emerald-400">Freelance Contracts</span>, and <span className="font-bold text-cyan-400">Global Scholarships</span>.
          </p>
          
          {/* Enhanced Feature Highlights Cards (6 Pillars) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-8 max-w-6xl w-full mx-auto">
             {[
               { icon: Laptop, title: "Remote Jobs", sub: "Work Anywhere", from: "from-[#00F2FE]", to: "to-[#4FACFE]", border: "hover:border-[#00F2FE]/40" },
               { icon: Rocket, title: "YC & Startups", sub: "Equity & Growth", from: "from-[#FF0844]", to: "to-[#FF4E50]", border: "hover:border-[#FF0844]/40" },
               { icon: Briefcase, title: "Tech Portals", sub: "Instahyre & Hirist", from: "from-[#D946EF]", to: "to-[#EC4899]", border: "hover:border-[#D946EF]/40" },
               { icon: Users, title: "Internships", sub: "Early Career", from: "from-[#8B5CF6]", to: "to-[#6366F1]", border: "hover:border-[#8B5CF6]/40" },
               { icon: DollarSign, title: "Freelancing", sub: "Upwork & Fiverr", from: "from-[#00F5A0]", to: "to-[#00D990]", border: "hover:border-[#00F5A0]/40" },
               { icon: GraduationCap, title: "Scholarships", sub: "Global Education", from: "from-[#3B82F6]", to: "to-[#06B6D4]", border: "hover:border-[#3B82F6]/40" }
             ].map((item, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 + idx * 0.05 }}
                 className={`group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-[#0F1424]/80 p-3.5 shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-1 ${item.border}`}
               >
                 <div className={`p-2.5 bg-gradient-to-br ${item.from} ${item.to} rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300`}>
                    <item.icon className="w-4 h-4 text-white" />
                 </div>
                 <div className="text-center">
                   <h3 className="text-xs font-extrabold text-white">{item.title}</h3>
                   <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
                 </div>
               </motion.div>
             ))}
          </div>

          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="flex justify-center"
          >
            <button 
              onClick={() => {
                const element = document.getElementById('job-listings-section');
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl shadow-pink-500/20 hover:scale-[1.02] transition-all duration-300 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current text-white" />
              Explore Opportunities
            </button>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
           id="job-listings-section"
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4, duration: 0.6 }}
           className="scroll-mt-6"
        >
           <JobSuggestions />
        </motion.div>
      </div>
    </div>
  );
};

export default JobMatchPage;
