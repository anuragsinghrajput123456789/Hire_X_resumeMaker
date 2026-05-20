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

  return (
    <div 
      className="bg-white text-[#1e293b] p-8 sm:p-10 font-sans min-h-[297mm] w-full max-w-[210mm] mx-auto box-border leading-normal selection:bg-indigo-100 break-words [overflow-wrap:anywhere]"
      style={{ fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif', fontSize: '11.5px' }}
    >
      {/* Header Section */}
      <div className="border-b border-slate-100 pb-6 mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight leading-tight mb-1">
              {data.fullName}
            </h1>
            {data.jobRole && (
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider leading-tight">
                {data.jobRole}
              </p>
            )}
          </div>

          {/* Contact Details Grid */}
          <div className="grid min-w-[220px] max-w-full grid-cols-1 gap-x-4 gap-y-1.5 text-[10.5px] text-[#475569] font-medium sm:grid-cols-2">
            {data.email && (
              <div className="flex min-w-0 items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <Mail size={12} className="text-indigo-500 shrink-0" />
                <a href={`mailto:${data.email}`} className="min-w-0 break-all">{data.email}</a>
              </div>
            )}
            {data.phone && (
              <div className="flex min-w-0 items-center gap-1.5">
                <Phone size={12} className="text-indigo-500 shrink-0" />
                <span className="min-w-0 break-words">{data.phone}</span>
              </div>
            )}
            {data.linkedin && (
              <div className="flex min-w-0 items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <Linkedin size={12} className="text-indigo-500 shrink-0" />
                <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="min-w-0 break-all">
                  {cleanLinkedin(data.linkedin)}
                </a>
              </div>
            )}
            {data.github && (
              <div className="flex min-w-0 items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <Github size={12} className="text-indigo-500 shrink-0" />
                <a href={data.github} target="_blank" rel="noopener noreferrer" className="min-w-0 break-all">
                  {cleanGithub(data.github)}
                </a>
              </div>
            )}
            {data.portfolio && (
              <div className="flex min-w-0 items-center gap-1.5 hover:text-indigo-600 transition-colors sm:col-span-2">
                <Globe size={12} className="text-indigo-500 shrink-0" />
                <a href={data.portfolio} target="_blank" rel="noopener noreferrer" className="min-w-0 break-all">
                  {cleanPortfolio(data.portfolio)}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {data.summary && (
        <section className="mb-6">
          <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3 mb-3">
            <h2 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
              Professional Summary
            </h2>
          </div>
          <p className="text-[#334155] leading-relaxed text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {/* Grid Layout for Skills, Education, Achievements */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        
        {/* Left Side: Skills & Certifications & Languages */}
        <div className="col-span-4 min-w-0 space-y-6">
          {/* Tech Stack */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-2.5 mb-3">
                <h2 className="text-[11px] font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1">
                  <Code2 size={12} className="text-indigo-600" /> Skills
                </h2>
              </div>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="max-w-full bg-indigo-50/70 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[9.5px] font-medium leading-tight"
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
              <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-2.5 mb-3">
                <h2 className="text-[11px] font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1">
                  <Award size={12} className="text-indigo-600" /> Certifications
                </h2>
              </div>
              <ul className="space-y-1.5 text-[10.5px] text-[#475569]">
                {data.certifications.map((cert, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-tight">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                    <span className="min-w-0">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-2.5 mb-3">
                <h2 className="text-[11px] font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1">
                  <Languages size={12} className="text-indigo-600" /> Languages
                </h2>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.languages.map((lang, index) => (
                  <span 
                    key={index} 
                    className="max-w-full bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[9.5px] font-medium leading-tight"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Education & Achievements */}
        <div className="col-span-8 min-w-0 space-y-6">
          {/* Education */}
          {cleanEdu && cleanEdu.length > 0 && (
            <div>
              <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-2.5 mb-3">
                <h2 className="text-[11px] font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap size={13} className="text-indigo-600" /> Education
                </h2>
              </div>
              <div className="space-y-3">
                {cleanEdu.map((edu, index) => (
                  <div key={index} className="group">
                    <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 mb-0.5">
                      <h3 className="min-w-0 font-bold text-slate-800 text-[11.5px]">
                        {edu.degree}
                      </h3>
                      <span className="shrink-0 text-[10px] font-bold text-slate-500">{edu.year}</span>
                    </div>
                    <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-[10.5px] text-[#475569]">
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
              <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-2.5 mb-3">
                <h2 className="text-[11px] font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1">
                  <Milestone size={12} className="text-indigo-600" /> Key Achievements
                </h2>
              </div>
              <ul className="space-y-1.5 text-[10.5px] text-[#475569]">
                {data.achievements.map((ach, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 shrink-0" />
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>

      {/* Professional Experience Section */}
      {cleanExp && cleanExp.length > 0 && (
        <section className="mb-6 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3 mb-4">
            <h2 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase size={13} className="text-indigo-600" /> Professional Experience
            </h2>
          </div>
          <div className="space-y-4">
            {cleanExp.map((exp, index) => (
              <div key={index} className="relative">
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 mb-1">
                  <h3 className="min-w-0 font-extrabold text-[12px] text-slate-800">
                    {exp.role} <span className="font-normal text-[#64748b]">at</span> <span className="text-indigo-600 font-semibold">{exp.company}</span>
                  </h3>
                  <span className="shrink-0 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {exp.duration}
                  </span>
                </div>
                <ul className="space-y-1.5 mt-2 ml-1">
                  {parseBulletPoints(exp.description).map((bullet, i) => (
                    <li key={i} className="text-[#334155] leading-relaxed flex items-start gap-2">
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
        <section className="mb-6 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3 mb-4">
            <h2 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
              <Code2 size={13} className="text-indigo-600" /> Selected Projects
            </h2>
          </div>
          <div className="space-y-4">
            {cleanProj.map((project, index) => (
              <div key={index}>
                <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 mb-1">
                  <div className="flex min-w-0 items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-[12px] text-slate-800">
                      {project.name}
                    </h3>
                    {project.technologies && (
                      <span className="max-w-full text-[9.5px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-semibold border border-indigo-100">
                        {project.technologies}
                      </span>
                    )}
                  </div>
                </div>
                <ul className="space-y-1 mt-1.5 ml-1">
                  {parseBulletPoints(project.description).map((bullet, i) => (
                    <li key={i} className="text-[#334155] leading-relaxed flex items-start gap-2">
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
        <div className="border-t border-slate-100 pt-6">
          {customSections.map((section) => (
            <section key={section.id} className="mb-6">
              <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3 mb-3">
                <h2 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
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

