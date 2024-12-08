import { create } from "zustand";

const useCoinStore = create((set) => ({
  coinName: "",
  setCoinName: (name) => set({ coinName: name }),
}));

export default useCoinStore;
