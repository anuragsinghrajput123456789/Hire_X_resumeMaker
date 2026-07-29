import React from 'react';
import { getStoredToken } from '../services/apiClient';
import { useCoverLetter } from '../hooks/useCoverLetter';
import { extractTextFromPDF, extractTextFromWordDoc } from '../services/pdfTextExtractor';
import { CoverLetterForm } from '../features/coverLetter/components/CoverLetterForm';
import { CoverLetterPreview } from '../features/coverLetter/components/CoverLetterPreview';
import { CoverLetterHistory } from '../features/coverLetter/components/CoverLetterHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Clock } from 'lucide-react';

const CoverLetterPage = () => {
  const token = getStoredToken();
  const coverLetter = useCoverLetter(token);

  const handleDropAccepted = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    coverLetter.setIsExtracting(true);
    coverLetter.setUploadedFileName(file.name);

    try {
      let extracted = '';
      if (file.name.endsWith('.pdf')) {
        extracted = await extractTextFromPDF(file);
      } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        extracted = await extractTextFromWordDoc(file);
      } else {
        extracted = await file.text();
      }
      coverLetter.setUploadedResumeText(extracted);
    } catch (err) {
      console.error('File extraction error:', err);
    } finally {
      coverLetter.setIsExtracting(false);
    }
  };

  return (
    <div className="min-h-screen pb-16 px-4 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
          <Mail className="w-3.5 h-3.5" /> AI Cover Letter Generator
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          Tailor Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400">Cover Letter</span>
        </h1>
        <p className="text-sm text-gray-400 max-w-2xl mx-auto">
          Generate targeted, high-impact cover letters matched specifically to job descriptions and company context.
        </p>
      </div>

      <Tabs value={coverLetter.activeTab} onValueChange={coverLetter.setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="bg-black/40 border border-white/10 p-1 rounded-2xl">
            <TabsTrigger value="editor" className="rounded-xl text-xs px-6 data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              <Mail className="w-3.5 h-3.5 mr-2" /> Generator
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl text-xs px-6 data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              <Clock className="w-3.5 h-3.5 mr-2" /> History ({coverLetter.history.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="editor" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <CoverLetterForm
                companyName={coverLetter.companyName}
                setCompanyName={coverLetter.setCompanyName}
                jobTitle={coverLetter.jobTitle}
                setJobTitle={coverLetter.setJobTitle}
                jobDescription={coverLetter.jobDescription}
                setJobDescription={coverLetter.setJobDescription}
                tone={coverLetter.tone}
                setTone={coverLetter.setTone}
                length={coverLetter.length}
                setLength={coverLetter.setLength}
                expLevel={coverLetter.expLevel}
                setExpLevel={coverLetter.setExpLevel}
                resumeSource={coverLetter.resumeSource}
                setResumeSource={coverLetter.setResumeSource}
                selectedResumeId={coverLetter.selectedResumeId}
                setSelectedResumeId={coverLetter.setSelectedResumeId}
                savedResumes={coverLetter.savedResumes}
                loadingResumes={coverLetter.loadingResumes}
                uploadedFileName={coverLetter.uploadedFileName}
                isExtracting={coverLetter.isExtracting}
                onDropAccepted={handleDropAccepted}
                isGenerating={coverLetter.isGenerating}
                onGenerate={coverLetter.handleGenerate}
              />
            </div>

            <div className="lg:col-span-7">
              <CoverLetterPreview
                data={coverLetter.generatedData}
                isSaving={coverLetter.isSaving}
                onSave={coverLetter.handleSave}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <CoverLetterHistory
            history={coverLetter.history}
            onLoadItem={coverLetter.loadFromHistory}
            onDeleteItem={coverLetter.handleDeleteHistory}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoverLetterPage;
