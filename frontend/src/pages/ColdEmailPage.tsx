import ColdEmailGenerator from '../components/ColdEmailGenerator';
import { Mail, Send, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const ColdEmailPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-career-gradient">
       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-grid-soft"></div>
          <div className="absolute top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-amber-500/5 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[10%] h-[40%] w-[40%] rounded-full bg-orange-500/5 blur-[120px]"></div>
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
            <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl"></div>
            <div className="relative rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-3.5 shadow-xl shadow-amber-500/10">
              <Mail className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className="text-center text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
              Cold Email Generator
            </h1>
          </div>
          
          <p className="mx-auto mb-10 max-w-2xl text-sm sm:text-base leading-relaxed text-gray-300">
            Generate highly-personalized cold emails and send them directly to potential employers. 
            Make <span className="text-amber-400 font-bold">meaningful connections</span> and land your dream job.
          </p>
          
          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { icon: Zap, text: "AI Outreach Engine", color: "text-amber-400" },
              { icon: Send, text: "Direct Gmail Routing", color: "text-orange-400" },
              { icon: Users, text: "Context-Aware Personalization", color: "text-purple-400" }
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
           <ColdEmailGenerator />
        </motion.div>
      </div>
    </div>
  );
};

export default ColdEmailPage;
