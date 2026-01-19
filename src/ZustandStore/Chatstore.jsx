import { create } from "zustand";

export const useChatStore = create((set) => ({
  chatId: null,
  chatUser: null,
  setChat: (chatId, user) => set({ chatId, chatUser: user }),
  clearChat: () => set({ chatId: null, chatUser: null }),
}));
