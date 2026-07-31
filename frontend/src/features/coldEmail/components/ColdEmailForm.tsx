import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, User, Building2, Briefcase, Zap, Link as LinkIcon, Sliders, CheckCircle2 } from 'lucide-react';
import { TONE_OPTIONS, GOAL_OPTIONS, CTA_OPTIONS } from '../../../hooks/useColdEmail';

interface ColdEmailFormProps {
  recipientName: string;
  setRecipientName: (v: string) => void;
  recipientEmail: string;
  setRecipientEmail: (v: string) => void;
  recipientCompany: string;
  setRecipientCompany: (v: string) => void;
  recipientRole: string;
  setRecipientRole: (v: string) => void;

  senderName: string;
  setSenderName: (v: string) => void;
  senderEmail: string;
  setSenderEmail: (v: string) => void;
  jobTitle: string;
  setJobTitle: (v: string) => void;
  experience: string;
  setExperience: (v: string) => void;
  skills: string;
  setSkills: (v: string) => void;
  personalNote: string;
  setPersonalNote: (v: string) => void;
  portfolioUrl: string;
  setPortfolioUrl: (v: string) => void;

  tone: string;
  setTone: (v: string) => void;
  goal: string;
  setGoal: (v: string) => void;
  ctaType: string;
  setCtaType: (v: string) => void;

  isGenerating: boolean;
  onGenerate: () => void;
}

export const ColdEmailForm: React.FC<ColdEmailFormProps> = ({
  recipientName, setRecipientName,
  recipientEmail, setRecipientEmail,
  recipientCompany, setRecipientCompany,
  recipientRole, setRecipientRole,
  senderName, setSenderName,
  senderEmail, setSenderEmail,
  jobTitle, setJobTitle,
  experience, setExperience,
  skills, setSkills,
  personalNote, setPersonalNote,
  portfolioUrl, setPortfolioUrl,
  tone, setTone,
  goal, setGoal,
  ctaType, setCtaType,
  isGenerating, onGenerate
}) => {
  return (
    <Card className="glass-card bg-[#0B1020]/90 border border-white/10 shadow-2xl rounded-3xl overflow-hidden p-5 sm:p-6 space-y-6">
      
      {/* Header */}
      <CardHeader className="p-0 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-black tracking-tight text-white flex items-center gap-2 font-poppins">
            <Sliders className="w-4 h-4 text-amber-400" />
            Outreach Parameters
          </CardTitle>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full uppercase">
            AI Engine v2.4
          </span>
        </div>
        <CardDescription className="text-slate-400 text-xs font-medium">
          Fill in recipient details and strategic preferences to generate a targeted cold email.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 space-y-5 text-xs">
        
        {/* SECTION 1: Target Recipient Info */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>1. Target Recipient Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-300 font-semibold flex items-center gap-1">
                Recipient Name <span className="text-amber-400 font-bold">*</span>
              </Label>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="bg-[#050814] border-white/10 text-white rounded-xl mt-1 h-9 text-xs focus:border-amber-400/50"
              />
            </div>

            <div>
              <Label className="text-slate-300 font-semibold flex items-center gap-1">
                Company Name <span className="text-amber-400 font-bold">*</span>
              </Label>
              <Input
                value={recipientCompany}
                onChange={(e) => setRecipientCompany(e.target.value)}
                placeholder="e.g. Stripe / Vercel"
                className="bg-[#050814] border-white/10 text-white rounded-xl mt-1 h-9 text-xs focus:border-amber-400/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-300 font-medium">Recipient Role / Title</Label>
              <Input
                value={recipientRole}
                onChange={(e) => setRecipientRole(e.target.value)}
                placeholder="e.g. VP of Engineering / Recruiter"
                className="bg-[#050814] border-white/10 text-white rounded-xl mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label className="text-slate-300 font-medium flex items-center gap-1">
                Recipient Email <span className="text-slate-500 font-normal">(Enables 1-click Gmail)</span>
              </Label>
              <Input
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="e.g. sarah@stripe.com"
                className="bg-[#050814] border-white/10 text-white rounded-xl mt-1 h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Sender & Position Details */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#00F2FE] uppercase tracking-wider">
            <User className="w-3.5 h-3.5" />
            <span>2. Your Profile & Role Target</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-300 font-semibold flex items-center gap-1">
                Target Position <span className="text-[#00F2FE] font-bold">*</span>
              </Label>
              <Input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Architect"
                className="bg-[#050814] border-white/10 text-white rounded-xl mt-1 h-9 text-xs focus:border-[#00F2FE]/50"
              />
            </div>

            <div>
              <Label className="text-slate-300 font-medium">Your Name</Label>
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your Full Name"
                className="bg-[#050814] border-white/10 text-white rounded-xl mt-1 h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-300 font-medium">Key Skills & Tech Stack</Label>
              <Input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. React, Node.js, TypeScript, AWS"
                className="bg-[#050814] border-white/10 text-white rounded-xl mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label className="text-slate-300 font-medium">Portfolio / GitHub / LinkedIn</Label>
              <Input
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="e.g. https://github.com/alexdev"
                className="bg-[#050814] border-white/10 text-white rounded-xl mt-1 h-9 text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-slate-300 font-medium">Experience Highlight / Achievement</Label>
            <Input
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 5+ years leading high-scale cloud frontend applications scaling to 2M users"
              className="bg-[#050814] border-white/10 text-white rounded-xl mt-1 h-9 text-xs"
            />
          </div>
        </div>

        {/* SECTION 3: Outreach Strategy & Tone Presets */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-400 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>3. Strategy & Tone Presets</span>
            </div>
            <span className="text-[10px] text-slate-500">1-Click Customization</span>
          </div>

          {/* Tone Selector Pills */}
          <div>
            <Label className="text-slate-300 font-medium mb-1.5 block">Email Tone & Style</Label>
            <div className="grid grid-cols-2 gap-2">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                    tone === t.id
                      ? 'bg-pink-500/20 border-pink-500/50 text-white shadow-sm'
                      : 'bg-[#050814] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Goal & CTA Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <Label className="text-slate-300 font-medium mb-1 block">Outreach Goal</Label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-[#050814] border border-white/10 text-white rounded-xl h-9 px-3 text-xs outline-none focus:border-pink-500/50"
              >
                {GOAL_OPTIONS.map((g) => (
                  <option key={g.id} value={g.id} className="bg-[#050814] text-white">
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-slate-300 font-medium mb-1 block">Call to Action (CTA)</Label>
              <select
                value={ctaType}
                onChange={(e) => setCtaType(e.target.value)}
                className="w-full bg-[#050814] border border-white/10 text-white rounded-xl h-9 px-3 text-xs outline-none focus:border-pink-500/50"
              >
                {CTA_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#050814] text-white">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Personal Note / Hook Reference */}
          <div>
            <Label className="text-slate-300 font-medium">Personal Context / Hook Reference</Label>
            <textarea
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              rows={2}
              placeholder="Mention a recent blog post, product release, mutual connection, or specific feature you admire..."
              className="w-full bg-[#050814] border border-white/10 text-white rounded-xl mt-1 p-2.5 text-xs focus:outline-none focus:border-pink-500/50 transition-all resize-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 via-pink-500 to-violet-600 hover:from-amber-600 hover:to-violet-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" /> Crafting Personalized Outreach Email...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" /> Generate Cold Email
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

