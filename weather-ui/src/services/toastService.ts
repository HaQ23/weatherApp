import { reactive } from "vue";

interface Toast {
  message: string;
  type: string;
}

const state = reactive({
  toasts: [] as Toast[],
});

export const useToast = () => {
  const showToast = (message: string, type = "info") => {
    state.toasts.push({ message, type });
    setTimeout(() => {
      state.toasts.shift();
    }, 3000);
  };

  const removeToast = (index: number) => {
    state.toasts.splice(index, 1);
  };

  return {
    state,
    showToast,
    removeToast,
  };
};
