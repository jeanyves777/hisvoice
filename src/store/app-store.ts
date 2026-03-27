import { create } from "zustand";

interface AppState {
  selectedTranslation: "kjv" | "web" | "asv";
  setTranslation: (v: "kjv" | "web" | "asv") => void;
  selectedGospels: string[];
  toggleGospel: (gospel: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedTranslation: "kjv",
  setTranslation: (v) => set({ selectedTranslation: v }),
  selectedGospels: ["matthew", "mark", "luke", "john"],
  toggleGospel: (gospel) =>
    set((s) => ({
      selectedGospels: s.selectedGospels.includes(gospel)
        ? s.selectedGospels.filter((g) => g !== gospel)
        : [...s.selectedGospels, gospel],
    })),
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
  language: "en",
  setLanguage: (lang) => set({ language: lang }),
}));
