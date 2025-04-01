import create from 'zustand';

interface Message {
  id: number;
  text: string;
  timestamp: Date;
  isUser: boolean;
}

interface ChatState {
  messages: Message[];
  addMessage: (text: string, isUser: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
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
}));