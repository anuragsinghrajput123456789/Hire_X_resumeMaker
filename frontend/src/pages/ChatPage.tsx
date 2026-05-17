import Chatbot from '../components/Chatbot';
import { MessageCircle, Bot, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-career-gradient">
       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-grid-soft"></div>
          <div className="absolute top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-cyan-500/5 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[10%] h-[40%] w-[40%] rounded-full bg-sky-500/5 blur-[120px]"></div>
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
            <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl"></div>
            <div className="relative rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 p-3.5 shadow-xl shadow-cyan-500/10">
              <MessageCircle className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className="text-center text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
              AI Career Assistant
            </h1>
          </div>
          
          <p className="mx-auto mb-10 max-w-2xl text-sm sm:text-base leading-relaxed text-gray-300">
            Get personalized career advice, resume tips, and interview walkthroughs from our AI assistant. 
            Available 24/7 to help you accelerate your career journey.
          </p>
          
          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { icon: Bot, text: "Advanced Neural Counsel", color: "text-cyan-400" },
              { icon: Sparkles, text: "Tailored Career Trajectories", color: "text-sky-400" },
              { icon: HelpCircle, text: "Instantaneous Response Log", color: "text-purple-400" }
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
           <Chatbot />
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage;
