<template>
  <div class="deployment-yaml">
    <!-- 工具栏 -->
    <div class="deployment-yaml__toolbar">
      <BeeButton :disabled="loading" icon="basic-copy" @click="handleCopy"> 复制 </BeeButton>
      <BeeButton v-if="permissionMap.edit" :disabled="loading" icon="basic-edit" type="primary" @click="handleEdit">
        编辑 YAML
      </BeeButton>
    </div>

    <!-- YAML 内容（只读） -->
    <div class="deployment-yaml__editor">
      <BeeCodeEditor v-model="yamlText" readonly />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Deployment 详情 - YAML
 * @module views/kubernetes/workload/deployment/detail/yaml
 * @description 只读展示该无状态应用的 YAML，支持复制与跳转编辑页
 */
import { computed, onMounted, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { getDeploymentYaml } from '@/api/kubernetes/workload/deployment'

import { KubernetesRouteNames } from '@/router/names.ts'

import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeCodeEditor from '@/components/base/BeeCodeEditor/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'

import { useClipboard } from '@/composables/useClipboard'

import { useDeploymentPermission } from '../composables/usePermission'

defineOptions({ name: 'DeploymentYaml' })

const route = useRoute()
const router = useRouter()
const { permissionMap } = useDeploymentPermission()

// ==================== Computed ====================
/** 所属集群 UID（路由参数） */
const clusterUid = computed(() => route.params.clusterUid as string)
/** 所属命名空间名称（路由参数） */
const namespace = computed(() => route.params.namespace as string)
/** 被查看无状态应用名称（路由参数） */
const deploymentName = computed(() => route.params.name as string)

// ==================== Reactive State ====================
/** YAML 内容 */
const yamlText = ref('')
/** 加载态 */
const loading = ref(false)

// ==================== Method ====================
/**
 * 加载无状态应用 YAML
 */
async function fetchYaml() {
  if (!clusterUid.value || !namespace.value || !deploymentName.value) return
  loading.value = true
  try {
    const { yaml } = await getDeploymentYaml(clusterUid.value, namespace.value, deploymentName.value)
    yamlText.value = yaml
  } catch {
    BeeMessage.error('加载无状态应用 YAML 失败')
  } finally {
    loading.value = false
  }
}

// ==================== Handler ====================
/**
 * 复制 YAML 内容
 * @description 走静默复制，避免成功提示里塞入整份 YAML
 */
async function handleCopy() {
  if (!yamlText.value) {
    BeeMessage.warning('暂无可复制的 YAML 内容')
    return
  }
  await useClipboard().copy(yamlText.value, true)
  BeeMessage.success('YAML 已复制到剪贴板')
}

/**
 * 跳转编辑 YAML 页面
 */
function handleEdit() {
  router
    .push({
      name: KubernetesRouteNames.Deployment.EditYaml,
      params: { clusterUid: clusterUid.value, namespace: namespace.value, name: deploymentName.value },
    })
    .catch(() => {})
}

// ==================== Lifecycle ====================
onMounted(() => {
  void fetchYaml()
})
</script>

<style lang="scss" scoped>
.deployment-yaml {
  display: flex;
  gap: 16px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  height: 100%;
  min-height: 0;
  padding: 16px;

  &__toolbar {
    display: flex;
    gap: 8px;
    flex-flow: row wrap;
    justify-content: flex-end;
    align-items: center;
  }

  &__editor {
    flex: 1;
    min-height: 240px;
  }
}
</style>
