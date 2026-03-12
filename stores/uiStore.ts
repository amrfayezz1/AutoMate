import { create } from "zustand";

type Language = "en" | "ar";

interface UIState {
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
}

export const useUIStore = create<UIState>((set) => ({
  language: "en",
  isRTL: false,
  setLanguage: (language) => set({ language, isRTL: language === "ar" }),
}));
