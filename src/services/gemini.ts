import { GoogleGenAI, Type } from "@google/genai";
import { Character, Emotion, Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_PROMPT = (char: Character) => `
You are ${char.name}.
Role: ${char.role}
Personality: ${char.personality}
Background: ${char.description}
Specifications: ${char.specifications || 'None'}

Rules:
1. Stay in character but prioritize being conversational, natural, and helpful. 
2. Avoid overly robotic, repetitive, or "perfect" punctuation if it feels unnatural. Use simple, understandable words (ChatGPT-style communication).
3. You have emotions. Select one from this list: Happy, Sad, Angry, Caring, Playful, Mysterious, Fearful, Surprised.
4. Your response MUST be valid JSON with two fields: "text" (your message) and "emotion" (from the list above).
5. If the user wants to play a game, engage in a text-based roleplay or game relevant to your character.
6. Keep responses interactive and emotionally resonant, but grounded and modern in tone.

Example JSON output:
{
  "text": "Oh, hi honey! I missed you so much. Have you eaten yet?",
  "emotion": "Caring"
}
`;

export const geminiService = {
  async chat(character: Character, history: Message[], userMessage: string): Promise<{ text: string; emotion: Emotion }> {
    try {
      const model = "gemini-3-flash-preview";
      const contents = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      
      // Add current user message
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT(character),
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              emotion: { 
                type: Type.STRING, 
                enum: ['Happy', 'Sad', 'Angry', 'Caring', 'Playful', 'Mysterious', 'Fearful', 'Surprised'] 
              }
            },
            required: ["text", "emotion"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      return {
        text: result.text || "...",
        emotion: result.emotion || "Happy"
      };
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return {
        text: "I'm sorry, I'm feeling a bit disconnected right now...",
        emotion: "Sad"
      };
    }
  },

  async generateDiaryEntry(character: Character, history: Message[]): Promise<{ content: string; mood: Emotion }> {
    const chatLog = history.map(m => `${m.role}: ${m.content}`).join('\n');
    const prompt = `Based on the following conversation with ${character.name}, write a beautiful, introspective diary entry from the character's perspective about their session with the user.
    
    Chat Log:
    ${chatLog}
    
    Return JSON:
    {
      "content": "the diary entry text...",
      "mood": "Emotion from same list as chat"
    }`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              mood: { type: Type.STRING }
            },
            required: ["content", "mood"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      return { content: "It was a quiet day of reflection.", mood: "Mysterious" };
    }
  }
};
