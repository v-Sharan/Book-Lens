import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const authStore = (set) => ({
  userProfile: null,
  allUsers: [],

  addUser: (user) => set({ userProfile: user }),
  removeUser: () => set({ userProfile: null }),

  fetchAllUsers: async () => {
    const response = await fetch("/api/users");
    const data = await response.json();
    set({ allUsers: data });
  },
});

const useAuthStore = create(
  persist(authStore, {
    name: "auth",
  })
);

export default useAuthStore;
