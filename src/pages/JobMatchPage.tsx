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
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Enhanced Header Section */}
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="text-center mb-16"
        >
          <div className="flex justify-center items-center gap-4 mb-8 relative inline-block">
             <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full"></div>
            <div className="p-4 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-600 rounded-3xl shadow-2xl relative animate-float">
              <Target className="w-12 h-12 text-white" />
            </div>
            
             <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 tracking-tight">
              Job Portals Hub
            </h1>
            
            <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ delay: 0.5, type: "spring" }}
               className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl absolute -top-4 -right-12 shadow-lg"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
            🚀 Discover your dream career with <span className="font-semibold text-purple-600">job portals</span>, <span className="font-semibold text-pink-600">internships</span>, 
            <span className="font-semibold text-blue-600"> scholarships</span>, and <span className="font-semibold text-green-600">freelancing</span> projects from around the globe.
          </p>
          
          {/* Enhanced Feature Highlights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
             {[
               { icon: Briefcase, title: "Job Portals", sub: "Career Opportunities", from: "from-purple-500", to: "to-blue-600" },
               { icon: Users, title: "Internships", sub: "Career Building", from: "from-pink-500", to: "to-purple-600" },
               { icon: GraduationCap, title: "Scholarships", sub: "Education Funding", from: "from-blue-500", to: "to-cyan-600" },
               { icon: Globe, title: "Freelancing", sub: "Global Work", from: "from-green-500", to: "to-emerald-600" }
             ].map((item, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 + idx * 0.1 }}
                 className="flex flex-col items-center gap-4 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-white/50 dark:border-gray-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
               >
                 <div className={`p-4 bg-gradient-to-br ${item.from} ${item.to} rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-7 h-7 text-white" />
                 </div>
                 <div className="text-center">
                   <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{item.title}</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400">{item.sub}</p>
                 </div>
               </motion.div>
             ))}
          </div>

          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.8 }}
             className="flex justify-center"
          >
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Explore Opportunities
            </button>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6, duration: 0.8 }}
        >
          <JobSuggestions />
        </motion.div>
      </div>
    </div>
  );
};

export default JobMatchPage;
