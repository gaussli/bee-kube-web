<template>
  <div class="system-page">
    <el-card>
      <template #header>
        <span>角色管理</span>
      </template>
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色代码" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default>
            <el-button type="primary" size="small">编辑</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '超级管理员', code: 'super_admin', description: '拥有所有权限', status: 1 },
  { id: 2, name: '普通管理员', code: 'admin', description: '拥有大部分权限', status: 1 },
  { id: 3, name: '普通用户', code: 'user', description: '拥有基础权限', status: 1 }
])
</script>

<style lang="scss" scoped>
.system-page {
  padding: $spacing-md;
}
</style>
