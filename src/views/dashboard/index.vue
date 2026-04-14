<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in stats" :key="item.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-title">{{ item.title }}</p>
              <p class="stat-value">{{ item.value }}</p>
            </div>
            <el-icon class="stat-icon" :style="{ color: item.color }">
              <component :is="item.icon" />
            </el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { User, Document, Goods, Money } from '@element-plus/icons-vue'

const stats = reactive([
  { title: '用户总数', value: '1,234', icon: User, color: '#409eff' },
  { title: '订单总数', value: '5,678', icon: Document, color: '#67c23a' },
  { title: '商品总数', value: '890', icon: Goods, color: '#e6a23c' },
  { title: '销售总额', value: '¥99,999', icon: Money, color: '#f56c6c' }
])
</script>

<style lang="scss" scoped>
.dashboard {
  padding: $spacing-md;

  .stat-card {
    margin-bottom: $spacing-md;

    .stat-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .stat-info {
        .stat-title {
          margin: 0 0 $spacing-xs;
          color: $text-secondary;
          font-size: $font-size-sm;
        }

        .stat-value {
          margin: 0;
          font-size: $font-size-xl;
          font-weight: bold;
          color: $text-primary;
        }
      }

      .stat-icon {
        font-size: 48px;
      }
    }
  }
}
</style>
