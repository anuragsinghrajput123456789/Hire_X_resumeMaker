import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Save, Loader2, Mail } from 'lucide-react';

interface ColdEmailPreviewProps {
  emailContent: string;
  isSaving: boolean;
  onSave: () => void;
}

export const ColdEmailPreview: React.FC<ColdEmailPreviewProps> = ({
  emailContent,
  isSaving,
  onSave,
}) => {
  const [copied, setCopied] = useState(false);

  if (!emailContent) {
    return (
      <Card className="glass-card bg-[#0F1424]/60 border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[360px]">
        <Mail className="w-12 h-12 text-gray-600 mb-3" />
        <h3 className="text-lg font-bold text-gray-300 mb-1">No Email Generated Yet</h3>
        <p className="text-xs text-gray-500 max-w-sm">
          Fill in the contact parameters on the left and click "Generate Cold Email" to produce your outreach message.
        </p>
      </Card>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(emailContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="glass-card bg-[#0F1424]/90 border border-white/10 shadow-2xl rounded-3xl overflow-hidden p-6">
      <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          Outreach Draft
        </CardTitle>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="text-xs h-8 rounded-lg border-white/10 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Email'}
          </Button>

          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="text-xs h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Draft
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-5 bg-black/40 border border-white/10 rounded-2xl text-gray-200 font-sans text-sm leading-relaxed whitespace-pre-line">
          {emailContent}
        </div>
      </CardContent>
    </Card>
  );
};
