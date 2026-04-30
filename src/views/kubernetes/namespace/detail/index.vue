<template>
  <div class="namespace-detail">
    <!-- 详情头部 -->
    <div class="detail-header">
      <BeeButton :border="false" @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">命名空间详情</span>
    </div>

    <!-- 详情主体 -->
    <transition name="fade-slide" mode="out-in">
      <div class="detail-body" v-if="loaded">
        <!-- 命名空间关键信息 -->
        <div class="namespace-header">
          <div class="namespace-icon">
            <el-icon :size="36"><FolderOpened /></el-icon>
          </div>
          <div class="namespace-meta">
            <div class="namespace-name-row">
              <span class="namespace-name">{{ namespaceData.name }}</span>
              <el-tag :type="phaseTagMap[namespaceData.phase]" size="small">
                {{ namespaceData.phase }}
              </el-tag>
            </div>
            <div class="namespace-status">
              <el-tag :type="statusTagMap[namespaceData.status]" size="small">
                {{ namespaceData.status }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 命名空间信息网格 -->
        <div class="info-grid">
          <!-- 基本信息 -->
          <div class="info-section">
            <div class="section-title">
              <el-icon><InfoFilled /></el-icon>
              <span>基本信息</span>
              <span class="section-title-en">/ Basic Info</span>
            </div>
            <div class="info-list">
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Key /></el-icon>
                  <span class="label-zh">名称</span>
                  <span class="label-en">Name</span>
                </div>
                <TextCopyableCell :text="namespaceData.name" />
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Clock /></el-icon>
                  <span class="label-zh">创建时间</span>
                  <span class="label-en">Create At</span>
                </div>
                <span class="info-value">{{ namespaceData.createAt || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- 标签信息 -->
          <div class="info-section info-section-full">
            <div class="section-title">
              <el-icon><PriceTag /></el-icon>
              <span>标签</span>
              <span class="section-title-en">Labels</span>
            </div>
            <div class="labels-container">
              <template v-if="Object.keys(namespaceData.labels).length > 0">
                <el-tag v-for="(value, key) in namespaceData.labels" :key="key" class="label-tag">
                  {{ key }}: {{ value }}
                </el-tag>
              </template>
              <span v-else class="no-data">暂无标签</span>
            </div>
          </div>

          <!-- 注释信息 -->
          <div class="info-section info-section-full">
            <div class="section-title">
              <el-icon><Document /></el-icon>
              <span>注释</span>
              <span class="section-title-en">Annotations</span>
            </div>
            <div class="annotations-container">
              <template v-if="Object.keys(namespaceData.annotations).length > 0">
                <div v-for="(value, key) in namespaceData.annotations" :key="key" class="annotation-item">
                  <span class="annotation-key">{{ key }}</span>
                  <span class="annotation-value">{{ value }}</span>
                </div>
              </template>
              <span v-else class="no-data">暂无注释</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Clock, Document, FolderOpened, InfoFilled, Key, PriceTag } from '@element-plus/icons-vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import TextCopyableCell from '@/components/TextCopyableCell/index.vue'

defineOptions({ name: 'NamespaceDetail' })

const router = useRouter()
const loaded = ref(false)
const namespace = router.currentRoute.value.query.name as string

const phaseTagMap: Record<string, string> = {
  Active: 'success',
  Terminating: 'warning',
  Failed: 'danger'
}

const statusTagMap: Record<string, string> = {
  True: 'success',
  False: 'info'
}

const namespaceData = ref({
  name: namespace,
  phase: 'Active',
  status: 'True',
  labels: {} as Record<string, string>,
  annotations: {} as Record<string, string>,
  createAt: ''
})

async function loadData() {
  try {
    // TODO: 调用获取命名空间详情 API
    // const data = await getNamespaceDetail(namespace)
    // namespaceData.value = data
  } finally {
    loaded.value = true
  }
}

function handleBack() {
  router.back()
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.namespace-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $bg-page;
}

.detail-header {
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

.detail-body {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 20px;
}

.namespace-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background-color: $bg-color;
  border-radius: 12px;

  .namespace-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    background-color: #ecf5ff;
    border-radius: 16px;
    color: #409eff;
  }

  .namespace-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;

    .namespace-name-row {
      display: flex;
      align-items: center;
      gap: 12px;

      .namespace-name {
        font-size: 20px;
        font-weight: 600;
        color: $text-primary;
      }
    }

    .namespace-status {
      font-size: 12px;
      color: $text-secondary;
    }
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  .info-section {
    background-color: $bg-color;
    border-radius: 12px;
    padding: 20px;

    &-full {
      grid-column: 1 / -1;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid $bg-selected;

      .el-icon {
        color: $color-primary;
        font-size: 16px;
      }

      .section-title-en {
        font-size: 12px;
        font-weight: 400;
        color: $text-tertiary;
        margin-left: 4px;
      }
    }

    .info-list {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;

        .info-label {
          display: flex;
          align-items: center;
          gap: 8px;

          .el-icon {
            color: $text-tertiary;
            font-size: 14px;
            flex-shrink: 0;
          }

          .label-zh {
            font-size: 14px;
            color: $text-secondary;
          }

          .label-en {
            font-size: 12px;
            color: $text-tertiary;
            margin-left: 2px;
          }
        }

        .info-value {
          font-size: 14px;
          color: $text-primary;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

.labels-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .label-tag {
    font-family: 'Monaco', 'Menlo', monospace;
  }
}

.annotations-container {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .annotation-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 12px;
    background-color: $bg-page;
    border-radius: 6px;

    .annotation-key {
      font-size: 12px;
      color: $text-tertiary;
      font-family: 'Monaco', 'Menlo', monospace;
    }

    .annotation-value {
      font-size: 14px;
      color: $text-primary;
      word-break: break-all;
    }
  }
}

.no-data {
  font-size: 14px;
  color: $text-tertiary;
}

.fade-slide-enter-active {
  animation: fadeSlideIn 0.3s ease-out;
}

.fade-slide-leave-active {
  animation: fadeSlideOut 0.2s ease-in;
}
</style>
