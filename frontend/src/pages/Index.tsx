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
  { name: 'Senior React Architect', match: '98%', status: 'Recruiter Outreach Active', color: 'border-[#00F2FE]/30 glow-cyan' },
  { name: 'Staff Product Lead • Meta', match: '95%', status: 'Interview Scheduled', color: 'border-[#8B5CF6]/30 glow-pink' },
  { name: 'AI Engineer • OpenAI', match: '99%', status: 'Offer Letter Received', color: 'border-[#00F5A0]/30 glow-emerald' },
  { name: 'Fullstack Architect • Stripe', match: '97%', status: 'ATS Score Verified', color: 'border-[#D946EF]/30 glow-pink' },
  { name: 'Principal DevOps Engineer', match: '96%', status: 'Cold Email Dispatched', color: 'border-[#FF0844]/30 glow-rose' },
  { name: 'Senior Data Scientist • Google', match: '98%', status: 'Technical Round Cleared', color: 'border-[#00F2FE]/30 glow-cyan' },
  { name: 'Lead UI/UX Architect', match: '94%', status: 'Portfolio Match 98%', color: 'border-[#8B5CF6]/30 glow-pink' },
  { name: 'Cloud Solutions Lead • AWS', match: '99%', status: 'Direct Recruiter Contact', color: 'border-[#00F5A0]/30 glow-emerald' }
];

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh-vibrant selection:bg-[#00F2FE]/20">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Live Workspace Tracker Ticker Strip */}
      <section className="relative py-8 z-10 overflow-hidden border-y border-white/[0.1] bg-[#050816]/90 backdrop-blur-2xl">
        {/* Animated Top & Bottom Glowing Border Beams */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00F2FE]/60 to-transparent shadow-[0_0_15px_#00F2FE]" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D946EF]/60 to-transparent shadow-[0_0_15px_#D946EF]" />

        {/* Animated Background Mesh & Floating Orbs */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00F2FE]/10 via-[#8B5CF6]/10 to-[#EC4899]/10 animate-pulse pointer-events-none" />
        <div className="absolute inset-0 bg-grid-soft opacity-40 pointer-events-none" />
        <div className="ambient-orb w-[500px] h-[180px] top-1/2 -left-20 -translate-y-1/2 bg-gradient-to-r from-[#00F2FE]/20 via-[#8B5CF6]/20 to-transparent blur-3xl pointer-events-none animate-float" />
        <div className="ambient-orb w-[500px] h-[180px] top-1/2 -right-20 -translate-y-1/2 bg-gradient-to-l from-[#EC4899]/20 via-[#00F5A0]/20 to-transparent blur-3xl pointer-events-none animate-float" />

        {/* Left & Right Edge Vignette Fade Masks for Seamless Motion */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-28 sm:w-44 bg-gradient-to-r from-[#030712] via-[#030712]/90 to-transparent z-30" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-28 sm:w-44 bg-gradient-to-l from-[#030712] via-[#030712]/90 to-transparent z-30" />

        <div className="max-w-7xl mx-auto px-6 mb-3.5 relative z-20">
          <div className="text-[11px] font-black uppercase tracking-widest text-[#00F2FE] flex items-center gap-2 drop-shadow-[0_0_10px_rgba(0,242,254,0.4)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2FE] opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00F2FE]"></span>
            </span>
            <span>Live Candidate Activity & Recruiter Matches</span>
          </div>
        </div>
        
        {/* Guaranteed Framer Motion Infinite Right-to-Left Marquee */}
        <div className="w-full flex overflow-hidden relative z-20 py-1">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 22,
                ease: "linear",
              },
            }}
            className="flex gap-4 w-max shrink-0"
          >
            {conveyorItems.concat(conveyorItems, conveyorItems, conveyorItems).map((item, idx) => (
              <div
                key={idx}
                className={`glass-card border rounded-2xl px-4 py-3 flex items-center gap-3.5 min-w-[300px] ${item.color} transition-all duration-300 hover:scale-[1.04] hover:border-white/40 cursor-pointer shadow-xl backdrop-blur-2xl group/ticker relative overflow-hidden`}
              >
                {/* Subtle Card Background Glow Highlight */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] to-transparent pointer-events-none" />
                
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00F2FE]/25 to-[#8B5CF6]/25 border border-[#00F2FE]/50 flex items-center justify-center text-[#00F2FE] shrink-0 group-hover/ticker:scale-110 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-transform">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>

                <div className="relative z-10">
                  <div className="text-xs font-black text-white tracking-tight group-hover/ticker:text-[#00F2FE] transition-colors">{item.name}</div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300 mt-1 font-semibold">
                    <span className="bg-[#00F5A0]/15 text-[#00F5A0] border border-[#00F5A0]/40 px-2 py-0.5 rounded-md font-extrabold shadow-sm">{item.match} Match</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-200 font-medium">{item.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
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

      {/* 5.5 Candidate Success Stories & Social Proof */}
      <AnimatedSection className="relative px-6 py-12 sm:px-8 z-10 max-w-7xl mx-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 max-w-xl mx-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00F5A0] bg-[#00F5A0]/10 border border-[#00F5A0]/20 px-3 py-1 rounded-full">
              Loved By Candidates
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-poppins">
              Landed Roles at Top Companies
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              See how job seekers use Hire-X to accelerate applications and land high-paying roles.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Sarah Lin",
                role: "Senior Frontend Engineer @ Stripe",
                text: "Hire-X flagged 7 critical missing keywords in my resume. After applying the AI fixes, my ATS match score jumped to 96% and I got 3 interview requests in 48 hours!",
                glow: "rgba(0, 242, 254, 0.15)",
                gradient: "from-[#00F2FE] to-[#4FACFE]"
              },
              {
                name: "Marcus Vance",
                role: "Staff Backend Engineer @ Meta",
                text: "The AI Cover Letter generator and real-time interview prep assistant gave me the exact edge I needed to land my dream offer with full equity transparency.",
                glow: "rgba(217, 70, 239, 0.15)",
                gradient: "from-[#D946EF] to-[#EC4899]"
              },
              {
                name: "Elena Rostova",
                role: "Lead Product Manager @ Google",
                text: "The curated job portal hub and automated cold outreach tool saved me weeks of manual searching. Received callbacks from top tech leads effortlessly.",
                glow: "rgba(0, 245, 160, 0.15)",
                gradient: "from-[#00F5A0] to-[#00D990]"
              }
            ].map((story, i) => (
              <InteractiveCard key={story.name} glowColor={story.glow}>
                <div className="glass-card border border-white/10 rounded-2xl p-6 h-full flex flex-col justify-between hover:border-white/20 transition-all duration-300">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(5)].map((_, idx) => (
                        <span key={idx} className="text-xs">★</span>
                      ))}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300 italic font-medium mb-4">
                      "{story.text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${story.gradient} flex items-center justify-center text-white text-xs font-black shadow-md`}>
                      {story.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">{story.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{story.role}</p>
                    </div>
                  </div>
                </div>
              </InteractiveCard>
            ))}
          </div>
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
