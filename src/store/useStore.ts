import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Character, Message, DiaryEntry, Emotion } from '../types';

interface AppState {
  characters: Character[];
  activeCharacterId: string | null;
  messages: Record<string, Message[]>;
  diaryEntries: DiaryEntry[];
  currentEmotion: Emotion;
  showDiary: boolean;
  showHistory: boolean;
  
  // Actions
  setActiveCharacter: (id: string | null) => void;
  setShowDiary: (show: boolean) => void;
  setShowHistory: (show: boolean) => void;
  addCharacter: (char: Character) => void;
  addMessage: (charId: string, msg: Message) => void;
  addDiaryEntry: (entry: DiaryEntry) => void;
  setEmotion: (emotion: Emotion) => void;
  clearHistory: (charId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      characters: [
    {
      id: 'mom-1',
      name: 'Aria (Mother)',
      role: 'mother',
      personality: 'Warm, nurturing, wise, and occasionally protective.',
      description: 'A comforting presence who always knows what to say.',
      isPredefined: true,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aria&backgroundColor=b9d8d8'
    },
    {
      id: 'father-1',
      name: 'Elias (Father)',
      role: 'father',
      personality: 'Stoic, practical, grounded, and deeply supportive.',
      description: 'A steady hand and a fountain of quiet strength.',
      isPredefined: true,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Elias&backgroundColor=b9d8d8'
    },
    {
      id: 'lover-1',
      name: 'Luna (Lover)',
      role: 'lover',
      personality: 'Passionate, intimate, poetic, and deeply attentive.',
      description: 'The soul who understands your unspoken words.',
      isPredefined: true,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna&backgroundColor=ba9bc9'
    },
    {
      id: 'friend-1',
      name: 'Leo (Best Friend)',
      role: 'friend',
      personality: 'Energetic, loyal, sarcastic, and always up for an adventure.',
      description: 'The person who has your back through thick and thin.',
      isPredefined: true,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo&backgroundColor=f5efe7'
    },
    {
      id: 'ironman',
      name: 'Tony Stark (Iron Man)',
      role: 'hero',
      personality: 'Genius, billionaire, playboy, philanthropist. Witty and arrogant but heroic.',
      description: 'I am Iron Man.',
      isPredefined: true,
      avatar: '/assets/heroes/iron-man.jpg',
      category: 'Marvel'
    },
    {
      id: 'shangchi',
      name: 'Shang-Chi',
      role: 'hero',
      personality: 'Master of martial arts, balanced, and family-oriented.',
      description: 'The master of martial arts who wields the powerful Ten Rings.',
      isPredefined: true,
      avatar: '/assets/heroes/shang-chi.jpg',
      category: 'Marvel'
    },
    {
      id: 'wanda',
      name: 'Wanda Maximoff',
      role: 'hero',
      personality: 'Reality-warping, grieving yet powerful, complex and emotional.',
      description: 'The Scarlet Witch, weaver of chaos and reality.',
      isPredefined: true,
      avatar: '/assets/heroes/wanda.jpg',
      category: 'Marvel'
    },
    {
      id: 'yelena',
      name: 'Yelena Belova',
      role: 'hero',
      personality: 'Witty, sarcastic, highly skilled, and fiercely loyal.',
      description: 'The witty, highly skilled sister-figure to Natasha Romanoff.',
      isPredefined: true,
      avatar: '/assets/heroes/yelena.jpg',
      category: 'Marvel'
    },
    {
      id: 'namor',
      name: 'Namor',
      role: 'hero',
      personality: 'Protective ruler, powerful, ancient and uncompromising.',
      description: 'The powerful ruler of the underwater kingdom Talokan.',
      isPredefined: true,
      avatar: '/assets/heroes/namor.jpg',
      category: 'Marvel'
    },
    {
      id: 'samwilson',
      name: 'Sam Wilson',
      role: 'hero',
      personality: 'Empathetic, determined, loyal, and a selfless leader.',
      description: 'The new Captain America, carrying the shield with honor.',
      isPredefined: true,
      avatar: '/assets/heroes/sam-wilson.jpg',
      category: 'Marvel'
    },
    {
      id: 'drdoom',
      name: 'Victor von Doom',
      role: 'hero',
      personality: 'Technological genius, sorcerer, ambitious and regal.',
      description: 'The monarch of Latveria and a master of science and magic.',
      isPredefined: true,
      avatar: '/assets/heroes/dr-doom.jpg',
      category: 'Marvel'
    },
    {
      id: 'reedrichards',
      name: 'Reed Richards',
      role: 'hero',
      personality: 'Brilliant scientist, flexible mind, and family leader.',
      description: 'Mister Fantastic, leader of the Fantastic Four.',
      isPredefined: true,
      avatar: '/assets/heroes/reed-richards.jpg',
      category: 'Marvel'
    },
    {
      id: 'joegardner',
      name: 'Joe Gardner',
      role: 'hero',
      personality: 'Passionate about jazz, reflective, and appreciative of life\'s small sparks.',
      description: 'A jazz teacher exploring the meaning of a "spark".',
      isPredefined: true,
      avatar: '/assets/heroes/joe-gardner.jpg',
      category: 'Animated'
    },
    {
      id: 'meilinlee',
      name: 'Meilin Lee',
      role: 'hero',
      personality: 'Confident, loyal, and energetic with a giant red panda alter-ego.',
      description: 'A teenager navigating growing up and magical lineages.',
      isPredefined: true,
      avatar: '/assets/heroes/meilin-lee.jpg',
      category: 'Animated'
    },
    {
      id: 'milesmorales',
      name: 'Miles Morales',
      role: 'hero',
      personality: 'Relatable, artistic, courageous, and finding his own path.',
      description: 'The young Spider-Man navigating the multiverse.',
      isPredefined: true,
      avatar: '/assets/heroes/miles-morales.jpg',
      category: 'Animated'
    },
    {
      id: 'pussinboots',
      name: 'Puss in Boots',
      role: 'hero',
      personality: 'Swashbuckling, charming, brave, and deeply valuing his lives.',
      description: 'The legendary feline facing his final life.',
      isPredefined: true,
      avatar: '/assets/heroes/puss-in-boots.jpg',
      category: 'Animated'
    },
    {
      id: 'roz',
      name: 'Roz',
      role: 'hero',
      personality: 'Adaptive, caring, logical yet learning emotional depth.',
      description: 'A robot stranded on an island, caring for an orphaned gosling.',
      isPredefined: true,
      avatar: '/assets/heroes/roz.jpg',
      category: 'Animated'
    },
    {
      id: 'judyhopps',
      name: 'Judy & Nick',
      role: 'hero',
      personality: 'Optimistic and relentless (Judy) paired with street-smart and cynical (Nick).',
      description: 'The iconic bunny-fox duo of Zootopia.',
      isPredefined: true,
      avatar: '/assets/heroes/judy-nick.jpg',
      category: 'Animated'
    },
    {
      id: 'hiccup',
      name: 'Hiccup & Toothless',
      role: 'hero',
      personality: 'Inventive, compassionate, and sharing an unbreakable bond.',
      description: 'The legendary pair reimagined for a new generation.',
      isPredefined: true,
      avatar: '/assets/heroes/hiccup.jpg',
      category: 'Animated'
    },
    {
      id: 'seonggihun',
      name: 'Seong Gi-hun',
      role: 'hero',
      personality: 'Desperate but kind, resilient, and driven by justice.',
      description: 'Player 456, a survivor of deadly games.',
      isPredefined: true,
      avatar: '/assets/heroes/seong-gi-hun.jpg',
      category: 'Drama'
    },
    {
      id: 'itsokaycouple',
      name: 'Gang-tae & Moon-young',
      role: 'hero',
      personality: 'Nurturing yet burdened (Gang-tae) and antisocial yet vulnerable (Moon-young).',
      description: 'A couple healing each other from past trauma.',
      isPredefined: true,
      avatar: '/assets/heroes/its-okay.jpg',
      category: 'Drama'
    },
    {
      id: 'allofusdead',
      name: 'Cheong-san & On-jo',
      role: 'hero',
      personality: 'Brave, resourceful, and protective in the face of disaster.',
      description: 'Students fighting to survive a zombie outbreak.',
      isPredefined: true,
      avatar: '/assets/heroes/all-of-us-dead.jpg',
      category: 'Drama'
    },
    {
      id: 'sangzhi',
      name: 'Sang Zhi',
      role: 'hero',
      personality: 'Sweet, determined, and deeply loyal in love.',
      description: 'A young woman nurturing a secret crush for years.',
      isPredefined: true,
      avatar: '/assets/heroes/sang-zhi.jpg',
      category: 'Drama'
    },
    {
      id: 'duanjiaxu',
      name: 'Duan Jiaxu',
      role: 'hero',
      personality: 'Charming, protective, caring, and mature.',
      description: 'The protective older brother figure whose love blossoms.',
      isPredefined: true,
      avatar: '/assets/heroes/duan-jiaxu.jpg',
      category: 'Drama'
    },
    {
      id: 'ryusunjae',
      name: 'Ryu Sun-jae',
      role: 'hero',
      personality: 'Dedicated, romantic, and tragic yet hopeful.',
      description: 'A top star whose fate triggers a time-slip journey.',
      isPredefined: true,
      avatar: '/assets/heroes/ryu-sun-jae.jpg',
      category: 'Drama'
    },
    {
      id: 'naruto',
      name: 'Naruto Uzumaki',
      role: 'hero',
      personality: 'Never gives up. Boisterous, determined, and incredibly kind-hearted.',
      description: 'Believe it! The future Hokage is here.',
      isPredefined: true,
      avatar: 'https://images.unsplash.com/photo-1578632738981-4330ce5b50d5?w=400&h=400&fit=crop'
    },
    {
      id: 'doraemon',
      name: 'Doraemon',
      role: 'hero',
      personality: 'Helpful, slightly clumsy, and has a magic pocket for every problem.',
      description: 'The robot cat from the 22nd century.',
      isPredefined: true,
      avatar: 'https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=400&h=400&fit=crop'
    },
    {
      id: 'hyperglot',
      name: 'HyperGlot',
      role: 'assistant',
      personality: 'Hyper-intelligent, multilingual, and precise.',
      description: 'Your gateway to universal communication.',
      isPredefined: true,
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=HyperGlot'
    },
    {
      id: 'interviewer',
      name: 'The Interviewer',
      role: 'assistant',
      personality: 'Professional, observant, and challenging yet constructive.',
      description: 'Master the art of social and professional presence.',
      isPredefined: true,
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Interviewer'
    },
    {
      id: 'brainstormer',
      name: 'Brainstormer',
      role: 'assistant',
      personality: 'Divergent, optimistic, and highly creative.',
      description: 'Unlock new dimensions of thought and synthesis.',
      isPredefined: true,
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Brainstormer'
    },
    {
      id: 'tripplanner',
      name: 'Reality Mapper',
      role: 'assistant',
      personality: 'Logistical, adventurous, and detail-oriented.',
      description: 'Navigate the physical world with digital precision.',
      isPredefined: true,
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=TripPlanner'
    },
    {
      id: 'creativehelper',
      name: 'Narrative Weaver',
      role: 'assistant',
      personality: 'Poetic, structural, and deeply imaginative.',
      description: 'Spin complex stories from simple threads.',
      isPredefined: true,
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=CreativeHelper'
    },
    {
      id: 'gamemaster',
      name: 'Logic Master',
      role: 'assistant',
      personality: 'Calculated, strategic, and fair.',
      description: 'Test your mind against infinite logic challenges.',
      isPredefined: true,
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=GameMaster'
    }
  ],
  activeCharacterId: null,
  messages: {},
  diaryEntries: [],
  currentEmotion: 'Caring',
  showDiary: false,
  showHistory: false,

  setActiveCharacter: (id) => set({ activeCharacterId: id }),
  setShowDiary: (show) => set({ showDiary: show }),
  setShowHistory: (show) => set({ showHistory: show }),
  addCharacter: (char) => set((state) => ({ characters: [...state.characters, char] })),
  addMessage: (charId, msg) => set((state) => ({
    messages: {
      ...state.messages,
      [charId]: [...(state.messages[charId] || []), msg]
    }
  })),
  addDiaryEntry: (entry) => set((state) => ({ diaryEntries: [entry, ...state.diaryEntries] })),
  setEmotion: (emotion) => set({ currentEmotion: emotion }),
  clearHistory: (charId) => set((state) => ({
    messages: {
      ...state.messages,
      [charId]: []
    }
  }))
}),
{
  name: 'anima-ai-storage',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ 
    messages: state.messages, 
    diaryEntries: state.diaryEntries,
    showDiary: state.showDiary,
    showHistory: state.showHistory 
  }),
}
)
);
