import { create } from 'zustand';
import type { ChatMessage, Character } from '@/services/types';

interface ChatState {
  // 현재 선택된 캐릭터
  currentCharacter: Character | null;
  
  // 현재 채팅 메시지들
  messages: ChatMessage[];
  
  // 채팅 파일명
  chatFileName: string | null;
  
  // 로딩 상태
  isLoading: boolean;
  isGenerating: boolean;
  
  // 에러
  error: string | null;
  
  // 액션들
  setCurrentCharacter: (character: Character | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (updater: (message: ChatMessage) => ChatMessage) => void;
  setChatFileName: (fileName: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentCharacter: null,
  messages: [],
  chatFileName: null,
  isLoading: false,
  isGenerating: false,
  error: null,
  
  setCurrentCharacter: (character) => set({ currentCharacter: character }),
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  
  updateLastMessage: (updater) =>
    set((state) => {
      if (state.messages.length === 0) return state;
      const newMessages = [...state.messages];
      newMessages[newMessages.length - 1] = updater(newMessages[newMessages.length - 1]);
      return { messages: newMessages };
    }),
  
  setChatFileName: (fileName) => set({ chatFileName: fileName }),
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  
  setError: (error) => set({ error }),
  
  clearChat: () =>
    set({
      messages: [],
      chatFileName: null,
      error: null,
    }),
}));

