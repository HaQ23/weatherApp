<template>
  <div
    class="toast-container position-fixed bottom-0 end-0 p-3"
    style="z-index: 1050"
  >
    <div
      v-for="(toast, index) in toasts"
      :key="index"
      :class="[
        'toast align-items-center text-white bg-' +
          toast.type +
          ' border-0 show',
      ]"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">
          {{ toast.message }}
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          @click="removeToast(index)"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Toast {
  message: string;
  type: string;
}

export default defineComponent({
  name: "ToastComponent",
  props: {
    toasts: {
      type: Array as () => Toast[],
      required: true,
    },
  },
  methods: {
    removeToast(index: number) {
      this.$emit("remove-toast", index);
    },
  },
});
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}
</style>
