import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = "https://wewatch-9dnk.onrender.com/api";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  message: null,
  fetchingUser: true,

signup: async (username, email, password) => {
  console.log("🔍 Signup called with:", { username, email, password }); 
  set({ isLoading: true, message: null });
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      username,
      email,
      password,
    });
    set({ user: response.data.user, isLoading: false });
  } catch (error) {
    console.log("❌ Signup error response:", error.response?.data); 
    set({
      isLoading: false,
      error: error.response?.data?.message || "Error Signing up",
    });
    throw error;
  }
},

  login: async (username, password) => {
    set({ isLoading: true, message: null });

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      const { user, message } = response.data;
      set({ user, message, isLoading: false });
      return { user, message };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error logging in",
      });
      throw error;
    }
  },

  fetchUser: async () => {
    set({ fetchingUser: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/fetch-user`);
      set({ user: response.data.user, fetchingUser: false });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("Not logged in, skipping fetchUser");
      } else {
        console.error("Unexpected fetchUser error:", error);
      }
      set({ fetchingUser: false, user: null });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response = await axios.post(`${API_URL}/logout`);
      set({
        message: response.data.message,
        user: null,
        isLoading: false,
        error: null,
      });
      return { message: response.data.message };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error logging out",
      });
      throw error;
    }
  },
}));
