import ResumeAnalyzer from '../components/ResumeAnalyzer';
import { Search, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AnalyzerPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-career-gradient">
      
       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-grid-soft"></div>
          <div className="absolute top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-500/5 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/5 blur-[120px]"></div>
       </div>

      <div className="container relative z-10 mx-auto px-4 py-8 sm:px-6 md:py-12">
        {/* Enhanced Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 flex flex-col items-center"
        >
          <div className="relative mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl"></div>
            <div className="relative rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-3.5 shadow-xl shadow-emerald-500/10">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-center text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
              Resume Analyzer
            </h1>
          </div>
          
          <p className="mx-auto mb-10 max-w-2xl text-sm sm:text-base leading-relaxed text-gray-300">
            Get detailed analysis and improvement suggestions for your resume. 
            Boost your <span className="text-emerald-400 font-bold">ATS compatibility</span> and increase your chances of landing interviews.
          </p>
          
          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { icon: Target, text: "ATS Score Check", color: "text-emerald-400" },
              { icon: TrendingUp, text: "Strategic Improvements", color: "text-indigo-400" },
              { icon: CheckCircle, text: "Keyword Assessment", color: "text-purple-400" }
            ].map((feature, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.15 + idx * 0.08 }}
                 className="flex items-center gap-2 rounded-full border border-white/5 bg-[#0F1424]/60 px-4 py-2 shadow-sm backdrop-blur"
               >
                 <feature.icon className={`w-4 h-4 ${feature.color}`} />
                 <span className="text-xs font-bold text-gray-200">{feature.text}</span>
               </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3, duration: 0.6 }}
        >
           <ResumeAnalyzer />
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyzerPage;
