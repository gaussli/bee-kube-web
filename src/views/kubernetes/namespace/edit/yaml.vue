<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeeBackHeader :actions="actionItems" title="编辑命名空间 YAML" @action="handleHeaderActions" @back="handleBack" />

    <!-- 编辑器 Body -->
    <BeeCard class="page-body">
      <BeeCodeEditor v-model="yamlText" class="page-body__editor" />
    </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { getNamespaceYaml, updateNamespaceYaml } from '@/api/kubernetes/namespace/namespace'

import { KubernetesRouteNames } from '@/router/names.ts'

import BeeCodeEditor from '@/components/base/BeeCodeEditor/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeeBackHeader, { type ActionItem } from '@/components/business/BeeBackHeader/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

defineOptions({ name: 'NamespaceEditYaml' })

const route = useRoute()
const router = useRouter()

// ==================== Reactive State ====================
/** YAML 内容 */
const yamlText = ref<string>('')
/** 是否正在加载 YAML */
const isLoading = ref<boolean>(false)
/** 是否正在提交 */
const isSubmitting = ref<boolean>(false)

// ==================== Computed ====================
/** 所属集群 UID（路由参数） */
const clusterUid = computed(() => route.params.clusterUid as string)
/** 被编辑命名空间名称（路由参数） */
const namespaceName = computed(() => route.params.name as string)
/** 头部操作按钮组：加载期间禁用，提交期间展示加载态 */
const actionItems = computed<ActionItem[]>(() => [
  {
    value: 'submit',
    label: '提交',
    icon: 'basic-right',
    type: 'success',
    disabled: isLoading.value,
    loading: isSubmitting.value,
  },
])

// ==================== Method ====================
/**
 * 获取命名空间 YAML
 */
async function fetchNamespaceYaml() {
  isLoading.value = true
  try {
    const data = await getNamespaceYaml(clusterUid.value, namespaceName.value)
    yamlText.value = data.yaml
  } catch {
    BeeMessage.error('加载命名空间 YAML 失败')
    router.back()
  } finally {
    isLoading.value = false
  }
}

/**
 * 提交更新
 * @description 仅做非空校验，YAML 语法与字段合法性由接口返回；成功后返回命名空间列表
 */
async function handleSubmit() {
  if (!yamlText.value.trim()) {
    BeeMessage.error('YAML 内容不能为空')
    return
  }
  isSubmitting.value = true
  try {
    await updateNamespaceYaml(clusterUid.value, namespaceName.value, yamlText.value)
  } catch {
    BeeMessage.error('保存命名空间 YAML 失败')
    return
  } finally {
    isSubmitting.value = false
  }
  BeeMessage.success('保存成功')
  await router.push({ name: KubernetesRouteNames.Namespace.List, params: { clusterUid: clusterUid.value } })
}

// ==================== Handler ====================
/**
 * 处理页面返回
 */
function handleBack() {
  router.back()
}

/**
 * 处理操作按钮组逻辑
 * @param value - 操作标识
 */
async function handleHeaderActions(value: string) {
  switch (value) {
    case 'submit': {
      await handleSubmit()
      break
    }
  }
}

// ==================== Lifecycle ====================
onMounted(() => {
  void fetchNamespaceYaml()
})
</script>

<style lang="scss" scoped>
.page-body {
  display: flex;
  gap: 16px;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow: hidden;

  &__editor {
    flex: 1;
    min-height: 0;
  }
}
</style>
