
export type Emotion = 'Happy' | 'Sad' | 'Angry' | 'Caring' | 'Playful' | 'Mysterious' | 'Fearful' | 'Surprised';

export interface Character {
  id: string;
  name: string;
  role: 'friend' | 'mother' | 'father' | 'lover' | 'hero' | 'custom' | 'assistant';
  personality: string;
  description: string;
  avatar?: string;
  category?: string;
  specifications?: string;
  isPredefined?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  emotion?: Emotion;
  timestamp: number;
}

export interface DiaryEntry {
  id: string;
  characterId: string;
  characterName: string;
  content: string;
  timestamp: number;
  mood: Emotion;
}

export interface GameState {
  isActive: boolean;
  type: 'riddle' | 'story' | 'trivia';
  score: number;
  turn: number;
}
