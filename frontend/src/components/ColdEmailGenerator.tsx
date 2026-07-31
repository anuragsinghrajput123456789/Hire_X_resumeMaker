import React from 'react';
import { getStoredToken } from '../services/apiClient';
import { useColdEmail } from '../hooks/useColdEmail';
import { ColdEmailForm } from '../features/coldEmail/components/ColdEmailForm';
import { ColdEmailPreview } from '../features/coldEmail/components/ColdEmailPreview';
import { Mail, Clock, Trash2, Sparkles, Building2, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ColdEmailGenerator = () => {
  const token = getStoredToken();
  const coldEmail = useColdEmail(token);

  return (
    <div className="min-h-screen pb-16 px-4 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Cold Outreach Engine
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white font-poppins">
          Cold Email <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-pink-400 to-violet-400">Generator</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Craft personalized, compelling cold emails tailored to hiring managers, engineering directors, and founders.
        </p>
      </div>

      <Tabs defaultValue="generator" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="bg-[#070B19]/80 border border-white/10 p-1.5 rounded-2xl shadow-xl">
            <TabsTrigger value="generator" className="rounded-xl text-xs px-6 py-2 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all cursor-pointer">
              <Mail className="w-3.5 h-3.5 mr-2" /> Generator Studio
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl text-xs px-6 py-2 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all cursor-pointer">
              <Clock className="w-3.5 h-3.5 mr-2" /> Saved Outreach History ({coldEmail.history.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6">
              <ColdEmailForm
                recipientName={coldEmail.recipientName}
                setRecipientName={coldEmail.setRecipientName}
                recipientEmail={coldEmail.recipientEmail}
                setRecipientEmail={coldEmail.setRecipientEmail}
                recipientCompany={coldEmail.recipientCompany}
                setRecipientCompany={coldEmail.setRecipientCompany}
                recipientRole={coldEmail.recipientRole}
                setRecipientRole={coldEmail.setRecipientRole}

                senderName={coldEmail.senderName}
                setSenderName={coldEmail.setSenderName}
                senderEmail={coldEmail.senderEmail}
                setSenderEmail={coldEmail.setSenderEmail}
                jobTitle={coldEmail.jobTitle}
                setJobTitle={coldEmail.setJobTitle}
                experience={coldEmail.experience}
                setExperience={coldEmail.setExperience}
                skills={coldEmail.skills}
                setSkills={coldEmail.setSkills}
                personalNote={coldEmail.personalNote}
                setPersonalNote={coldEmail.setPersonalNote}
                portfolioUrl={coldEmail.portfolioUrl}
                setPortfolioUrl={coldEmail.setPortfolioUrl}

                tone={coldEmail.tone}
                setTone={coldEmail.setTone}
                goal={coldEmail.goal}
                setGoal={coldEmail.setGoal}
                ctaType={coldEmail.ctaType}
                setCtaType={coldEmail.setCtaType}

                isGenerating={coldEmail.isGenerating}
                onGenerate={coldEmail.handleGenerate}
              />
            </div>

            <div className="lg:col-span-6 sticky top-24">
              <ColdEmailPreview
                emailContent={coldEmail.generatedEmail}
                subjectLine={coldEmail.subjectLine}
                emailBody={coldEmail.emailBody}
                recipientEmail={coldEmail.recipientEmail}
                isSaving={coldEmail.isSaving}
                onSave={coldEmail.handleSave}
                getGmailComposerUrl={coldEmail.getGmailComposerUrl}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          {coldEmail.history.length === 0 ? (
            <div className="glass-card bg-[#0B1020]/60 border border-white/10 rounded-2xl p-12 text-center text-slate-400 text-xs">
              <Mail className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-300">No saved emails found in history.</p>
              <p className="text-[11px] text-slate-500 mt-1">Generate a cold email and click "Save Draft" to store it here.</p>
            </div>
          ) : (
            <div className="space-y-3 max-w-4xl mx-auto">
              {coldEmail.history.map((item) => (
                <Card
                  key={item._id}
                  className="glass-card bg-[#0B1020]/80 border border-white/10 hover:border-amber-400/30 transition-all rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-white font-poppins">{item.recipientName}</span>
                      {item.recipientCompany && (
                        <Badge variant="outline" className="text-[10px] border-amber-400/30 text-amber-300 bg-amber-400/10">
                          <Building2 className="w-2.5 h-2.5 mr-1" />
                          {item.recipientCompany}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[10px] border-white/10 text-slate-300">
                        {item.jobTitle}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(item.content)}
                      className="text-xs h-8 rounded-lg border-white/10 text-slate-300 hover:text-white"
                    >
                      Copy
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => coldEmail.handleDelete(item._id)}
                      className="text-xs h-8 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColdEmailGenerator;


