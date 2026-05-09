import { create } from 'zustand';

interface CarStore {
  activeCarId: string | null;
  setActiveCarId: (id: string) => void;
}

export const useCarStore = create<CarStore>((set) => ({
  activeCarId: null,
  setActiveCarId: (id) => set({ activeCarId: id }),
}));
