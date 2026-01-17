import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Database";

export const useAuthStore = create((set) => ({
  currentUser: null,
  loading: true,

  listenAuth: () => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        set({ currentUser: user });
      } else {
        set({ currentUser: null });
      }

      setTimeout(() => {
        set({ loading: false });
      }, 1900);
    });

    return unsub;
  },
}));
