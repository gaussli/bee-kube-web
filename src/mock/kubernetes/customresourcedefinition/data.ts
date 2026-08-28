import type {
  CustomResourceDefinitionDetailVo,
  CustomResourceDefinitionListVo,
} from '@/types/kubernetes/customresourcedefinition'
import type { EventListVo } from '@/types/kubernetes/event'

export const mockCustomResourceDefinitionList: CustomResourceDefinitionListVo[] = []

export const mockCustomResourceDefinitionDetail: CustomResourceDefinitionDetailVo = {}

export const mockCustomResourceDefinitionYaml: string = ``

export const mockCustomResourceDefinitionEventList: EventListVo[] = []
