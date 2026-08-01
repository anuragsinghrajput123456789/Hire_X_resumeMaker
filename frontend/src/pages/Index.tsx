import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  Mail,
  MessageSquare,
  Search,
  ShieldCheck,
  Target,
  Wand2,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/Hero';
import AnimatedSection from '@/components/AnimatedSection';
import InteractiveCard from '@/components/InteractiveCard';
import { staggerChildVariants } from '@/lib/animations';

const features = [
  {
    title: 'AI Resume Builder',
    description: 'Design highly polished, ATS-optimized resumes with step-by-step guidance and real-time AI formatting highlights.',
    icon: Wand2,
    link: '/generator',
    glowClass: 'glow-pink',
    glowColor: 'rgba(217, 70, 239, 0.15)',
    iconColor: 'text-[#D946EF] bg-[#D946EF]/10 border border-[#D946EF]/20'
  },
  {
    title: 'Neural Resume Analyzer',
    description: 'Scan your resume instantly for missing keywords, core skill gaps, weak summaries, and match scores.',
    icon: Search,
    link: '/analyzer',
    glowClass: 'glow-cyan',
    glowColor: 'rgba(0, 242, 254, 0.15)',
    iconColor: 'text-[#00F2FE] bg-[#00F2FE]/10 border border-[#00F2FE]/20'
  },
  {
    title: 'Job Match Portals',
    description: 'Instantly measure your resume strength against diverse roles and optimize your job applications.',
    icon: Target,
    link: '/job-match',
    glowClass: 'glow-rose',
    glowColor: 'rgba(255, 8, 68, 0.15)',
    iconColor: 'text-[#FF0844] bg-[#FF0844]/10 border border-[#FF0844]/20'
  },
  {
    title: 'Cold Outreach Engine',
    description: 'Generate personalized, high-conversion emails for recruiters and hiring managers tailored to target jobs.',
    icon: Mail,
    link: '/cold-email',
    glowClass: 'glow-cyan',
    glowColor: 'rgba(79, 172, 254, 0.15)',
    iconColor: 'text-[#4FACFE] bg-[#4FACFE]/10 border border-[#4FACFE]/20'
  },
  {
    title: 'AI Career Assistant',
    description: 'Consult our conversational career bot to simulate interviews, get guidance, and refine positions.',
    icon: MessageSquare,
    link: '/chat',
    glowClass: 'glow-emerald',
    glowColor: 'rgba(0, 245, 160, 0.15)',
    iconColor: 'text-[#00F5A0] bg-[#00F5A0]/10 border border-[#00F5A0]/20'
  },
  {
    title: 'Secure Workspace',
    description: 'Save all your custom resumes, active history, and generated outputs in your personal safe hub.',
    icon: ShieldCheck,
    link: '/generator',
    glowClass: 'glow-pink',
    glowColor: 'rgba(236, 72, 153, 0.15)',
    iconColor: 'text-[#EC4899] bg-[#EC4899]/10 border border-[#EC4899]/20'
  }
];

const stats = [
  { value: '14,200+', label: 'Successful Resumes', glowClass: 'glow-pink', glowColor: 'rgba(217, 70, 239, 0.15)' },
  { value: '98.6%', label: 'Average ATS Match', glowClass: 'glow-cyan', glowColor: 'rgba(0, 242, 254, 0.15)' },
  { value: '450k+', label: 'AI Operations Ran', glowClass: 'glow-rose', glowColor: 'rgba(255, 8, 68, 0.15)' }
];

