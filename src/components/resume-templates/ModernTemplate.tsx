
import { ResumeData } from '../../types/resumeTypes';

interface TemplateProps {
  data: ResumeData;
}

const ModernTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="bg-white text-black p-6 font-['Arial',sans-serif] leading-tight h-full min-h-[1100px]">
      {/* ATS-Optimized Header */}
      <div className="text-center mb-4 pb-2" style={{ borderBottom: '3px solid #000' }}>
        <h1 className="text-2xl font-bold text-black mb-1 tracking-wide uppercase" style={{ fontSize: '24px', fontWeight: 'bold' }}>
          {data.fullName}
        </h1>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-800 flex-wrap">
          <span className="font-medium">{data.phone}</span>
          <span className="text-gray-600">•</span>
          <span className="font-medium">{data.email}</span>
          {data.linkedin && (
            <>
              <span className="text-gray-600">•</span>
              <span className="font-medium">LinkedIn: {data.linkedin}</span>
            </>
          )}
          {data.github && (
            <>
              <span className="text-gray-600">•</span>
              <span className="font-medium">GitHub: {data.github}</span>
            </>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-4">
          <h2 className="text-base font-bold text-black mb-1 uppercase tracking-wide" style={{ borderBottom: '2px solid #333', paddingBottom: '2px', fontSize: '14px' }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-xs leading-normal text-gray-900 text-justify" style={{ fontSize: '10px', lineHeight: '1.3' }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Core Competencies */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-bold text-black mb-1 uppercase tracking-wide" style={{ borderBottom: '2px solid #333', paddingBottom: '2px', fontSize: '14px' }}>
            CORE COMPETENCIES
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-1 text-xs">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex items-center" style={{ fontSize: '10px' }}>
                <span className="w-1 h-1 bg-black rounded-full mr-2"></span>
                <span className="font-medium text-gray-900">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {data.experience && data.experience.length > 0 && data.experience[0].company && (
        <div className="mb-4">
          <h2 className="text-base font-bold text-black mb-1 uppercase tracking-wide" style={{ borderBottom: '2px solid #333', paddingBottom: '2px', fontSize: '14px' }}>
            PROFESSIONAL EXPERIENCE
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-sm text-black" style={{ fontSize: '12px' }}>{exp.role}</h3>
                  <p className="font-semibold text-gray-800" style={{ fontSize: '11px' }}>{exp.company}</p>
                </div>
                <span className="text-xs font-medium bg-gray-200 px-2 py-0.5 rounded" style={{ fontSize: '9px' }}>
                  {exp.duration}
                </span>
              </div>
              <div className="ml-4 text-gray-900" style={{ fontSize: '10px', lineHeight: '1.3' }}>
                {exp.description.split(/[.!]/).filter(item => item.trim()).map((item, idx) => (
                  <div key={idx} className="flex items-start mb-1">
                    <span className="mr-2 mt-1.5">•</span>
                    <span>{item.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-bold text-black mb-1 uppercase tracking-wide" style={{ borderBottom: '2px solid #333', paddingBottom: '2px', fontSize: '14px' }}>
            EDUCATION
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-black" style={{ fontSize: '11px' }}>{edu.degree}</h3>
                  <p className="font-medium text-gray-800" style={{ fontSize: '10px' }}>{edu.institution}</p>
                </div>
                <span className="text-xs font-medium bg-gray-200 px-2 py-0.5 rounded" style={{ fontSize: '9px' }}>
                  {edu.year}
                </span>
              </div>
              {edu.gpa && (
                <p className="text-xs text-gray-700 mt-0.5" style={{ fontSize: '9px' }}>GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && data.projects[0].name && (
        <div className="mb-4">
          <h2 className="text-base font-bold text-black mb-1 uppercase tracking-wide" style={{ borderBottom: '2px solid #333', paddingBottom: '2px', fontSize: '14px' }}>
            KEY PROJECTS
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-black" style={{ fontSize: '11px' }}>{project.name}</h3>
                <span className="text-[10px] italic bg-gray-200 px-1.5 py-0.5 rounded" style={{ fontSize: '9px' }}>
                  {project.technologies}
                </span>
              </div>
              <p className="text-xs text-gray-900 leading-tight ml-4" style={{ fontSize: '10px', lineHeight: '1.3' }}>
                • {project.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Two-column layout for additional sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-black mb-2 uppercase tracking-wide" style={{ borderBottom: '1px solid #333', paddingBottom: '2px', fontSize: '14px' }}>
              CERTIFICATIONS
            </h2>
            <div className="space-y-1">
              {data.certifications.map((cert, index) => (
                <div key={index} className="flex items-start" style={{ fontSize: '11px' }}>
                  <span className="mr-2 mt-1">•</span>
                  <span className="text-gray-900">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-black mb-2 uppercase tracking-wide" style={{ borderBottom: '1px solid #333', paddingBottom: '2px', fontSize: '14px' }}>
              LANGUAGES
            </h2>
            <div className="space-y-1">
              {data.languages.map((lang, index) => (
                <div key={index} className="flex items-start" style={{ fontSize: '11px' }}>
                  <span className="mr-2 mt-1">•</span>
                  <span className="text-gray-900">{lang}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {data.achievements && data.achievements.length > 0 && (
          <div className="md:col-span-2">
            <h2 className="text-base font-bold text-black mb-2 uppercase tracking-wide" style={{ borderBottom: '1px solid #333', paddingBottom: '2px', fontSize: '14px' }}>
              KEY ACHIEVEMENTS
            </h2>
            <div className="space-y-1">
              {data.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start" style={{ fontSize: '11px' }}>
                  <span className="mr-2 mt-1">•</span>
                  <span className="text-gray-900">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ModernTemplate;
