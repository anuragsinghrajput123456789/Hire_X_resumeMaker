import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

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
  isGenerating, onGenerate
}) => {
  return (
    <Card className="glass-card bg-[#0F1424]/80 border border-white/10 shadow-2xl rounded-3xl overflow-hidden p-6">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-400">
          Cold Outreach Parameters
        </CardTitle>
        <CardDescription className="text-gray-400 text-xs">
          Input details about your target contact to generate a high-converting cold email.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-gray-300">Recipient Name *</Label>
            <Input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="bg-black/30 border-white/10 text-white rounded-xl mt-1 h-9"
            />
          </div>
          <div>
            <Label className="text-gray-300">Recipient Email (Optional)</Label>
            <Input
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="e.g. sarah@techcorp.com"
              className="bg-black/30 border-white/10 text-white rounded-xl mt-1 h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-gray-300">Company Name</Label>
            <Input
              value={recipientCompany}
              onChange={(e) => setRecipientCompany(e.target.value)}
              placeholder="e.g. Stripe"
              className="bg-black/30 border-white/10 text-white rounded-xl mt-1 h-9"
            />
          </div>
          <div>
            <Label className="text-gray-300">Recipient Role / Title</Label>
            <Input
              value={recipientRole}
              onChange={(e) => setRecipientRole(e.target.value)}
              placeholder="e.g. VP of Engineering"
              className="bg-black/30 border-white/10 text-white rounded-xl mt-1 h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-gray-300">Your Name</Label>
            <Input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Your Full Name"
              className="bg-black/30 border-white/10 text-white rounded-xl mt-1 h-9"
            />
          </div>
          <div>
            <Label className="text-gray-300">Target Role *</Label>
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="bg-black/30 border-white/10 text-white rounded-xl mt-1 h-9"
            />
          </div>
        </div>

        <div>
          <Label className="text-gray-300">Key Skills & Tech Stack</Label>
          <Input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. Node.js, TypeScript, Distributed Systems, AWS"
            className="bg-black/30 border-white/10 text-white rounded-xl mt-1 h-9"
          />
        </div>

        <div>
          <Label className="text-gray-300">Personal Note / Specific Project Reference</Label>
          <textarea
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
            rows={3}
            placeholder="Mention a recent blog post, podcast, product release, or mutual connection..."
            className="w-full bg-black/30 border border-white/10 text-white rounded-xl mt-1 p-2.5 focus:outline-none focus:border-violet-500 transition-all resize-none"
          />
        </div>

        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full h-10 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white font-bold shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 mt-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Crafting Cold Email...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Generate Cold Email
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
