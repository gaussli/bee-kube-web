<template>
  <div class="menu-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" :icon="Plus">新增菜单</el-button>
        </div>
      </template>
      <el-table :data="[]" stripe>
        <el-table-column prop="name" label="菜单名称" />
        <el-table-column prop="code" label="菜单编码" />
        <el-table-column prop="frontPath" label="路由路径" />
        <el-table-column prop="frontComponent" label="组件路径" />
        <el-table-column label="操作" width="180">
          <template #default>
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'

defineOptions({ name: 'MenuManage' })
</script>

<style lang="scss" scoped>
.menu-list {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
