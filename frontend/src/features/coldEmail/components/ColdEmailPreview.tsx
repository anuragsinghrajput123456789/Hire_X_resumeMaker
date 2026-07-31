import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Save, Loader2, Mail, ExternalLink, Sparkles, Send, FileText, CheckCircle2 } from 'lucide-react';

interface ColdEmailPreviewProps {
  emailContent: string;
  subjectLine?: string;
  emailBody?: string;
  recipientEmail?: string;
  isSaving: boolean;
  onSave: () => void;
  getGmailComposerUrl?: () => string;
}

export const ColdEmailPreview: React.FC<ColdEmailPreviewProps> = ({
  emailContent,
  subjectLine = '',
  emailBody = '',
  recipientEmail = '',
  isSaving,
  onSave,
  getGmailComposerUrl,
}) => {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!emailContent) {
    return (
      <Card className="glass-card bg-[#0B1020]/70 border border-white/10 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[440px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 shadow-inner">
          <Mail className="w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 font-poppins">Ready to Craft Your Cold Email</h3>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
          Fill in your recipient's info, company target, and outreach strategy on the left, then click <b className="text-amber-400">Generate Cold Email</b> to craft a high-conversion draft.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-md text-left">
          {[
            { title: 'Value-First Hooks', desc: 'Grabs recruiter attention' },
            { title: '1-Click Gmail', desc: 'Direct browser dispatch' },
            { title: 'Saved History', desc: 'Revisit & copy anytime' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs">
              <span className="font-bold text-white block mb-0.5">{item.title}</span>
              <span className="text-[10px] text-slate-500">{item.desc}</span>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const effectiveSubject = subjectLine || 'Subject Line';
  const effectiveBody = emailBody || emailContent;
  const wordCount = effectiveBody.trim().split(/\s+/).filter(Boolean).length;
  const readingTimeSec = Math.max(10, Math.ceil((wordCount / 200) * 60));

  const handleCopySubject = () => {
    navigator.clipboard.writeText(effectiveSubject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(effectiveBody);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(emailContent);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const gmailUrl = getGmailComposerUrl ? getGmailComposerUrl() : '';

  return (
    <Card className="glass-card bg-[#0B1020]/90 border border-white/10 shadow-2xl rounded-3xl overflow-hidden p-5 sm:p-6 space-y-4">
      
      {/* Header Actions */}
      <CardHeader className="p-0 flex flex-row items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white font-poppins flex items-center gap-2">
              <span>Outreach Email Draft</span>
              <span className="text-[10px] font-mono font-normal text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                Ready to Send
              </span>
            </CardTitle>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>~{readingTimeSec}s read time</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="text-xs h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Draft
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        
        {/* Email Client Mockup Header Bar */}
        <div className="rounded-2xl border border-white/10 bg-[#050814] overflow-hidden">
          
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-[10px] font-mono text-slate-400">Email Composer Preview</span>
          </div>

          <div className="p-4 space-y-3">
            
            {/* Subject Line Field Bar */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 truncate">
                <span className="text-xs font-bold text-amber-400 shrink-0">Subject:</span>
                <span className="text-xs font-semibold text-white truncate">{effectiveSubject}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopySubject}
                className="text-[11px] h-7 px-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg shrink-0 flex items-center gap-1"
              >
                {copiedSubject ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedSubject ? 'Copied' : 'Copy Subject'}
              </Button>
            </div>

            {/* Email Body Output */}
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] text-slate-200 font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-line min-h-[220px]">
              {effectiveBody}
            </div>

          </div>
        </div>

        {/* 1-Click Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyBody}
              className="text-xs h-9 px-3.5 rounded-xl border-white/10 bg-white/[0.03] text-slate-200 hover:text-white hover:bg-white/[0.08] flex items-center gap-1.5"
            >
              {copiedBody ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              {copiedBody ? 'Copied Body' : 'Copy Email Body'}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyAll}
              className="text-xs h-9 px-3.5 rounded-xl border-white/10 bg-white/[0.03] text-slate-200 hover:text-white hover:bg-white/[0.08] flex items-center gap-1.5"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5 text-pink-400" />}
              {copiedAll ? 'Copied Full Text' : 'Copy Full Draft'}
            </Button>
          </div>

          {/* Direct Gmail Composer Launch Button */}
          {gmailUrl && (
            <a
              href={gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="sm"
                className="w-full sm:w-auto text-xs h-9 px-4 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open in Gmail Web</span>
                <ExternalLink className="w-3 h-3 text-white/80" />
              </Button>
            </a>
          )}
        </div>

      </CardContent>
    </Card>
  );
};

