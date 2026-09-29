<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeeBackHeader :actions="actionItems" title="创建资源定义 YAML" @action="handleHeaderActions" @back="handleBack" />

    <!-- 编辑器 Body -->
    <BeeCard class="page-body">
      <BeeCodeEditor v-model="yamlText" class="page-body__editor" />
    </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { createCustomResourceDefinitionYaml } from '@/api/kubernetes/customresourcedefinition'

import { KubernetesRouteNames } from '@/router/names.ts'

import BeeCodeEditor from '@/components/base/BeeCodeEditor/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeeBackHeader, { type ActionItem } from '@/components/business/BeeBackHeader/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

defineOptions({ name: 'CustomResourceDefinitionCreateYaml' })

const route = useRoute()
const router = useRouter()

/** 资源定义 YAML 模板 */
const YAML_TEMPLATE = `apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: myresources.example.com
spec:
  group: example.com
  scope: Namespaced
  names:
    plural: myresources
    singular: myresource
    kind: MyResource
    listKind: MyResourceList
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object`

// ==================== Reactive State ====================
/** YAML 内容 */
const yamlText = ref<string>(YAML_TEMPLATE)
/** 是否正在提交 */
const isSubmitting = ref<boolean>(false)

// ==================== Computed ====================
/** 所属集群 UID（路由参数） */
const clusterUid = computed(() => route.params.clusterUid as string)
/** 头部操作按钮组 */
const actionItems = computed<ActionItem[]>(() => [
  {
    value: 'submit',
    label: '创建',
    icon: 'basic-right',
    type: 'success',
    loading: isSubmitting.value,
  },
])

// ==================== Method ====================
/**
 * 提交创建
 * @description 仅做非空校验，YAML 语法与字段合法性由接口返回；成功后返回列表
 */
async function handleSubmit() {
  if (!yamlText.value.trim()) {
    BeeMessage.error('YAML 内容不能为空')
    return
  }
  isSubmitting.value = true
  try {
    await createCustomResourceDefinitionYaml(clusterUid.value, yamlText.value)
  } catch {
    BeeMessage.error('创建资源定义失败')
    return
  } finally {
    isSubmitting.value = false
  }
  BeeMessage.success('创建成功')
  await router.push({
    name: KubernetesRouteNames.CustomResourceDefinition.List,
    params: { clusterUid: clusterUid.value },
  })
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
