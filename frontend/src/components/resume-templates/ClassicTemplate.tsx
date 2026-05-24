import React, { Fragment } from 'react';
import { ResumeData } from '../../types/resumeTypes';
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

const ClassicTemplate = ({ data, customSections, fontSizeAdjustment, lineHeightAdjustment, spacingAdjustment }: TemplateProps) => {
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
  const baseFontSize = `calc(${isLowDensity ? '13px' : isHighDensity ? '11px' : '12px'} + ${fontSizeAdjustment || 0}px)`;
  const headingFontSize = `calc(${isLowDensity ? '13px' : isHighDensity ? '11px' : '12px'} + ${fontSizeAdjustment || 0}px)`;
  const contactFontSize = `calc(${isLowDensity ? '11px' : isHighDensity ? '9.5px' : '10px'} + ${fontSizeAdjustment || 0}px)`;
  
  let sectionSpacing = isLowDensity ? 'mb-6' : isHighDensity ? 'mb-2.5' : 'mb-4';
  let itemSpacing = isLowDensity ? 'space-y-4' : isHighDensity ? 'space-y-2' : 'space-y-3';
  let listSpacing = isLowDensity ? 'space-y-1.5' : isHighDensity ? 'space-y-0.5' : 'space-y-1';

  if (spacingAdjustment === 'compact') {
    sectionSpacing = isLowDensity ? 'mb-4' : isHighDensity ? 'mb-1.5' : 'mb-2.5';
    itemSpacing = isLowDensity ? 'space-y-2.5' : isHighDensity ? 'space-y-1' : 'space-y-1.5';
    listSpacing = isLowDensity ? 'space-y-1' : isHighDensity ? 'space-y-0' : 'space-y-0.5';
  } else if (spacingAdjustment === 'spacious') {
    sectionSpacing = isLowDensity ? 'mb-8' : isHighDensity ? 'mb-4' : 'mb-6';
    itemSpacing = isLowDensity ? 'space-y-6' : isHighDensity ? 'space-y-3.5' : 'space-y-5';
    listSpacing = isLowDensity ? 'space-y-2' : isHighDensity ? 'space-y-1' : 'space-y-1.5';
  }

  const customLineHeight = lineHeightAdjustment === 'tight' ? '1.25' : lineHeightAdjustment === 'loose' ? '1.6' : '1.4';

  // Construct dynamic inline contact info
  const contactItems: React.ReactNode[] = [];
  
  if (data.phone) {
    contactItems.push(<span key="phone">{data.phone}</span>);
  }
  
  if (data.email) {
    contactItems.push(
      <a key="email" href={`mailto:${data.email}`} className="break-all hover:underline">
        {data.email}
      </a>
    );
  }
  
  if (data.linkedin) {
    contactItems.push(
      <a key="linkedin" href={data.linkedin} target="_blank" rel="noopener noreferrer" className="break-all hover:underline">
        {cleanLinkedin(data.linkedin)}
      </a>
    );
  }
  
  if (data.github) {
    contactItems.push(
      <a key="github" href={data.github} target="_blank" rel="noopener noreferrer" className="break-all hover:underline">
        {cleanGithub(data.github)}
      </a>
    );
  }
  
  if (data.portfolio) {
    contactItems.push(
      <a key="portfolio" href={data.portfolio} target="_blank" rel="noopener noreferrer" className="break-all hover:underline">
        {cleanPortfolio(data.portfolio)}
      </a>
    );
  }

  return (
    <div 
      className="bg-white text-black p-8 sm:p-10 font-sans min-h-[297mm] w-full max-w-[210mm] mx-auto box-border leading-normal selection:bg-slate-100 break-words [overflow-wrap:anywhere]"
      style={{ 
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', 
        fontSize: baseFontSize,
        lineHeight: customLineHeight
      }}
    >
      {/* Centered Minimalist Header */}
      <div className="w-full flex flex-col items-center justify-center text-center mb-5">
        <h1 className="max-w-full font-bold text-gray-950 tracking-tight mb-1 text-center font-sans leading-tight" style={{ fontSize: isLowDensity ? '26px' : isHighDensity ? '20px' : '22px' }}>
          {data.fullName}
        </h1>
        {data.jobRole && (
          <p className="max-w-full font-semibold text-gray-600 uppercase tracking-wider mb-1 text-center leading-tight" style={{ fontSize: isLowDensity ? '13px' : isHighDensity ? '10px' : '11px' }}>
            {data.jobRole}
          </p>
        )}
        
        {/* Contact info list with simple pipes */}
        <div className="w-full flex flex-wrap justify-center items-center gap-x-2 tracking-wide font-sans mt-0.5" style={{ fontSize: contactFontSize }}>
          {contactItems.map((item, idx) => (
            <Fragment key={idx}>
              {item}
              {idx < contactItems.length - 1 && <span className="text-gray-400 font-normal px-1">|</span>}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <section className={sectionSpacing}>
          <h2 className="font-bold text-gray-950 uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
            Professional Summary
          </h2>
          <hr className="border-t border-gray-900 mt-1 mb-2" />
          <p className="text-gray-800 leading-relaxed text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {cleanExp && cleanExp.length > 0 && (
        <section className={sectionSpacing}>
          <h2 className="font-bold text-gray-950 uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
            Experience
          </h2>
          <hr className="border-t border-gray-900 mt-1 mb-2" />
          <div className={itemSpacing}>
            {cleanExp.map((exp, index) => (
              <div key={index} className="break-inside-avoid" style={{ breakInside: 'avoid' }}>
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 font-bold text-gray-950">
                  <span className="min-w-0" style={{ fontSize: isLowDensity ? '13px' : isHighDensity ? '10.5px' : '11.5px' }}>{exp.role}</span>
                  <span className="shrink-0 font-normal text-gray-700" style={{ fontSize: isLowDensity ? '11px' : isHighDensity ? '9px' : '10px' }}>{exp.duration}</span>
                </div>
                <div className="text-gray-800 mt-0.5">
                  <span className="italic font-medium">{exp.company}</span>
                </div>
                <ul className={`list-disc list-outside ml-4 mt-1 ${listSpacing} text-gray-800 leading-relaxed text-justify`}>
                  {parseBulletPoints(exp.description).map((bullet, i) => (
                    <li key={i} className="pl-1">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {cleanProj && cleanProj.length > 0 && (
        <section className={sectionSpacing}>
          <h2 className="font-bold text-gray-950 uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
            Projects
          </h2>
          <hr className="border-t border-gray-900 mt-1 mb-2" />
          <div className={itemSpacing}>
            {cleanProj.map((project, index) => (
              <div key={index} className="break-inside-avoid" style={{ breakInside: 'avoid' }}>
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 font-bold text-gray-950">
                  <div className="min-w-0" style={{ fontSize: isLowDensity ? '13px' : isHighDensity ? '10.5px' : '11.5px' }}>
                    <span>{project.name}</span>
                    {project.technologies && (
                      <span className="font-normal text-gray-700">
                        <span className="text-gray-400 px-1.5 font-normal">|</span>
                        {project.technologies}
                      </span>
                    )}
                  </div>
                </div>
                <ul className={`list-disc list-outside ml-4 mt-1 ${listSpacing} text-gray-800 leading-relaxed text-justify`}>
                  {parseBulletPoints(project.description).map((bullet, i) => (
                    <li key={i} className="pl-1">
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
          <h2 className="font-bold text-gray-950 uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
            Education
          </h2>
          <hr className="border-t border-gray-900 mt-1 mb-2" />
          <div className="space-y-3">
            {cleanEdu.map((edu, index) => (
              <div key={index} className="break-inside-avoid" style={{ breakInside: 'avoid' }}>
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 font-bold text-gray-950">
                  <span className="min-w-0" style={{ fontSize: isLowDensity ? '13px' : isHighDensity ? '10.5px' : '11.5px' }}>{edu.institution}</span>
                  <span className="shrink-0 font-normal text-gray-700" style={{ fontSize: isLowDensity ? '11px' : isHighDensity ? '9px' : '10px' }}>{edu.year}</span>
                </div>
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 mt-0.5 text-gray-800">
                  <span className="min-w-0 italic font-medium">{edu.degree}</span>
                  {edu.gpa && (
                    <span className="text-gray-600 font-sans font-bold" style={{ fontSize: isLowDensity ? '11px' : isHighDensity ? '9px' : '10px' }}>
                      GPA: {edu.gpa}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className={sectionSpacing}>
          <h2 className="font-bold text-gray-950 uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
            Technical Skills
          </h2>
          <hr className="border-t border-gray-900 mt-1 mb-2" />
          <p className="text-gray-800 leading-relaxed text-justify">
            <span className="font-bold text-gray-950">Skills & Technologies:</span> {data.skills.join(', ')}
          </p>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className={sectionSpacing}>
          <h2 className="font-bold text-gray-950 uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
            Certifications
          </h2>
          <hr className="border-t border-gray-900 mt-1 mb-2" />
          <ul className={`list-disc list-outside ml-4 ${listSpacing} text-gray-800`}>
            {data.certifications.map((cert, index) => (
              <li key={index} className="pl-1 break-inside-avoid" style={{ breakInside: 'avoid' }}>{cert}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <section className={sectionSpacing}>
          <h2 className="font-bold text-gray-950 uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
            Languages
          </h2>
          <hr className="border-t border-gray-900 mt-1 mb-2" />
          <p className="text-gray-800 leading-relaxed text-justify">
            {data.languages.join(', ')}
          </p>
        </section>
      )}

      {/* Honors & Awards */}
      {data.achievements && data.achievements.length > 0 && (
        <section className={sectionSpacing}>
          <h2 className="font-bold text-gray-950 uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
            Honors & Awards
          </h2>
          <hr className="border-t border-gray-900 mt-1 mb-2" />
          <ul className={`list-disc list-outside ml-4 ${listSpacing} text-gray-800`}>
            {data.achievements.map((achievement, index) => (
              <li key={index} className="pl-1 break-inside-avoid" style={{ breakInside: 'avoid' }}>{achievement}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && (
        <div className="space-y-4">
          {customSections.map((section) => (
            <section key={section.id} className={sectionSpacing}>
              <h2 className="font-bold text-gray-950 uppercase tracking-wider text-left" style={{ fontSize: headingFontSize }}>
                {section.title}
              </h2>
              <hr className="border-t border-gray-900 mt-1 mb-2" />
              <p className="text-gray-800 leading-relaxed text-justify whitespace-pre-wrap">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;
