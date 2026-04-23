<template>
  <div class="user-roles">
    <!-- 顶部导航 -->
    <div class="nav-bar">
      <div class="back-btn" @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回</span>
      </div>
      <div class="page-title">
        <span class="title-cn">配置角色</span>
        <span class="title-en">Config Roles</span>
      </div>
    </div>

    <!-- 内容区域 -->
    <el-card class="content-card">
      <transition name="fade-slide" mode="out-in">
        <div v-if="loaded" class="content">
          <!-- 用户信息 -->
          <div class="user-info">
            <UserAvatar :name="userData.username" :size="48" />
            <div class="user-meta">
              <div class="user-name">
                <span>{{ userData.username }}</span>
                <el-tag :type="userData.status === 1 ? 'success' : 'danger'" size="small">
                  {{ userData.status === 1 ? '启用' : '禁用' }}
                </el-tag>
              </div>
              <div class="user-id">
                <el-icon><Key /></el-icon>
                <span>{{ userData.id }}</span>
              </div>
            </div>
          </div>

          <!-- 角色分配 -->
          <div class="roles-section">
            <div class="section-header">
              <div class="section-icon">
                <el-icon><UserFilled /></el-icon>
              </div>
              <div class="section-title">
                <span>配置角色</span>
                <span class="title-en">Config Roles</span>
              </div>
              <div class="section-count">
                <span>{{ selectedRoles.length }}</span>
                <span class="count-en">/ {{ pagination.total }}</span>
              </div>
            </div>

            <!-- 搜索和批量操作 -->
            <div class="roles-toolbar">
              <el-input
                v-model="queryForm.name"
                placeholder="搜索角色名称"
                clearable
                class="search-input"
                @input="handleSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <div class="toolbar-actions">
                <el-button text size="small" @click="handleSelectCurrentPage">
                  <el-icon><Select /></el-icon>
                  全选当页
                </el-button>
                <el-button text size="small" @click="handleClearCurrentPage">
                  <el-icon><Close /></el-icon>
                  清空当页
                </el-button>
              </div>
            </div>

            <!-- 已选角色标签 -->
            <div v-if="selectedRoles.length > 0" class="selected-tags">
              <span class="selected-label">已选角色：</span>
              <el-tag
                v-for="roleId in selectedRoles"
                :key="roleId"
                closable
                size="small"
                @close="handleRemoveRole(roleId)"
              >
                {{ getRoleName(roleId) }}
              </el-tag>
            </div>

            <!-- 角色列表 -->
            <div class="roles-list">
              <el-checkbox-group v-model="selectedRoles">
                <div
                  v-for="role in roleList"
                  :key="role.id"
                  class="role-item"
                  :class="{ 'is-selected': selectedRoles.includes(role.id) }"
                  @click="toggleRole(role.id)"
                >
                  <el-checkbox :value="role.id" @click.prevent>
                    <div class="role-content">
                      <div class="role-header">
                        <div class="role-icon">
                          <el-icon><UserFilled /></el-icon>
                        </div>
                        <div class="role-info">
                          <div class="role-name">{{ role.name }}</div>
                          <div class="role-desc">
                            <el-icon><Collection /></el-icon>
                            <span>{{ role.code }}</span>
                          </div>
                        </div>
                        <div class="role-tags">
                          <el-tag v-if="role.isSystem" size="small" type="warning">系统</el-tag>
                          <el-tag
                            :type="role.status === 1 ? 'success' : 'danger'"
                            size="small"
                          >
                            {{ role.status === 1 ? '启用' : '禁用' }}
                          </el-tag>
                        </div>
                      </div>
                      <div v-if="role.description" class="role-description">
                        {{ role.description }}
                      </div>
                    </div>
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </div>

            <!-- 分页 -->
            <div class="roles-pagination">
              <el-pagination
                v-model:current-page="pagination.page"
                v-model:page-size="pagination.pageSize"
                :total="pagination.total"
                :page-sizes="[5, 10, 20, 50]"
                layout="total, sizes, prev, pager, next"
                background
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
              />
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="form-actions">
            <el-button @click="handleBack">取消</el-button>
            <el-button type="primary" @click="handleSubmit">保存</el-button>
          </div>
        </div>
      </transition>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Key, UserFilled, Collection, Select, Close, Search } from '@element-plus/icons-vue'
import UserAvatar from '@/components/UserAvatar/index.vue'
import type { UserDetailResp, UserAssignRoleReq } from '@/types'
import type { RoleResp } from '@/types/role'

defineOptions({ name: 'UserAssignRoles' })

const router = useRouter()
const loaded = ref(false)

const userId = router.currentRoute.value.query.userId as string
const userData = ref<UserDetailResp>({
  id: userId,
  username: 'admin',
  nickname: '管理员',
  status: 1
})

