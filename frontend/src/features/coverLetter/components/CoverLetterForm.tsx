import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COVER_LETTER_TONES, COVER_LETTER_LENGTHS, EXPERIENCE_LEVELS } from '@/config/constants';
import { SavedResume } from '@/services/resumeService';
import { Sparkles, Loader2, Upload, FileText } from 'lucide-react';

interface CoverLetterFormProps {
  companyName: string;
  setCompanyName: (v: string) => void;
  jobTitle: string;
  setJobTitle: (v: string) => void;
  jobDescription: string;
  setJobDescription: (v: string) => void;
  tone: string;
  setTone: (v: string) => void;
  length: string;
  setLength: (v: string) => void;
  expLevel: string;
  setExpLevel: (v: string) => void;
  resumeSource: 'upload' | 'select';
  setResumeSource: (v: 'upload' | 'select') => void;
  selectedResumeId: string;
  setSelectedResumeId: (v: string) => void;
  savedResumes: SavedResume[];
  loadingResumes: boolean;
  uploadedFileName: string;
  isExtracting: boolean;
  onDropAccepted: (files: File[]) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const CoverLetterForm: React.FC<CoverLetterFormProps> = ({
  companyName, setCompanyName,
  jobTitle, setJobTitle,
  jobDescription, setJobDescription,
  tone, setTone,
  length, setLength,
  expLevel, setExpLevel,
  resumeSource, setResumeSource,
  selectedResumeId, setSelectedResumeId,
  savedResumes, loadingResumes,
  uploadedFileName, isExtracting, onDropAccepted,
  isGenerating, onGenerate,
}) => {
  return (
    <Card className="glass-card bg-[#0F1424]/80 border border-white/10 shadow-2xl rounded-3xl overflow-hidden p-6">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-400">
          Cover Letter Parameters
        </CardTitle>
        <CardDescription className="text-gray-400 text-xs">
          Tailor your application targeting specific roles & companies using AI.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-semibold text-gray-300">Target Company</Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google"
              className="bg-black/30 border-white/10 text-white text-sm rounded-xl mt-1.5 focus:border-violet-500"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-gray-300">Job Title</Label>
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="bg-black/30 border-white/10 text-white text-sm rounded-xl mt-1.5 focus:border-violet-500"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold text-gray-300">Job Description *</Label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={4}
            placeholder="Paste the full target job posting description here..."
            className="w-full bg-black/30 border border-white/10 text-white text-sm rounded-xl mt-1.5 p-3 focus:outline-none focus:border-violet-500 transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs font-semibold text-gray-300">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="bg-black/30 border-white/10 text-white rounded-xl mt-1.5 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0F1424] border-white/10 text-white">
                {COVER_LETTER_TONES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold text-gray-300">Length</Label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger className="bg-black/30 border-white/10 text-white rounded-xl mt-1.5 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0F1424] border-white/10 text-white">
                {COVER_LETTER_LENGTHS.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold text-gray-300">Experience Level</Label>
            <Select value={expLevel} onValueChange={setExpLevel}>
              <SelectTrigger className="bg-black/30 border-white/10 text-white rounded-xl mt-1.5 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0F1424] border-white/10 text-white">
                {EXPERIENCE_LEVELS.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resume Selection */}
        <div className="pt-2">
          <Label className="text-xs font-semibold text-gray-300">Resume Context Source</Label>
          <div className="flex gap-3 mt-2 mb-3">
            <Button
              type="button"
              variant={resumeSource === 'select' ? 'default' : 'outline'}
              onClick={() => setResumeSource('select')}
              className="text-xs h-8 rounded-lg border-white/10"
            >
              Select Saved Profile
            </Button>
            <Button
              type="button"
              variant={resumeSource === 'upload' ? 'default' : 'outline'}
              onClick={() => setResumeSource('upload')}
              className="text-xs h-8 rounded-lg border-white/10"
            >
              Upload PDF Resume
            </Button>
          </div>

          {resumeSource === 'select' ? (
            <div>
              {loadingResumes ? (
                <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading saved resumes...
                </div>
              ) : savedResumes.length === 0 ? (
                <p className="text-xs text-amber-400 py-1">No saved resumes found in profile.</p>
              ) : (
                <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                  <SelectTrigger className="bg-black/30 border-white/10 text-white rounded-xl text-xs">
                    <SelectValue placeholder="Choose a resume" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F1424] border-white/10 text-white">
                    {savedResumes.map((r) => (
                      <SelectItem key={r._id} value={r._id}>
                        {r.fullName} ({r.jobRole || 'General'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-violet-500/50 transition-all bg-black/20">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onDropAccepted([e.target.files[0]]);
                  }
                }}
                className="hidden"
                id="resume-upload-input"
              />
              <label htmlFor="resume-upload-input" className="cursor-pointer flex flex-col items-center gap-1.5">
                <Upload className="w-6 h-6 text-violet-400 mb-1" />
                <span className="text-xs font-medium text-gray-300">
                  {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Click to select or drop resume file'}
                </span>
                <span className="text-[10px] text-gray-500">Supports PDF, DOCX, TXT</span>
              </label>
              {isExtracting && (
                <div className="flex items-center justify-center gap-2 text-xs text-violet-400 mt-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Extracting resume text...
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          onClick={onGenerate}
          disabled={isGenerating || isExtracting}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 hover:from-violet-700 hover:to-amber-600 text-white font-bold shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Tailoring Cover Letter...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Generate Cover Letter
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
