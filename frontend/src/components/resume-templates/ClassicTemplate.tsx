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
}

const ClassicTemplate = ({ data, customSections }: TemplateProps) => {
  const cleanExp = filterExperience(data.experience);
  const cleanEdu = filterEducation(data.education);
  const cleanProj = filterProjects(data.projects);
  // Construct dynamic inline contact info to match the clean sans-serif layout without icons
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
        fontSize: '11.5px',
        lineHeight: '1.4'
      }}
    >
      {/* Centered Minimalist Header */}
      <div className="w-full flex flex-col items-center justify-center text-center mb-5">
        <h1 className="max-w-full text-2xl font-bold text-gray-950 tracking-tight mb-1 text-center font-sans leading-tight">
          {data.fullName}
        </h1>
        {data.jobRole && (
          <p className="max-w-full text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 text-center leading-tight">
            {data.jobRole}
          </p>
        )}
        
        {/* Contact info list with simple pipes */}
        <div className="w-full flex flex-wrap justify-center items-center gap-x-2 text-[10px] text-gray-700 tracking-wide font-sans mt-0.5">
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
        <section className="mb-4">
          <h2 className="text-[12px] font-bold text-gray-900 border-b border-gray-900 mb-2 pb-0.5 uppercase tracking-wider text-left">
            Professional Summary
          </h2>
          <p className="text-gray-800 leading-relaxed text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {cleanExp && cleanExp.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12px] font-bold text-gray-900 border-b border-gray-900 mb-2 pb-0.5 uppercase tracking-wider text-left">
            Experience
          </h2>
          <div className="space-y-4">
            {cleanExp.map((exp, index) => (
              <div key={index}>
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 font-bold text-gray-950">
                  <span className="min-w-0">{exp.role}</span>
                  <span className="shrink-0 font-normal text-gray-700">{exp.duration}</span>
                </div>
                <div className="text-gray-800 mt-0.5">
                  <span className="italic font-medium">{exp.company}</span>
                </div>
                <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-gray-800 leading-relaxed text-justify">
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
        <section className="mb-4">
          <h2 className="text-[12px] font-bold text-gray-900 border-b border-gray-900 mb-2 pb-0.5 uppercase tracking-wider text-left">
            Projects
          </h2>
          <div className="space-y-4">
            {cleanProj.map((project, index) => (
              <div key={index}>
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 font-bold text-gray-950">
                  <div className="min-w-0">
                    <span>{project.name}</span>
                    {project.technologies && (
                      <span className="font-normal text-gray-700">
                        <span className="text-gray-400 px-1.5 font-normal">|</span>
                        {project.technologies}
                      </span>
                    )}
                  </div>
                </div>
                <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-gray-800 leading-relaxed text-justify">
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
        <section className="mb-4">
          <h2 className="text-[12px] font-bold text-gray-900 border-b border-gray-900 mb-2 pb-0.5 uppercase tracking-wider text-left">
            Education
          </h2>
          <div className="space-y-3">
            {cleanEdu.map((edu, index) => (
              <div key={index}>
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 font-bold text-gray-950">
                  <span className="min-w-0">{edu.institution}</span>
                  <span className="shrink-0 font-normal text-gray-700">{edu.year}</span>
                </div>
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 mt-0.5 text-gray-800">
                  <span className="min-w-0 italic font-medium">{edu.degree}</span>
                  {edu.gpa && (
                    <span className="text-[10px] text-gray-600 font-sans font-bold">
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
        <section className="mb-4">
          <h2 className="text-[12px] font-bold text-gray-900 border-b border-gray-900 mb-2 pb-0.5 uppercase tracking-wider text-left">
            Technical Skills
          </h2>
          <p className="text-gray-800 leading-relaxed text-justify">
            <span className="font-bold text-gray-950">Skills & Technologies:</span> {data.skills.join(', ')}
          </p>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12px] font-bold text-gray-900 border-b border-gray-900 mb-2 pb-0.5 uppercase tracking-wider text-left">
            Certifications
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-gray-800">
            {data.certifications.map((cert, index) => (
              <li key={index} className="pl-1">{cert}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12px] font-bold text-gray-900 border-b border-gray-900 mb-2 pb-0.5 uppercase tracking-wider text-left">
            Languages
          </h2>
          <p className="text-gray-800 leading-relaxed text-justify">
            {data.languages.join(', ')}
          </p>
        </section>
      )}

      {/* Honors & Awards */}
      {data.achievements && data.achievements.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12px] font-bold text-gray-900 border-b border-gray-900 mb-2 pb-0.5 uppercase tracking-wider text-left">
            Honors & Awards
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-gray-800">
            {data.achievements.map((achievement, index) => (
              <li key={index} className="pl-1">{achievement}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && (
        <div className="space-y-4">
          {customSections.map((section) => (
            <section key={section.id} className="mb-4">
              <h2 className="text-[12px] font-bold text-gray-900 border-b border-gray-900 mb-2 pb-0.5 uppercase tracking-wider text-left">
                {section.title}
              </h2>
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
