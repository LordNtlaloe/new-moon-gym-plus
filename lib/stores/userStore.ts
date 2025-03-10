import { create } from "zustand";

interface usersSate {
  userName: string;
  isUserLoggedIn: boolean;

  setUserName: (newName: string) => void;
  setUserLogInStatus: (newStatus: boolean) => void;
}

export const useUserStore = create<usersSate>()((set) => ({
  userName: "",
  isUserLoggedIn: false,

  setUserName: (newName) => set({ userName: newName }),
  setUserLogInStatus: (newStatus) => set({ isUserLoggedIn: newStatus }),
}));