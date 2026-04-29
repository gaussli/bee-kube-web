<template>
  <div class="menu-assign-roles">
    <!-- 顶部导航 -->
    <div class="assign-header">
      <BeeButton :border="false" @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">配置角色</span>
    </div>

    <!-- 内容主体 -->
    <transition name="fade-slide" mode="out-in">
      <div v-if="loaded" class="assign-body">
        <!-- 菜单信息 -->
        <div class="menu-header">
          <div class="menu-icon">
            <el-icon :size="36"><component :is="menuData.frontIcon || 'Menu'" /></el-icon>
          </div>
          <div class="menu-meta">
            <div class="menu-name-row">
              <span class="menu-name">{{ menuData.name }}</span>
              <el-tag :type="menuData.status === 1 ? 'success' : 'danger'" size="small">
                {{ menuData.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </div>
            <div class="menu-code">
              <TextCopyableCell :text="menuData.code" />
            </div>
          </div>
        </div>

        <!-- 角色分配 -->
        <BeeTransfer v-model="selectedRoleIds" :left-data="availableRoles" :right-data="selectedRoles" left-title="可选角色" right-title="已选角色" label-key="name" value-key="id">
          <template #left="{ item }">
            <div class="role-item-content">
              <div class="role-icon">
                <el-icon><UserFilled /></el-icon>
              </div>
              <div class="role-info">
                <div class="role-name">{{ item.name }}</div>
                <div class="role-code">
                  <el-icon><Collection /></el-icon>
                  <span>{{ item.code }}</span>
                </div>
              </div>
              <div class="role-tags">
                <BeeTag v-if="item.isSystem" type="warning">系统</BeeTag>
                <BeeTag :type="item.status === 1 ? 'success' : 'danger'">
                  {{ item.status === 1 ? '启用' : '禁用' }}
                </BeeTag>
              </div>
            </div>
          </template>
          <template #right="{ item }">
            <div class="role-item-content">
              <div class="role-icon">
                <el-icon><UserFilled /></el-icon>
              </div>
              <div class="role-info">
                <div class="role-name">{{ item.name }}</div>
                <div class="role-code">
                  <el-icon><Collection /></el-icon>
                  <span>{{ item.code }}</span>
                </div>
              </div>
              <div class="role-tags">
                <BeeTag v-if="item.isSystem" type="warning">系统</BeeTag>
                <BeeTag :type="item.status === 1 ? 'success' : 'danger'">
                  {{ item.status === 1 ? '启用' : '禁用' }}
                </BeeTag>
              </div>
            </div>
          </template>
        </BeeTransfer>
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Collection, UserFilled } from '@element-plus/icons-vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import BeeTransfer from '@/components/BeeTransfer/index.vue'
import TextCopyableCell from '@/components/TextCopyableCell/index.vue'
import type { MenuDetailResp } from '@/types'
import type { RoleResp } from '@/types/role'

defineOptions({ name: 'MenuAssignRoles' })

const router = useRouter()
const loaded = ref(false)

const menuId = router.currentRoute.value.query.menuId as string
const menuData = ref<MenuDetailResp>({
  id: menuId,
  code: 'system_menu',
  name: '系统菜单',
  status: 1
})

// 模拟所有角色数据
const allRoles = ref<RoleResp[]>([])
for (let i = 1; i <= 20; i++) {
  allRoles.value.push({
    id: String(i),
    code: `role_${i}`,
    name: `角色${i}`,
    description: `这是角色${i}的描述信息`,
    status: i % 5 === 0 ? 0 : 1,
    isSystem: i <= 2,
    createAt: '',
    updateAt: ''
  })
}

// 已选中的角色ID
const selectedRoleIds = ref<string[]>(['1', '2'])

// 已选角色列表
const selectedRoles = computed(() => {
  return allRoles.value.filter(role => selectedRoleIds.value.includes(role.id))
})

// 可选角色列表（排除已选的）
const availableRoles = computed(() => {
  return allRoles.value.filter(role => !selectedRoleIds.value.includes(role.id))
})

function handleBack() {
  router.back()
}

async function handleSubmit() {
  console.log('提交参数:', { menuId, roleIds: selectedRoleIds.value })
  // TODO: 调用 API
  ElMessage.success('保存成功')
  router.back()
}

onMounted(() => {
  // TODO: 加载菜单信息和已有角色
  loaded.value = true
})
</script>

<style lang="scss" scoped>
.menu-assign-roles {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $bg-page;
}

.assign-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  border-bottom: 1px solid rgba($text-secondary, 0.1);

  .header-title {
    color: $text-secondary;
    font-weight: 600;
  }
}

.assign-body {
  flex: 1;
  min-height: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  animation: fadeSlideIn 0.3s ease-out;

  :deep(.bee-transfer) {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
}

.assign-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid rgba($text-secondary, 0.1);
}

.menu-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background-color: $bg-color;
  border-radius: 12px;

  .menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    background-color: #ecf5ff;
    border-radius: 16px;
    color: #409eff;
  }

  .menu-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;

    .menu-name-row {
      display: flex;
      align-items: center;
      gap: 12px;

      .menu-name {
        font-size: 20px;
        font-weight: 600;
        color: $text-primary;
      }
    }

    .menu-code {
      font-size: 12px;
      color: $text-secondary;
    }
  }
}

// 角色项内容
.role-item-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.role-info {
  flex: 1;
  min-width: 0;
}

.role-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, rgba($color-primary, 0.15) 0%, rgba($color-primary, 0.08) 100%);
  border-radius: 8px;
  font-size: 14px;
  color: $color-primary;
  transition: all 0.25s ease;

  .role-item.is-selected & {
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-400 100%);
    color: #fff;
  }
}

.role-name {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
  line-height: 1.4;
}

.role-code {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
  font-size: 12px;
  color: $text-secondary;
  font-family: 'SF Mono', Consolas, monospace;

  .el-icon {
    font-size: 12px;
    color: $color-primary;
    opacity: 0.6;
  }
}

.role-tags {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

// 渐入渐出动画
.fade-slide-enter-active {
  animation: fadeSlideIn 0.3s ease-out;
}

@keyframes fadeSlideIn {
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
