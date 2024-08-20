import { createStore } from "vuex";
import { auth, AuthState } from "./modules/auth";
import { cities, CitiesState } from "./modules/cities";

export interface RootState {
  auth: AuthState;
  cities: CitiesState;
}

export default createStore<RootState>({
  modules: {
    auth,
    cities,
  },
});
