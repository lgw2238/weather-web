import create from 'zustand';

interface Message {
  id: number;
  text: string;
  timestamp: Date;
  isUser: boolean;
}

interface ChatState {
  messages: Message[];
  lastCity: string | null; // 마지막으로 선택된 도시
  addMessage: (text: string, isUser: boolean) => void;
  setLastCity: (city: string) => void; // 마지막 도시 업데이트
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  lastCity: null,
  addMessage: (text: string, isUser: boolean) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now(),
          text,
          timestamp: new Date(),
          isUser,
        },
      ],
    })),
  setLastCity: (city: string) =>
    set(() => ({
      lastCity: city,
    })),
}));