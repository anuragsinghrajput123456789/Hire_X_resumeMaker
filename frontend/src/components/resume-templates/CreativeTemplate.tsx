import { ResumeData } from '../../types/resumeTypes';
import { 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  Globe, 
  Award, 
  Sparkles
} from 'lucide-react';
import { parseBulletPoints, cleanLinkedin, cleanGithub, cleanPortfolio, filterExperience, filterEducation, filterProjects } from '../../lib/resumeHelper';

interface TemplateProps {
  data: ResumeData;
  customSections?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  fontSizeAdjustment?: number;
  lineHeightAdjustment?: string;
  spacingAdjustment?: string;
}

const CreativeTemplate = ({ data, customSections, fontSizeAdjustment, lineHeightAdjustment, spacingAdjustment }: TemplateProps) => {
  const cleanExp = filterExperience(data.experience);
  const cleanEdu = filterEducation(data.education);
  const cleanProj = filterProjects(data.projects);
  // Gracefully handle name splitting
  const nameParts = data.fullName ? data.fullName.trim().split(' ') : [''];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  // Calculate dynamic content density score
  const totalItemsCount = 
    (data.summary ? 1.5 : 0) + 
    cleanExp.length * 2.5 + 
    cleanEdu.length * 1.5 + 
    cleanProj.length * 2.0 + 
    (data.skills && data.skills.length > 0 ? data.skills.length * 0.12 : 0) +
    (data.certifications && data.certifications.length > 0 ? data.certifications.length * 0.12 : 0) +
    (data.languages && data.languages.length > 0 ? data.languages.length * 0.12 : 0) +
    (customSections && customSections.length > 0 ? customSections.length * 2.0 : 0);

  const isLowDensity = totalItemsCount < 9;
  const isHighDensity = totalItemsCount > 16;

  // Spacing and sizing tokens
  const baseFontSize = `calc(${isLowDensity ? '12.5px' : isHighDensity ? '11px' : '11.5px'} + ${fontSizeAdjustment || 0}px)`;
  const headingFontSize = `calc(${isLowDensity ? '15px' : isHighDensity ? '12px' : '13px'} + ${fontSizeAdjustment || 0}px)`;
  
  let sectionSpacing = isLowDensity ? 'space-y-6' : isHighDensity ? 'space-y-3' : 'space-y-4.5';
  let listSpacing = isLowDensity ? 'space-y-2' : isHighDensity ? 'space-y-0.5' : 'space-y-1.5';
  let timelineGap = isLowDensity ? 'space-y-6' : isHighDensity ? 'space-y-3' : 'space-y-5';

  if (spacingAdjustment === 'compact') {
    sectionSpacing = isLowDensity ? 'space-y-4' : isHighDensity ? 'space-y-1.5' : 'space-y-3';
    listSpacing = isLowDensity ? 'space-y-1' : isHighDensity ? 'space-y-0' : 'space-y-0.5';
    timelineGap = isLowDensity ? 'space-y-4' : isHighDensity ? 'space-y-1.5' : 'space-y-3';
  } else if (spacingAdjustment === 'spacious') {
    sectionSpacing = isLowDensity ? 'space-y-8' : isHighDensity ? 'space-y-4.5' : 'space-y-6';
    listSpacing = isLowDensity ? 'space-y-2.5' : isHighDensity ? 'space-y-1' : 'space-y-2';
    timelineGap = isLowDensity ? 'space-y-8' : isHighDensity ? 'space-y-4.5' : 'space-y-6.5';
  }

  const hasSidebarContent = (data.skills && data.skills.length > 0) || 
                            (data.languages && data.languages.length > 0) || 
                            (data.certifications && data.certifications.length > 0);

  const customLineHeight = lineHeightAdjustment === 'tight' ? '1.25' : lineHeightAdjustment === 'loose' ? '1.6' : '1.4';

  return (
    <div 
      className="bg-white text-slate-800 font-sans min-h-[297mm] w-full max-w-[210mm] mx-auto flex flex-row box-border shadow-sm break-words [overflow-wrap:anywhere]"
      style={{ 
        fontFamily: '"Poppins", "Inter", sans-serif', 
        fontSize: baseFontSize,
        lineHeight: customLineHeight
      }}
    >
      
      {/* LEFT SIDEBAR (1/3 Width) - Sophisticated Midnight Navy (Only visible if there is content) */}
      {hasSidebarContent && (
        <div className="w-[32%] min-w-0 bg-slate-950 text-white p-6 flex flex-col gap-6 shrink-0 print:bg-slate-950">
          
          {/* Profile/Design Header inside Sidebar */}
          <div className="flex flex-col items-center text-center mt-2">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3 animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <p className="text-[10px] font-black tracking-[0.25em] text-indigo-400 uppercase">Interactive Profile</p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-indigo-400 uppercase tracking-[0.2em] text-[9.5px] font-black mb-3 border-b border-slate-800 pb-1.5">
              Contact Details
            </h3>
            {/* Contact info - fully inline styles for html2canvas PDF */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10px', color: '#cbd5e1' }}>
              {data.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px', flexShrink: 0, verticalAlign: 'middle' }}>
                    <Mail size={11} strokeWidth={2.5} style={{ display: 'block', color: '#6366f1' }} />
                  </span>
                  <a href={`mailto:${data.email}`} style={{ wordBreak: 'break-all', verticalAlign: 'middle' }}>{data.email}</a>
                </div>
              )}
              {data.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px', flexShrink: 0, verticalAlign: 'middle' }}>
                    <Phone size={11} strokeWidth={2.5} style={{ display: 'block', color: '#6366f1' }} />
                  </span>
                  <span style={{ wordBreak: 'break-word', minWidth: 0, verticalAlign: 'middle' }}>{data.phone}</span>
                </div>
              )}
              {data.linkedin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px', flexShrink: 0, verticalAlign: 'middle' }}>
                    <Linkedin size={11} strokeWidth={2.5} style={{ display: 'block', color: '#6366f1' }} />
                  </span>
                  <a href={data.linkedin} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all', verticalAlign: 'middle' }}>
                    {cleanLinkedin(data.linkedin)}
                  </a>
                </div>
              )}
              {data.github && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px', flexShrink: 0, verticalAlign: 'middle' }}>
                    <Github size={11} strokeWidth={2.5} style={{ display: 'block', color: '#6366f1' }} />
                  </span>
                  <a href={data.github} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all', verticalAlign: 'middle' }}>
                    {cleanGithub(data.github)}
                  </a>
                </div>
              )}
              {data.portfolio && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px', flexShrink: 0, verticalAlign: 'middle' }}>
                    <Globe size={11} strokeWidth={2.5} style={{ display: 'block', color: '#6366f1' }} />
                  </span>
                  <a href={data.portfolio} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all', verticalAlign: 'middle' }}>
                    {cleanPortfolio(data.portfolio)}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Tech Stack Skills Section */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <h3 className="text-indigo-400 uppercase tracking-[0.2em] text-[9.5px] font-black mb-3 border-b border-slate-800 pb-1.5">
                Core Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="max-w-full bg-slate-900 border border-slate-800 text-slate-200 px-2 py-0.5 rounded-lg text-[9.5px] font-semibold leading-tight tracking-wide hover:border-indigo-500/50 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages Section */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h3 className="text-indigo-400 uppercase tracking-[0.2em] text-[9.5px] font-black mb-3 border-b border-slate-800 pb-1.5">
                Languages
              </h3>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex flex-wrap justify-between items-center gap-x-2 gap-y-1 text-[10px] text-slate-300">
                    <span className="min-w-0 font-semibold">{lang}</span>
                    {/* Decorative level dots */}
                    <div className="flex shrink-0 gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                      <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                      <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {data.certifications && data.certifications.length > 0 && (
            <div className="mt-auto">
              <h3 className="text-indigo-400 uppercase tracking-[0.2em] text-[9.5px] font-black mb-3 border-b border-slate-800 pb-1.5">
                Certifications
              </h3>
              <ul className="space-y-2 text-[9.5px] text-slate-300">
                {data.certifications.map((cert, index) => (
                  <li key={index} className="flex items-start gap-2 leading-snug break-inside-avoid" style={{ breakInside: 'avoid' }}>
                    <Award size={11} className="text-indigo-500 shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

      {/* RIGHT MAIN COLUMN (2/3 Width, transforms to full-width when sidebar is collapsed) */}
      <div className={`${hasSidebarContent ? 'w-[68%]' : 'w-full'} min-w-0 p-6 sm:p-8 flex flex-col gap-6 overflow-hidden`}>
        
        {/* Large Styled Header */}
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight tracking-tight uppercase" style={{ fontSize: isLowDensity ? '42px' : isHighDensity ? '34px' : '38px' }}>
            {firstName}
            {lastName && (
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent block font-black">
                {lastName}
              </span>
            )}
          </h1>
          {data.jobRole && (
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-start gap-1.5 leading-tight" style={{ fontSize: isLowDensity ? '13px' : '10.5px' }}>
              <span className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
              {data.jobRole}
            </p>
          )}

          {/* Fallback Inline Contact Bar (If sidebar is hidden) */}
          {!hasSidebarContent && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 font-medium mt-4 border-t border-slate-100 pt-4" style={{ fontSize: isLowDensity ? '11px' : '9.5px' }}>
              {data.email && (
                <div className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px', flexShrink: 0, verticalAlign: 'middle' }}>
                    <Mail size={11} strokeWidth={2.5} style={{ display: 'block', color: '#6366f1' }} />
                  </span>
                  <a href={`mailto:${data.email}`} className="break-all" style={{ verticalAlign: 'middle' }}>{data.email}</a>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-1.5">
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px', flexShrink: 0, verticalAlign: 'middle' }}>
                    <Phone size={11} strokeWidth={2.5} style={{ display: 'block', color: '#6366f1' }} />
                  </span>
                  <span className="break-words" style={{ verticalAlign: 'middle' }}>{data.phone}</span>
                </div>
              )}
              {data.linkedin && (
                <div className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px', flexShrink: 0, verticalAlign: 'middle' }}>
                    <Linkedin size={11} strokeWidth={2.5} style={{ display: 'block', color: '#6366f1' }} />
                  </span>
                  <a href={data.linkedin} target="_blank" rel="noopener noreferrer" style={{ verticalAlign: 'middle' }}>{cleanLinkedin(data.linkedin)}</a>
                </div>
              )}
              {data.github && (
                <div className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px', flexShrink: 0, verticalAlign: 'middle' }}>
                    <Github size={11} strokeWidth={2.5} style={{ display: 'block', color: '#6366f1' }} />
                  </span>
                  <a href={data.github} target="_blank" rel="noopener noreferrer" style={{ verticalAlign: 'middle' }}>{cleanGithub(data.github)}</a>
                </div>
              )}
              {data.portfolio && (
                <div className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px', flexShrink: 0, verticalAlign: 'middle' }}>
                    <Globe size={11} strokeWidth={2.5} style={{ display: 'block', color: '#6366f1' }} />
                  </span>
                  <a href={data.portfolio} target="_blank" rel="noopener noreferrer" style={{ verticalAlign: 'middle' }}>{cleanPortfolio(data.portfolio)}</a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary Description / About Me */}
        {data.summary && (
          <div>
            <h2 className="font-bold text-slate-900 border-l-4 border-indigo-600 pl-3 mb-2.5 uppercase tracking-wider" style={{ fontSize: headingFontSize }}>
              Profile Summary
            </h2>
            <p className="text-[#475569] leading-relaxed text-justify">
              {data.summary}
            </p>
          </div>
        )}

        {/* Education Section */}
        {cleanEdu && cleanEdu.length > 0 && (
          <div>
            <h2 className="font-bold text-slate-900 border-l-4 border-indigo-600 pl-3 mb-3.5 uppercase tracking-wider" style={{ fontSize: headingFontSize }}>
              Education
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {cleanEdu.map((edu, index) => (
                <div key={index} className="min-w-0 bg-slate-50 border border-slate-100 p-3 rounded-xl hover:shadow-sm transition-shadow break-inside-avoid" style={{ breakInside: 'avoid' }}>
                  <div className="text-slate-900 font-bold leading-tight mb-0.5" style={{ fontSize: isLowDensity ? '12px' : '10.5px' }}>{edu.degree}</div>
                  <div className="text-indigo-600 font-semibold text-[10px]">{edu.institution}</div>
                  <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-1 text-[9px] text-slate-400 font-bold mt-2">
                    <span className="min-w-0">{edu.year}</span>
                    {edu.gpa && (
                      <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-black">
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section with elegant visual timeline track */}
        {cleanExp && cleanExp.length > 0 && (
          <div>
            <h2 className="font-bold text-slate-900 border-l-4 border-indigo-600 pl-3 mb-4 uppercase tracking-wider" style={{ fontSize: headingFontSize }}>
              Experience Timeline
            </h2>
            
            <div className="space-y-5 relative pl-4 border-l-2 border-indigo-50/70 ml-1.5">
              {cleanExp.map((exp, index) => (
                <div key={index} className="relative group break-inside-avoid" style={{ breakInside: 'avoid' }}>
                  {/* Timeline node */}
                  <div className="absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-600 border-[3px] border-white shadow-md shadow-indigo-500/20 group-hover:scale-125 transition-transform" />
                  
                  <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 mb-1">
                    <h3 className="min-w-0 font-black text-slate-800 leading-tight" style={{ fontSize: isLowDensity ? '13px' : '11px' }}>
                      {exp.role}
                    </h3>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider shrink-0 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded" style={{ fontSize: isLowDensity ? '10px' : '8.5px' }}>
                      {exp.duration}
                    </span>
                  </div>
                  <div className="text-indigo-600 font-bold text-[10px] mb-2 break-words">{exp.company}</div>
                  
                  <ul className="space-y-1 mt-1.5">
                     {parseBulletPoints(exp.description).map((bullet, idx) => (
                      <li key={idx} className="text-[#475569] leading-relaxed flex items-start gap-2 text-justify">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        <span className="flex-1">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Projects Section */}
        {cleanProj && cleanProj.length > 0 && (
          <div>
            <h2 className="font-bold text-slate-900 border-l-4 border-indigo-600 pl-3 mb-3.5 uppercase tracking-wider" style={{ fontSize: headingFontSize }}>
              Key Projects
            </h2>
            <div className="grid gap-3">
              {cleanProj.map((project, index) => (
                <div key={index} className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl hover:shadow-sm transition-all group break-inside-avoid" style={{ breakInside: 'avoid' }}>
                  <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                    <h3 className="min-w-0 font-extrabold text-slate-800 uppercase tracking-tight" style={{ fontSize: isLowDensity ? '12px' : '10.5px' }}>{project.name}</h3>
                    {project.technologies && (
                      <span className="max-w-full text-[9px] font-bold text-pink-600 bg-pink-50 border border-pink-100 px-1.5 py-0.5 rounded uppercase tracking-wide">
                        {project.technologies}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1 mt-2">
                    {parseBulletPoints(project.description).map((bullet, idx) => (
                      <li key={idx} className="text-[10px] text-[#475569] leading-snug flex items-start gap-1.5 text-justify">
                        <div className="w-1 h-1 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                        <span className="flex-1">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {data.achievements && data.achievements.length > 0 && (
          <div>
            <h2 className="font-bold text-slate-900 border-l-4 border-indigo-600 pl-3 mb-3 uppercase tracking-wider" style={{ fontSize: headingFontSize }}>
              Key Achievements & Honors
            </h2>
            <ul className="space-y-1.5 ml-1">
              {data.achievements.map((ach, i) => (
                <li key={i} className="text-[#475569] leading-relaxed flex items-start gap-2 text-[10px] break-inside-avoid" style={{ breakInside: 'avoid' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span>{ach}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Inline Custom Sections */}
        {customSections && customSections.length > 0 && (
          <div className={sectionSpacing}>
            {customSections.map((section) => (
              <section key={section.id} className="break-inside-avoid" style={{ breakInside: 'avoid' }}>
                <h2 className="font-bold text-slate-900 border-l-4 border-indigo-600 pl-3 mb-2.5 uppercase tracking-wider" style={{ fontSize: headingFontSize }}>
                  {section.title}
                </h2>
                <p className="text-[#475569] leading-relaxed text-justify whitespace-pre-wrap">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CreativeTemplate;
