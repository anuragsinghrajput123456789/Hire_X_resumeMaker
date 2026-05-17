import { ResumeData } from '../../types/resumeTypes';
import { Mail, Phone, Linkedin, Github, Globe, MapPin, Briefcase, Award, GraduationCap, Code2, Rocket, ExternalLink } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

const ModernTemplate = ({ data }: TemplateProps) => {
  return (
    <div className="bg-white text-black p-10 font-sans min-h-[1123px] w-full max-w-[210mm] mx-auto box-border leading-tight selection:bg-blue-100" style={{ fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black mb-4 tracking-tight">
          {data.fullName}
        </h1>
        
        <div className="flex justify-center items-center flex-wrap gap-y-2 gap-x-6 text-[11px] text-gray-800 font-medium">
           {data.email && (
             <div className="flex items-center gap-1.5 group">
               <div className="p-1 bg-gray-100 rounded-md group-hover:bg-blue-50 transition-colors">
                <Mail size={12} className="text-blue-600" />
               </div>
               <a href={`mailto:${data.email}`} className="hover:text-blue-600 transition-colors">{data.email}</a>
             </div>
           )}
           {data.phone && (
             <div className="flex items-center gap-1.5 group">
               <div className="p-1 bg-gray-100 rounded-md group-hover:bg-blue-50 transition-colors">
                <Phone size={12} className="text-blue-600" />
               </div>
               <span>{data.phone}</span>
             </div>
           )}
           {data.linkedin && (
             <div className="flex items-center gap-1.5 group">
               <div className="p-1 bg-gray-100 rounded-md group-hover:bg-blue-50 transition-colors">
                <Linkedin size={12} className="text-blue-600" />
               </div>
               <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">{data.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a>
             </div>
           )}
           {data.github && (
             <div className="flex items-center gap-1.5 group">
               <div className="p-1 bg-gray-100 rounded-md group-hover:bg-blue-50 transition-colors">
                <Github size={12} className="text-blue-600" />
               </div>
               <a href={data.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">{data.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</a>
             </div>
           )}
        </div>
        
        <div className="flex justify-center items-center gap-6 mt-3 text-[11px] text-gray-700 font-bold uppercase tracking-widest">
           <div className="flex items-center gap-1.5"><Globe size={12} className="text-gray-400" /> PROJECTS</div>
           <div className="flex items-center gap-1.5"><Code2 size={12} className="text-gray-400" /> RESEARCH</div>
           <div className="flex items-center gap-1.5"><Rocket size={12} className="text-gray-400" /> PORTFOLIO</div>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b-2 border-black text-black uppercase mb-3 pb-1 tracking-[0.1em]">Summary</h2>
          <p className="text-[11.5px] text-gray-900 leading-relaxed text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-6">
           <h2 className="text-sm font-bold border-b-2 border-black text-black uppercase mb-3 pb-1 tracking-[0.1em]">Education</h2>
           <div className="space-y-4">
             {data.education.map((edu, index) => (
               <div key={index} className="relative">
                 <div className="flex justify-between items-baseline mb-1">
                   <h3 className="font-bold text-[12px] text-black">
                     <span className="text-blue-700">•</span> {edu.degree} | <span className="font-semibold">{edu.institution}</span>
                   </h3>
                   <span className="text-[11px] font-bold text-gray-700">{edu.year}</span>
                 </div>
                 {edu.gpa && (
                   <p className="text-[11px] text-gray-800 ml-3 italic">
                     GPA: <span className="font-bold text-black">{edu.gpa}</span>
                   </p>
                 )}
               </div>
             ))}
           </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b-2 border-black text-black uppercase mb-3 pb-1 tracking-[0.1em]">Experience</h2>
          <div className="space-y-5">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-[12px] text-black">
                    {exp.role} | <span className="font-semibold text-blue-700">{exp.company}</span>
                  </h3>
                  <div className="text-[11px] font-bold text-gray-700">
                    {exp.duration}
                  </div>
                </div>
                <ul className="space-y-1.5 mt-2">
                   {exp.description.split(/[•\n]/).filter((item: string) => item.trim().length > 0).map((item: string, i: number) => (
                      <li key={i} className="text-[11px] text-gray-900 leading-relaxed flex items-start gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1 shrink-0" />
                         <span>{item.trim()}</span>
                      </li>
                   ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b-2 border-black text-black uppercase mb-3 pb-1 tracking-[0.1em]">Technical Skills</h2>
          <div className="space-y-2">
             <div className="text-[11px] leading-relaxed">
               <span className="font-black text-black mr-2">• CORE STACK:</span>
               <span className="text-gray-900">{data.skills.join(', ')}</span>
             </div>
             {/* If we had grouped skills in the data, we could show them here */}
             <div className="text-[11px] leading-relaxed">
               <span className="font-black text-black mr-2">• TOOLS & ENV:</span>
               <span className="text-gray-900">Git, Docker, Linux, CI/CD, VS Code, Postman</span>
             </div>
          </div>
        </section>
      )}

      {/* Achievements */}
      {(data.achievements?.length > 0 || data.certifications?.length > 0) && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b-2 border-black text-black uppercase mb-3 pb-1 tracking-[0.1em]">Achievements & Activities</h2>
          <ul className="space-y-2">
             {data.achievements?.map((ach, i) => (
                <li key={i} className="text-[11px] text-gray-900 leading-relaxed flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1 shrink-0" />
                   <span>{ach}</span>
                </li>
             ))}
             {data.certifications?.map((cert, i) => (
                <li key={i} className="text-[11px] text-gray-900 leading-relaxed flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1 shrink-0" />
                   <span className="font-bold">Certification:</span> {cert}
                </li>
             ))}
          </ul>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b-2 border-black text-black uppercase mb-3 pb-1 tracking-[0.1em]">Projects</h2>
          <div className="space-y-5">
            {data.projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[12px] text-black uppercase tracking-tight">{project.name}</h3>
                    {project.technologies && (
                      <span className="text-[10px] text-gray-600 font-medium">| {project.technologies}</span>
                    )}
                  </div>
                  <div className="flex gap-3 text-[10px] font-black text-blue-700">
                     <span className="flex items-center gap-1 cursor-pointer hover:underline">GITHUB <ExternalLink size={10} /></span>
                     <span className="flex items-center gap-1 cursor-pointer hover:underline">LIVE <ExternalLink size={10} /></span>
                  </div>
                </div>
                <ul className="space-y-1.5">
                   {project.description.split(/[•\n]/).filter((item: string) => item.trim().length > 0).map((item: string, i: number) => (
                      <li key={i} className="text-[11px] text-gray-900 leading-relaxed flex items-start gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1 shrink-0" />
                         <span>{item.trim()}</span>
                      </li>
                   ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ModernTemplate;
