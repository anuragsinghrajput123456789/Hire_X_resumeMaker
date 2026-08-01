import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  ExternalLink, 
  Briefcase, 
  Users, 
  DollarSign, 
  GraduationCap, 
  TrendingUp, 
  Globe, 
  MapPin, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Search,
  Rocket,
  Laptop,
  CheckCircle2,
  Zap,
  Filter,
  type LucideIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Website {
  name: string;
  url: string;
  description: string;
  features: string[];
  locationType: 'international' | 'national' | 'both';
  category: 'job-search' | 'remote' | 'startup' | 'internship' | 'freelance' | 'scholarship';
  badgeText?: string;
  isPopular?: boolean;
}

export const remoteJobWebsites: Website[] = [
  {
    name: "RemoteOK",
    url: "https://remoteok.com",
    description: "World's #1 remote job board connecting global tech, design, & product talent with top companies.",
    features: ["100% Remote positions", "Live salary transparency", "Instant global applications"],
    locationType: 'international',
    category: 'remote',
    badgeText: 'Top Remote',
    isPopular: true
  },
  {
    name: "We Work Remotely",
    url: "https://weworkremotely.com",
    description: "The largest remote work community in the world with 130,000+ monthly remote listings.",
    features: ["Top tier tech employers", "Zero location restrictions", "Engineering & Product focus"],
    locationType: 'international',
    category: 'remote',
    badgeText: '130k+ Jobs',
    isPopular: true
  },
  {
    name: "Remote.co",
    url: "https://remote.co",
    description: "Vetted remote job portal featuring premium openings for developers, designers, and managers.",
    features: ["Hand-curated listings", "Scam-free guarantee", "Remote company profiles"],
    locationType: 'international',
    category: 'remote'
  },
  {
    name: "Turing",
    url: "https://www.turing.com",
    description: "AI-backed remote platform placing top global software engineers into full-time US companies.",
    features: ["Competitive US compensation", "Long-term remote contracts", "AI skill matching"],
    locationType: 'international',
    category: 'remote',
    badgeText: 'US Salaries'
  },
  {
    name: "Remotive",
    url: "https://remotive.com",
    description: "Hand-screened remote tech jobs in software development, product management, and marketing.",
    features: ["Hand-vetted startups", "Tech-first roles", "Active Slack community"],
    locationType: 'international',
    category: 'remote'
  },
  {
    name: "Working Nomads",
    url: "https://www.workingnomads.com",
    description: "Curated digital nomad and remote job postings delivered directly to global job seekers.",
    features: ["Daily email alerts", "Global work anywhere", "Full-time & contract"],
    locationType: 'international',
    category: 'remote'
  },
  {
    name: "Jobspresso",
    url: "https://jobspresso.co",
    description: "Expertly curated remote jobs in tech, marketing, customer support, and sales.",
    features: ["Strictly quality-screened", "High-growth tech startups", "Worldwide flexibility"],
    locationType: 'international',
    category: 'remote'
  },
  {
    name: "FlexJobs",
    url: "https://www.flexjobs.com",
    description: "Premium subscription job site specializing in vetted remote, hybrid, and flexible career roles.",
    features: ["100% Scam-free guarantee", "Career coaching tools", "Vetted employers"],
    locationType: 'international',
    category: 'remote'
  }
];

