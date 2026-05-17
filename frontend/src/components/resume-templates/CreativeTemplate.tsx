
import { ResumeData } from '../../types/resumeTypes';

interface TemplateProps {
  data: ResumeData;
}

const CreativeTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="bg-white text-gray-800 font-sans min-h-[1100px] flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-slate-900 text-white p-5 flex flex-col gap-4">
        
        {/* Contact Info (Sidebar) */}
        <div className="mt-4">
          <h3 className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-2 border-b border-slate-700 pb-1">Contact</h3>
          <div className="space-y-2 text-xs text-slate-300">
            {data.phone && <div className="break-words">{data.phone}</div>}
            {data.email && <div className="break-words">{data.email}</div>}
            {data.linkedin && <div className="break-words">LinkedIn: {data.linkedin}</div>}
            {data.github && <div className="break-words">GitHub: {data.github}</div>}
          </div>
        </div>

        {/* Skills (Sidebar) */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <h3 className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-2 border-b border-slate-700 pb-1">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, index) => (
                <span key={index} className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded text-[10px]">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education (Sidebar) */}
         {data.education && data.education.length > 0 && (
          <div>
            <h3 className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-2 border-b border-slate-700 pb-1">Education</h3>
            <div className="space-y-2">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <div className="text-white font-bold text-xs">{edu.degree}</div>
                  <div className="text-slate-400 text-[10px]">{edu.institution}</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">{edu.year}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
         {/* Languages (Sidebar) */}
         {data.languages && data.languages.length > 0 && (
          <div>
            <h3 className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-2 border-b border-slate-700 pb-1">Languages</h3>
             <div className="space-y-1">
              {data.languages.map((lang, index) => (
                <div key={index} className="text-xs text-slate-300">{lang}</div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6">
        
        {/* Header Name */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight uppercase tracking-tight">
            {data.fullName?.split(' ')[0]} 
            <span className="text-blue-600 block">{data.fullName?.split(' ').slice(1).join(' ')}</span>
          </h1>
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-4">
             <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-3 mb-2 uppercase tracking-wider">
              About Me
            </h2>
            <p className="text-slate-700 leading-snug text-xs">
              {data.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && data.experience[0].company && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-wider">
              Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative pl-6 border-l border-slate-200">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                  <h3 className="text-base font-bold text-slate-800">{exp.role}</h3>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-blue-600 font-semibold text-xs">{exp.company}</span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{exp.duration}</span>
                  </div>
                   <div className="text-xs text-slate-600 leading-tight">
                    {exp.description.split(/[.!]/).filter(item => item.trim()).map((item, idx) => (
                      <div key={idx} className="mb-0.5">• {item.trim()}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
         {data.projects && data.projects.length > 0 && data.projects[0].name && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-wider">
              Projects
            </h2>
            <div className="grid gap-2">
              {data.projects.map((project, index) => (
                <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                   <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-800 text-xs">{project.name}</h3>
                    <span className="text-[9px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wide">{project.technologies}</span>
                  </div>
                  <p className="text-[10px] text-slate-600">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CreativeTemplate;
