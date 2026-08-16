import { useState } from 'react';
import { 
  startSession, 
  submitAnswer, 
  finalizeSession,
  InterviewRoadmap,
  InterviewQuestion,
  InterviewFeedback,
  InterviewStudyPlan,
  CareerIntelligence
} from '../services/interviewService';
import { useToast } from '../components/ui/use-toast';

export const useInterviewSession = () => {
  const { toast } = useToast();

  const [jobDescription, setJobDescription] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Mid-Level');
  const [selectedResumeId, setSelectedResumeId] = useState<string | undefined>(undefined);

  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<InterviewRoadmap | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [lastReview, setLastReview] = useState<{ review: string; score: number; modelAnswer: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [studyPlan, setStudyPlan] = useState<InterviewStudyPlan | null>(null);
  const [careerIntelligence, setCareerIntelligence] = useState<CareerIntelligence | null>(null);

  const handleStartSession = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Job Description Required',
        description: 'Please provide a target job description to build the interview simulation.',
        variant: 'destructive',
      });
      return;
    }

    setIsStarting(true);
    try {
      const res = await startSession({
        jobDescription,
        company,
        role,
        interviewType,
        difficulty,
        resumeId: selectedResumeId,
      });

      setSessionId(res.sessionId);
      setRoadmap(res.roadmap);
      setCurrentQuestion(res.question);
      setIsCompleted(false);
      setLastReview(null);

      toast({
        title: 'Session Started!',
        description: 'Your tailored preparation roadmap and first question are ready.',
      });
    } catch (error: unknown) {
      toast({
        title: 'Session Failed',
        description: error instanceof Error ? error.message : 'Could not initialize interview session.',
        variant: 'destructive',
      });
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!sessionId || !userAnswer.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await submitAnswer({
        sessionId,
        userAnswer,
      });

      setLastReview({
        review: res.review,
        score: res.score,
        modelAnswer: res.modelAnswer,
      });

      if (res.completed || !res.nextQuestion) {
        setIsCompleted(true);
        toast({
          title: 'Interview Completed!',
          description: 'Ready to generate overall session feedback.',
        });
      } else {
        setCurrentQuestion(res.nextQuestion);
        setUserAnswer('');
      }
    } catch (error: unknown) {
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Could not submit answer.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalizeSession = async () => {
    if (!sessionId) return;

    setIsFinalizing(true);
    try {
      const res = await finalizeSession({ sessionId });
      setFeedback(res.feedback);
      setStudyPlan(res.studyPlan);
      setCareerIntelligence(res.careerIntelligence);

      toast({
        title: 'Report Ready!',
        description: 'Full performance analytics and study plan generated.',
      });
    } catch (error: unknown) {
      toast({
        title: 'Finalization Failed',
        description: error instanceof Error ? error.message : 'Could not finalize session.',
        variant: 'destructive',
      });
    } finally {
      setIsFinalizing(false);
    }
  };

  return {
    jobDescription, setJobDescription,
    company, setCompany,
    role, setRole,
    interviewType, setInterviewType,
    difficulty, setDifficulty,
    selectedResumeId, setSelectedResumeId,
    isStarting,
    isSubmitting,
    isFinalizing,
    sessionId,
    roadmap,
    currentQuestion,
    userAnswer, setUserAnswer,
    lastReview,
    isCompleted,
    feedback,
    studyPlan,
    careerIntelligence,
    handleStartSession,
    handleSubmitAnswer,
    handleFinalizeSession,
  };
};
