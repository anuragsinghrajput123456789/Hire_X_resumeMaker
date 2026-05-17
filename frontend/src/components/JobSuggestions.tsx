import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ExternalLink, Briefcase, Users, DollarSign, GraduationCap, TrendingUp, Globe, MapPin, Sparkles, ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react';

interface Website {
  name: string;
  url: string;
  description: string;
  features: string[];
  locationType: 'international' | 'national' | 'both';
}

const internshipWebsites: Website[] = [
  {
    name: "Internshala",
    url: "https://internshala.com",
    description: "India's largest internship platform with 300,000+ opportunities",
    features: ["Work from home options", "Stipend guaranteed", "Certificate provided"],
    locationType: 'national'
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/jobs/internship-jobs/",
    description: "Professional network with extensive internship opportunities worldwide",
    features: ["Industry connections", "Company insights", "Professional networking"],
    locationType: 'international'
  },
  {
    name: "Indeed",
    url: "https://www.indeed.com/q-internship-jobs.html",
    description: "Global job search engine with comprehensive internship listings",
    features: ["Salary insights", "Company reviews", "Application tracking"],
    locationType: 'international'
  },
  {
    name: "Glassdoor",
    url: "https://www.glassdoor.com/Job/internship-jobs-SRCH_KO0,10.htm",
    description: "Job search platform with company insights and internship opportunities",
    features: ["Company reviews", "Salary transparency", "Interview insights"],
    locationType: 'international'
  },
  {
    name: "AngelList",
    url: "https://angel.co/jobs",
    description: "Startup internships and early-stage company opportunities",
    features: ["Startup culture", "Equity options", "Direct founder contact"],
    locationType: 'international'
  },
  {
    name: "Forage",
    url: "https://www.theforage.com",
    description: "Virtual work experience programs with top companies",
    features: ["Free programs", "Industry simulation", "Certificate completion"],
    locationType: 'international'
  }
];

const freelancingWebsites: Website[] = [
  {
    name: "Upwork",
    url: "https://www.upwork.com",
    description: "Global freelancing platform with diverse project opportunities",
    features: ["Payment protection", "Time tracking", "Skill tests"],
    locationType: 'international'
  },
  {
    name: "Fiverr",
    url: "https://www.fiverr.com",
    description: "Marketplace for digital services starting at $5",
    features: ["Gig-based system", "Quick turnaround", "Level progression"],
    locationType: 'international'
  },
  {
    name: "Freelancer",
    url: "https://www.freelancer.com",
    description: "Contest-based and project-based freelancing platform",
    features: ["Milestone payments", "Contest opportunities", "Mobile app"],
    locationType: 'international'
  },
  {
    name: "Toptal",
    url: "https://www.toptal.com",
    description: "Elite network of top 3% freelance talent",
    features: ["Rigorous screening", "Premium rates", "Direct client matching"],
    locationType: 'international'
  },
  {
    name: "99designs",
    url: "https://99designs.com",
    description: "Creative freelancing platform for designers and creatives",
    features: ["Design contests", "1-to-1 projects", "Brand packages"],
    locationType: 'international'
  },
  {
    name: "Guru",
    url: "https://www.guru.com",
    description: "Flexible freelancing platform with workroom collaboration",
    features: ["Safe pay system", "Workroom tools", "Flexible agreements"],
    locationType: 'international'
  },
  {
    name: "PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "UK-based freelancing platform for creative and technical projects",
    features: ["Hourly and fixed-price", "Workstream collaboration", "AI matching"],
    locationType: 'international'
  },
  {
    name: "SimplyHired",
    url: "https://www.simplyhired.com/freelance-jobs",
    description: "Freelance job aggregator with global opportunities",
    features: ["Job alerts", "Salary estimates", "Company reviews"],
    locationType: 'international'
  }
];

