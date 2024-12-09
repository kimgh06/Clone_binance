import { create } from "zustand";

const useCoinStore = create((set) => ({
  coinName: "BTC",
  setCoinName: (name) => set({ coinName: name }),
}));

export default useCoinStore;
