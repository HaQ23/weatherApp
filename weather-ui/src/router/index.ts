import DashboardPage from "@/views/dashboardPage.vue";
import LoginPage from "@/views/loginPage.vue";
import RegisterPage from "@/views/registerPage.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        name: "Login",
        component: LoginPage,
      },
      {
        path: "register",
        name: "Register",
        component: RegisterPage,
      },
    ],
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("isAuthenticated");

  if (to.path.startsWith("/auth") && isAuthenticated) {
    next({ name: "Dashboard" });
  } else if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