const jobSearchWebsites: Website[] = [
  {
    name: "LinkedIn Jobs",
    url: "https://www.linkedin.com/jobs/",
    description: "Professional networking platform with extensive job opportunities",
    features: ["AI-powered matching", "Company insights", "Professional networking"],
    locationType: 'international'
  },
  {
    name: "Indeed",
    url: "https://www.indeed.com",
    description: "World's largest job search engine with millions of listings",
    features: ["Resume upload", "Salary insights", "Company reviews"],
    locationType: 'international'
  },
  {
    name: "Naukri.com",
    url: "https://www.naukri.com",
    description: "India's leading job portal with comprehensive opportunities",
    features: ["Indian market focus", "Resume building", "Company reviews"],
    locationType: 'national'
  },
  {
    name: "Monster",
    url: "https://www.monster.com",
    description: "Global employment website for job seekers and employers",
    features: ["Career advice", "Resume services", "Job alerts"],
    locationType: 'international'
  },
  {
    name: "ZipRecruiter",
    url: "https://www.ziprecruiter.com",
    description: "AI-powered job matching platform with instant notifications",
    features: ["Smart matching", "Mobile alerts", "One-click apply"],
    locationType: 'international'
  },
  {
    name: "Shine.com",
    url: "https://www.shine.com",
    description: "India's premium job portal for professionals",
    features: ["Premium jobs", "Career advice", "Skill assessments"],
    locationType: 'national'
  },
  {
    name: "CareerBuilder",
    url: "https://www.careerbuilder.com",
    description: "Comprehensive job search platform with career resources",
    features: ["Resume builder", "Career tests", "Salary calculator"],
    locationType: 'international'
  },
  {
    name: "Dice",
    url: "https://www.dice.com",
    description: "Technology-focused job board for IT professionals",
    features: ["Tech-specific", "Salary insights", "Skills matching"],
    locationType: 'international'
  },
  {
    name: "FlexJobs",
    url: "https://www.flexjobs.com",
    description: "Remote, part-time, and flexible job opportunities",
    features: ["Remote work focus", "Flexible schedules", "Vetted opportunities"],
    locationType: 'international'
  },
  {
    name: "AngelList Talent",
    url: "https://angel.co/jobs",
    description: "Startup and tech company job opportunities",
    features: ["Startup culture", "Equity information", "Direct contact"],
    locationType: 'international'
  },
  {
    name: "Times Jobs",
    url: "https://www.timesjobs.com",
    description: "Leading Indian job portal with diverse opportunities",
    features: ["Indian companies", "Walk-in interviews", "Career resources"],
    locationType: 'national'
  },
  {
    name: "Wellfound",
    url: "https://wellfound.com",
    description: "Startup job platform connecting talent with growing companies",
    features: ["Startup focus", "Company culture", "Growth opportunities"],
    locationType: 'international'
  }
];

const scholarshipWebsites: Website[] = [
  {
    name: "Study Buddy",
    url: "https://www.studybuddy.com",
    description: "Comprehensive scholarship search platform for international students",
    features: ["Personalized matching", "Application tracking", "Deadline reminders"],
    locationType: 'international'
  },
  {
    name: "Scholarships.com",
    url: "https://www.scholarships.com",
    description: "Free scholarship search engine with millions in awards",
    features: ["Free to use", "Custom matches", "Application tools"],
    locationType: 'international'
  },
  {
    name: "Fastweb",
    url: "https://www.fastweb.com",
    description: "Leading scholarship search platform with personalized results",
    features: ["Scholarship matching", "College search", "Financial aid advice"],
    locationType: 'international'
  },
  {
    name: "Scholarship Portal",
    url: "https://www.scholarshipportal.com",
    description: "European scholarship database for international students",
    features: ["European focus", "Study abroad info", "University partnerships"],
    locationType: 'international'
  },
  {
    name: "Buddy4Study",
    url: "https://www.buddy4study.com",
    description: "India's largest scholarship platform for students",
    features: ["Merit-based scholarships", "Need-based aid", "Government schemes"],
    locationType: 'national'
  },
  {
    name: "CollegeDekho Scholarships",
    url: "https://www.collegedekho.com/scholarships",
    description: "Comprehensive scholarship portal for Indian students",
    features: ["College partnerships", "Easy application", "Expert guidance"],
    locationType: 'national'
  },
  {
    name: "ScholarshipOwl",
    url: "https://scholarshipowl.com",
    description: "Automated scholarship application service",
    features: ["Auto-apply feature", "Essay assistance", "Deadline tracking"],
    locationType: 'international'
  },
  {
    name: "DAAD Scholarships",
    url: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
    description: "German Academic Exchange Service scholarships",
    features: ["Study in Germany", "Research funding", "Language courses"],
    locationType: 'international'
  },
  {
    name: "Chevening Scholarships",
    url: "https://www.chevening.org",
    description: "UK government's global scholarship programme",
    features: ["UK studies", "Leadership development", "Global network"],
    locationType: 'international'
  },
  {
    name: "Fulbright Program",
    url: "https://www.fulbrightonline.org",
    description: "International educational exchange program",
    features: ["Cultural exchange", "Research opportunities", "Global impact"],
    locationType: 'international'
  }
];

