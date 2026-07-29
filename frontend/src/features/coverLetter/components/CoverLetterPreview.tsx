import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CoverLetterResponse } from '@/services/aiService';
import { Copy, Check, Download, Save, Loader2, FileText, Sparkles } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface CoverLetterPreviewProps {
  data: CoverLetterResponse | null;
  isSaving: boolean;
  onSave: () => void;
}

export const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({
  data,
  isSaving,
  onSave,
}) => {
  const [copied, setCopied] = useState(false);

  if (!data) {
    return (
      <Card className="glass-card bg-[#0F1424]/60 border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <FileText className="w-12 h-12 text-gray-600 mb-3" />
        <h3 className="text-lg font-bold text-gray-300 mb-1">No Cover Letter Generated Yet</h3>
        <p className="text-xs text-gray-500 max-w-sm">
          Fill out the parameters on the left and click "Generate Cover Letter" to craft your application letter.
        </p>
      </Card>
    );
  }

  const handleCopy = () => {
    if (!data.coverLetter) return;
    navigator.clipboard.writeText(data.coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('cover-letter-pdf-container');
    if (!element) return;

    const opt = {
      margin: 15,
      filename: `${data.company || 'Cover_Letter'}_Tailored.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <Card className="glass-card bg-[#0F1424]/90 border border-white/10 shadow-2xl rounded-3xl overflow-hidden p-6">
      <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            Tailored Cover Letter
          </CardTitle>
          <p className="text-xs text-gray-400 mt-1">
            {data.company} — {data.jobTitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="text-xs h-8 rounded-lg border-white/10 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadPDF}
            className="text-xs h-8 rounded-lg border-white/10 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </Button>

          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="text-xs h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {/* Render PDF target block */}
        <div id="cover-letter-pdf-container" className="p-6 bg-black/40 border border-white/10 rounded-2xl text-gray-200 font-sans text-sm leading-relaxed whitespace-pre-line">
          {data.coverLetter}
        </div>

        {/* Highlighted Key Skill Match & Improvements */}
        {(data.recommendedChanges?.length > 0 || data.missingSkills?.length > 0) && (
          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {data.recommendedChanges?.length > 0 && (
              <div className="p-3 bg-violet-950/30 border border-violet-500/20 rounded-xl">
                <span className="font-semibold text-violet-300 block mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Tailoring Highlights
                </span>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  {data.recommendedChanges.map((change, idx) => (
                    <li key={idx}>{change}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.missingSkills?.length > 0 && (
              <div className="p-3 bg-amber-950/30 border border-amber-500/20 rounded-xl">
                <span className="font-semibold text-amber-300 block mb-1.5">Missing Keyword Gaps</span>
                <div className="flex flex-wrap gap-1">
                  {data.missingSkills.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-[10px] border-amber-500/30 text-amber-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
