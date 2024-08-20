<template>
  <section class="container d-flex flex-column align-items-center gap-5">
    <h2 class="title">Create account</h2>
    <form @submit.prevent="handleRegister">
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
      <button type="submit" class="btn btn-primary w-100 mt-3">Register</button>
      <p class="d-flex align-items-center mt-4">
        Already have an account?
        <router-link to="/auth/login" class="btn btn-link p-1"
          >Login here</router-link
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

    const handleRegister = async () => {
      try {
        await store.dispatch("register", {
          email: email.value,
          password: password.value,
        });
        router.push("/dashboard");
      } catch (error) {
        alert("Registration failed");
      }
    };

    return {
      email,
      password,
      handleRegister,
    };
  },
});
</script>

<style>
.title {
  font-size: 3rem;
  color: #007bff;
  font-weight: bold;
}
</style>
