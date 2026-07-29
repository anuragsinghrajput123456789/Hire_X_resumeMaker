import React from 'react';
import { SavedCoverLetter } from '@/services/coverLetterService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, FolderOpen, Clock } from 'lucide-react';

interface CoverLetterHistoryProps {
  history: SavedCoverLetter[];
  onLoadItem: (item: SavedCoverLetter) => void;
  onDeleteItem: (id: string) => void;
}

export const CoverLetterHistory: React.FC<CoverLetterHistoryProps> = ({
  history,
  onLoadItem,
  onDeleteItem,
}) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-xs">
        No saved cover letters found in history.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <Card
          key={item._id}
          className="glass-card bg-[#0F1424]/60 border border-white/5 hover:border-white/20 transition-all rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm text-white">{item.company}</span>
              <Badge variant="outline" className="text-[10px] border-violet-500/30 text-violet-300">
                {item.jobTitle}
              </Badge>
              <Badge variant="outline" className="text-[10px] border-white/10 text-gray-400">
                {item.tone || 'Professional'}
              </Badge>
            </div>
            <p className="text-xs text-gray-400 line-clamp-1 max-w-xl">
              {item.coverLetterText}
            </p>
            <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" /> {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onLoadItem(item)}
              className="text-xs h-8 rounded-lg border-white/10 flex items-center gap-1.5"
            >
              <FolderOpen className="w-3.5 h-3.5" /> Load
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDeleteItem(item._id)}
              className="text-xs h-8 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
