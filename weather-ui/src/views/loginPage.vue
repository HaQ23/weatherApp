<template>
  <section class="container d-flex flex-column align-items-center gap-5">
    <h2 class="title">Welcome!</h2>
    <form @submit.prevent="handleLogin">
      <div class="d-flex flex-column mb-3">
        <label for="email" class="form-label align-self-start"
          >Email address*</label
        >
        <input type="email" class="form-control" v-model="email" required />
      </div>
      <div class="d-flex flex-column mb-3">
        <label for="password" class="form-label align-self-start"
          >Password*</label
        >
        <input
          type="password"
          class="form-control"
          v-model="password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary w-100 mt-3">Login</button>
      <p class="d-flex align-items-center mt-4">
        Don't have an account?
        <router-link to="/auth/register" class="btn btn-link p-1"
          >Register here</router-link
        >
      </p>
    </form>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { RootState } from "@/store";

export default defineComponent({
  setup() {
    const store = useStore<RootState>();
    const router = useRouter();

    const email = ref("");
    const password = ref("");

    const handleLogin = async () => {
      try {
        await store.dispatch("login", {
          email: email.value,
          password: password.value,
        });

        const isAuthenticated = store.getters.isAuthenticated;
        if (isAuthenticated) {
          router
            .push("/dashboard")
            .catch((err) => console.error("Redirect failed:", err));
        } else {
          alert("Login failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed");
      }
    };

    return {
      email,
      password,
      handleLogin,
    };
  },
});
</script>
<style lang="scss">
.container {
  margin-top: 10rem;
  form {
    width: 100%;
    max-width: 420px;
  }
  .title {
    font-size: 3rem;
    color: #007bff;
    font-weight: bold;
  }
}
</style>
