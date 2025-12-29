import ColdEmailGenerator from '../components/ColdEmailGenerator';
import { Mail, Send, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const ColdEmailPage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/20 relative overflow-hidden">
        {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-[35%] h-[40%] bg-orange-500/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
       </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center gap-4 mb-6 relative inline-block">
             <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
            <div className="p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-xl relative transform transition-transform hover:rotate-6 duration-300">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              Cold Email Generator
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Generate personalized cold emails and send them directly to potential employers. 
            Make <span className="text-orange-600 font-semibold">meaningful connections</span> and land your dream job.
          </p>
          
          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
             {[
               { icon: Zap, text: "AI-Generated", color: "text-orange-500" },
               { icon: Send, text: "Direct Send", color: "text-red-500" },
               { icon: Users, text: "Personalized", color: "text-purple-500" }
             ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
                >
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{feature.text}</span>
                </motion.div>
             ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
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
