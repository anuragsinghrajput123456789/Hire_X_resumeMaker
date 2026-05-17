import JobSuggestions from '../components/JobSuggestions';
import { Target, Briefcase, Users, Sparkles, Zap, Globe, GraduationCap } from 'lucide-react';
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

      <div className="container relative z-10 mx-auto px-4 py-8 sm:px-6 md:py-12">
        {/* Enhanced Header Section */}
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="mb-12 text-center md:mb-16 flex flex-col items-center"
        >
          <div className="relative mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="absolute inset-0 rounded-full bg-pink-500/10 blur-xl"></div>
            <div className="relative rounded-full bg-gradient-to-br from-pink-500 to-rose-600 p-4 shadow-xl shadow-pink-500/10 border border-pink-400/20">
              <Target className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className="text-center text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
              Job Portals Hub
            </h1>
          </div>
          
          <p className="mx-auto mb-10 max-w-2xl text-sm sm:text-base leading-relaxed text-gray-300">
            Discover career opportunities with <span className="font-bold text-pink-400">job portals</span>, <span className="font-bold text-purple-400">internships</span>, 
            <span className="font-bold text-blue-400"> scholarships</span>, and <span className="font-bold text-emerald-400">freelancing</span> projects from around the globe.
          </p>
          
          {/* Enhanced Feature Highlights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 max-w-5xl w-full mx-auto">
             {[
               { icon: Briefcase, title: "Job Portals", sub: "Career Opportunities", from: "from-pink-500", to: "to-rose-500", text: "text-pink-400", border: "hover:border-pink-500/30" },
               { icon: Users, title: "Internships", sub: "Career Building", from: "from-purple-500", to: "to-indigo-500", text: "text-purple-400", border: "hover:border-purple-500/30" },
               { icon: GraduationCap, title: "Scholarships", sub: "Education Funding", from: "from-blue-500", to: "to-cyan-500", text: "text-blue-400", border: "hover:border-blue-500/30" },
               { icon: Globe, title: "Freelancing", sub: "Global Work", from: "from-emerald-500", to: "to-teal-500", text: "text-emerald-400", border: "hover:border-emerald-500/30" }
             ].map((item, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.15 + idx * 0.08 }}
                 className={`group flex flex-col items-center gap-3.5 rounded-2xl border border-white/5 bg-[#0F1424]/80 p-5 shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-1 ${item.border}`}
               >
                 <div className={`p-3 bg-gradient-to-br ${item.from} ${item.to} rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300`}>
                    <item.icon className="w-5 h-5 text-white" />
                 </div>
                 <div className="text-center">
                   <h3 className="text-sm font-black text-white">{item.title}</h3>
                   <p className="text-xs text-gray-400 font-medium">{item.sub}</p>
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
