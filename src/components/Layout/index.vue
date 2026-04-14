<template>
  <el-container class="layout-container">
    <el-aside :width="appStore.sidebarOpened ? '200px' : '64px'" class="aside">
      <div class="logo">
        <img src="@/assets/vue.svg" alt="logo" />
        <span v-show="appStore.sidebarOpened">Bee Kube</span>
      </div>
      <el-menu
        :default-active="route.path"
        :collapse="!appStore.sidebarOpened"
        :collapse-transition="false"
        router
        class="aside-menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <el-sub-menu index="/system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/system/user">用户管理</el-menu-item>
          <el-menu-item index="/system/role">角色管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="toggle-icon" @click="appStore.toggleSidebar">
            <Fold v-show="appStore.sidebarOpened" />
            <Expand v-show="!appStore.sidebarOpened" />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.meta.title">{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <span class="username">Admin</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="setting">设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { HomeFilled, Setting, Fold, Expand } from '@element-plus/icons-vue'
import { useAppStore, useUserStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

async function handleCommand(command: string) {
  if (command === 'logout') {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      type: 'warning'
    })
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .aside {
    background: $bg-light;
    transition: width 0.3s;

    .logo {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      height: 60px;
      padding: 0 $spacing-md;
      background: $primary-color;
      color: white;
      font-weight: bold;

      img {
        width: 32px;
        height: 32px;
      }
    }

    .aside-menu {
      border-right: none;
      background: transparent;
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: $bg-light;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

    .header-left {
      display: flex;
      align-items: center;
      gap: $spacing-md;

      .toggle-icon {
        font-size: 20px;
        cursor: pointer;
      }
    }

    .header-right {
      .user-dropdown {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        cursor: pointer;

        .username {
          color: $text-primary;
        }
      }
    }
  }

  .main {
    background: $bg-color;
    overflow-y: auto;
  }
}
</style>
