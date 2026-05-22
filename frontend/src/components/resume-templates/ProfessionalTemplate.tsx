import { ResumeData } from '../../types/resumeTypes';
import { Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';
import { parseBulletPoints, cleanLinkedin, cleanGithub, cleanPortfolio, filterExperience, filterEducation, filterProjects } from '../../lib/resumeHelper';

interface TemplateProps {
  data: ResumeData;
  customSections?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

const ProfessionalTemplate = ({ data, customSections }: TemplateProps) => {
  const cleanExp = filterExperience(data.experience);
  const cleanEdu = filterEducation(data.education);
  const cleanProj = filterProjects(data.projects);

  // Dynamic Content Density Calculator to adjust font sizes and layouts automatically
  const totalItemsCount = 
    (data.summary ? 1.5 : 0) + 
    cleanExp.length * 2.5 + 
    cleanEdu.length * 1.5 + 
    cleanProj.length * 2.0 + 
    (data.skills && data.skills.length > 0 ? data.skills.length * 0.15 : 0) +
    (data.certifications && data.certifications.length > 0 ? data.certifications.length * 0.15 : 0) +
    (data.languages && data.languages.length > 0 ? data.languages.length * 0.15 : 0) +
    (customSections && customSections.length > 0 ? customSections.length * 2.0 : 0);

  const isLowDensity = totalItemsCount < 9;
  const isHighDensity = totalItemsCount > 16;

  // Spacing and sizing tokens
  const baseFontSize = isLowDensity ? '12px' : isHighDensity ? '10.5px' : '11.5px';
  const headingFontSize = isLowDensity ? '13px' : isHighDensity ? '11px' : '12px';
  const contactFontSize = isLowDensity ? '11px' : isHighDensity ? '9px' : '10px';
  const sectionSpacing = isLowDensity ? 'mb-6' : isHighDensity ? 'mb-2.5' : 'mb-4';
  const itemSpacing = isLowDensity ? 'space-y-4' : isHighDensity ? 'space-y-2' : 'space-y-3';
  const listSpacing = isLowDensity ? 'space-y-1.5' : isHighDensity ? 'space-y-0.5' : 'space-y-1';

  return (
    <div 
      className="bg-white text-gray-900 p-8 sm:p-10 font-sans min-h-[297mm] w-full max-w-[210mm] mx-auto box-border leading-normal selection:bg-gray-200 break-words [overflow-wrap:anywhere]"
      style={{ 
        fontFamily: '"Arial", "Helvetica", "Inter", sans-serif', 
        fontSize: baseFontSize,
        lineHeight: '1.4'
      }}
    >
      
      {/* ATS Recruiter Header */}
      <div className="border-b-2 border-gray-900 pb-3 mb-5">
        <div className="flex flex-wrap justify-between items-end gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-black uppercase tracking-wide leading-tight mb-1" style={{ fontSize: isLowDensity ? '26px' : isHighDensity ? '20px' : '23px' }}>
              {data.fullName}
            </h1>
            {data.jobRole && (
              <p className="font-bold text-gray-700 uppercase tracking-widest leading-tight" style={{ fontSize: isLowDensity ? '12px' : isHighDensity ? '9.5px' : '10.5px' }}>
                {data.jobRole}
              </p>
            )}
          </div>
          
          {/* Contact Details Column - fully inline styles for html2canvas PDF */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: '190px', maxWidth: '100%', gap: '5px', color: '#1f2937', fontWeight: 500, fontSize: contactFontSize }}>
            {data.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: `${isLowDensity ? 12 : isHighDensity ? 10 : 11}px`, height: `${isLowDensity ? 12 : isHighDensity ? 10 : 11}px`, flexShrink: 0 }}>
                  <Mail size={isLowDensity ? 12 : isHighDensity ? 10 : 11} style={{ display: 'block', color: '#4b5563' }} />
                </span>
                <a href={`mailto:${data.email}`} style={{ minWidth: 0, wordBreak: 'break-all', textAlign: 'left' }}>{data.email}</a>
              </div>
            )}
            {data.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: `${isLowDensity ? 12 : isHighDensity ? 10 : 11}px`, height: `${isLowDensity ? 12 : isHighDensity ? 10 : 11}px`, flexShrink: 0 }}>
                  <Phone size={isLowDensity ? 12 : isHighDensity ? 10 : 11} style={{ display: 'block', color: '#4b5563' }} />
                </span>
                <span style={{ minWidth: 0, wordBreak: 'break-word', textAlign: 'left' }}>{data.phone}</span>
              </div>
            )}
            {data.linkedin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: `${isLowDensity ? 12 : isHighDensity ? 10 : 11}px`, height: `${isLowDensity ? 12 : isHighDensity ? 10 : 11}px`, flexShrink: 0 }}>
                  <Linkedin size={isLowDensity ? 12 : isHighDensity ? 10 : 11} style={{ display: 'block', color: '#4b5563' }} />
                </span>
                <a href={data.linkedin} target="_blank" rel="noopener noreferrer" style={{ minWidth: 0, wordBreak: 'break-all', textAlign: 'left' }}>
                  {cleanLinkedin(data.linkedin)}
                </a>
              </div>
            )}
            {data.github && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: `${isLowDensity ? 12 : isHighDensity ? 10 : 11}px`, height: `${isLowDensity ? 12 : isHighDensity ? 10 : 11}px`, flexShrink: 0 }}>
                  <Github size={isLowDensity ? 12 : isHighDensity ? 10 : 11} style={{ display: 'block', color: '#4b5563' }} />
                </span>
                <a href={data.github} target="_blank" rel="noopener noreferrer" style={{ minWidth: 0, wordBreak: 'break-all', textAlign: 'left' }}>
                  {cleanGithub(data.github)}
                </a>
              </div>
            )}
            {data.portfolio && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: `${isLowDensity ? 12 : isHighDensity ? 10 : 11}px`, height: `${isLowDensity ? 12 : isHighDensity ? 10 : 11}px`, flexShrink: 0 }}>
                  <Globe size={isLowDensity ? 12 : isHighDensity ? 10 : 11} style={{ display: 'block', color: '#4b5563' }} />
                </span>
                <a href={data.portfolio} target="_blank" rel="noopener noreferrer" style={{ minWidth: 0, wordBreak: 'break-all', textAlign: 'left' }}>
                  {cleanPortfolio(data.portfolio)}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <section className={sectionSpacing}>
          <h2 className="font-bold text-black uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
            Professional Summary
          </h2>
          <hr className="border-t border-gray-400 mt-1 mb-2" />
          <p className="text-gray-900 leading-relaxed text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {/* Core Competencies / Skills (Recruiter friendly grid) */}
      {data.skills && data.skills.length > 0 && (
        <section className={sectionSpacing}>
          <h2 className="font-bold text-black uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
            Core Competencies & Technical Skills
          </h2>
          <hr className="border-t border-gray-400 mt-1 mb-2" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex min-w-0 items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0" />
                <span className="font-semibold text-gray-900 leading-tight">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {cleanExp && cleanExp.length > 0 && (
        <section className={sectionSpacing}>
          <h2 className="font-bold text-black uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
            Professional Experience
          </h2>
          <hr className="border-t border-gray-400 mt-1 mb-2.5" />
          <div className={itemSpacing}>
            {cleanExp.map((exp, index) => (
              <div key={index} className="break-inside-avoid" style={{ breakInside: 'avoid' }}>
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 mb-0.5">
                  <div className="min-w-0 font-bold text-black" style={{ fontSize: isLowDensity ? '12.5px' : isHighDensity ? '10.5px' : '11.5px' }}>
                    <span>{exp.role}</span>
                    <span className="font-normal text-gray-400 px-2">|</span>
                    <span className="font-bold text-gray-700">{exp.company}</span>
                  </div>
                  <span className="shrink-0 font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200" style={{ fontSize: isLowDensity ? '10px' : isHighDensity ? '8.5px' : '9px' }}>
                    {exp.duration}
                  </span>
                </div>
                
                <ul className={`list-disc list-outside ml-4 mt-1.5 ${listSpacing} text-gray-900 leading-relaxed text-justify`}>
                  {parseBulletPoints(exp.description).map((bullet, i) => (
                    <li key={i} className="pl-0.5">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Selected Projects */}
      {cleanProj && cleanProj.length > 0 && (
        <section className={sectionSpacing}>
          <h2 className="font-bold text-black uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
            Selected Projects
          </h2>
          <hr className="border-t border-gray-400 mt-1 mb-2.5" />
          <div className={itemSpacing}>
            {cleanProj.map((project, index) => (
              <div key={index} className="break-inside-avoid" style={{ breakInside: 'avoid' }}>
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 mb-0.5">
                  <div className="min-w-0 font-bold text-black" style={{ fontSize: isLowDensity ? '12px' : isHighDensity ? '10.5px' : '11px' }}>
                    <span>{project.name}</span>
                    {project.technologies && (
                      <>
                        <span className="font-normal text-gray-400 px-2">|</span>
                        <span className="text-gray-600 font-semibold" style={{ fontSize: isLowDensity ? '11px' : isHighDensity ? '9px' : '10px' }}>{project.technologies}</span>
                      </>
                    )}
                  </div>
                </div>
                <ul className={`list-disc list-outside ml-4 mt-1 ${listSpacing} text-gray-900 leading-relaxed text-justify`}>
                  {parseBulletPoints(project.description).map((bullet, i) => (
                    <li key={i} className="pl-0.5">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {cleanEdu && cleanEdu.length > 0 && (
        <section className={sectionSpacing}>
          <h2 className="font-bold text-black uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
            Education & Academic Credentials
          </h2>
          <hr className="border-t border-gray-400 mt-1 mb-2" />
          <div className="space-y-2.5">
            {cleanEdu.map((edu, index) => (
              <div key={index} className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 break-inside-avoid" style={{ breakInside: 'avoid' }}>
                <div className="min-w-0">
                  <span className="font-bold text-black">{edu.degree}</span>
                  <span className="font-normal text-gray-400 px-2">|</span>
                  <span className="font-semibold text-gray-700 italic">{edu.institution}</span>
                  {edu.gpa && <span className="text-gray-600 font-bold ml-2" style={{ fontSize: isLowDensity ? '10.5px' : isHighDensity ? '8.5px' : '9.5px' }}>(GPA: {edu.gpa})</span>}
                </div>
                <span className="shrink-0 font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200" style={{ fontSize: isLowDensity ? '10px' : isHighDensity ? '8.5px' : '9px' }}>
                  {edu.year}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid Layout for Certifications, Languages, Achievements */}
      {((data.certifications && data.certifications.length > 0) || 
        (data.languages && data.languages.length > 0) || 
        (data.achievements && data.achievements.length > 0)) && (
        <div className={`grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 ${sectionSpacing}`}>
          {data.certifications && data.certifications.length > 0 && (
            <div className="break-inside-avoid" style={{ breakInside: 'avoid' }}>
              <h2 className="font-bold text-black uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
                Professional Certifications
              </h2>
              <hr className="border-t border-gray-400 mt-1 mb-2" />
              <div className="grid grid-cols-1 gap-1">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="flex min-w-0 items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0 mt-1.5" />
                    <span className="font-semibold text-gray-900">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.languages && data.languages.length > 0 && (
            <div className="break-inside-avoid" style={{ breakInside: 'avoid' }}>
              <h2 className="font-bold text-black uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
                Languages Spoken
              </h2>
              <hr className="border-t border-gray-400 mt-1 mb-2" />
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex min-w-0 items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0 mt-1.5" />
                    <span className="font-semibold text-gray-900">{lang}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.achievements && data.achievements.length > 0 && (
            <div className={`break-inside-avoid ${((data.certifications && data.certifications.length > 0) || (data.languages && data.languages.length > 0)) ? 'sm:col-span-2' : 'col-span-1'}`} style={{ breakInside: 'avoid' }}>
              <h2 className="font-bold text-black uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
                Achievements & Technical Commendations
              </h2>
              <hr className="border-t border-gray-400 mt-1 mb-2" />
              <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
                {data.achievements.map((achievement, index) => (
                  <div key={index} className="flex min-w-0 items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0 mt-1.5" />
                    <span className="text-gray-900">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inline Custom Sections */}
      {customSections && customSections.length > 0 && (
        <div className={itemSpacing}>
          {customSections.map((section) => (
            <section key={section.id} className={`break-inside-avoid ${sectionSpacing}`} style={{ breakInside: 'avoid' }}>
              <h2 className="font-bold text-black uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
                {section.title}
              </h2>
              <hr className="border-t border-gray-400 mt-1 mb-2" />
              <p className="text-gray-900 leading-relaxed text-justify whitespace-pre-wrap">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      )}

    </div>
  );
};

export default ProfessionalTemplate;
