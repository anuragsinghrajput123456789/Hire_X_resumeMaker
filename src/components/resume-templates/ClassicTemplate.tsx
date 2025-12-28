
import { ResumeData } from '../../types/resumeTypes';

interface TemplateProps {
  data: ResumeData;
}

const ClassicTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="bg-white text-black p-6 font-serif leading-tight h-full min-h-[1100px]">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          {data.fullName}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
          {data.phone && <span>{data.phone}</span>}
          {data.email && (
            <>
              <span className="text-gray-400">|</span>
              <span>{data.email}</span>
            </>
          )}
          {data.linkedin && (
            <>
              <span className="text-gray-400">|</span>
              <span>{data.linkedin}</span>
            </>
          )}
           {data.github && (
            <>
              <span className="text-gray-400">|</span>
              <span>{data.github}</span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 mb-2 pb-1 uppercase tracking-wider">
            Professional Summary
          </h2>
          <p className="text-gray-800 text-justify leading-snug text-sm">
            {data.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && data.experience[0].company && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 mb-2 pb-1 uppercase tracking-wider">
            Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="text-base font-bold text-gray-900">{exp.company}</h3>
                  <span className="text-xs font-medium text-gray-600">{exp.duration}</span>
                </div>
                <div className="text-sm font-semibold text-gray-800 mb-1 italic">{exp.role}</div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-gray-800 text-sm">
                   {exp.description.split(/[.!]/).filter(item => item.trim()).map((item, idx) => (
                    <li key={idx} className="pl-1">
                      {item.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
         <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 mb-2 pb-1 uppercase tracking-wider">
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-bold text-gray-900">{edu.institution}</h3>
                  <span className="text-xs font-medium text-gray-600">{edu.year}</span>
                </div>
                <div className="text-sm text-gray-800">
                  {edu.degree}
                  {edu.gpa && <span className="text-gray-600 ml-2">(GPA: {edu.gpa})</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 mb-2 pb-1 uppercase tracking-wider">
            Skills
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-800 text-sm">
            {data.skills.map((skill, index) => (
              <span key={index} className="flex items-center">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

       {/* Projects */}
      {data.projects && data.projects.length > 0 && data.projects[0].name && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 mb-2 pb-1 uppercase tracking-wider">
            Projects
          </h2>
          <div className="space-y-2">
             {data.projects.map((project, index) => (
              <div key={index}>
                 <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="text-base font-bold text-gray-900">{project.name}</h3>
                  <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{project.technologies}</span>
                </div>
                <p className="text-gray-800 text-sm">{project.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Additional Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.certifications && data.certifications.length > 0 && (
          <section>
             <h2 className="text-base font-bold text-gray-800 border-b border-gray-300 mb-2 pb-1 uppercase tracking-wider">
              Certifications
            </h2>
             <ul className="list-disc list-outside ml-4 space-y-0.5 text-gray-800 text-sm">
              {data.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </section>
        )}
        
        {data.languages && data.languages.length > 0 && (
          <section>
             <h2 className="text-base font-bold text-gray-800 border-b border-gray-300 mb-2 pb-1 uppercase tracking-wider">
              Languages
            </h2>
             <ul className="list-disc list-outside ml-4 space-y-0.5 text-gray-800 text-sm">
              {data.languages.map((lang, index) => (
                <li key={index}>{lang}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

    </div>
  );
};

export default ClassicTemplate;