export const startupWebsites: Website[] = [
  {
    name: "Y Combinator (Work at a Startup)",
    url: "https://www.workatastartup.com",
    description: "Apply directly to hundreds of YC portfolio startups with a single unified profile.",
    features: ["Direct founder access", "Pre-seed to Series C equity", "YC portfolio badge"],
    locationType: 'international',
    category: 'startup',
    badgeText: 'YC Network',
    isPopular: true
  },
  {
    name: "Wellfound (AngelList)",
    url: "https://wellfound.com",
    description: "The world's largest startup job platform with 130,000+ tech startups hiring globally.",
    features: ["Salary & equity transparency", "No recruiter middlemen", "Startup culture insights"],
    locationType: 'international',
    category: 'startup',
    badgeText: 'Startup Hub',
    isPopular: true
  },
  {
    name: "Instahyre",
    url: "https://www.instahyre.com",
    description: "AI-powered talent marketplace connecting top tech professionals with top startups & MNCs.",
    features: ["Instant recruiter matching", "Zero spam guaranteed", "Curated top tech roles"],
    locationType: 'both',
    category: 'startup',
    badgeText: 'AI Matched',
    isPopular: true
  },
  {
    name: "Cutshort",
    url: "https://cutshort.io",
    description: "AI-matched tech career platform with direct chat access to founders and engineering leads.",
    features: ["Direct founder messaging", "Verified tech profiles", "Fast response times"],
    locationType: 'both',
    category: 'startup',
    badgeText: 'Direct Chat'
  },
  {
    name: "Hacker News (Who Is Hiring)",
    url: "https://news.ycombinator.com",
    description: "Monthly thread where YC founders and tech leads post direct engineering openings.",
    features: ["Direct tech lead hiring", "Transparent tech stacks", "Global remote roles"],
    locationType: 'international',
    category: 'startup'
  },
  {
    name: "Product Hunt Jobs",
    url: "https://www.producthunt.com/jobs",
    description: "Discover open roles at trending products and venture-backed startups around the world.",
    features: ["Early employee roles", "Trending product teams", "Venture funded"],
    locationType: 'international',
    category: 'startup'
  },
  {
    name: "Techstars Jobs",
    url: "https://jobs.techstars.com",
    description: "Career opportunities across 3,000+ Techstars accelerator portfolio companies globally.",
    features: ["Global startup ecosystem", "Rapid growth roles", "Accelerator alumni"],
    locationType: 'international',
    category: 'startup'
  },
  {
    name: "Key Values",
    url: "https://www.keyvalues.com",
    description: "Find engineering teams matching your personal engineering values and work culture.",
    features: ["Culture-first matching", "Deep engineering specs", "Detailed team profiles"],
    locationType: 'international',
    category: 'startup'
  }
];

export const jobSearchWebsites: Website[] = [
  {
    name: "Instahyre",
    url: "https://www.instahyre.com",
    description: "AI-driven career portal connecting elite tech talent with top companies effortless.",
    features: ["AI Smart matching", "Direct HR outreach", "Premium salary offers"],
    locationType: 'both',
    category: 'job-search',
    badgeText: 'AI Powered',
    isPopular: true
  },
  {
    name: "LinkedIn Jobs",
    url: "https://www.linkedin.com/jobs/",
    description: "World's premier professional network with millions of active global job postings.",
    features: ["AI-powered job recommendations", "One-click Easy Apply", "Company network insights"],
    locationType: 'international',
    category: 'job-search',
    isPopular: true
  },
  {
    name: "Naukri.com",
    url: "https://www.naukri.com",
    description: "India's largest job portal connecting millions of job seekers with top corporate recruiters.",
    features: ["Leading Indian market reach", "Smart resume booster", "Verified company badges"],
    locationType: 'national',
    category: 'job-search',
    isPopular: true
  },
  {
    name: "Hirist",
    url: "https://www.hirist.tech",
    description: "Exclusive niche job board dedicated to software engineering, product, & data roles.",
    features: ["Tech-only listings", "Fast recruiter response", "Top tech compensation"],
    locationType: 'both',
    category: 'job-search',
    badgeText: 'Tech Only'
  },
  {
    name: "Hirect",
    url: "https://hirect.in",
    description: "Direct chat app connecting tech job seekers directly with hiring managers & CEOs.",
    features: ["Direct chat messaging", "Zero recruitment spam", "Instant interview scheduling"],
    locationType: 'both',
    category: 'job-search',
    badgeText: 'Instant Chat'
  },
  {
    name: "Indeed",
    url: "https://www.indeed.com",
    description: "Global job search engine indexing millions of opportunities directly from corporate sites.",
    features: ["Comprehensive job aggregator", "Transparent salary insights", "Employee reviews"],
    locationType: 'international',
    category: 'job-search'
  },
  {
    name: "Glassdoor",
    url: "https://www.glassdoor.com",
    description: "Job search engine integrated with authentic company reviews, salaries, and interview Q&As.",
    features: ["Verified salary database", "Interview question prep", "Employee ratings"],
    locationType: 'international',
    category: 'job-search'
  },
  {
    name: "ZipRecruiter",
    url: "https://www.ziprecruiter.com",
    description: "AI-powered job matching platform sending instant alerts when your application is viewed.",
    features: ["One-tap job application", "AI candidate matching", "Real-time recruiter alerts"],
    locationType: 'international',
    category: 'job-search'
  },
  {
    name: "Dice",
    url: "https://www.dice.com",
    description: "Premier career hub built exclusively for tech, IT, and software engineering professionals.",
    features: ["Tech skill salary tools", "Security clearance jobs", "Tech recruiter network"],
    locationType: 'international',
    category: 'job-search'
  },
  {
    name: "Shine.com",
    url: "https://www.shine.com",
    description: "India's innovative job portal offering candidate profiling and recruiter matching.",
    features: ["Skill assessment tests", "Walk-in interview alerts", "Career enhancement"],
    locationType: 'national',
    category: 'job-search'
  }
];

