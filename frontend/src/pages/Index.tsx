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
  Sparkles,
  Zap,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const features = [
  {
    title: 'AI Resume Builder',
    description: 'Design highly polished, ATS-optimized resumes with step-by-step guidance and real-time AI formatting highlights.',
    icon: Wand2,
    link: '/generator',
    glowClass: 'glow-pink',
    iconColor: 'text-[#D946EF] bg-[#D946EF]/10 border border-[#D946EF]/20'
  },
  {
    title: 'Neural Resume Analyzer',
    description: 'Scan your resume instantly for missing keywords, core skill gaps, weak summaries, and match scores.',
    icon: Search,
    link: '/analyzer',
    glowClass: 'glow-cyan',
    iconColor: 'text-[#00F2FE] bg-[#00F2FE]/10 border border-[#00F2FE]/20'
  },
  {
    title: 'Job Match Portals',
    description: 'Instantly measure your resume strength against diverse roles and optimize your job applications.',
    icon: Target,
    link: '/job-match',
    glowClass: 'glow-rose',
    iconColor: 'text-[#FF0844] bg-[#FF0844]/10 border border-[#FF0844]/20'
  },
  {
    title: 'Cold Outreach Engine',
    description: 'Generate personalized, high-conversion emails for recruiters and hiring managers tailored to target jobs.',
    icon: Mail,
    link: '/cold-email',
    glowClass: 'glow-cyan',
    iconColor: 'text-[#4FACFE] bg-[#4FACFE]/10 border border-[#4FACFE]/20'
  },
  {
    title: 'AI Career Assistant',
    description: 'Consult our conversational career bot to simulate interviews, get guidance, and refine positions.',
    icon: MessageSquare,
    link: '/chat',
    glowClass: 'glow-emerald',
    iconColor: 'text-[#00F5A0] bg-[#00F5A0]/10 border border-[#00F5A0]/20'
  },
  {
    title: 'Secure Candidate Workspace',
    description: 'Save all your custom resumes, active history, and generated outputs in your personal safe hub.',
    icon: ShieldCheck,
    link: '/generator',
    glowClass: 'glow-pink',
    iconColor: 'text-[#EC4899] bg-[#EC4899]/10 border border-[#EC4899]/20'
  }
];

const stats = [
  { value: '14,200+', label: 'Successful Resumes', glowClass: 'glow-pink' },
  { value: '98.6%', label: 'Average ATS Match', glowClass: 'glow-cyan' },
  { value: '450k+', label: 'AI Operations Ran', glowClass: 'glow-rose' }
];

