<template>
  <nav class="navbar">
    <div class="container-xxl d-flex justify-content-end">
      <button type="button" class="btn btn-primary" @click="handleLogout">
        Logout
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { RootState } from "../store";

export default defineComponent({
  setup() {
    const store = useStore<RootState>();
    const router = useRouter();

    const handleLogout = async (event: MouseEvent) => {
      event.preventDefault();
      await store.dispatch("logout");
      router.push("/auth/login");
    };

    return {
      handleLogout,
    };
  },
});
</script>
<style scoped lang="scss">
.navbar {
  position: sticky;
  top: 0;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  background-color: #fff;
  z-index: 999;
}
@media (min-width: 1400px) {
  .navbar {
    .container-xxl {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>