export const internshipWebsites: Website[] = [
  {
    name: "Internshala",
    url: "https://internshala.com",
    description: "India's largest internship platform with 300,000+ opportunities across all domains.",
    features: ["Guaranteed stipend jobs", "Work from home internships", "Verified certificates"],
    locationType: 'national',
    category: 'internship',
    badgeText: '300k+ Roles',
    isPopular: true
  },
  {
    name: "Unstop (Dare2Compete)",
    url: "https://unstop.com",
    description: "Premier platform for hackathons, coding challenges, and corporate internship drives.",
    features: ["National hackathons", "Direct PPI opportunities", "Campus placement drives"],
    locationType: 'both',
    category: 'internship',
    badgeText: 'Hackathons',
    isPopular: true
  },
  {
    name: "LinkedIn Internships",
    url: "https://www.linkedin.com/jobs/internship-jobs/",
    description: "Global professional network connecting students with top tier company internships.",
    features: ["Alumni networking", "Global enterprise intern roles", "Company insights"],
    locationType: 'international',
    category: 'internship'
  },
  {
    name: "Forage",
    url: "https://www.theforage.com",
    description: "Free virtual work experience programs created by top Fortune 500 companies.",
    features: ["100% Free programs", "Self-paced simulations", "CV resume certificates"],
    locationType: 'international',
    category: 'internship',
    badgeText: 'Virtual Experience'
  },
  {
    name: "Wellfound Internships",
    url: "https://wellfound.com/jobs",
    description: "Early stage startup internships with direct access to founders and equity opportunities.",
    features: ["Startup culture", "Direct founder contact", "Hands-on growth"],
    locationType: 'international',
    category: 'internship'
  },
  {
    name: "Glassdoor Internships",
    url: "https://www.glassdoor.com/Job/internship-jobs-SRCH_KO0,10.htm",
    description: "Internship search engine with real intern reviews and stipend transparency.",
    features: ["Stipend transparency", "Intern reviews", "Interview prep"],
    locationType: 'international',
    category: 'internship'
  }
];

export const freelancingWebsites: Website[] = [
  {
    name: "Upwork",
    url: "https://www.upwork.com",
    description: "The world's leading freelancing network connecting business clients with expert talent.",
    features: ["Payment protection Escrow", "Hourly & Fixed rate contracts", "Global project scope"],
    locationType: 'international',
    category: 'freelance',
    badgeText: 'Top Freelance',
    isPopular: true
  },
  {
    name: "Fiverr",
    url: "https://www.fiverr.com",
    description: "Global marketplace for digital services offering fixed-price project gigs.",
    features: ["Gig-based productized services", "Fast project delivery", "Seller level rewards"],
    locationType: 'international',
    category: 'freelance',
    isPopular: true
  },
  {
    name: "Toptal",
    url: "https://www.toptal.com",
    description: "Exclusive network matching top 3% freelance software developers and designers with elite clients.",
    features: ["Top 3% screened talent", "Premium hourly rates", "Enterprise clients"],
    locationType: 'international',
    category: 'freelance',
    badgeText: 'Top 3% Talent'
  },
  {
    name: "Freelancer.com",
    url: "https://www.freelancer.com",
    description: "Massive project and contest-based freelancing marketplace for tech and creative skills.",
    features: ["Milestone payments", "Global design contests", "Mobile work app"],
    locationType: 'international',
    category: 'freelance'
  },
  {
    name: "Guru",
    url: "https://www.guru.com",
    description: "Flexible freelancing platform featuring secure Workroom collaboration tools.",
    features: ["SafePay payment protection", "Custom work agreements", "Low transaction fees"],
    locationType: 'international',
    category: 'freelance'
  },
  {
    name: "99designs",
    url: "https://99designs.com",
    description: "Creative platform specifically built for freelance graphic designers and brand strategists.",
    features: ["Design contests", "1-on-1 brand projects", "Copyright transfer"],
    locationType: 'international',
    category: 'freelance'
  }
];