const JobSuggestions = () => {
  const [showMoreJobs, setShowMoreJobs] = useState(false);
  const [showMoreInternships, setShowMoreInternships] = useState(false);
  const [showMoreScholarships, setShowMoreScholarships] = useState(false);
  const [showMoreFreelancing, setShowMoreFreelancing] = useState(false);

  const INITIAL_DISPLAY_COUNT = 8;

  const WebsiteCard = ({ website, icon: Icon, accentColor, hoverBorderClass }: { website: Website, icon: LucideIcon, accentColor: string, hoverBorderClass: string }) => (
    <Card className={`group h-full flex flex-col transition-all duration-300 border border-white/5 bg-[#0F1424]/80 shadow-xl overflow-hidden hover:-translate-y-1 ${hoverBorderClass}`}>
      <CardHeader className="pb-4 relative z-10 flex-shrink-0">
        <CardTitle className="flex items-start justify-between gap-3 text-base text-white">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${accentColor} group-hover:scale-105 transition-transform duration-300 shadow-md flex-shrink-0`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold truncate text-white">{website.name}</span>
          </div>
          
          <div className="flex-shrink-0">
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
      
      <CardContent className="flex-1 flex flex-col justify-between space-y-4 relative z-10 px-5 pb-5">
        <div className="space-y-4 flex-1">
          <CardDescription className="text-gray-400 leading-relaxed text-xs line-clamp-2">{website.description}</CardDescription>
          
          <div className="space-y-2">
            <h4 className="text-xs font-black text-gray-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Key Offerings
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              {website.features.slice(0, 3).map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
          
        <Button asChild className="w-full mt-4 h-9 bg-white/5 hover:bg-white/10 text-white font-bold text-xs shadow-md border border-white/10 hover:scale-[1.01] transition-all rounded-xl group/btn">
          <a href={website.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
            <span>Explore Website</span>
            <ExternalLink className="ml-1.5 h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );

  const ShowMoreButton = ({ isExpanded, onClick, count }: { isExpanded: boolean, onClick: () => void, count: number }) => (
    <div className="col-span-full flex justify-center mt-8">
      <Button
        onClick={onClick}
        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs rounded-full px-6 py-2.5 flex items-center gap-2 hover:scale-105 transition-all"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Show Less
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 animate-bounce" />
            Show More ({count - INITIAL_DISPLAY_COUNT} portals)
          </>
        )}
      </Button>
    </div>
  );

  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto py-4 px-0 relative z-10 max-w-5xl">
        
        {/* Job Search Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black mb-2 flex items-center justify-center gap-3 text-white">
              <div className="p-2.5 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg shadow-pink-500/10">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              Job Search Portals
            </h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto">Find your next career opportunity on these leading job search platforms</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {jobSearchWebsites
              .slice(0, showMoreJobs ? jobSearchWebsites.length : INITIAL_DISPLAY_COUNT)
              .map((website, index) => (
                <WebsiteCard 
                  key={index} 
                  website={website} 
                  icon={Briefcase} 
                  accentColor="from-pink-500 to-rose-500"
                  hoverBorderClass="hover:border-pink-500/30"
                />
              ))}
            {jobSearchWebsites.length > INITIAL_DISPLAY_COUNT && (
              <ShowMoreButton
                isExpanded={showMoreJobs}
                onClick={() => setShowMoreJobs(!showMoreJobs)}
                count={jobSearchWebsites.length}
              />
            )}
          </div>
        </section>

        {/* Internship Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black mb-2 flex items-center justify-center gap-3 text-white">
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg shadow-purple-500/10">
                <Users className="w-5 h-5 text-white" />
              </div>
              Internship Opportunities
            </h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto">Launch your career with amazing internship opportunities from top platforms</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {internshipWebsites
              .slice(0, showMoreInternships ? internshipWebsites.length : INITIAL_DISPLAY_COUNT)
              .map((website, index) => (
                <WebsiteCard 
                  key={index} 
                  website={website} 
                  icon={Users} 
                  accentColor="from-purple-500 to-indigo-500"
                  hoverBorderClass="hover:border-purple-500/30"
                />
              ))}
            {internshipWebsites.length > INITIAL_DISPLAY_COUNT && (
              <ShowMoreButton
                isExpanded={showMoreInternships}
                onClick={() => setShowMoreInternships(!showMoreInternships)}
                count={internshipWebsites.length}
              />
            )}
          </div>
        </section>

        {/* Scholarship Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black mb-2 flex items-center justify-center gap-3 text-white">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/10">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              Scholarship Opportunities
            </h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto">Fund your education with scholarships from top platforms worldwide</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {scholarshipWebsites
              .slice(0, showMoreScholarships ? scholarshipWebsites.length : INITIAL_DISPLAY_COUNT)
              .map((website, index) => (
                <WebsiteCard 
                  key={index} 
                  website={website} 
                  icon={GraduationCap} 
                  accentColor="from-blue-500 to-cyan-500"
                  hoverBorderClass="hover:border-blue-500/30"
                />
              ))}
            {scholarshipWebsites.length > INITIAL_DISPLAY_COUNT && (
              <ShowMoreButton
                isExpanded={showMoreScholarships}
                onClick={() => setShowMoreScholarships(!showMoreScholarships)}
                count={scholarshipWebsites.length}
              />
            )}
          </div>
        </section>

        {/* Freelancing Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black mb-2 flex items-center justify-center gap-3 text-white">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/10">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              Freelancing Platforms
            </h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto">Build your independent career with global freelancing opportunities</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {freelancingWebsites
              .slice(0, showMoreFreelancing ? freelancingWebsites.length : INITIAL_DISPLAY_COUNT)
              .map((website, index) => (
                <WebsiteCard 
                  key={index} 
                  website={website} 
                  icon={DollarSign} 
                  accentColor="from-emerald-500 to-teal-500"
                  hoverBorderClass="hover:border-emerald-500/30"
                />
              ))}
            {freelancingWebsites.length > INITIAL_DISPLAY_COUNT && (
              <ShowMoreButton
                isExpanded={showMoreFreelancing}
                onClick={() => setShowMoreFreelancing(!showMoreFreelancing)}
                count={freelancingWebsites.length}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobSuggestions;
