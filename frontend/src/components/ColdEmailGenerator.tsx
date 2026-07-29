import React from 'react';
import { getStoredToken } from '../services/apiClient';
import { useColdEmail } from '../hooks/useColdEmail';
import { ColdEmailForm } from '../features/coldEmail/components/ColdEmailForm';
import { ColdEmailPreview } from '../features/coldEmail/components/ColdEmailPreview';
import { Mail, Clock, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ColdEmailGenerator = () => {
  const token = getStoredToken();
  const coldEmail = useColdEmail(token);

  return (
    <div className="min-h-screen pb-16 px-4 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
          <Mail className="w-3.5 h-3.5" /> AI Cold Outreach Engine
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          Cold Email <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400">Generator</span>
        </h1>
        <p className="text-sm text-gray-400 max-w-2xl mx-auto">
          Craft personalized, compelling cold emails tailored to recruiters, engineering managers, and founders.
        </p>
      </div>

      <Tabs defaultValue="generator" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="bg-black/40 border border-white/10 p-1 rounded-2xl">
            <TabsTrigger value="generator" className="rounded-xl text-xs px-6 data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              <Mail className="w-3.5 h-3.5 mr-2" /> Generator
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl text-xs px-6 data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              <Clock className="w-3.5 h-3.5 mr-2" /> History ({coldEmail.history.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
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
                isGenerating={coldEmail.isGenerating}
                onGenerate={coldEmail.handleGenerate}
              />
            </div>

            <div className="lg:col-span-7">
              <ColdEmailPreview
                emailContent={coldEmail.generatedEmail}
                isSaving={coldEmail.isSaving}
                onSave={coldEmail.handleSave}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          {coldEmail.history.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">
              No saved emails found in history.
            </div>
          ) : (
            <div className="space-y-3">
              {coldEmail.history.map((item) => (
                <Card
                  key={item._id}
                  className="glass-card bg-[#0F1424]/60 border border-white/5 hover:border-white/20 transition-all rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white">{item.recipientName}</span>
                      {item.recipientCompany && (
                        <Badge variant="outline" className="text-[10px] border-violet-500/30 text-violet-300">
                          {item.recipientCompany}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[10px] border-white/10 text-gray-400">
                        {item.jobTitle}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1 max-w-xl">
                      {item.content}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => coldEmail.handleDelete(item._id)}
                    className="text-xs h-8 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
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