export const scholarshipWebsites: Website[] = [
  {
    name: "Buddy4Study",
    url: "https://www.buddy4study.com",
    description: "India's largest scholarship network matching students with government and corporate funding.",
    features: ["Merit & Need-based aid", "Corporate CSR grants", "Application assistance"],
    locationType: 'national',
    category: 'scholarship',
    badgeText: 'India #1',
    isPopular: true
  },
  {
    name: "Scholarships.com",
    url: "https://www.scholarships.com",
    description: "Free global scholarship directory listing billions of dollars in college funding awards.",
    features: ["Personalized match engine", "College financial aid", "No cost registration"],
    locationType: 'international',
    category: 'scholarship',
    isPopular: true
  },
  {
    name: "Fastweb",
    url: "https://www.fastweb.com",
    description: "Leading online resource for finding scholarships, financial aid, and college grants.",
    features: ["Personalized alerts", "College search tools", "Scholarship matching"],
    locationType: 'international',
    category: 'scholarship'
  },
  {
    name: "DAAD Scholarships",
    url: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
    description: "German Academic Exchange Service offering full scholarships for international postgraduates.",
    features: ["Full tuition & stipend", "Study in Germany", "Research grants"],
    locationType: 'international',
    category: 'scholarship',
    badgeText: 'Germany Fully Funded'
  },
  {
    name: "Chevening Scholarships",
    url: "https://www.chevening.org",
    description: "UK government's prestigious global scholarship program for future leaders.",
    features: ["Full UK Master's funding", "Leadership network", "Global alumni"],
    locationType: 'international',
    category: 'scholarship',
    badgeText: 'UK Fully Funded'
  },
  {
    name: "Fulbright Program",
    url: "https://www.fulbrightonline.org",
    description: "Flagship international educational exchange program sponsored by the US government.",
    features: ["US Graduate study", "Cultural exchange", "Full funding support"],
    locationType: 'international',
    category: 'scholarship'
  }
];

export const ALL_WEBSITES: Website[] = [
  ...remoteJobWebsites,
  ...startupWebsites,
  ...jobSearchWebsites,
  ...internshipWebsites,
  ...freelancingWebsites,
  ...scholarshipWebsites
];

type CategoryFilter = 'all' | 'remote' | 'startup' | 'job-search' | 'internship' | 'freelance' | 'scholarship';

