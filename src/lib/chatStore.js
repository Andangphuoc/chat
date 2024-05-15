import { create } from "zustand";
import { useUserStore } from "./useStore";
export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentBlocked: false,
  isReceiverBlocked: false,
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;
    //CHECK IF CURRENT USER IS BLOCK
    if (user.blocked.includes(currentUser.id)) {
      set({
        chatId,
        user: null,
        isCurrentBlocked: true,
        isReceiverBlocked: false,
      });
    }
    //CHECK IF RECEIVER USER IS BLOCK
    else if (currentUser.blocked.includes(user.id)) {
      set({
        chatId,
        user: user,
        isCurrentBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      return set({
        chatId,
        user,
        isCurrentBlocked: false,
        isReceiverBlocked: false,
      });
    }

    // End of changeChat method
  },
  changeBlock: () => {
    set((state) => ({
      ...state,
      isReceiverBlocked: !state.isReceiverBlocked,
    }));
  },
}));
