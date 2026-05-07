import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ChevronLeft, Book, Gamepad2, Sparkles, Smile, History, Ghost, Zap, Bot } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Character, Emotion, Message } from '../types';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { geminiService } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { Badge } from './ui/badge';

const EMOTION_COLORS: Record<Emotion, string> = {
  Happy: 'from-yellow-500/20 to-orange-500/10',
  Sad: 'from-blue-600/20 to-indigo-900/10',
  Angry: 'from-red-600/30 to-black/10',
  Caring: 'from-pink-400/20 to-purple-500/10',
  Playful: 'from-green-400/20 to-yellow-300/10',
  Mysterious: 'from-purple-900/30 to-black/20',
  Fearful: 'from-gray-800/40 to-black/30',
  Surprised: 'from-cyan-400/20 to-white/10'
};

export const ChatWindow = ({ charId }: { charId: string }) => {
  const { 
    characters, 
    messages, 
    addMessage, 
    setActiveCharacter, 
    setEmotion, 
    currentEmotion, 
    addDiaryEntry, 
    clearHistory,
    setShowDiary,
    setShowHistory
  } = useStore();
  const character = characters.find(c => c.id === charId)!;
  const chatMessages = messages[charId] || [];
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    addMessage(charId, userMsg);
    setInput('');
    setIsLoading(true);

    try {
      const result = await geminiService.chat(character, chatMessages, input);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.text,
        emotion: result.emotion,
        timestamp: Date.now()
      };
      addMessage(charId, aiMsg);
      setEmotion(result.emotion);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiary = async () => {
    if (chatMessages.length === 0) return;
    setIsLoading(true);
    try {
      const entry = await geminiService.generateDiaryEntry(character, chatMessages);
      addDiaryEntry({
        id: Date.now().toString(),
        characterId: charId,
        characterName: character.name,
        content: entry.content,
        mood: entry.mood as Emotion,
        timestamp: Date.now()
      });
      alert("Memories sealed in the Chronical.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex bg-[#F5EFE7] text-[#1a1a1a] overflow-hidden">
      {/* Navigation Rail (Left) */}
      <aside className="w-20 border-r border-[#B9D8D8]/50 flex flex-col items-center py-8 gap-8 shrink-0 bg-white/20">
        <div className="relative group">
          <div className="w-12 h-12 rounded-full bg-[#9482C1] flex items-center justify-center shadow-xl border-2 border-white/50 overflow-hidden transform hover:scale-110 transition-transform duration-500">
            <img 
              src="https://api.dicebear.com/7.x/bottts/svg?seed=Roboto&backgroundColor=9482c1&radius=50" 
              alt="Mascot" 
              className="w-10 h-10 object-contain p-1"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#fdfbf9] shadow-sm animate-pulse" />
        </div>
        <nav className="flex flex-col gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setActiveCharacter(null)} 
            className="rounded-xl hover:bg-white/40 text-zinc-500 hover:text-[#9482C1]"
            title="Back to Lobby"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowDiary(true)} 
            className="rounded-xl hover:bg-white/40 text-zinc-500 hover:text-[#9482C1]"
            title="Open Chronicle (Diary)"
          >
            <Book className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              setActiveCharacter(null);
              setShowHistory(true);
            }} 
            className="rounded-xl hover:bg-white/40 text-zinc-500 hover:text-[#9482C1]"
            title="View Chat History"
          >
            <History className="h-5 w-5" />
          </Button>
        </nav>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-white/10">
        <header className="h-24 border-b border-[#B9D8D8]/50 px-8 flex items-center justify-between shrink-0 bg-white/60 backdrop-blur-md z-10">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-14 h-14 rounded-full bg-white overflow-hidden border-2 border-white shadow-2xl shadow-purple-500/10 transition-transform group-hover:scale-105 duration-500">
                <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-[#1a1a1a] uppercase tracking-tighter">{character.name}</h2>
                <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <Bot className="h-2.5 w-2.5 text-emerald-600" />
                  <span className="text-[8px] font-black text-emerald-700 tracking-widest uppercase">Verified</span>
                </div>
              </div>
              <p className="text-[10px] text-[#9482C1] flex items-center gap-1.5 uppercase font-black tracking-widest mt-1">
                <span className="w-2 h-2 rounded-full bg-[#9482C1] animate-pulse"></span> {currentEmotion} Mode
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white border-[#B9D8D8] text-[10px] font-bold uppercase tracking-widest h-8 rounded-lg text-[#9482C1] hover:bg-zinc-50">Lobby</Button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <ScrollArea ref={scrollRef} className="h-full px-8 py-10">
            <div className="max-w-3xl mx-auto space-y-10 pb-20">
              {chatMessages.length === 0 && (
                <div className="py-24 text-center">
                  <Sparkles className="h-10 w-10 text-[#B9D8D8] mx-auto mb-4" />
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-black">Waiting for your first word</p>
                </div>
              )}
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-md ${
                      msg.role === 'user' 
                      ? 'bg-[#9482C1] text-white rounded-tr-none' 
                      : 'bg-white text-[#1a1a1a] border border-[#B9D8D8]/50 rounded-tl-none font-medium'
                    }`}>
                      <div className="markdown-body prose prose-zinc max-w-none prose-p:my-0 prose-p:leading-relaxed text-[15px] font-medium">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                    <span className="text-[9px] text-zinc-500 mt-2 block font-black uppercase tracking-widest px-2">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {msg.role === 'user' ? 'Sent' : msg.emotion}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-4 bg-white rounded-3xl border border-[#B9D8D8]/50 gap-1.5 flex items-center shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B9D8D8] animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#BA9BC9] animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9482C1] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <footer className="p-8 bg-white/60 backdrop-blur-sm shrink-0 border-t border-[#B9D8D8]/30">
          <div className="max-w-3xl mx-auto relative bg-white rounded-2xl border-2 border-[#9482C1]/20 p-1 flex items-center shadow-2xl shadow-[#9482C1]/5 focus-within:border-[#9482C1]/40 transition-all">
            <Input 
              placeholder={`Message ${character.name}...`}
              className="border-none bg-transparent focus-visible:ring-0 text-[15px] px-6 h-14 text-[#1a1a1a] placeholder:text-zinc-500 font-medium"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button 
              size="icon" 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="rounded-xl w-12 h-12 bg-[#9482C1] hover:bg-[#836fa5] text-white transition-all shrink-0 shadow-lg shadow-purple-900/10"
              title="Send Message"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </footer>
      </main>

      {/* Right Sidebar: Specifications */}
      <aside className="w-80 border-l border-[#B9D8D8]/50 flex flex-col shrink-0 bg-white/20 hidden lg:flex">
        <div className="p-6 space-y-12 overflow-y-auto h-full">
          <div>
            <h3 className="text-[10px] font-black text-[#9482C1] uppercase tracking-[0.3em] mb-8">Specifications</h3>
            <div className="space-y-8">
              {[
                { label: 'Empathy', val: 68 },
                { label: 'Humor', val: 92 },
                { label: 'Logic', val: 45 }
              ].map(spec => (
                <div key={spec.label}>
                  <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-widest text-zinc-600">
                    <span>{spec.label}</span>
                    <span className="text-[#9482C1]">{spec.val}%</span>
                  </div>
                  <div className="h-1.5 bg-[#B9D8D8]/30 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${spec.val}%` }} 
                      className="h-full bg-gradient-to-r from-[#B9D8D8] to-[#9482C1] rounded-full shadow-sm" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-[#9482C1] uppercase tracking-[0.3em] mb-4">Core Essence</h3>
            <div className="p-5 bg-white rounded-2xl border border-[#B9D8D8]/50 text-xs text-zinc-600 leading-relaxed italic shadow-sm">
              {character.personality}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-[#9482C1] uppercase tracking-[0.3em] mb-5">Minigames</h3>
            <div className="space-y-3">
              {['Riddle Master', 'Co-op Quest'].map(game => (
                <div key={game} className="group p-4 bg-white border border-[#B9D8D8]/30 hover:border-[#BA9BC9] rounded-2xl cursor-pointer transition-all shadow-sm">
                  <p className="text-xs font-bold text-[#1a1a1a] uppercase tracking-tight">{game}</p>
                  <p className="text-[9px] text-[#9482C1] font-black uppercase tracking-widest mt-1.5">Level: Alpha</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-8 border-t border-[#B9D8D8]/50 bg-white/40 mt-auto">
           <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase font-black tracking-[0.3em] leading-none">
             <span>Level 1 Contact</span>
             <div className="flex gap-1.5 items-center">
               <div className="w-1.5 h-1.5 rounded-full bg-[#B9D8D8]" />
               <div className="w-1.5 h-1.5 rounded-full bg-[#BA9BC9]" />
               <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
             </div>
           </div>
        </div>
      </aside>
    </div>
  );
};