const JobSuggestions: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showMoreMap, setShowMoreMap] = useState<Record<string, boolean>>({
    'remote': false,
    'startup': false,
    'job-search': false,
    'internship': false,
    'freelance': false,
    'scholarship': false,
  });

  const INITIAL_DISPLAY_COUNT = 8;

  const toggleShowMore = (cat: string) => {
    setShowMoreMap(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Filtered websites calculation
  const filteredWebsites = useMemo(() => {
    return ALL_WEBSITES.filter(w => {
      const matchesFilter = activeFilter === 'all' || w.category === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        w.name.toLowerCase().includes(q) || 
        w.description.toLowerCase().includes(q) || 
        w.features.some(f => f.toLowerCase().includes(q));
      
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const categoriesConfig = [
    { id: 'all', label: 'All Portals', icon: Sparkles, color: 'from-[#8B5CF6] to-[#EC4899]' },
    { id: 'remote', label: 'Remote Jobs', icon: Laptop, color: 'from-[#00F2FE] to-[#4FACFE]' },
    { id: 'startup', label: 'Startups & YC', icon: Rocket, color: 'from-[#FF0844] to-[#FF4E50]' },
    { id: 'job-search', label: 'Tech Portals', icon: Briefcase, color: 'from-[#D946EF] to-[#EC4899]' },
    { id: 'internship', label: 'Internships', icon: Users, color: 'from-[#8B5CF6] to-[#6366F1]' },
    { id: 'freelance', label: 'Freelance', icon: DollarSign, color: 'from-[#00F5A0] to-[#00D990]' },
    { id: 'scholarship', label: 'Scholarships', icon: GraduationCap, color: 'from-[#3B82F6] to-[#06B6D4]' },
  ];

  const WebsiteCard = ({ website }: { website: Website }) => {
    const getCategoryDetails = (cat: Website['category']) => {
      switch (cat) {
        case 'remote':
          return { icon: Laptop, accentColor: 'from-[#00F2FE] to-[#4FACFE]', hoverBorder: 'hover:border-[#00F2FE]/40', badgeBg: 'bg-[#00F2FE]/10 text-[#00F2FE] border-[#00F2FE]/30' };
        case 'startup':
          return { icon: Rocket, accentColor: 'from-[#FF0844] to-[#FF4E50]', hoverBorder: 'hover:border-[#FF0844]/40', badgeBg: 'bg-[#FF0844]/10 text-[#FF0844] border-[#FF0844]/30' };
        case 'job-search':
          return { icon: Briefcase, accentColor: 'from-[#D946EF] to-[#EC4899]', hoverBorder: 'hover:border-[#D946EF]/40', badgeBg: 'bg-[#D946EF]/10 text-[#D946EF] border-[#D946EF]/30' };
        case 'internship':
          return { icon: Users, accentColor: 'from-[#8B5CF6] to-[#6366F1]', hoverBorder: 'hover:border-[#8B5CF6]/40', badgeBg: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30' };
        case 'freelance':
          return { icon: DollarSign, accentColor: 'from-[#00F5A0] to-[#00D990]', hoverBorder: 'hover:border-[#00F5A0]/40', badgeBg: 'bg-[#00F5A0]/10 text-[#00F5A0] border-[#00F5A0]/30' };
        case 'scholarship':
          return { icon: GraduationCap, accentColor: 'from-[#3B82F6] to-[#06B6D4]', hoverBorder: 'hover:border-[#3B82F6]/40', badgeBg: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30' };
      }
    };

    const details = getCategoryDetails(website.category);
    const Icon = details.icon;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
      >
        <Card className={`group h-full flex flex-col transition-all duration-300 border border-white/10 bg-[#070B18]/90 backdrop-blur-xl shadow-xl overflow-hidden hover:-translate-y-1 ${details.hoverBorder} relative`}>
          {website.isPopular && (
            <div className="absolute top-0 right-0 z-20">
              <span className="bg-gradient-to-l from-[#D946EF] to-[#8B5CF6] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-lg shadow-md flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Featured
              </span>
            </div>
          )}

          <CardHeader className="pb-3 relative z-10 flex-shrink-0 pt-4 px-4">
            <CardTitle className="flex items-start justify-between gap-2.5 text-base text-white">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${details.accentColor} group-hover:scale-110 transition-transform duration-300 shadow-md flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold truncate text-white text-sm group-hover:text-[#00F2FE] transition-colors">{website.name}</span>
                  {website.badgeText && (
                    <span className="text-[10px] font-bold text-[#00F2FE] tracking-tight">{website.badgeText}</span>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center gap-1">
                {website.locationType === 'international' && (
                  <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span className="text-[10px] font-bold">Global</span>
                  </Badge>
                )}
                {website.locationType === 'national' && (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-bold">Local</span>
                  </Badge>
                )}
                {website.locationType === 'both' && (
                  <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span className="text-[10px] font-bold">Both</span>
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-between space-y-3.5 relative z-10 px-4 pb-4">
            <div className="space-y-3 flex-1">
              <CardDescription className="text-gray-400 leading-relaxed text-xs line-clamp-2">{website.description}</CardDescription>

              <div className="space-y-1.5 bg-white/[0.02] border border-white/[0.05] p-2.5 rounded-xl">
                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-[#00F5A0]" />
                  Key Highlights
                </h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  {website.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-[#00F5A0] shrink-0" />
                      <span className="line-clamp-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Button asChild className="w-full mt-3 h-9 bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs shadow-md border border-white/10 hover:border-white/20 hover:scale-[1.01] active:scale-[0.99] transition-all rounded-xl group/btn">
              <a href={website.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                <span>Explore Portal</span>
                <ExternalLink className="ml-1.5 h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform text-[#00F2FE]" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderSection = (title: string, subtitle: string, icon: LucideIcon, categoryKey: Website['category'], items: Website[], colorGradient: string, borderHover: string) => {
    const SectionIcon = icon;
    const isExpanded = showMoreMap[categoryKey];
    const displayItems = isExpanded ? items : items.slice(0, INITIAL_DISPLAY_COUNT);

    if (items.length === 0) return null;

    return (
      <section key={categoryKey} className="mb-14">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 bg-gradient-to-br ${colorGradient} rounded-2xl shadow-lg`}>
              <SectionIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                {title}
                <span className="text-xs font-mono font-bold text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                  {items.length} Portals
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {displayItems.map((website, idx) => (
              <WebsiteCard key={`${website.name}-${idx}`} website={website} />
            ))}
          </AnimatePresence>
        </div>

        {items.length > INITIAL_DISPLAY_COUNT && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => toggleShowMore(categoryKey)}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs rounded-full px-6 py-2 flex items-center gap-2 hover:scale-105 transition-all shadow-md"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 animate-bounce" />
                  Show All ({items.length - INITIAL_DISPLAY_COUNT} More)
                </>
              )}
            </Button>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto py-2 px-0 relative z-10 max-w-6xl">
        
        {/* Controls Header: Search & Category Filter Pills */}
        <div className="glass-card border border-white/10 rounded-2xl p-4 mb-10 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search Instahyre, YC, RemoteOK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-xs bg-[#050816]/90 border-white/10 focus:border-[#00F2FE]/60 rounded-xl"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium self-end md:self-auto">
              <Filter className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span>Showing <b>{filteredWebsites.length}</b> verified portals</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categoriesConfig.map(cat => {
              const Icon = cat.icon;
              const isActive = activeFilter === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id as CategoryFilter)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 select-none ${
                    isActive 
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-purple-500/20 scale-[1.02]` 
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section List Render */}
        {activeFilter === 'all' && !searchQuery ? (
          <>
            {renderSection('Remote Jobs & Global Opportunities', 'Hand-screened work anywhere roles in tech, product & design', Laptop, 'remote', remoteJobWebsites, 'from-[#00F2FE] to-[#4FACFE]', 'hover:border-[#00F2FE]/40')}
            {renderSection('Startup Jobs & Y Combinator Networks', 'Access early-stage startups, YC portfolio roles & venture equity', Rocket, 'startup', startupWebsites, 'from-[#FF0844] to-[#FF4E50]', 'hover:border-[#FF0844]/40')}
            {renderSection('Tech & General Job Portals', 'Instahyre, LinkedIn, Hirist & top corporate talent marketplaces', Briefcase, 'job-search', jobSearchWebsites, 'from-[#D946EF] to-[#EC4899]', 'hover:border-[#D946EF]/40')}
            {renderSection('Internships & Placement Drives', 'Kickstart your career with internships and virtual work simulations', Users, 'internship', internshipWebsites, 'from-[#8B5CF6] to-[#6366F1]', 'hover:border-[#8B5CF6]/40')}
            {renderSection('Freelancing & Contract Platforms', 'Global freelance marketplaces for independent tech and design pros', DollarSign, 'freelance', freelancingWebsites, 'from-[#00F5A0] to-[#00D990]', 'hover:border-[#00F5A0]/40')}
            {renderSection('Scholarships & Educational Grants', 'Fully funded global scholarships and university financial aid', GraduationCap, 'scholarship', scholarshipWebsites, 'from-[#3B82F6] to-[#06B6D4]', 'hover:border-[#3B82F6]/40')}
          </>
        ) : (
          <div className="mb-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredWebsites.map((website, idx) => (
                <WebsiteCard key={`${website.name}-${idx}`} website={website} />
              ))}
            </div>

            {filteredWebsites.length === 0 && (
              <div className="text-center py-16 glass-card rounded-2xl border border-white/10">
                <Search className="w-10 h-10 text-slate-500 mx-auto mb-3 animate-pulse" />
                <h3 className="text-base font-bold text-white mb-1">No portals found</h3>
                <p className="text-xs text-slate-400 mb-4">Try adjusting your search query or switching filters</p>
                <Button 
                  onClick={() => { setSearchQuery(''); setActiveFilter('all'); }} 
                  className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold text-xs rounded-xl"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default JobSuggestions;
