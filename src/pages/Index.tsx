import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Target, FileText, MessageSquare, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "AI Resume Generator",
    description: "Create professional, ATS-optimized resumes with AI assistance tailored to your industry",
    icon: Sparkles,
    color: "blue",
    link: "/generator"
  },
  {
    title: "Resume Analyzer",
    description: "Get detailed feedback, ATS compatibility scores, and improvement suggestions",
    icon: Target,
    color: "green",
    link: "/analyzer"
  },
  {
    title: "Job Matching",
    description: "Discover personalized job recommendations based on your skills and experience",
    icon: FileText,
    color: "purple",
    link: "/job-match"
  },
  {
    title: "Cold Email Generator",
    description: "Generate and send personalized cold emails to potential employers and recruiters",
    icon: Mail,
    color: "orange",
    link: "/cold-email"
  },
  {
    title: "AI Career Assistant",
    description: "Get personalized career advice, interview tips, and resume guidance 24/7",
    icon: MessageSquare,
    color: "pink",
    link: "/chat"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white/50 dark:bg-gray-950/50">
       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[30%] h-[40%] bg-pink-500/10 rounded-full blur-[100px] animate-pulse delay-2000"></div>
       </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 max-w-5xl mx-auto"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800 text-sm font-semibold text-blue-700 dark:text-blue-300">
             ✨ AI-Powered Career Growth
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
            Build Your Future with <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
              HIRE-X AI
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Create ATS-optimized resumes, get instant expert feedback, and find your perfect job match—all powered by advanced AI.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Link to="/generator">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="flex justify-center items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
              GPAI 3.0 Powered
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
              95% ATS Pass Rate
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
              Real-time Analysis
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-6xl mx-auto"
        >
          {[
             { val: "10k+", label: "Resumes Created", from: "from-blue-50", to: "to-blue-100", dFrom: "dark:from-blue-900/30", dTo: "dark:to-blue-800/30", tColor: "text-blue-600" },
             { val: "98%", label: "Interview Rate", from: "from-green-50", to: "to-green-100", dFrom: "dark:from-green-900/30", dTo: "dark:to-green-800/30", tColor: "text-green-600" },
             { val: "24/7", label: "AI Availability", from: "from-purple-50", to: "to-purple-100", dFrom: "dark:from-purple-900/30", dTo: "dark:to-purple-800/30", tColor: "text-purple-600" }
          ].map((stat, i) => (
             <Card key={i} className={`text-center border-0 shadow-lg bg-gradient-to-br ${stat.from} ${stat.to} ${stat.dFrom} ${stat.dTo} backdrop-blur-sm`}>
               <CardContent className="pt-8 pb-8">
                 <div className={`text-4xl font-extrabold ${stat.tColor} mb-2`}>{stat.val}</div>
                 <p className="text-base text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
               </CardContent>
             </Card>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="mb-24 px-4">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to <span className="text-blue-600">Succeed</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
               Our comprehensive suite of AI tools is designed to help you navigate every step of your job search journey.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {features.map((feature, index) => {
               // Render the last item (Career Assistant) to span 2 cols on tablet if needed, or maintain grid
               // For 5 items, let's keep it simple grid, or perhaps centering the last one could be nice
               // but normal grid behavior is usually fine.
               return (
                <motion.div key={index} variants={itemVariants} className="h-full">
                  <Link to={feature.link} className="block h-full">
                    <Card className="group h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden relative">
                      <div className={`absolute top-0 left-0 w-1 h-full bg-${feature.color}-500/50 group-hover:bg-${feature.color}-500 transition-colors`}></div>
                      <CardHeader className="text-center pb-4 pt-8">
                        <div className={`mx-auto mb-6 p-4 bg-${feature.color}-100 dark:bg-${feature.color}-900/20 rounded-2xl w-fit group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner`}>
                          <feature.icon className={`h-8 w-8 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                        </div>
                        <CardTitle className="text-xl font-bold mb-3">{feature.title}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-8 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                         <span className={`text-${feature.color}-600 font-semibold flex items-center text-sm`}>
                            Try it now <ArrowRight className="ml-1 w-4 h-4" />
                         </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
               );
            })}
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 z-0"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
            <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
              Join thousands of professionals who have successfully accelerated their careers with Hire-X.
            </p>
            <Link to="/generator">
              <Button size="lg" className="h-14 px-10 text-lg bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-xl font-bold rounded-full border-2 border-white/50">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
