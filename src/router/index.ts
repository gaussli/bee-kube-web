import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/stores";

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "登录", hidden: true },
  },
  {
    path: "/",
    redirect: "/dashboard",
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/dashboard/index.vue"),
    meta: { title: "首页", icon: "HomeFilled", requiresAuth: true },
  },
];

// 动态路由（异步加载）
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/system",
    name: "System",
    redirect: "/system/user",
    meta: {
      title: "系统管理",
      icon: "Setting",
      requiresAuth: true,
      roles: ["admin"],
    },
    children: [
      {
        path: "/system/user",
        name: "User",
        component: () => import("@/views/system/user/index.vue"),
        meta: {
          title: "用户管理",
          icon: "User",
          requiresAuth: true,
          roles: ["admin"],
        },
      },
      {
        path: "/system/role",
        name: "Role",
        component: () => import("@/views/system/role/index.vue"),
        meta: {
          title: "角色管理",
          icon: "Avatar",
          requiresAuth: true,
          roles: ["admin"],
        },
      },
    ],
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Bee Kube`;
  }

  // 需要登录且未登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn()) {
    next({ path: "/login", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

// 重置路由
export function resetRouter() {
  const routes = router.getRoutes();
  routes.forEach((route) => {
    const { name } = route;
    if (name && !constantRoutes.find((r) => r.name === name)) {
      router.removeRoute(name);
    }
  });
}

export default router;
