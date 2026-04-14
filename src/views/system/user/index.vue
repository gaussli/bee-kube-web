<template>
  <div class="system-page">
    <el-card>
      <template #header>
        <span>用户管理</span>
      </template>
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="email" label="邮箱" />
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
import { ref } from 'vue';

const tableData = ref([
  { id: 1, username: 'admin', nickname: '管理员', email: 'admin@example.com', status: 1 },
  { id: 2, username: 'user1', nickname: '用户1', email: 'user1@example.com', status: 1 },
  { id: 3, username: 'user2', nickname: '用户2', email: 'user2@example.com', status: 0 }
]);
</script>

<style lang="scss" scoped>
.system-page {
  padding: $spacing-md;
}
</style>
