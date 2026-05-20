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

  return (
    <div 
      className="bg-white text-gray-900 p-8 sm:p-10 font-sans min-h-[297mm] w-full max-w-[210mm] mx-auto box-border leading-normal selection:bg-gray-200 break-words [overflow-wrap:anywhere]"
      style={{ fontFamily: '"Arial", "Helvetica", "Inter", sans-serif', fontSize: '10.5px' }}
    >
      
      {/* ATS Recruiter Header */}
      <div className="border-b-2 border-gray-900 pb-3 mb-5">
        <div className="flex flex-wrap justify-between items-end gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-black uppercase tracking-wide leading-tight mb-1">
              {data.fullName}
            </h1>
            {data.jobRole && (
              <p className="text-xs font-bold text-gray-700 uppercase tracking-widest leading-tight">
                {data.jobRole}
              </p>
            )}
          </div>
          
          {/* Contact Details Column */}
          <div className="flex min-w-[190px] max-w-full flex-col items-end gap-y-1 text-[10px] text-gray-800 font-medium">
            {data.email && (
              <div className="flex max-w-full items-center gap-1.5 hover:text-black">
                <Mail size={11} className="text-gray-600 shrink-0" />
                <a href={`mailto:${data.email}`} className="min-w-0 break-all text-right">{data.email}</a>
              </div>
            )}
            {data.phone && (
              <div className="flex max-w-full items-center gap-1.5">
                <Phone size={11} className="text-gray-600 shrink-0" />
                <span className="min-w-0 break-words text-right">{data.phone}</span>
              </div>
            )}
            {data.linkedin && (
              <div className="flex max-w-full items-center gap-1.5 hover:text-black">
                <Linkedin size={11} className="text-gray-600 shrink-0" />
                <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="min-w-0 break-all text-right">
                  {cleanLinkedin(data.linkedin)}
                </a>
              </div>
            )}
            {data.github && (
              <div className="flex max-w-full items-center gap-1.5 hover:text-black">
                <Github size={11} className="text-gray-600 shrink-0" />
                <a href={data.github} target="_blank" rel="noopener noreferrer" className="min-w-0 break-all text-right">
                  {cleanGithub(data.github)}
                </a>
              </div>
            )}
            {data.portfolio && (
              <div className="flex max-w-full items-center gap-1.5 hover:text-black">
                <Globe size={11} className="text-gray-600 shrink-0" />
                <a href={data.portfolio} target="_blank" rel="noopener noreferrer" className="min-w-0 break-all text-right">
                  {cleanPortfolio(data.portfolio)}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-400 mb-2 pb-0.5">
            Professional Summary
          </h2>
          <p className="text-gray-900 leading-relaxed text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {/* Core Competencies / Skills (Recruiter friendly grid) */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-400 mb-2 pb-0.5">
            Core Competencies & Technical Skills
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex min-w-0 items-start gap-2">
                <span className="w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0" />
                <span className="font-semibold text-gray-900 leading-tight">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {cleanExp && cleanExp.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-400 mb-3 pb-0.5">
            Professional Experience
          </h2>
          <div className="space-y-3.5">
            {cleanExp.map((exp, index) => (
              <div key={index}>
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 mb-0.5">
                  <div className="min-w-0 text-[11.5px] font-bold text-black">
                    <span>{exp.role}</span>
                    <span className="font-normal text-gray-400 px-2">|</span>
                    <span className="font-bold text-gray-700">{exp.company}</span>
                  </div>
                  <span className="shrink-0 text-[9.5px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    {exp.duration}
                  </span>
                </div>
                
                <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-gray-900 leading-relaxed text-justify">
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
        <section className="mb-4">
          <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-400 mb-3 pb-0.5">
            Selected Projects
          </h2>
          <div className="space-y-3">
            {cleanProj.map((project, index) => (
              <div key={index}>
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 mb-0.5">
                  <div className="min-w-0 text-[11px] font-bold text-black">
                    <span>{project.name}</span>
                    {project.technologies && (
                      <>
                        <span className="font-normal text-gray-400 px-2">|</span>
                        <span className="text-[10px] text-gray-600 font-semibold">{project.technologies}</span>
                      </>
                    )}
                  </div>
                </div>
                <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-gray-900 leading-relaxed text-justify">
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
        <section className="mb-4">
          <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-400 mb-2.5 pb-0.5">
            Education & Academic Credentials
          </h2>
          <div className="space-y-2">
            {cleanEdu.map((edu, index) => (
              <div key={index} className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1">
                <div className="min-w-0">
                  <span className="font-bold text-black">{edu.degree}</span>
                  <span className="font-normal text-gray-400 px-2">|</span>
                  <span className="font-semibold text-gray-700 italic">{edu.institution}</span>
                  {edu.gpa && <span className="text-gray-600 text-[10px] font-bold ml-2">(GPA: {edu.gpa})</span>}
                </div>
                <span className="shrink-0 text-[9.5px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                  {edu.year}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid Layout for Certifications, Languages, Achievements */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 mb-4 sm:grid-cols-2">
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-400 mb-2 pb-0.5">
              Professional Certifications
            </h2>
            <div className="grid grid-cols-1 gap-1">
              {data.certifications.map((cert, index) => (
                <div key={index} className="flex min-w-0 items-start gap-2">
                  <span className="w-1 h-1 bg-gray-900 rounded-full shrink-0" />
                  <span className="font-semibold text-gray-900">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.languages && data.languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-400 mb-2 pb-0.5">
              Languages Spoken
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {data.languages.map((lang, index) => (
                <div key={index} className="flex min-w-0 items-start gap-2">
                  <span className="w-1 h-1 bg-gray-900 rounded-full shrink-0" />
                  <span className="font-semibold text-gray-900">{lang}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.achievements && data.achievements.length > 0 && (
          <div className="sm:col-span-2">
            <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-400 mb-2 pb-0.5">
              Achievements & Technical Commendations
            </h2>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
              {data.achievements.map((achievement, index) => (
                <div key={index} className="flex min-w-0 items-start gap-2">
                  <span className="w-1 h-1 bg-gray-900 rounded-full shrink-0" />
                  <span className="text-gray-900">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inline Custom Sections */}
      {customSections && customSections.length > 0 && (
        <div className="space-y-4">
          {customSections.map((section) => (
            <section key={section.id}>
              <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-400 mb-2 pb-0.5">
                {section.title}
              </h2>
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
