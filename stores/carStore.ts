import { create } from "zustand";

interface CarState {
  activeCarId: string | null;
  setActiveCarId: (id: string | null) => void;
}

export const useCarStore = create<CarState>((set) => ({
  activeCarId: null,
  setActiveCarId: (activeCarId) => set({ activeCarId }),
}));
