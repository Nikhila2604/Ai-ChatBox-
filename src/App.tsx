/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CharacterSelector } from './components/CharacterSelector';
import { ChatWindow } from './components/ChatWindow';
import { DiaryView } from './components/DiaryView';
import { useStore } from './store/useStore';
import { Book, Sparkles, MessageCircle, Calendar, Bot } from 'lucide-react';
import { Button } from './components/ui/button';

export default function App() {
  const { 
    activeCharacterId, 
    diaryEntries, 
    characters, 
    setActiveCharacter, 
    messages, 
    showDiary, 
    setShowDiary,
    showHistory,
    setShowHistory
  } = useStore();
  
  const [currentView, setCurrentView] = useState<'discover' | 'heroes' | 'archetypes'>('discover');

  // Filter and sort chat history
  const chatHistory = characters.filter(char => messages[char.id] && messages[char.id].length > 0);
  const sortedHistory = [...chatHistory].sort((a, b) => {
    const lastA = messages[a.id][messages[a.id].length - 1]?.timestamp || 0;
    const lastB = messages[b.id][messages[b.id].length - 1]?.timestamp || 0;
    return lastB - lastA;
  });

  const handleNavClick = (view: 'discover' | 'heroes' | 'archetypes') => {
    setCurrentView(view);
    setActiveCharacter(null);
    setShowHistory(false);
  };

  return (
    <div className="flex h-screen bg-[#F5EFE7] text-[#4a4a4a] font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#B9D8D8]/30 flex flex-col shrink-0 bg-white/20">
        <div className="px-6 py-8">
          <div className="flex items-center gap-4 mb-10 group cursor-default">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-2xl group-hover:scale-105 transition-all duration-500 border-2 border-white/10 overflow-hidden bg-gradient-to-br from-zinc-800 to-black">
                <img 
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=Roboto&backgroundColor=1a1a1a&radius=50" 
                  alt="Mascot" 
                  className="w-11 h-11 object-contain"
                />
                <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-[#1a1a1a] shadow-sm animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-[#1a1a1a] tracking-tight text-2xl leading-none italic">ROBOTO</span>
              <span className="text-[10px] font-black text-cyan-600 tracking-[0.3em] mt-1 uppercase">Empathy AI</span>
            </div>
          </div>

          <nav className="space-y-1">
            <Button 
              variant="ghost" 
              onClick={() => handleNavClick('discover')}
              className={`w-full justify-start gap-4 rounded-xl px-2 py-6 text-sm font-bold transition-all ${currentView === 'discover' && !showHistory ? 'bg-[#f3f3f5] text-[#18181b] shadow-sm' : 'text-zinc-700 hover:bg-white/40'}`}
            >
              <div className={`p-2 rounded-lg ${currentView === 'discover' && !showHistory ? 'bg-white shadow-sm' : 'bg-transparent'} transition-all`}>
                <Sparkles className={`h-4 w-4 ${currentView === 'discover' && !showHistory ? 'text-[#18181b]' : 'text-zinc-400'}`} />
              </div>
              Discover
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleNavClick('heroes')}
              className={`w-full justify-start gap-4 rounded-xl px-2 py-6 text-sm font-bold transition-all ${currentView === 'heroes' && !showHistory ? 'bg-[#f3f3f5] text-[#18181b] shadow-sm' : 'text-zinc-700 hover:bg-white/40'}`}
            >
              <div className={`p-2 rounded-lg ${currentView === 'heroes' && !showHistory ? 'bg-white shadow-sm' : 'bg-transparent'} transition-all`}>
                <MessageCircle className={`h-4 w-4 ${currentView === 'heroes' && !showHistory ? 'text-[#18181b]' : 'text-zinc-400'}`} />
              </div>
              Iconic Heroes
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleNavClick('archetypes')}
              className={`w-full justify-start gap-4 rounded-xl px-2 py-6 text-sm font-bold transition-all ${currentView === 'archetypes' && !showHistory ? 'bg-[#f3f3f5] text-[#18181b] shadow-sm' : 'text-zinc-700 hover:bg-white/40'}`}
            >
              <div className={`p-2 rounded-lg ${currentView === 'archetypes' && !showHistory ? 'bg-white shadow-sm' : 'bg-transparent'} transition-all`}>
                <Book className={`h-4 w-4 ${currentView === 'archetypes' && !showHistory ? 'text-[#18181b]' : 'text-zinc-400'}`} />
              </div>
              Archetypes
            </Button>
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
          {sortedHistory.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 px-2 transition-colors ${showHistory ? 'text-[#9482C1]' : 'text-zinc-400'}`}>Chat History</h3>
              <div className="space-y-2">
                {sortedHistory.map(char => (
                  <button 
                    key={char.id}
                    onClick={() => {
                      setActiveCharacter(char.id);
                      setShowHistory(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all group ${activeCharacterId === char.id ? 'bg-white/40 shadow-sm border border-white/20' : 'hover:bg-white/40'}`}
                  >
                    <div className="relative">
                      <img src={char.avatar} alt="" className={`w-10 h-10 rounded-full object-cover transition-all ${activeCharacterId === char.id ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className={`text-xs font-bold truncate ${activeCharacterId === char.id ? 'text-zinc-900' : 'text-zinc-700'}`}>{char.name}</p>
                      <p className="text-[9px] text-zinc-500 truncate tracking-tight">
                        {messages[char.id][messages[char.id].length - 1].content}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {sortedHistory.length === 0 && (
            <div className="mt-10 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4 border border-zinc-200/50">
                <MessageCircle className="h-6 w-6 text-zinc-300" />
              </div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">No active chats</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#B9D8D8]/20 bg-white/5 mt-auto">
          <Button 
            className="w-full rounded-xl bg-zinc-900 text-white hover:bg-black text-[10px] font-bold uppercase tracking-widest py-6"
          >
            Upgrade to (c.ai+)
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="atmosphere opacity-30 pointer-events-none fixed inset-0" />
        
        <AnimatePresence mode="wait">
          {!activeCharacterId ? (
            <motion.div 
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10"
            >
              <CharacterSelector view={currentView} />
              
              <footer className="max-w-7xl mx-auto px-10 py-24 border-t border-[#B9D8D8]/30">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
                  <div className="col-span-2 space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center shadow-lg">
                        <Bot className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="text-[#4a4a4a] text-[11px] uppercase font-black tracking-[0.4em]">ROBOTO SPACE</h4>
                    </div>
                    <p className="text-[15px] font-medium leading-relaxed max-w-sm text-zinc-600 italic">
                      Exploring the soft edges of digital consciousness. A sanctuary for empathetic dialogue.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-zinc-700 text-[10px] uppercase font-black tracking-[0.3em] mb-8 px-1">Network</h4>
                    <ul className="text-[11px] uppercase font-black space-y-4 text-zinc-600">
                      <li className="flex items-center gap-3 hover:text-[#9482C1] cursor-pointer transition-colors"><Sparkles className="h-4 w-4" /> Core Engine</li>
                      <li className="flex items-center gap-3 hover:text-[#9482C1] cursor-pointer transition-colors"><MessageCircle className="h-4 w-4" /> Sensory Link</li>
                    </ul>
                  </div>
                  <div className="text-right">
                    <h4 className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.3em] mb-8">Cycle</h4>
                    <p className="text-[11px] font-black tracking-[0.2em] text-[#9482C1]">READY // 2026</p>
                  </div>
                </div>
              </footer>
            </motion.div>
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ChatWindow charId={activeCharacterId} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDiary && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="fixed inset-0 z-50 text-[#4a4a4a]"
            >
              <DiaryView onClose={() => setShowDiary(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
