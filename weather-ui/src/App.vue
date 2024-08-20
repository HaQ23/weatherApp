<template>
  <div id="app">
    <router-view></router-view>
    <ToastComponent :toasts="toasts" @remove-toast="removeToast" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ToastComponent from "./components/toastComponent.vue";
import { useToast } from "@/services/toastService";

export default defineComponent({
  components: {
    ToastComponent,
  },
  setup() {
    const { state, removeToast } = useToast();
    return {
      toasts: state.toasts,
      removeToast,
    };
  },
});
</script>
<style lang="scss">
#app {
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

*,
*::after,
*::before {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
