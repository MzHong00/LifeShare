// Zustand sample store
// import { create } from 'zustand';

interface UserState {
  userId: string | null;
  setUserId: (id: string) => void;
  clearUser: () => void;
}

// const useUserStore = create<UserState>((set) => ({
//   userId: null,
//   setUserId: (id) => set({ userId: id }),
//   clearUser: () => set({ userId: null }),
// }));

// export default useUserStore;

// Note: Uncomment after installing zustand
export {};
