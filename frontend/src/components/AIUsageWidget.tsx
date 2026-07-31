import React, { useEffect, useState } from 'react';
import { getAIUsage, AIUsageResponse, FeatureUsage } from '../services/aiService';
import { Zap, Clock, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface AIUsageWidgetProps {
  compact?: boolean;
  className?: string;
}

export const AIUsageWidget: React.FC<AIUsageWidgetProps> = ({ compact = false, className = '' }) => {
  const [usageData, setUsageData] = useState<AIUsageResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [countdownText, setCountdownText] = useState<string>('');

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const data = await getAIUsage();
      setUsageData(data);
      setCountdownText(data.countdown.formatted);
      setError(null);
    } catch (err) {
      setError('Unable to load AI usage');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
    
    // Refresh usage every 60 seconds
    const interval = setInterval(() => {
      fetchUsage();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Live countdown ticker
  useEffect(() => {
    if (!usageData?.countdown?.totalSeconds) return;

    let secondsLeft = usageData.countdown.totalSeconds;
    const ticker = setInterval(() => {
      secondsLeft = Math.max(0, secondsLeft - 1);
      const h = Math.floor(secondsLeft / 3600);
      const m = Math.floor((secondsLeft % 3600) / 60);
      setCountdownText(`${h}h ${m}m Remaining`);
    }, 1000);

    return () => clearInterval(ticker);
  }, [usageData]);

  if (loading && !usageData) {
    return (
      <div className={`p-4 rounded-xl border border-violet-500/20 bg-slate-900/60 backdrop-blur-md animate-pulse ${className}`}>
        <div className="h-4 bg-slate-700/50 rounded w-1/3 mb-3"></div>
        <div className="h-2 bg-slate-700/40 rounded w-full mb-2"></div>
        <div className="h-2 bg-slate-700/40 rounded w-4/5"></div>
      </div>
    );
  }

  if (error || !usageData) {
    return null; // Silently failover to preserve existing UI if offline
  }

  const featureLabels: Record<string, { label: string; icon: string }> = {
    coverLetter: { label: 'Cover Letters', icon: '📝' },
    atsAnalysis: { label: 'ATS Resume Scans', icon: '📊' },
    resumeOptimization: { label: 'Resume Optimizations', icon: '⚡' },
    coldEmail: { label: 'Cold Emails', icon: '✉️' },
    chat: { label: 'Career Assistant Chat', icon: '💬' }
  };

  const getBarColor = (percent: number) => {
    if (percent >= 100) return 'bg-rose-500';
    if (percent >= 80) return 'bg-amber-500';
    return 'bg-gradient-to-r from-violet-500 to-indigo-500';
  };

  return (
    <div className={`p-4 md:p-5 rounded-xl border border-violet-500/20 bg-slate-900/80 backdrop-blur-xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              AI Daily Usage & Quotas
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 uppercase font-medium">
                {usageData.tier} Tier
              </span>
            </h4>
          </div>
        </div>

        {/* Live Reset Timer */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50">
          <Clock className="w-3.5 h-3.5 text-violet-400" />
          <span>Reset in <strong className="text-slate-200">{countdownText}</strong></span>
        </div>
      </div>

      {/* Feature Progress Bars */}
      <div className="space-y-3">
        {Object.entries(featureLabels).map(([key, config]) => {
          const item: FeatureUsage = usageData.usage[key] || { used: 0, limit: 10, remaining: 10, progressPercent: 0 };
          const isFull = item.used >= item.limit;

          return (
            <div key={key} className="group">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <span>{config.icon}</span> {config.label}
                </span>
                <span className="text-slate-400">
                  <strong className={isFull ? 'text-rose-400' : 'text-slate-200'}>{item.used}</strong> / {item.limit}
                  <span className="ml-1.5 text-[10px] text-slate-500">({item.remaining} left)</span>
                </span>
              </div>

              {/* Progress Track */}
              <div 
                className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/40"
                role="progressbar"
                aria-valuenow={item.used}
                aria-valuemin={0}
                aria-valuemax={item.limit}
                aria-label={`${config.label} Usage`}
              >
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(item.progressPercent)}`}
                  style={{ width: `${Math.min(100, item.progressPercent)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIUsageWidget;