// 模拟所有角色数据
const allRoles = ref<RoleResp[]>([])
for (let i = 1; i <= 55; i++) {
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

// 查询表单
const queryForm = reactive({
  name: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 已选中的角色
const selectedRoles = ref<string[]>(['1', '2'])

// 过滤后的角色列表（根据搜索和分页）
const roleList = computed(() => {
  let list = allRoles.value
  if (queryForm.name) {
    list = list.filter(r => r.name.includes(queryForm.name))
  }
  pagination.total = list.length
  const start = (pagination.page - 1) * pagination.pageSize
  return list.slice(start, start + pagination.pageSize)
})

function getRoleName(roleId: string) {
  return allRoles.value.find(r => r.id === roleId)?.name || roleId
}

function toggleRole(roleId: string) {
  const index = selectedRoles.value.indexOf(roleId)
  if (index === -1) {
    selectedRoles.value.push(roleId)
  } else {
    selectedRoles.value.splice(index, 1)
  }
}

function handleRemoveRole(roleId: string) {
  const index = selectedRoles.value.indexOf(roleId)
  if (index !== -1) {
    selectedRoles.value.splice(index, 1)
  }
}

function handleSearch() {
  pagination.page = 1
}

function handleSelectCurrentPage() {
  const currentPageIds = roleList.value.map(r => r.id)
  currentPageIds.forEach(id => {
    if (!selectedRoles.value.includes(id)) {
      selectedRoles.value.push(id)
    }
  })
}

function handleClearCurrentPage() {
  const currentPageIds = roleList.value.map(r => r.id)
  selectedRoles.value = selectedRoles.value.filter(id => !currentPageIds.includes(id))
}

function handleSizeChange() {
  pagination.page = 1
}

function handlePageChange() {
  // 分页变化时不需要额外处理
}

function handleBack() {
  router.back()
}

async function handleSubmit() {
  const params: UserAssignRoleReq = {
    userId,
    roleIds: selectedRoles.value
  }
  console.log('提交参数:', params)
  // TODO: 调用 API
  ElMessage.success('保存成功')
  router.back()
}

onMounted(() => {
  // TODO: 加载用户信息和已有角色
  pagination.total = allRoles.value.length
  loaded.value = true
})
</script>

<style lang="scss" scoped>
.user-roles {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $bg-page;
}

.nav-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 48px;
  padding: 0 8px;
  background-color: $bg-page;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 8px;
  color: $text-secondary;
  transition: all 0.3s;

  &:hover {
    color: $text-primary;
    background-color: $bg-hover;
  }
}

.page-title {
  display: flex;
  align-items: baseline;
  gap: 12px;

  .title-cn {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
  }

  .title-en {
    font-size: 12px;
    color: $text-secondary;
  }
}

.content-card {
  flex: 1;
  overflow: hidden;
  background-color: $bg-page;
  border: 1px solid rgba($text-secondary, 0.1);
  border-radius: 12px;

  :deep(.el-card__body) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.user-info {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba($bg-color, 0.5);
  border: 1px solid rgba($text-secondary, 0.1);
  border-radius: 10px;
}

.user-meta {
  flex: 1;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
}

.user-id {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 12px;
  color: $text-secondary;
  font-family: monospace;

  .el-icon {
    color: $color-primary;
  }
}

.roles-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba($bg-color, 0.5);
  border: 1px solid rgba($text-secondary, 0.1);
  border-radius: 10px;
  padding: 16px 20px;
  overflow: hidden;
}

.section-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba($text-secondary, 0.1);
}

.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-400 100%);
  border-radius: 8px;
  font-size: 16px;
  color: #fff;
}

.section-title {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 10px;

  span:first-child {
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }

  .title-en {
    font-size: 12px;
    color: $text-secondary;
  }
}

.section-count {
  padding: 4px 12px;
  background: rgba($color-primary, 0.1);
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  color: $color-primary;

  .count-en {
    font-weight: 400;
    opacity: 0.7;
  }
}

.roles-toolbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.search-input {
  width: 200px;
}

.toolbar-actions {
  display: flex;
  gap: 4px;

  .el-button {
    color: $text-secondary;

    &:hover {
      color: $color-primary;
    }
  }
}

.selected-tags {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  margin-bottom: 12px;
  background: rgba($bg-color, 0.3);
  border-radius: 8px;
  max-height: 100px;
  overflow-y: auto;

  .selected-label {
    font-size: 12px;
    color: $text-secondary;
    flex-shrink: 0;
  }

  .el-tag {
    background: rgba($color-primary, 0.1);
    border-color: rgba($color-primary, 0.3);
    color: $color-primary;
  }
}

.roles-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  min-height: 0;
}

.role-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 14px 16px;
  background: rgba($bg-color, 0.4);
  border: 1px solid rgba($text-secondary, 0.08);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%) scaleY(0);
    width: 3px;
    height: 60%;
    background: linear-gradient(180deg, $color-primary 0%, $color-primary-400 100%);
    border-radius: 0 2px 2px 0;
    transition: transform 0.25s ease;
  }

  &:hover {
    background: rgba($bg-hover, 0.4);
    border-color: rgba($text-secondary, 0.15);

    &::before {
      transform: translateY(-50%) scaleY(0.6);
    }
  }

  &.is-selected {
    background: rgba($color-primary, 0.06);
    border-color: rgba($color-primary, 0.25);

    &::before {
      transform: translateY(-50%) scaleY(1);
    }
  }

  :deep(.el-checkbox) {
    width: 100%;
    display: flex;
    align-items: flex-start;
  }

  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background: $color-primary;
    border-color: $color-primary;
  }

  :deep(.el-checkbox__inner) {
    background: rgba($bg-color, 0.6);
    border-color: rgba($text-secondary, 0.25);
    border-radius: 5px;

    &::after {
      top: 3px;
      left: 6px;
    }
  }

  :deep(.el-checkbox__label) {
    flex: 1;
    padding-left: 12px;
  }
}

.role-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.role-header {
  display: flex;
  align-items: center;
  gap: 10px;
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

.role-info {
  flex: 1;
  min-width: 0;
}

.role-name {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
  line-height: 1.4;
}

.role-desc {
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
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.role-description {
  font-size: 12px;
  color: $text-tertiary;
  line-height: 1.4;
  padding-left: 42px;
}

.roles-pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba($text-secondary, 0.1);
}

.form-actions {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba($text-secondary, 0.1);
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
