import { create } from "zustand";
import { useUserStore } from "./useUserStore";

export const useChatStore = create((set) => ({
  chatId: null,
  chatUser: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,

  setChat: (id, user) => {
    const currentuser = useUserStore.getState().currentuser;

    // 1. Check korun current user-ke receiver block koreche kina
    if (user.blocked?.includes(currentuser.id)) {
      return set({
        chatId: id,
        chatUser: null, // Blocked thakle user info dekhabo na
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    }

    // 2. Check korun current user receiver-ke block koreche kina
    else if (currentuser.blocked?.includes(user.id)) {
      return set({
        chatId: id,
        chatUser: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    }

    // 3. Jodi keu kauke block na kore thake
    else {
      return set({
        chatId: id,
        chatUser: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },

  changeBlock: () => {
    set((state) => ({
      ...state,
      isReceiverBlocked: !state.isReceiverBlocked,
    }));
  },

  resetChat: () => {
    set({
      chatId: null,
      chatUser: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
  },
}));
