import { create } from 'zustand';

type Store = {
  isAssistantVisible: boolean;
  setAssistantVisibility: {
    on: () => void;
    off: () => void;
  };
}

export const useStore = create<Store>((set) => ({
  isAssistantVisible: false,
  setAssistantVisibility: {
    on: () => set({ isAssistantVisible: true }),
    off: () => set({ isAssistantVisible: false }),
    toggle: () => set((state: { isAssistantVisible: boolean }) => ({ isAssistantVisible: !state.isAssistantVisible })),
  },
}));
