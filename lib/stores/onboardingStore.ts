import { create } from 'zustand';

export type TrackingMode = 'time' | 'mileage' | 'both';

export type BaselineEntry = {
  checked: boolean;
  date: string | null; // ISO YYYY-MM-DD
  mileage: number | null;
};

export type BaselineMap = Record<string, BaselineEntry>;

interface OnboardingStore {
  make: string;
  model: string;
  year: string;
  plate: string;
  trackingMode: TrackingMode;
  odometer: string;
  baseline: BaselineMap;
  set: (patch: Partial<Omit<OnboardingStore, 'set' | 'reset' | 'toggleBaseline' | 'updateBaseline'>>) => void;
  toggleBaseline: (typeId: string) => void;
  updateBaseline: (typeId: string, patch: Partial<BaselineEntry>) => void;
  reset: () => void;
}

const initial = {
  make: '',
  model: '',
  year: '',
  plate: '',
  trackingMode: 'both' as TrackingMode,
  odometer: '',
  baseline: {} as BaselineMap,
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  ...initial,
  set: (patch) => set(patch),
  toggleBaseline: (typeId) =>
    set((s) => {
      const prev = s.baseline[typeId] ?? { checked: false, date: null, mileage: null };
      return {
        baseline: { ...s.baseline, [typeId]: { ...prev, checked: !prev.checked } },
      };
    }),
  updateBaseline: (typeId, patch) =>
    set((s) => {
      const prev = s.baseline[typeId] ?? { checked: true, date: null, mileage: null };
      return {
        baseline: { ...s.baseline, [typeId]: { ...prev, ...patch } },
      };
    }),
  reset: () => set(initial),
}));
