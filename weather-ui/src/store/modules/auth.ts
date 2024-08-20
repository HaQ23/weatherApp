import { Module } from "vuex";
import * as authApi from "@/api/auth";

export interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
}

export const auth: Module<AuthState, any> = {
  state: {
    isAuthenticated: !!localStorage.getItem("isAuthenticated"),
    email: localStorage.getItem("email"),
  },
  mutations: {
    SET_AUTHENTICATED(
      state,
      { status, email }: { status: boolean; email: string | null }
    ) {
      state.isAuthenticated = status;
      state.email = email;
      if (status) {
        localStorage.setItem("isAuthenticated", "true");
        if (email) localStorage.setItem("email", email);
      } else {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("email");
      }
    },
  },
  actions: {
    async login(
      { commit },
      { email, password }: { email: string; password: string }
    ) {
      try {
        const response = await authApi.login(email, password);
        if (response.message === "Login successful") {
          commit("SET_AUTHENTICATED", { status: true, email });
        }
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    async register(
      { commit },
      { email, password }: { email: string; password: string }
    ) {
      try {
        const response = await authApi.register(email, password);
        if (response.message === "Login successful") {
          commit("SET_AUTHENTICATED", { status: true, email });
        }
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    },
    logout({ commit }) {
      commit("SET_AUTHENTICATED", { status: false, email: null });
    },
  },
  getters: {
    isAuthenticated(state): boolean {
      return state.isAuthenticated;
    },
    email(state): string | null {
      return state.email;
    },
  },
};
