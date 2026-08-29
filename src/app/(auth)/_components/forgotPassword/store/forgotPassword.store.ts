import { create } from "zustand";

type ForgotPasswordStore = {

  email: string;
  otp: string;
  password: string;

  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  setPassword: (password: string) => void;

  reset: () => void;
};

export const useForgotPasswordStore = create<ForgotPasswordStore>((set) => ({
 
  email: "",
  otp: "",
  password: "",

  setEmail: (email) => set({ email }),
  setOtp: (otp) => set({ otp }),
  setPassword: (password) => set({ password }),

  reset: () =>
    set({
      email: "",
      otp: "",
      password: "",
    }),
}));