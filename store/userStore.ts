"use client";

import { create } from "zustand";

interface UserStore {
  userId: string | null;
  email: string | null;
  fullName: string | null;
  isPro: boolean;
  setUser: (value: {
    userId: string;
    email: string | null;
    fullName: string | null;
    isPro: boolean;
  }) => void;
  setPro: (value: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  userId: null,
  email: null,
  fullName: null,
  isPro: false,
  setUser: ({ userId, email, fullName, isPro }) =>
    set(() => ({ userId, email, fullName, isPro })),
  setPro: (isPro) => set((state) => ({ ...state, isPro })),
  clearUser: () =>
    set(() => ({
      userId: null,
      email: null,
      fullName: null,
      isPro: false,
    })),
}));
