<template>
  <div class="role-assign-permissions">
    <!-- 顶部导航 -->
    <div class="assign-header">
      <BeeButton @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">配置权限</span>
    </div>

    <!-- 内容主体 -->
    <transition name="fade-slide" mode="out-in">
      <div v-if="loaded" class="assign-body">
        <!-- 角色信息 -->
        <div class="role-header">
          <div class="role-icon">
            <el-icon><Key /></el-icon>
          </div>
          <div class="role-meta">
            <div class="role-name-row">
              <span class="role-name">{{ roleData.name }}</span>
              <el-tag :type="roleData.status === 1 ? 'success' : 'danger'" size="small">
                {{ roleData.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </div>
            <div class="role-code">
              <BeeLabelCopyable :label="roleData.code" />
            </div>
          </div>
        </div>

        <!-- 权限配置 -->
        <div class="permissions-panel">
          <div class="panel-header">
            <el-icon><Menu /></el-icon>
            <span>菜单权限</span>
          </div>
          <div class="panel-body">
            <BeeTree
              ref="menuTreeRef"
              v-model="selectedMenuIds"
              :data="menuTreeData"
              :props="{ children: 'children', label: 'name' }"
              :default-expand-all="true"
            >
              <template #default="{ data }">
                <div class="menu-tree-node">
                  <div class="menu-info">
                    <span class="menu-name">{{ data.name }}</span>
                    <span class="menu-code">{{ data.code }}</span>
                  </div>
                  <div class="menu-meta">
                    <el-tag v-if="data.type === 1" size="small" type="primary">菜单</el-tag>
                    <el-tag v-else-if="data.type === 2" size="small" type="success">按钮</el-tag>
                    <el-tag v-else size="small">链接</el-tag>
                  </div>
                </div>
              </template>
            </BeeTree>
          </div>
        </div>
      </div>
    </transition>

    <!-- 底部操作 -->
    <div class="assign-footer">
      <BeeButton @click="handleBack">取消</BeeButton>
      <BeeButton type="primary" @click="handleSubmit">保存</BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'

import { ElMessage } from 'element-plus'

import { ArrowLeft, Key, Menu } from '@element-plus/icons-vue'

import type { RoleDetailResp, MenuResp } from '@/types/platform/role'

import { bindRoleMenus, getRoleDetail, getRoleMenus, getMenuPage } from '@/api/platform/role'

import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import BeeLabelCopyable from '@/components/BeeLabelCopyable/index.vue'
import BeeTree from '@/components/BeeTree/index.vue'

defineOptions({ name: 'RoleAssignPermissions' })

const router = useRouter()
const loaded = ref(false)
const menuTreeRef = ref()!

const roleId = router.currentRoute.value.query.roleId as string
const roleData = ref<RoleDetailResp>({} as RoleDetailResp)
const menuTreeData = ref<MenuResp[]>([])
const selectedMenuIds = ref<string[]>([])

// 模拟菜单数据
const mockMenus: MenuResp[] = [
  {
    id: '1',
    code: 'dashboard',
    name: '仪表盘',
    type: 1,
    status: 1,
    createAt: '',
    updateAt: '',
  },
  {
    id: '2',
    code: 'system',
    name: '系统管理',
    type: 1,
    status: 1,
    createAt: '',
    updateAt: '',
    children: [
      {
        id: '2-1',
        code: 'system:user',
        name: '用户管理',
        parentId: '2',
        type: 1,
        status: 1,
        createAt: '',
        updateAt: '',
      },
      {
        id: '2-2',
        code: 'system:role',
        name: '角色管理',
        parentId: '2',
        type: 1,
        status: 1,
        createAt: '',
        updateAt: '',
      },
      {
        id: '2-3',
        code: 'system:menu',
        name: '菜单管理',
        parentId: '2',
        type: 1,
        status: 1,
        createAt: '',
        updateAt: '',
      },
    ],
  },
  {
    id: '3',
    code: 'order',
    name: '订单管理',
    type: 1,
    status: 1,
    createAt: '',
    updateAt: '',
    children: [
      {
        id: '3-1',
        code: 'order:list',
        name: '订单列表',
        parentId: '3',
        type: 1,
        status: 1,
        createAt: '',
        updateAt: '',
      },
      {
        id: '3-2',
        code: 'order:export',
        name: '导出订单',
        parentId: '3',
        type: 2,
        status: 1,
        createAt: '',
        updateAt: '',
      },
    ],
  },
]

function handleBack() {
  router.back()
}

async function handleSubmit() {
  try {
    await bindRoleMenus(roleId, selectedMenuIds.value)
    ElMessage.success('保存成功')
    router.back()
  } catch {
    // 失败处理
  }
}

async function loadData() {
  try {
    // 加载角色详情
    roleData.value = await getRoleDetail(roleId)

    // 加载菜单列表
    const menuResp = await getMenuPage({})
    menuTreeData.value = menuResp.list.length > 0 ? menuResp.list : mockMenus

    // 加载角色已有菜单权限
    const roleMenus = await getRoleMenus(roleId, {})
    selectedMenuIds.value = roleMenus.list.map(m => m.id)

    loaded.value = true
  } catch {
    // 如果 API 失败，使用模拟数据
    roleData.value = {
      id: roleId,
      code: 'role_admin',
      name: '管理员',
      status: 1,
      isSystem: true,
      createAt: '',
      updateAt: '',
    }
    menuTreeData.value = mockMenus
    loaded.value = true
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.role-assign-permissions {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $color-bg-surface;
}

.assign-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  border-bottom: 1px solid rgba($color-text-secondary, 0.1);

  .header-title {
    font-weight: 600;
    color: $color-text-secondary;
  }
}

.assign-body {
  display: flex;
  gap: 16px;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
  animation: fade-slide-in 0.3s ease-out;
}

.assign-footer {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid rgba($color-text-secondary, 0.1);
}

.role-header {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 24px;
  border-radius: 12px;
  background-color: $color-bg-page;

  .role-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    font-size: 24px;
    color: $color-primary;
    background: linear-gradient(135deg, rgba($color-primary, 0.15) 0%, rgba($color-primary, 0.08) 100%);
  }

  .role-meta {
    display: flex;
    gap: 8px;
    flex-direction: column;
    overflow: hidden;

    .role-name-row {
      display: flex;
      gap: 12px;
      align-items: center;

      .role-name {
        font-size: 20px;
        font-weight: 600;
        color: $color-text-primary;
      }
    }

    .role-code {
      font-family: 'SF Mono', Consolas, monospace;
      font-size: 12px;
      color: $color-text-secondary;
    }
  }
}

.permissions-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 300px;
  border-radius: 12px;
  overflow: hidden;
  background-color: $color-bg-page;

  .panel-header {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid rgba($color-text-secondary, 0.1);
    font-weight: 500;
    color: $color-text-secondary;
  }

  .panel-body {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
  }
}

.menu-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;

  .menu-info {
    display: flex;
    gap: 12px;
    align-items: center;

    .menu-name {
      font-size: 14px;
      color: $color-text-primary;
    }

    .menu-code {
      font-family: 'SF Mono', Consolas, monospace;
      font-size: 12px;
      color: $color-text-tertiary;
    }
  }
}

// 渐入渐出动画
.fade-slide-enter-active {
  animation: fade-slide-in 0.3s ease-out;
}

@keyframes fade-slide-in {
  from {
    opacity: 0;
    transform: translateX(20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