const conveyorItems = [
  { name: 'Senior React Architect', match: '98%', status: 'Recruiter Outreach Active', color: 'border-[#00F2FE]/30' },
  { name: 'Staff Product Manager', match: '95%', status: 'Interviewing at Stripe', color: 'border-[#8B5CF6]/30' },
  { name: 'Machine Learning Engineer', match: '97%', status: 'Offer Received', color: 'border-[#00F5A0]/30' },
  { name: 'Director of Engineering', match: '99%', status: 'ATS Score Verified', color: 'border-[#D946EF]/30' },
  { name: 'Lead Devops Engineer', match: '96%', status: 'Cold Email Dispatched', color: 'border-[#FF0844]/30' }
];

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh-vibrant selection:bg-[#00F2FE]/20">
      
      {/* Cinematic Animated Spotlight Meshes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="ambient-orb left-[10%] top-[12%] w-[450px] h-[450px] bg-[#00F2FE]/15" />
        <div className="ambient-orb right-[15%] top-[25%] w-[400px] h-[400px] bg-[#D946EF]/12" />
        <div className="ambient-orb left-[40%] bottom-[15%] w-[500px] h-[500px] bg-[#8B5CF6]/10" />
        <div className="absolute inset-0 bg-grid-soft" />
      </div>

      {/* Hero Section Container */}
      <section className="relative px-6 pb-20 pt-16 sm:px-8 md:pb-28 lg:pt-24 z-10 max-w-7xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          
          {/* Left Side Info Desk */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col text-left"
          >
            {/* Ambient Tag Pill */}
            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] shadow-inner mb-6 text-xs font-semibold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#00F2FE] animate-pulse" />
              <span>Cinematic AI Candidate Workspace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.05] text-white mb-6">
              Supercharge Your <br />
              <span className="text-gradient-premium">Career Workspace</span> <br />
              With Pure Intelligence
            </h1>

            <p className="max-w-xl text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed mb-10 font-medium">
              Erase generic builders. Design high-conversion, ATS-optimized resumes, audit key competencies, simulate interviews, and coordinate cold recruitment outreach inside a unified cinematic canvas.
            </p>

            {/* Quick Interactive Features Row */}
            <div className="flex flex-wrap gap-3 mb-10 text-xs font-bold select-none">
              <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-200">
                <span className="h-2 w-2 rounded-full bg-[#00F5A0] shadow-[0_0_12px_#00f5a0]" />
                Neural Match Scanners
              </span>
              <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-200">
                <span className="h-2 w-2 rounded-full bg-[#00F2FE] shadow-[0_0_12px_#00f2fe]" />
                Interactive Advisor
              </span>
              <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-200">
                <span className="h-2 w-2 rounded-full bg-[#D946EF] shadow-[0_0_12px_#d946ef]" />
                Tactile PDF Formats
              </span>
            </div>

            {/* CTA action group */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/generator" className="w-full sm:w-auto">
                <Button size="lg" className="btn-premium w-full sm:w-auto px-8 py-6 rounded-xl flex items-center justify-center gap-3 text-xs">
                  Create Your Optimized Resume
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/chat" className="w-full sm:w-auto">
                <Button size="lg" className="btn-outline-premium w-full sm:w-auto px-6 py-6 rounded-xl flex items-center justify-center gap-2 text-xs bg-white/[0.02] hover:bg-white/[0.07] border border-white/10 text-slate-300 font-bold transition-all duration-300">
                  Consult AI Coach
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Side Floating Deck Mockups */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[480px] w-full hidden md:block select-none"
          >
            {/* Main Floating Platform Interface Card */}
            <div className="absolute top-[10%] left-[5%] w-[85%] h-[75%] rounded-3xl glass-card border border-white/10 p-6 flex flex-col justify-between shadow-[0_30px_70px_rgba(0,0,0,0.7)] animate-float overflow-hidden card-glow-active">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hire-X Workspace Control</div>
              </div>

              {/* Dynamic Mockup Content */}
              <div className="flex-1 py-4 flex flex-col gap-3.5">
                <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00F2FE]/10 flex items-center justify-center border border-[#00F2FE]/20">
                      <Wand2 className="w-4 h-4 text-[#00F2FE]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Full-Stack Resume.pdf</div>
                      <div className="text-[10px] font-semibold text-slate-500">ATS optimized model</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[#00F5A0]/10 border border-[#00F5A0]/20 text-[9px] font-black text-[#00F5A0]">PASSING</span>
                </div>

                <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FF0844]/10 flex items-center justify-center border border-[#FF0844]/20">
                      <Target className="w-4 h-4 text-[#FF0844]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Netflix - Tech Lead Position</div>
                      <div className="text-[10px] font-semibold text-slate-500">Job matching evaluation</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[#00F2FE]/10 border border-[#00F2FE]/20 text-[9px] font-black text-[#00F2FE]">98.4% MATCH</span>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-400">FE</div>
                  <div className="w-6 h-6 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center text-[8px] font-bold text-[#8B5CF6]">AI</div>
                </div>
                <div className="text-[9px] font-bold text-slate-500">Candidate profiles successfully matched to target roles.</div>
              </div>
            </div>

            {/* Smaller Secondary Floating Orb Card (ATS Circle Score Meter) */}
            <div className="absolute bottom-[2%] right-[2%] w-[210px] rounded-2xl glass-card border border-white/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.65)] animate-float-delayed flex items-center gap-3.5">
              <div className="relative w-11 h-11 flex items-center justify-center rounded-full bg-[#00F5A0]/10 border border-[#00F5A0]/30 shadow-[0_0_15px_rgba(5,232,255,0.1)]">
                <TrendingUp className="w-5 h-5 text-[#00F5A0]" />
              </div>
              <div>
                <div className="text-sm font-black text-white font-poppins">98.6 ATS</div>
                <div className="text-[9px] font-bold text-[#00F5A0] tracking-wider uppercase">Vercel standard</div>
              </div>
            </div>

            {/* Micro floating capsule (Active AI Coach) */}
            <div className="absolute top-[4%] right-[8%] rounded-full glass-card border border-white/10 px-3.5 py-1.5 shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00F2FE] rounded-full animate-ping" />
              <span className="text-[9px] font-bold text-slate-200">AI Career Coach Online</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Infinite Horizontal Looping Preview Showcase */}
      <section className="relative py-10 z-10 overflow-hidden border-y border-white/[0.04] bg-[#070A18]/45">
        <div className="absolute inset-0 bg-grid-soft opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 mb-4">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00F2FE]">Live Workspace Tracker</div>
        </div>
        
        <div className="w-full flex overflow-hidden relative">
          <div className="animate-conveyor flex gap-6">
            {conveyorItems.concat(conveyorItems).map((item, idx) => (
              <div
                key={idx}
                className={`glass-card border rounded-2xl px-6 py-4 flex items-center gap-4 min-w-[290px] shadow-lg ${item.color} transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-[#00F2FE]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-white">{item.name}</div>
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 mt-1">
                    <span>Score: <b className="text-white font-bold">{item.match}</b></span>
                    <span className="text-slate-600">|</span>
                    <span>{item.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats row section */}
      <section className="relative px-6 py-12 sm:px-8 md:py-16 z-10 max-w-7xl mx-auto">
        <div className="container mx-auto max-w-5xl grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`glass-card rounded-2xl p-6 border text-center relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${stat.glowClass}`}
            >
              <p className="text-3xl font-extrabold text-white mb-1 font-poppins">{stat.value}</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modular Features Grid Section */}
      <section className="relative px-6 py-16 sm:px-8 md:py-24 z-10 max-w-7xl mx-auto">
        <div className="container mx-auto">
          
          <div className="text-center mb-16 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-white font-poppins leading-tight">
              Powerful Automation
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
              Discover cutting-edge automation modules crafted to streamline applications, improve recruiter responses, and land your ideal workspace.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <Link to={feature.link} className="group block h-full">
                  <Card className={`h-full overflow-hidden glass-card border rounded-2xl transition-all duration-300 hover:border-white/[0.08] hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${feature.glowClass}`}>
                    <CardHeader className="pb-4">
                      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${feature.iconColor}`}>
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base font-bold tracking-tight text-white font-poppins">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="min-h-16 text-xs font-semibold leading-relaxed text-slate-400">
                        {feature.description}
                      </CardDescription>
                      <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#00F2FE] group-hover:text-white transition-colors duration-300">
                        Open tool
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Structured guided Workflow display */}
      <section className="relative px-6 py-12 sm:px-8 md:py-20 z-10 max-w-7xl mx-auto">
        <div className="container mx-auto max-w-5xl">
          <div className="grid gap-8 rounded-3xl border border-white/[0.05] bg-[#070A18]/45 p-6 shadow-2xl backdrop-blur-md sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00F2FE]">Guided Pipeline</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tighter text-white font-poppins leading-tight">
                Move from rough draft to recruiter-ready in minutes.
              </h2>
              <p className="mt-4 text-xs text-slate-400 leading-relaxed font-semibold">
                Hire-X provides integrated candidate workspace features that work in sync. Craft customized details, audit quality against targets, match open listings, and dispatch tailored letters without jumping platforms.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Draft', text: 'Create professional layout summaries with expert sections.', icon: Wand2 },
                { title: 'Audit', text: 'Scan formatting, spelling, and keywords directly.', icon: Search },
                { title: 'Outreach', text: 'Auto-generate recruiter letters and find matches.', icon: Target }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.03] bg-[#050816]/70 p-5 text-left"
                >
                  <div className="mb-8 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white shadow-md">
                    <item.icon className="h-4.5 w-4.5" />
                  </div>
                  <p className="text-sm font-extrabold text-white font-poppins">{item.title}</p>
                  <p className="mt-2 text-[10px] leading-relaxed text-slate-500 font-bold">{item.text}</p>
                  <span className="absolute right-3 top-3 text-2xl font-black text-white/[0.02] select-none">0{index + 1}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Premium Call to Action Area */}
      <section className="relative px-6 py-16 sm:px-8 md:py-24 z-10 max-w-7xl mx-auto">
        <div className="container mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1020] via-[#070A18] to-[#050816] border border-white/[0.05] px-6 py-14 text-center shadow-2xl relative">
            <div className="absolute inset-0 bg-grid-soft opacity-30 pointer-events-none" />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mx-auto max-w-2xl relative z-10"
            >
              <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00F2FE]/10 border border-[#00F2FE]/20 text-[#00F2FE] shadow-md">
                <Brain className="h-5.5 w-5.5" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tighter text-white font-poppins leading-tight">
                Ready to organize your job search?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-xs sm:text-sm text-slate-400 leading-relaxed font-bold">
                Join thousands of software builders, analysts, and designers crafting premium careers with HIRE-X.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="btn-premium w-full sm:w-auto px-8 py-5.5 rounded-xl flex items-center justify-center text-xs">
                    Create Free Account
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link to="/chat" className="w-full sm:w-auto">
                  <Button size="lg" className="btn-outline-premium w-full sm:w-auto py-5.5 rounded-xl flex items-center justify-center text-xs bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all duration-300">
                    Consult Career Coach
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
