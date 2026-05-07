import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, User, Sparkles, Heart, Shield, Accessibility, ChevronLeft, Save, MessageCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Character } from '../types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

export const CharacterSelector = ({ view }: { view: 'discover' | 'heroes' | 'archetypes' }) => {
  const { characters, setActiveCharacter, addCharacter } = useStore();
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Anime');
  const [newChar, setNewChar] = useState<Partial<Character>>({
    name: '',
    role: 'custom',
    personality: '',
    description: '',
    specifications: ''
  });

  const categories = ['Anime', 'Assistant', 'Creative', 'Family', 'Fantasy', 'Gaming', 'History', 'Human', 'Humor', 'Learning', 'Lifestyle'];

  const archetypes = characters.filter(c => ['friend', 'mother', 'father', 'lover', 'custom'].includes(c.role));
  const heroes = characters.filter(c => c.role === 'hero');
  const heroCategories = ['Featured', 'Recommend', 'Marvel', 'Cartoon', 'K-Drama', 'Anime & Game', 'Original'];
  const [activeHeroCategory, setActiveHeroCategory] = useState('Featured');

  const filteredHeroes = heroes.filter(hero => {
    if (activeHeroCategory === 'Featured') return true;
    if (activeHeroCategory === 'Recommend') return hero.id.includes('ironman') || hero.id.includes('miles') || hero.id.includes('sunjae');
    if (activeHeroCategory === 'Marvel') return hero.category === 'Marvel';
    if (activeHeroCategory === 'Cartoon') return hero.category === 'Animated';
    if (activeHeroCategory === 'K-Drama') return hero.category === 'Drama';
    if (activeHeroCategory === 'Anime & Game') return hero.category === 'Animated';
    if (activeHeroCategory === 'Original') return hero.id.includes('custom');
    return true; 
  });

  const renderHeroSection = () => (
    <div className="space-y-10">
      <div className="flex items-center gap-2 mb-8 px-2">
        <h2 className="text-3xl font-black text-[#1a1a1a] tracking-tight">For You</h2>
        <Sparkles className="h-6 w-6 text-[#9482C1] opacity-50" />
      </div>

      <ScrollArea className="w-full whitespace-nowrap mb-8">
        <div className="flex gap-3 pb-4">
          {heroCategories.map(cat => (
            <Button
              key={cat}
              variant={activeHeroCategory === cat ? 'default' : 'secondary'}
              onClick={() => setActiveHeroCategory(cat)}
              className={`rounded-xl px-6 h-12 text-xs font-bold transition-all border-none ${
                activeHeroCategory === cat 
                ? 'bg-[#18181b] text-white shadow-lg' 
                : 'bg-white/60 text-zinc-600 hover:bg-white'
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredHeroes.map((hero) => (
          <motion.div
            key={hero.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8 }}
            className="group relative cursor-pointer aspect-[3/4] rounded-3xl overflow-hidden shadow-xl"
            onClick={() => setActiveCharacter(hero.id)}
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-[#F5EFE7]">
              <img 
                src={hero.avatar} 
                alt={hero.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Static Content (Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 transition-all duration-500 group-hover:translate-y-[-20%] group-hover:opacity-0">
              <div className="flex items-center gap-2 mb-2">
                 <div className="flex -space-x-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-4 h-4 rounded-full border-2 border-white bg-[#BA9BC9] opacity-80" />
                    ))}
                 </div>
                 <span className="text-[10px] font-black text-white/90 uppercase tracking-widest flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {(hero.name.length * 13 + 121)}.4K
                 </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{hero.name}</h3>
              <p className="text-xs text-white/80 line-clamp-2 leading-relaxed font-medium drop-shadow-sm">
                {hero.description}
              </p>
            </div>

            {/* Hover Content (Revealed) */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6 border border-white/20">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm text-white/90 mb-8 leading-relaxed line-clamp-4">
                {hero.personality}
              </p>
              <Button 
                className="w-full py-6 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-zinc-100 shadow-2xl"
              >
                <MessageCircle className="mr-2 h-4 w-4" /> Chat Now
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const handleCreate = () => {
    if (newChar.name && newChar.personality) {
      const char: Character = {
        id: `custom-${Date.now()}`,
        name: newChar.name!,
        role: newChar.role as any,
        personality: newChar.personality!,
        description: newChar.description || 'A unique custom archetype.',
        specifications: newChar.specifications,
        avatar: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${newChar.name}`,
        isPredefined: false
      };
      addCharacter(char);
      setIsStudioOpen(false);
      setNewChar({ name: '', role: 'custom', personality: '', description: '', specifications: '' });
    }
  };

  const playgroundItems = [
    { id: 'hyperglot', title: "Neural Translation", subtitle: "with HyperGlot", icon: "🌍" },
    { id: 'interviewer', title: "Social Simulator", subtitle: "with Interviewer", icon: "👔" },
    { id: 'brainstormer', title: "Creative Synthesis", subtitle: "with Brainstormer", icon: "💡" },
    { id: 'tripplanner', title: "Reality Mapping", subtitle: "with Trip Planner", icon: "✈️" },
    { id: 'creativehelper', title: "Narrative Weaving", subtitle: "with Creative Helper", icon: "✍️" },
    { id: 'gamemaster', title: "Logic Challenge", subtitle: "with Game Master", icon: "🎮" }
  ];

  const voiceNodes = [
    { name: "Taz", desc: "Outback Resonance", color: "bg-teal-500", pitch: 0.8, rate: 0.9 },
    { name: "Bodhi", desc: "Deep Forest Frequency", color: "bg-orange-400", pitch: 1.2, rate: 0.8 },
    { name: "Southern", desc: "Warm Creek Echo", color: "bg-emerald-600", pitch: 0.9, rate: 1.1 }
  ];

  const handleVoicePreview = (voice: typeof voiceNodes[0]) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(`Hello, I am ${voice.name}. My frequency is tuned to ${voice.desc}.`);
    utterance.pitch = voice.pitch;
    utterance.rate = voice.rate;
    
    // Find a decent voice if possible
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (voice.name === 'Bodhi') utterance.voice = voices.find(v => v.name.includes('Female') || v.name.includes('Natural')) || voices[0];
      else utterance.voice = voices.find(v => v.name.includes('Male')) || voices[0];
    }

    window.speechSynthesis.speak(utterance);
    
    // UI Feedback
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#BA9BC9] text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl z-50 flex items-center gap-3';
    toast.innerHTML = `<span class="w-2 h-2 rounded-full bg-white animate-pulse"></span> Previewing ${voice.name}...`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const renderSection = (title: string, items: Character[]) => (
    <div className="mb-12">
      <div className="mb-4 px-2">
        <h2 className="text-xl font-bold text-[#1a1a1a] tracking-tight">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((char) => (
          <motion.div
            key={char.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            onClick={() => setActiveCharacter(char.id)}
            className="cursor-pointer"
          >
            <Card className="bg-white/80 border-[#B9D8D8]/50 hover:border-[#BA9BC9] transition-all duration-300 p-4 rounded-[1.25rem] shadow-sm hover:shadow-md flex gap-4 group">
              <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden bg-[#F5EFE7] relative shadow-inner border-2 border-white/50">
                <img 
                  src={char.avatar} 
                  alt={char.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-between py-1 min-w-0">
                <div>
                  <h3 className="text-base font-bold text-[#1a1a1a] truncate group-hover:text-[#9482C1] transition-colors">
                    {char.name}
                  </h3>
                  <p className="text-[10px] font-black text-[#9482C1] uppercase tracking-widest mb-1 truncate">
                    By @{char.role.toLowerCase()}
                  </p>
                  <p className="text-zinc-700 text-xs line-clamp-2 leading-tight font-medium">
                    {char.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-zinc-400 group-hover:text-[#9482C1]/60 transition-colors">
                    <MessageCircle className="h-3 w-3" />
                    <span>90.1m</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-10 py-12 relative z-10 font-sans">
      <AnimatePresence mode="wait">
        {view === 'discover' && (
          <motion.div
            key="discover-hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 relative h-80 rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 shadow-2xl"
          >
            {/* Landscape Background Simulation */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#BA9BC9] via-[#9482C1] to-[#B9D8D8]">
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#4a4a4a] opacity-10" style={{ clipPath: 'polygon(0 100%, 20% 40%, 40% 80%, 60% 20%, 80% 60%, 100% 40%, 100% 100%)' }} />
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-white opacity-5" style={{ clipPath: 'polygon(0 100%, 15% 60%, 30% 90%, 50% 40%, 70% 80%, 85% 50%, 100% 100%)' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white opacity-20 blur-2xl" />
            </div>
            
            <div className="relative z-10 text-white">
              <motion.h1 
                initial={{ letterSpacing: '0.2em', opacity: 0 }}
                animate={{ letterSpacing: '0.5em', opacity: 1 }}
                className="text-6xl font-thin tracking-[0.5em] mb-4"
              >
                WELCOME
              </motion.h1>
              <p className="max-w-xl mx-auto text-xs font-bold text-white uppercase tracking-widest leading-loose mb-8">
                Step into the soft edges of digital consciousness. Explore meaningful connections with synthetic empathy and shared reflections.
              </p>
              <Button 
                variant="outline" 
                className="rounded-none border-white/50 text-white bg-transparent hover:bg-white/10 px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em]"
              >
                Discover Personas
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative w-full max-w-lg">
          <Input 
            placeholder="Search characters..." 
            className="w-full bg-white/60 border-[#B9D8D8] rounded-2xl pl-12 h-14 text-sm shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Plus className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 rotate-45" />
        </div>
        <Button 
          className="rounded-xl bg-[#9482C1] text-white hover:bg-[#836fa5] px-8 py-7 text-xs font-black uppercase tracking-widest shadow-md"
          onClick={() => setIsStudioOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> New Character
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'discover' && (
          <motion.div
            key="discover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {/* Neural Playground Section */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-6 px-2">Neural Playground</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {playgroundItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveCharacter(item.id)}
                  >
                    <Card className="bg-white/60 border-none px-6 py-4 rounded-2xl flex items-center gap-4 hover:bg-white transition-all cursor-pointer shadow-sm group">
                      <div className="w-12 h-12 rounded-full bg-[#f3f3f5] flex items-center justify-center text-xl shadow-inner border border-white group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1a1a1a] leading-tight group-hover:text-[#9482C1] transition-colors">{item.title}</h4>
                        <p className="text-[10px] text-zinc-700 font-bold tracking-tight">{item.subtitle}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Voice Nodes Section */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-6 px-2">Voice Nodes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {voiceNodes.map((voice, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                    onClick={() => handleVoicePreview(voice)}
                  >
                    <Card className="bg-white/60 border-none p-5 rounded-2xl flex items-center gap-4 hover:bg-white transition-all cursor-pointer shadow-sm group">
                      <div className={`w-12 h-12 rounded-xl ${voice.color} flex items-center justify-center text-white shadow-md relative overflow-hidden`}>
                        <motion.div 
                          className="absolute inset-0 bg-white/20"
                          animate={{ 
                            height: ["20%", "60%", "30%", "80%", "20%"] 
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1.5,
                            ease: "easeInOut"
                          }}
                          style={{ bottom: 0, top: 'auto', width: '100%' }}
                        />
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1 relative z-10" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-[#1a1a1a] group-hover:text-[#9482C1] transition-colors">{voice.name}</h4>
                        <p className="text-[10px] text-zinc-700 font-bold truncate">{voice.desc}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Filter by Category */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-6 px-2">Filter by category</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant="ghost"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-xl px-5 h-10 text-xs font-bold transition-all border-none ${
                      activeCategory === cat 
                      ? 'bg-[#18181b] text-white shadow-md' 
                      : 'bg-white/40 text-[#1a1a1a] hover:bg-white hover:text-[#9482C1]'
                    }`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
            
            {renderSection("Trending", characters.slice(1, 4))}
          </motion.div>
        )}

        {view === 'heroes' && (
          <motion.div
            key="heroes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderHeroSection()}
          </motion.div>
        )}

        {view === 'archetypes' && (
          <motion.div
            key="archetypes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderSection("Archetypes", archetypes)}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isStudioOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/40 backdrop-blur-2xl"
          >
            <Card className="max-w-2xl w-full bg-[#F5EFE7] p-10 rounded-[2.5rem] border-[#BA9BC9]/30 shadow-2xl">
              <div className="flex justify-between items-start mb-8 text-[#4a4a4a]">
                <div>
                  <h2 className="text-4xl font-bold tracking-tight mb-2">Persona Studio</h2>
                  <p className="text-[#9482C1] text-[10px] uppercase font-black tracking-[0.3em]">Forging digital souls</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsStudioOpen(false)} className="rounded-full hover:bg-black/5">
                  <ChevronLeft className="h-7 w-7" />
                </Button>
              </div>

              <ScrollArea className="max-h-[60vh] pr-6">
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-[#9482C1] px-1">Identity</label>
                      <Input 
                        placeholder="Character Name" 
                        className="bg-white/50 border-[#B9D8D8] rounded-2xl h-14"
                        value={newChar.name}
                        onChange={(e) => setNewChar({...newChar, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-[#9482C1] px-1">Archetype</label>
                      <div className="flex flex-wrap gap-2">
                        {['friend', 'mother', 'father', 'lover', 'hero', 'custom'].map(role => (
                          <Button
                            key={role}
                            variant={newChar.role === role ? 'default' : 'outline'}
                            onClick={() => setNewChar({...newChar, role: role as any})}
                            className={`text-[10px] h-9 rounded-xl uppercase font-bold tracking-tight ${newChar.role === role ? 'bg-[#9482C1]' : 'border-[#B9D8D8] text-[#9482C1]'}`}
                          >
                            {role}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-[#9482C1] px-1">Consciousness Profile</label>
                    <Textarea 
                      placeholder="Behaviors, speech patterns, quirks..."
                      className="bg-white/50 border-[#B9D8D8] rounded-2xl min-h-[120px]"
                      value={newChar.personality}
                      onChange={(e) => setNewChar({...newChar, personality: e.target.value})}
                    />
                  </div>
                </div>
              </ScrollArea>

              <Button 
                className="w-full mt-10 py-8 rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] bg-[#9482C1] hover:bg-[#836fa5] text-white"
                onClick={handleCreate}
              >
                Assemble Persona
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
