import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Calendar, Trash2, ChevronLeft, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export const DiaryView = ({ onClose }: { onClose: () => void }) => {
  const { diaryEntries } = useStore();

  return (
    <div className="fixed inset-0 z-40 bg-[#F5EFE7] flex flex-col p-10 overflow-hidden font-sans text-[#4a4a4a]">
      <div className="atmosphere opacity-40 shrink-0" />
      
      <header className="max-w-4xl w-full mx-auto flex justify-between items-center mb-20 relative z-10 px-4">
        <div>
          <p className="text-[#9482C1] uppercase font-black tracking-[0.4em] text-[10px] mb-3">Memory Consolidation</p>
          <h2 className="text-5xl font-black text-[#4a4a4a] tracking-tighter">THE CHRONICLE</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-2xl bg-white border border-[#B9D8D8] hover:bg-[#F5EFE7] shadow-sm h-12 w-12">
          <ChevronLeft className="h-7 w-7 text-[#9482C1]" />
        </Button>
      </header>

      <ScrollArea className="flex-1 max-w-4xl w-full mx-auto relative z-10 px-4">
        {diaryEntries.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-48">
            <BookOpen className="h-14 w-14 text-zinc-300 mb-6" />
            <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-xs">Nothing recorded in this timeline</p>
          </div>
        ) : (
          <div className="space-y-8 pb-32">
            {diaryEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-white/60 backdrop-blur-md border-[#B9D8D8] hover:border-[#BA9BC9] transition-all p-10 rounded-[2.5rem] relative group overflow-hidden shadow-xl shadow-purple-900/5">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#9482C1]/5 blur-[80px] pointer-events-none" />
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <div className="flex items-center gap-5 mb-4">
                        <Badge className="bg-[#BA9BC9] text-white border-none uppercase text-[9px] font-black tracking-widest px-4 py-1">
                          {entry.characterName}
                        </Badge>
                        <span className="text-zinc-400 text-[10px] uppercase font-black tracking-widest flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-2 text-[#B9D8D8]" /> {new Date(entry.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-[#4a4a4a] tracking-tight">{entry.mood} REFLECTION</h3>
                    </div>
                  </div>
                  <div className="text-base leading-relaxed text-[#4a4a4a] font-medium opacity-90 prose prose-zinc max-w-none italic border-l-4 border-[#B9D8D8] pl-8 py-2">
                    "{entry.content}"
                  </div>
                  <div className="mt-10 pt-8 border-t border-[#B9D8D8]/30 flex justify-between items-center px-2">
                    <span className="text-[10px] uppercase font-black text-zinc-300 tracking-[0.3em]">Signature // 0x{entry.id.slice(-6)}</span>
                    <Sparkles className="h-4 w-4 text-[#B9D8D8] group-hover:text-[#9482C1] transition-colors" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