const conveyorItems = [
  { name: 'Senior React Architect', match: '98%', status: 'Recruiter Outreach Active', color: 'border-[#00F2FE]/25' },
  { name: 'Staff Product Manager', match: '95%', status: 'Interviewing at Stripe', color: 'border-[#8B5CF6]/25' },
  { name: 'Machine Learning Engineer', match: '97%', status: 'Offer Received', color: 'border-[#00F5A0]/25' },
  { name: 'Director of Engineering', match: '99%', status: 'ATS Score Verified', color: 'border-[#D946EF]/25' },
  { name: 'Lead Devops Engineer', match: '96%', status: 'Cold Email Dispatched', color: 'border-[#FF0844]/25' }
];

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh-vibrant selection:bg-[#00F2FE]/20">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Live Workspace Tracker Ticker Strip */}
      <section className="relative py-6 z-10 overflow-hidden border-y border-white/[0.05] bg-[#050814]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 mb-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#00F2FE] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] animate-pulse" />
            Live Candidate Matches Ticker
          </div>
        </div>
        
        <div className="w-full flex overflow-hidden relative">
          <div className="animate-conveyor flex gap-4">
            {conveyorItems.concat(conveyorItems).map((item, idx) => (
              <div
                key={idx}
                className={`glass-card border rounded-xl px-4 py-2.5 flex items-center gap-3 min-w-[260px] ${item.color} transition-all duration-300 hover:scale-[1.02] hover:border-white/20`}
              >
                <div className="w-6 h-6 rounded-full bg-[#00F2FE]/10 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE] shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{item.name}</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                    <span>Score: <b className="text-white font-semibold">{item.match}</b></span>
                    <span className="text-slate-600">•</span>
                    <span>{item.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Feature Highlights Grid Section */}
      <AnimatedSection className="relative px-6 py-12 sm:px-8 md:py-16 z-10 max-w-7xl mx-auto">
        <div className="container mx-auto max-w-6xl">
          
          <div className="text-center mb-10 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-poppins">
              Powerful AI Capabilities
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Crafted to streamline applications, eliminate keyword gaps, and maximize recruiter response rates.
            </p>
          </div>

          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={staggerChildVariants}>
                <Link to={feature.link} className="group block h-full">
                  <InteractiveCard glowColor={feature.glowColor} className="h-full">
                    <Card className={`h-full overflow-hidden glass-card border rounded-xl p-5 transition-all duration-300 hover:border-white/20 hover:shadow-xl ${feature.glowClass}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${feature.iconColor}`}>
                          <feature.icon className="h-4.5 w-4.5" />
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-[#00F2FE] group-hover:translate-x-1 transition-all duration-300" />
                      </div>

                      <CardTitle className="text-sm font-bold tracking-tight text-white font-poppins mb-1.5">
                        {feature.title}
                      </CardTitle>

                      <CardDescription className="text-xs font-normal leading-relaxed text-slate-400">
                        {feature.description}
                      </CardDescription>
                    </Card>
                  </InteractiveCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* 4. Candidate Workflow Pipeline Section */}
      <AnimatedSection className="relative px-6 py-10 sm:px-8 md:py-14 z-10 max-w-7xl mx-auto">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-2xl border border-white/[0.08] bg-[#070A18]/60 p-6 sm:p-8 shadow-xl backdrop-blur-md">
            
            <div className="text-center max-w-lg mx-auto mb-8">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00F2FE]">Guided Pipeline</span>
              <h2 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight text-white font-poppins">
                3 Steps to Recruiter-Ready Success
              </h2>
              <p className="mt-1 text-xs text-slate-400 font-normal">
                Craft custom summaries, audit quality against targets, and dispatch recruiter emails.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Draft', text: 'Create professional layout summaries with expert sections.', icon: Wand2 },
                { title: 'Audit', text: 'Scan formatting, spelling, and keywords directly.', icon: Search },
                { title: 'Outreach', text: 'Auto-generate recruiter letters and find matches.', icon: Target }
              ].map((item, index) => (
                <InteractiveCard key={item.title} glowColor="rgba(139, 92, 246, 0.15)">
                  <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#050814]/80 p-4 text-left group hover:border-white/20 transition-all duration-300 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500">0{index + 1}</span>
                    </div>
                    <p className="text-sm font-bold text-white font-poppins">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400 font-normal">{item.text}</p>
                  </div>
                </InteractiveCard>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* 5. Key Metrics / Stats Row Section */}
      <AnimatedSection className="relative px-6 py-8 sm:px-8 z-10 max-w-7xl mx-auto">
        <div className="container mx-auto max-w-5xl grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <InteractiveCard key={stat.label} glowColor={stat.glowColor}>
              <div className={`glass-card rounded-xl p-4 border text-center relative overflow-hidden transition-all duration-300 hover:border-white/20 ${stat.glowClass}`}>
                <p className="text-2xl font-extrabold text-white mb-0.5 font-poppins">{stat.value}</p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </AnimatedSection>

      {/* 6. Premium Call to Action Area */}
      <AnimatedSection className="relative px-6 py-12 sm:px-8 md:py-16 z-10 max-w-7xl mx-auto">
        <div className="container mx-auto max-w-4xl">
          <InteractiveCard glowColor="rgba(0, 242, 254, 0.2)" enableTilt={false}>
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1020] via-[#070A18] to-[#050816] border border-white/10 px-6 py-10 text-center shadow-xl relative">
              <div className="absolute inset-0 bg-grid-soft opacity-30 pointer-events-none" />
              <div className="mx-auto max-w-xl relative z-10">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#00F2FE]/10 border border-[#00F2FE]/20 text-[#00F2FE] shadow-sm">
                  <Brain className="h-5 w-5" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white font-poppins">
                  Ready to organize your job search?
                </h2>
                <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  Join thousands of software engineers, product managers, and designers crafting premium careers with HIRE-X.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="btn-premium w-full sm:w-auto px-6 py-2.5 rounded-xl flex items-center justify-center text-xs font-bold">
                      Create Free Account
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link to="/chat" className="w-full sm:w-auto">
                    <Button size="lg" className="btn-outline-premium w-full sm:w-auto px-5 py-2.5 rounded-xl flex items-center justify-center text-xs font-semibold">
                      Consult Career Coach
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </InteractiveCard>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Index;
