import { ResumeData } from '../../types/resumeTypes';
import { 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code2, 
  Languages, 
  Milestone
} from 'lucide-react';
import { parseBulletPoints, cleanLinkedin, cleanGithub, cleanPortfolio, filterExperience, filterEducation, filterProjects } from '../../lib/resumeHelper';

interface TemplateProps {
  data: ResumeData;
  customSections?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

const ModernTemplate = ({ data, customSections }: TemplateProps) => {
  const cleanExp = filterExperience(data.experience);
  const cleanEdu = filterEducation(data.education);
  const cleanProj = filterProjects(data.projects);

  // Dynamic Spacing / Readability Score Calculator
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

  // Adaptive typography and spacing tokens
  const baseFontSize = isLowDensity ? '12.5px' : isHighDensity ? '11px' : '11.5px';
  const headingFontSize = isLowDensity ? '12px' : isHighDensity ? '10px' : '11px';
  const sectionSpacing = isLowDensity ? 'mb-7' : isHighDensity ? 'mb-3' : 'mb-5';
  const itemSpacing = isLowDensity ? 'space-y-5' : isHighDensity ? 'space-y-2.5' : 'space-y-4';
  const listSpacing = isLowDensity ? 'space-y-2' : isHighDensity ? 'space-y-0.5' : 'space-y-1.5';
  const colGap = isLowDensity ? 'gap-8' : isHighDensity ? 'gap-4' : 'gap-6';
  const contactIconSize = isLowDensity ? 11 : isHighDensity ? 9.5 : 10.5;

  const hasLeftCol = (data.skills && data.skills.length > 0) || 
                      (data.certifications && data.certifications.length > 0) || 
                      (data.languages && data.languages.length > 0);
  const hasRightCol = (cleanEdu && cleanEdu.length > 0) || 
                       (data.achievements && data.achievements.length > 0);

  return (
    <div 
      className="bg-white text-[#1e293b] p-8 sm:p-10 font-sans min-h-[297mm] w-full max-w-[210mm] mx-auto box-border leading-normal selection:bg-indigo-100 break-words [overflow-wrap:anywhere]"
      style={{ 
        fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif', 
        fontSize: baseFontSize 
      }}
    >
      {/* Header Section */}
      <div className="border-b border-slate-100 pb-5 mb-5">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight leading-tight mb-1" style={{ fontSize: isLowDensity ? '32px' : isHighDensity ? '26px' : '28px' }}>
              {data.fullName}
            </h1>
            {data.jobRole && (
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider leading-tight" style={{ fontSize: isLowDensity ? '14px' : isHighDensity ? '12px' : '13px' }}>
                {data.jobRole}
              </p>
            )}
          </div>

          {/* Contact Details Grid - fully inline styles for reliable html2canvas PDF capture */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '5px 12px',
            minWidth: '220px',
            maxWidth: '100%',
            fontSize: isLowDensity ? '11px' : isHighDensity ? '9.5px' : '10px',
            color: '#475569',
            fontWeight: 500
          }}>
            {data.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: `${contactIconSize}px`, height: `${contactIconSize}px`, flexShrink: 0 }}>
                  <Mail size={contactIconSize} style={{ display: 'block', color: '#6366f1' }} />
                </span>
                <a href={`mailto:${data.email}`} style={{ minWidth: 0, wordBreak: 'break-all' }}>{data.email}</a>
              </div>
            )}
            {data.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: `${contactIconSize}px`, height: `${contactIconSize}px`, flexShrink: 0 }}>
                  <Phone size={contactIconSize} style={{ display: 'block', color: '#6366f1' }} />
                </span>
                <span style={{ minWidth: 0, wordBreak: 'break-word' }}>{data.phone}</span>
              </div>
            )}
            {data.linkedin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: `${contactIconSize}px`, height: `${contactIconSize}px`, flexShrink: 0 }}>
                  <Linkedin size={contactIconSize} style={{ display: 'block', color: '#6366f1' }} />
                </span>
                <a href={data.linkedin} target="_blank" rel="noopener noreferrer" style={{ minWidth: 0, wordBreak: 'break-all' }}>
                  {cleanLinkedin(data.linkedin)}
                </a>
              </div>
            )}
            {data.github && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: `${contactIconSize}px`, height: `${contactIconSize}px`, flexShrink: 0 }}>
                  <Github size={contactIconSize} style={{ display: 'block', color: '#6366f1' }} />
                </span>
                <a href={data.github} target="_blank" rel="noopener noreferrer" style={{ minWidth: 0, wordBreak: 'break-all' }}>
                  {cleanGithub(data.github)}
                </a>
              </div>
            )}
            {data.portfolio && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0, gridColumn: '1 / -1' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: `${contactIconSize}px`, height: `${contactIconSize}px`, flexShrink: 0 }}>
                  <Globe size={contactIconSize} style={{ display: 'block', color: '#6366f1' }} />
                </span>
                <a href={data.portfolio} target="_blank" rel="noopener noreferrer" style={{ minWidth: 0, wordBreak: 'break-all' }}>
                  {cleanPortfolio(data.portfolio)}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {data.summary && (
        <section className={sectionSpacing}>
          <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3 mb-2.5">
            <h2 className="font-bold text-[#0f172a] uppercase tracking-wider" style={{ fontSize: isLowDensity ? '13px' : isHighDensity ? '11px' : '12px' }}>
              Professional Summary
            </h2>
          </div>
          <p className="text-[#334155] leading-relaxed text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {/* Dynamic Grid Layout - auto collapses when columns are empty */}
      {(hasLeftCol || hasRightCol) && (
        <div className={`grid grid-cols-12 ${colGap} ${sectionSpacing}`}>
          
          {/* Left Side: Skills & Certifications & Languages */}
          {hasLeftCol && (
            <div className={`${hasRightCol ? 'col-span-4' : 'col-span-12'} min-w-0 space-y-5`}>
              {/* Tech Stack */}
              {data.skills && data.skills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-2.5 mb-2.5">
                    <h2 className="font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1" style={{ fontSize: headingFontSize }}>
                      <Code2 size={12} className="text-indigo-600" /> Skills
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {data.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="max-w-full bg-indigo-50/70 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[9.5px] font-medium leading-tight"
                        style={{ fontSize: isLowDensity ? '10.5px' : '9px' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {data.certifications && data.certifications.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-2.5 mb-2.5">
                    <h2 className="font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1" style={{ fontSize: headingFontSize }}>
                      <Award size={12} className="text-indigo-600" /> Certifications
                    </h2>
                  </div>
                  <ul className="space-y-1 text-[#475569]" style={{ fontSize: isLowDensity ? '11px' : '9.5px' }}>
                    {data.certifications.map((cert, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-tight break-inside-avoid" style={{ breakInside: 'avoid' }}>
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                        <span className="min-w-0">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Languages */}
              {data.languages && data.languages.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-2.5 mb-2.5">
                    <h2 className="font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1" style={{ fontSize: headingFontSize }}>
                      <Languages size={12} className="text-indigo-600" /> Languages
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.languages.map((lang, index) => (
                      <span 
                        key={index} 
                        className="max-w-full bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[9.5px] font-medium leading-tight"
                        style={{ fontSize: isLowDensity ? '10px' : '9px' }}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right Side: Education & Achievements */}
          {hasRightCol && (
            <div className={`${hasLeftCol ? 'col-span-8' : 'col-span-12'} min-w-0 space-y-5`}>
              {/* Education */}
              {cleanEdu && cleanEdu.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-2.5 mb-2.5">
                    <h2 className="font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1" style={{ fontSize: headingFontSize }}>
                      <GraduationCap size={13} className="text-indigo-600" /> Education
                    </h2>
                  </div>
                  <div className="space-y-2.5">
                    {cleanEdu.map((edu, index) => (
                      <div key={index} className="group break-inside-avoid" style={{ breakInside: 'avoid' }}>
                        <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 mb-0.5">
                          <h3 className="min-w-0 font-bold text-slate-800" style={{ fontSize: isLowDensity ? '13px' : '11px' }}>
                            {edu.degree}
                          </h3>
                          <span className="shrink-0 font-bold text-slate-500" style={{ fontSize: isLowDensity ? '11px' : '9.5px' }}>{edu.year}</span>
                        </div>
                        <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-[#475569]" style={{ fontSize: isLowDensity ? '11px' : '10px' }}>
                          <span className="min-w-0 font-medium italic">{edu.institution}</span>
                          {edu.gpa && (
                            <span className="text-indigo-600 font-semibold bg-indigo-50 px-1.5 rounded text-[9.5px]">
                              GPA: {edu.gpa}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {data.achievements && data.achievements.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-2.5 mb-2.5">
                    <h2 className="font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1" style={{ fontSize: headingFontSize }}>
                      <Milestone size={12} className="text-indigo-600" /> Key Achievements
                    </h2>
                  </div>
                  <ul className="space-y-1.5 text-[#475569]" style={{ fontSize: isLowDensity ? '11px' : '10px' }}>
                    {data.achievements.map((ach, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed break-inside-avoid" style={{ breakInside: 'avoid' }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Professional Experience Section */}
      {cleanExp && cleanExp.length > 0 && (
        <section className={`${sectionSpacing} border-t border-slate-100 pt-5`}>
          <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3 mb-3.5">
            <h2 className="font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5" style={{ fontSize: isLowDensity ? '13px' : '12px' }}>
              <Briefcase size={13} className="text-indigo-600" /> Professional Experience
            </h2>
          </div>
          <div className={itemSpacing}>
            {cleanExp.map((exp, index) => (
              <div key={index} className="relative break-inside-avoid" style={{ breakInside: 'avoid' }}>
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 mb-1">
                  <h3 className="min-w-0 font-extrabold text-[#0f172a]" style={{ fontSize: isLowDensity ? '13px' : '11.5px' }}>
                    {exp.role} <span className="font-normal text-[#64748b]">at</span> <span className="text-indigo-600 font-semibold">{exp.company}</span>
                  </h3>
                  <span className="shrink-0 font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded" style={{ fontSize: isLowDensity ? '11px' : '9.5px' }}>
                    {exp.duration}
                  </span>
                </div>
                <ul className={`space-y-1 mt-1.5 ml-1 ${listSpacing}`}>
                  {parseBulletPoints(exp.description).map((bullet, i) => (
                    <li key={i} className="text-[#334155] leading-relaxed flex items-start gap-2 text-justify">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span className="flex-1">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Projects Section */}
      {cleanProj && cleanProj.length > 0 && (
        <section className={`${sectionSpacing} border-t border-slate-100 pt-5`}>
          <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3 mb-3.5">
            <h2 className="font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5" style={{ fontSize: isLowDensity ? '13px' : '12px' }}>
              <Code2 size={13} className="text-indigo-600" /> Selected Projects
            </h2>
          </div>
          <div className={itemSpacing}>
            {cleanProj.map((project, index) => (
              <div key={index} className="break-inside-avoid" style={{ breakInside: 'avoid' }}>
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 mb-1">
                  <div className="flex min-w-0 items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-slate-800" style={{ fontSize: isLowDensity ? '13px' : '11.5px' }}>
                      {project.name}
                    </h3>
                    {project.technologies && (
                      <span className="max-w-full text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-semibold border border-indigo-100" style={{ fontSize: isLowDensity ? '10.5px' : '9px' }}>
                        {project.technologies}
                      </span>
                    )}
                  </div>
                </div>
                <ul className={`space-y-1 mt-1.5 ml-1 ${listSpacing}`}>
                  {parseBulletPoints(project.description).map((bullet, i) => (
                    <li key={i} className="text-[#334155] leading-relaxed flex items-start gap-2 text-justify">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span className="flex-1">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Inline Custom Sections */}
      {customSections && customSections.length > 0 && (
        <div className="border-t border-slate-100 pt-5">
          {customSections.map((section) => (
            <section key={section.id} className={sectionSpacing}>
              <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3 mb-2.5">
                <h2 className="font-bold text-[#0f172a] uppercase tracking-wider" style={{ fontSize: isLowDensity ? '13px' : '12px' }}>
                  {section.title}
                </h2>
              </div>
              <p className="text-[#334155] leading-relaxed whitespace-pre-wrap text-justify">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      )}

    </div>
  );
};

export default ModernTemplate;

