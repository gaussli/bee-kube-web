# Service 功能

## 查看 Service 列表
- 页面效果
  - 触发条件：功能菜单“Service 管理”点击
  - 权限限制：`kubernetes:network:service:view`
  - 路由跳转
    - Name: `kubernetes:network:service`
    - Path: `/kubernetes/clusters/:clusterUid/services`
    - Component: `/src/view/kubernetes/network/service/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/services`
  - Function: `PageVo<ServiceListVo> getServiceList(clusterUid: string, namespace: string, params: Partial<ServiceQueryForm>)`
    - clusterUid: string （集群 UID）
    - `ServiceQueryForm`（Service 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Service 名称）
      - namespace: string （命名空间名称）
      - type: ServiceType （Service 类型，来自 `/src/config/kubernetes/network/service.ts`）
      - labelSelector: Record<string, string> （标签过滤）
    - `ServiceListVo`（Service 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （Service 名称）
      - description?: string （Service 描述）
      - type: ServiceType （Service 类型，来自 `/src/config/kubernetes/network/service.ts`）
      - clusterIp: string （集群内部 IP）
      - ports?: ServicePort[] （端口配置列表）
      - selector: Record<string, string> （标签选择器，匹配目标 Pod 的标签）
      - externalName: string （外部域名，仅 ExternalName 类型生效）
      - headless: boolean （是否为 Headless Service）
- Mock
  - 函数：`/src/mock/kubernetes/network/service.ts#getServiceListMock()`
  - 数据：`/src/mock/kubernetes/network/serviceData.ts#mockServices`，模拟数量：32
  - 逻辑
    - 基于 `mockServices` 进行 `namespace` 精准过滤，得到 `filteredNamespace`
    - 基于 `filteredNamespace` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filteredNamespace` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 Service 详情
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“详情”按钮点击
  - 权限限制：`kubernetes:network:service:view`
  - 路由跳转
    - Name: `kubernetes:network:service:detail`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name`
    - Component: `/src/view/kubernetes/network/service/detail/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name`
  - Function: `ServiceDetailVo getServiceDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Service 名称）
    - `ServiceDetailVo`（Service 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （Service 描述）
      - metadata: ObjectMeta （Service 的资源元数据，详见 ### ObjectMeta）
      - spec: ServiceSpec （Service 的规格定义，详见 ### ServiceSpec）
      - statusObj: ServiceStatusObj （Service 的观测状态，详见 ### ServiceStatusObj）
- Mock
  - 函数：`/src/mock/kubernetes/network/service.ts#getServiceDetailMock()`
  - 数据：`/src/mock/kubernetes/network/serviceData.ts#mockServiceDetail`
  - 逻辑：直接返回 `mockServiceDetail`

## 查看 Service YAML
- 页面效果
  - 触发条件：详情页 -> “YAML” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/yaml`
  - Function: `ServiceYamlVo getServiceYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Service 名称）
- Mock
  - 函数：`/src/mock/kubernetes/network/service.ts#getServiceYamlMock()`
  - 数据：`/src/mock/kubernetes/network/serviceData.ts#mockServiceYaml`
  - 逻辑：直接返回 `mockServiceYaml`

## 查看 Service Endpoint 列表
- 页面效果
  - 触发条件：详情页 -> “Endpoint” TAB 点击
- API 接口
  - 待补充
- Mock
  - 函数：`/src/mock/kubernetes/network/service.ts#getServiceEndpointListMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 创建 Service
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “创建”按钮点击
  - 权限限制：`kubernetes:network:service:create`
  - 路由跳转
    - Name: `kubernetes:network:service:create`
    - Path: `/kubernetes/clusters/:clusterUid/services/create`
    - Component: `/src/view/kubernetes/network/service/create/index.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/services`
  - Function: `void createService(clusterUid: string, data: Partial<ServiceCreateForm>)`
    - clusterUid: string （集群 UID）
    - `ServiceCreateForm`（Service 创建请求对象）
      - description?: string （Service 描述）
      - metadata: ObjectMeta （Service 的资源元数据，详见 ### ObjectMeta）
      - spec: ServiceSpec （Service 的规格定义，详见 ### ServiceSpec）
  - Permission: `kubernetes:network:service:create`
- Mock
  - 函数：`/src/mock/kubernetes/network/service.ts#createServiceMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 创建 Service（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “YAML”按钮点击
  - 权限限制：`kubernetes:network:service:create`
  - 路由跳转
    - Name: `kubernetes:network:service:create:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/services/create/yaml`
    - Component: `/src/view/kubernetes/network/service/create/yaml.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/services/yaml`
  - Function: `void createServiceYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （Service YAML 字符串）
  - Permission: `kubernetes:network:service:create`
- Mock
  - 函数：`/src/mock/kubernetes/network/service.ts#createServiceYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 更新 Service
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑应用”按钮点击
  - 权限限制：`kubernetes:network:service:edit`
  - 路由跳转
    - Name: `kubernetes:network:service:edit`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/edit`
    - Component: `/src/view/kubernetes/network/service/edit.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name`
  - Function: `void updateService(clusterUid: string, data: ServiceUpdateForm)`
    - clusterUid: string （集群 UID）
    - `ServiceUpdateForm`（Service 更新请求对象）
      - description?: string （Service 描述）
      - metadata: ObjectMeta （Service 的资源元数据，详见 ### ObjectMeta）
      - spec: ServiceSpec （Service 的规格定义，详见 ### ServiceSpec）
  - Permission: `kubernetes:network:service:edit`
- Mock
  - 函数：`/src/mock/kubernetes/network/service.ts#updateServiceMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 更新 Service（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑YAML”按钮点击
  - 权限限制：`kubernetes:network:service:edit`
  - 路由跳转
    - Name: `kubernetes:network:service:edit:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/edit/yaml`
    - Component: `/src/view/kubernetes/network/service/edit/yaml.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/yaml`
  - Function: `void updateServiceYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Service 名称）
    - yaml: string （Service YAML 字符串）
  - Permission: `kubernetes:network:service:edit`
- Mock
  - 函数：`/src/mock/kubernetes/network/service.ts#updateServiceYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 管理 Service 标签
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改标签”按钮点击
  - 权限限制：`kubernetes:network:service:edit`
  - 路由跳转
    - Name: `kubernetes:network:service:edit:labels`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/edit/labels`
    - Component: `/src/view/kubernetes/network/service/edit/labels.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/labels`
  - Function: `void manageServiceLabels(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Service 名称）
    - `MetadataLabelForm`（管理标签请求对象，来自 `/src/types/kubernetes/common.ts`）
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/network/service.ts#manageServiceLabelsMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 管理 Service 注解
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改注解”按钮点击
  - 权限限制：`kubernetes:network:service:edit`
  - 路由跳转
    - Name: `kubernetes:network:service:edit:annotations`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/edit/annotations`
    - Component: `/src/view/kubernetes/network/service/edit/annotations.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/annotations`
  - Function: `void manageServiceAnnotations(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Service 名称）
    - `MetadataAnnotationForm`（管理注解请求对象，来自 `/src/types/kubernetes/common.ts`）
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/network/service.ts#manageServiceAnnotationsMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 删除 Service
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“删除应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:network:service:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name`
  - Function: `void deleteService(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Service 名称）
  - Permission: `kubernetes:network:service:delete`
- Mock
  - 函数：`/src/mock/kubernetes/network/service.ts#deleteServiceMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 批量删除 Service
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “删除”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:network:service:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/services`
  - Function: `void deleteServices(clusterUid: string, namespace: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - uids: string[] （Service UID 列表）
  - Permission: `kubernetes:network:service:delete`
- Mock
  - 函数：`/src/mock/kubernetes/network/service.ts#deleteServicesMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 导入 Service
- 页面效果
  - 待补充
- API 接口
  - 待补充
- Mock
  - 函数：`/src/mock/kubernetes/network/service.ts#importServiceMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 导出 Service
- 页面效果
  - 待补充
- API 接口
  - 待补充
- Mock
  - 函数：`/src/mock/kubernetes/network/service.ts#exportServiceMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

---

# Ingress 功能

## 查看 Ingress 列表
- 页面效果
  - 触发条件：功能菜单“Ingress 管理”点击
  - 权限限制：`kubernetes:network:ingress:view`
  - 路由跳转
    - Name: `kubernetes:network:ingress`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses`
    - Component: `/src/view/kubernetes/network/ingress/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses`
  - Function: `PageVo<IngressListVo> getIngressList(clusterUid: string, namespace: string, params: Partial<IngressQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - `IngressQueryForm`（Ingress 查询条件请求对象） 继承 `PageForm`
      - name: string （Ingress 名称，模糊匹配）
      - ingressClassName?: string （Ingress 类名）
      - labelSelector: string （标签选择器，key=value 格式，多个用逗号分隔）
    - `IngressListVo`（Ingress 列表项响应对象） 继承 `Namespaced`
      - uid: string （资源 UID）
      - name: string （Ingress 名称）
      - description: string （Ingress 描述，取自 annotations.bee.kube/description）
      - ingressClassName?: string （Ingress 类名）
      - loadBalancer?: IngressLoadBalancer[] （负载均衡器入口地址列表）
      - rules: IngressRule[] （转发规则列表）
      - tls?: IngressTLS[] （TLS 证书配置列表）
- Mock
  - 函数：`/src/mock/kubernetes/network/ingress.ts#getIngressListMock()`
  - 数据：`/src/mock/kubernetes/network/ingressData.ts#mockIngresses`，模拟数量：32
  - 逻辑
    - 基于 `mockIngresses` 进行 `namespace` 精准过滤，得到 `filteredNamespace`
    - 基于 `filteredNamespace` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filteredNamespace` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 Ingress 详情
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“详情”按钮点击
  - 权限限制：`kubernetes:network:ingress:view`
  - 路由跳转
    - Name: `kubernetes:network:ingress:detail`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name`
    - Component: `/src/view/kubernetes/network/ingress/detail/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name`
  - Function: `IngressListVo getIngressDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Ingress 名称）
- Mock
  - 函数：`/src/mock/kubernetes/network/ingress.ts#getIngressDetailMock()`
  - 数据：`/src/mock/kubernetes/network/ingressData.ts#mockIngressDetail`
  - 逻辑：直接返回 `mockIngressDetail`

## 查看 Ingress YAML
- 页面效果
  - 触发条件：详情页 -> “YAML” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/yaml`
  - Function: `IngressYamlVo getIngressYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Ingress 名称）
- Mock
  - 函数：`/src/mock/kubernetes/network/ingress.ts#getIngressYamlMock()`
  - 数据：`/src/mock/kubernetes/network/ingressData.ts#mockIngressYaml`
  - 逻辑：直接返回 `mockIngressYaml`

## 创建 Ingress
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “创建”按钮点击
  - 权限限制：`kubernetes:network:ingress:create`
  - 路由跳转
    - Name: `kubernetes:network:ingress:create`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/create`
    - Component: `/src/view/kubernetes/network/ingress/create.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses`
  - Function: `void createIngress(clusterUid: string, data: IngressCreateForm)`
    - clusterUid: string （集群 UID）
    - `IngressCreateForm`（Ingress 创建请求对象）
      - name: string （Ingress 名称）
      - namespace: string （命名空间名称）
      - ingressClassName?: string （Ingress 类名）
      - rules: IngressRule[] （转发规则列表）
      - tls?: IngressTLS[] （TLS 证书配置列表）
      - labels?: Record<string, string> （标签）
      - annotations?: Record<string, string> （注解）
  - Permission: `kubernetes:network:ingress:create`
- Mock
  - 函数：`/src/mock/kubernetes/network/ingress.ts#createIngressMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 创建 Ingress（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “YAML”按钮点击
  - 权限限制：`kubernetes:network:ingress:create`
  - 路由跳转
    - Name: `kubernetes:network:ingress:create:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/ingresses/create/yaml`
    - Component: `/src/view/kubernetes/network/ingress/create/yaml.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/ingresses/yaml`
  - Function: `void createIngressYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （Ingress YAML 字符串）
  - Permission: `kubernetes:network:ingress:create`
- Mock
  - 函数：`/src/mock/kubernetes/network/ingress.ts#createIngressYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 更新 Ingress
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑应用”按钮点击
  - 权限限制：`kubernetes:network:ingress:edit`
  - 路由跳转
    - Name: `kubernetes:network:ingress:edit`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/edit`
    - Component: `/src/view/kubernetes/network/ingress/edit.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name`
  - Function: `void updateIngress(clusterUid: string, data: IngressUpdateForm)`
    - clusterUid: string （集群 UID）
    - `IngressUpdateForm`（Ingress 更新请求对象）
      - name: string （Ingress 名称）
      - namespace: string （命名空间名称）
      - ingressClassName?: string （Ingress 类名）
      - rules: IngressRule[] （转发规则列表）
      - tls?: IngressTLS[] （TLS 证书配置列表）
      - labels?: Record<string, string> （标签）
      - annotations?: Record<string, string> （注解）
  - Permission: `kubernetes:network:ingress:edit`
- Mock
  - 函数：`/src/mock/kubernetes/network/ingress.ts#updateIngressMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 更新 Ingress（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑YAML”按钮点击
  - 权限限制：`kubernetes:network:ingress:edit`
  - 路由跳转
    - Name: `kubernetes:network:ingress:edit:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/edit/yaml`
    - Component: `/src/view/kubernetes/network/ingress/edit/yaml.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/yaml`
  - Function: `void updateIngressYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Ingress 名称）
    - yaml: string （Ingress YAML 字符串）
  - Permission: `kubernetes:network:ingress:edit`
- Mock
  - 函数：`/src/mock/kubernetes/network/ingress.ts#updateIngressYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 管理 Ingress 标签
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改标签”按钮点击
  - 权限限制：`kubernetes:network:ingress:edit`
  - 路由跳转
    - Name: `kubernetes:network:ingress:edit:labels`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/edit/labels`
    - Component: `/src/view/kubernetes/network/ingress/edit/labels.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/labels`
  - Function: `void manageIngressLabels(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Ingress 名称）
    - `MetadataLabelForm`（管理标签请求对象，来自 `/src/types/kubernetes/common.ts`）
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/network/ingress.ts#manageIngressLabelsMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 管理 Ingress 注解
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改注解”按钮点击
  - 权限限制：`kubernetes:network:ingress:edit`
  - 路由跳转
    - Name: `kubernetes:network:ingress:edit:annotations`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/edit/annotations`
    - Component: `/src/view/kubernetes/network/ingress/edit/annotations.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/annotations`
  - Function: `void manageIngressAnnotations(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Ingress 名称）
    - `MetadataAnnotationForm`（管理注解请求对象，来自 `/src/types/kubernetes/common.ts`）
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/network/ingress.ts#manageIngressAnnotationsMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 删除 Ingress
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“删除应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:network:ingress:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name`
  - Function: `void deleteIngress(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Ingress 名称）
  - Permission: `kubernetes:network:ingress:delete`
- Mock
  - 函数：`/src/mock/kubernetes/network/ingress.ts#deleteIngressMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 批量删除 Ingress
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “删除”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:network:ingress:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses`
  - Function: `void deleteIngresses(clusterUid: string, namespace: string, names: string[])`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - names: string[] （Ingress 名称列表）
  - Permission: `kubernetes:network:ingress:delete`
- Mock
  - 函数：`/src/mock/kubernetes/network/ingress.ts#deleteIngressesMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 导入 Ingress
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导入”按钮点击，弹框（BeeDialog）进行文档上传
  - 权限限制：`kubernetes:network:ingress:import`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/import`
  - Function: `void importIngress(clusterUid: string, namespace: string, formData: FormData, onProgress?: (progressEvent: AxiosProgressEvent) => void)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - formData: FormData （上传的文件）
    - onProgress?: (progressEvent: AxiosProgressEvent) => void （上传进度回调）
  - Permission: `kubernetes:network:ingress:import`
- Mock
  - 函数：`/src/mock/kubernetes/network/ingress.ts#importIngressMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 导出 Ingress
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导出”按钮点击，保存文档
  - 权限限制：`kubernetes:network:ingress:export`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/export`
  - Function: `void exportIngress(clusterUid: string, namespace: string, params: Partial<IngressQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - `IngressQueryForm` 共享【查看 Ingress 列表】章节的实体定义
  - Permission: `kubernetes:network:ingress:export`
- Mock
  - 函数：`/src/mock/kubernetes/network/ingress.ts#exportIngressMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

# NetworkPolicy 功能

## 查看 NetworkPolicy 列表
- 页面效果
  - 触发条件：功能菜单“NetworkPolicy 管理”点击
  - 权限限制：`kubernetes:network:networkpolicy:view`
  - 路由跳转
    - Name: `kubernetes:network:networkpolicy`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies`
    - Component: `/src/view/kubernetes/network/networkpolicy/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies`
  - Function: `PageVo<NetworkPolicyListVo> getNetworkPolicyList(clusterUid: string, namespace: string, params: Partial<NetworkPolicyQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - `NetworkPolicyQueryForm`（NetworkPolicy 查询条件请求对象） 继承 `PageForm`
      - name: string （NetworkPolicy 名称，模糊匹配）
      - labelSelector: string （标签选择器）
    - `NetworkPolicyListVo`（NetworkPolicy 列表项响应对象） 继承 `AuditEntity`
      - name: string （NetworkPolicy 名称）
      - namespace: string （命名空间名称）
      - clusterUid: string （所属集群 UID）
      - clusterName?: string （所属集群名称）
      - podSelector: Record<string, string> （Pod 选择器）
      - policyTypes?: string[] （策略类型列表，如 Ingress、Egress）
      - deletable?: boolean （是否可删除）
- Mock
  - 函数：`/src/mock/kubernetes/network/networkpolicy.ts#getNetworkPolicyListMock()`
  - 数据：`/src/mock/kubernetes/network/networkpolicyData.ts#mockNetworkPolicies`，模拟数量：32
  - 逻辑
    - 基于 `mockNetworkPolicies` 进行 `namespace` 精准过滤，得到 `filteredNamespace`
    - 基于 `filteredNamespace` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filteredNamespace` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 NetworkPolicy 详情
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“详情”按钮点击
  - 权限限制：`kubernetes:network:networkpolicy:view`
  - 路由跳转
    - Name: `kubernetes:network:networkpolicy:detail`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name`
    - Component: `/src/view/kubernetes/network/networkpolicy/detail/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name`
  - Function: `NetworkPolicyDetailVo getNetworkPolicyDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （NetworkPolicy 名称）
    - `NetworkPolicyDetailVo`（NetworkPolicy 详情响应对象） 继承 `AuditEntity`
      - name: string （NetworkPolicy 名称）
      - namespace: string （命名空间名称）
      - clusterUid: string （所属集群 UID）
      - clusterName?: string （所属集群名称）
      - podSelector: Record<string, string> （Pod 选择器）
      - ingress?: NetworkPolicyIngressRule[] （入方向规则列表）
      - egress?: NetworkPolicyEgressRule[] （出方向规则列表）
      - policyTypes?: string[] （策略类型列表）
      - labels?: Record<string, string> （标签）
      - annotations?: Record<string, string> （注解）
- Mock
  - 函数：`/src/mock/kubernetes/network/networkpolicy.ts#getNetworkPolicyDetailMock()`
  - 数据：`/src/mock/kubernetes/network/networkpolicyData.ts#mockNetworkPolicyDetail`
  - 逻辑：直接返回 `mockNetworkPolicyDetail`

## 查看 NetworkPolicy YAML
- 页面效果
  - 触发条件：详情页 -> “YAML” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/yaml`
  - Function: `NetworkPolicyYamlVo getNetworkPolicyYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （NetworkPolicy 名称）
- Mock
  - 函数：`/src/mock/kubernetes/network/networkpolicy.ts#getNetworkPolicyYamlMock()`
  - 数据：`/src/mock/kubernetes/network/networkpolicyData.ts#mockNetworkPolicyYaml`
  - 逻辑：直接返回 `mockNetworkPolicyYaml`

## 创建 NetworkPolicy
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “创建”按钮点击
  - 权限限制：`kubernetes:network:networkpolicy:create`
  - 路由跳转
    - Name: `kubernetes:network:networkpolicy:create`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/create`
    - Component: `/src/view/kubernetes/network/networkpolicy/create.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies`
  - Function: `void createNetworkPolicy(clusterUid: string, data: NetworkPolicyCreateForm)`
    - clusterUid: string （集群 UID）
    - `NetworkPolicyCreateForm`（NetworkPolicy 创建请求对象）
      - name: string （NetworkPolicy 名称）
      - namespace: string （命名空间名称）
      - podSelector: Record<string, string> （Pod 选择器）
      - ingress?: NetworkPolicyIngressRule[] （入方向规则列表）
      - egress?: NetworkPolicyEgressRule[] （出方向规则列表）
      - policyTypes?: ('Ingress' | 'Egress')[] （策略类型列表）
      - labels?: Record<string, string> （标签）
      - annotations?: Record<string, string> （注解）
  - Permission: `kubernetes:network:networkpolicy:create`
- Mock
  - 函数：`/src/mock/kubernetes/network/networkpolicy.ts#createNetworkPolicyMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 创建 NetworkPolicy（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “YAML”按钮点击
  - 权限限制：`kubernetes:network:networkpolicy:create`
  - 路由跳转
    - Name: `kubernetes:network:networkpolicy:create:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/networkpolicies/create/yaml`
    - Component: `/src/view/kubernetes/network/networkpolicy/create/yaml.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/networkpolicies/yaml`
  - Function: `void createNetworkPolicyYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （NetworkPolicy YAML 字符串）
  - Permission: `kubernetes:network:networkpolicy:create`
- Mock
  - 函数：`/src/mock/kubernetes/network/networkpolicy.ts#createNetworkPolicyYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 更新 NetworkPolicy
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑应用”按钮点击
  - 权限限制：`kubernetes:network:networkpolicy:edit`
  - 路由跳转
    - Name: `kubernetes:network:networkpolicy:edit`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/edit`
    - Component: `/src/view/kubernetes/network/networkpolicy/edit.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name`
  - Function: `void updateNetworkPolicy(clusterUid: string, data: NetworkPolicyUpdateForm)`
    - clusterUid: string （集群 UID）
    - `NetworkPolicyUpdateForm`（NetworkPolicy 更新请求对象）
      - name: string （NetworkPolicy 名称）
      - namespace: string （命名空间名称）
      - podSelector: Record<string, string> （Pod 选择器）
      - ingress?: NetworkPolicyIngressRule[] （入方向规则列表）
      - egress?: NetworkPolicyEgressRule[] （出方向规则列表）
      - policyTypes?: ('Ingress' | 'Egress')[] （策略类型列表）
      - labels?: Record<string, string> （标签）
      - annotations?: Record<string, string> （注解）
  - Permission: `kubernetes:network:networkpolicy:edit`
- Mock
  - 函数：`/src/mock/kubernetes/network/networkpolicy.ts#updateNetworkPolicyMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 更新 NetworkPolicy（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑YAML”按钮点击
  - 权限限制：`kubernetes:network:networkpolicy:edit`
  - 路由跳转
    - Name: `kubernetes:network:networkpolicy:edit:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/edit/yaml`
    - Component: `/src/view/kubernetes/network/networkpolicy/edit/yaml.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/yaml`
  - Function: `void updateNetworkPolicyYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （NetworkPolicy 名称）
    - yaml: string （NetworkPolicy YAML 字符串）
  - Permission: `kubernetes:network:networkpolicy:edit`
- Mock
  - 函数：`/src/mock/kubernetes/network/networkpolicy.ts#updateNetworkPolicyYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 管理 NetworkPolicy 标签
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改标签”按钮点击
  - 权限限制：`kubernetes:network:networkpolicy:edit`
  - 路由跳转
    - Name: `kubernetes:network:networkpolicy:edit:labels`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/edit/labels`
    - Component: `/src/view/kubernetes/network/networkpolicy/edit/labels.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/labels`
  - Function: `void manageNetworkPolicyLabels(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （NetworkPolicy 名称）
    - `MetadataLabelForm`（管理标签请求对象，来自 `/src/types/kubernetes/common.ts`）
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/network/networkpolicy.ts#manageNetworkPolicyLabelsMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 管理 NetworkPolicy 注解
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改注解”按钮点击
  - 权限限制：`kubernetes:network:networkpolicy:edit`
  - 路由跳转
    - Name: `kubernetes:network:networkpolicy:edit:annotations`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/edit/annotations`
    - Component: `/src/view/kubernetes/network/networkpolicy/edit/annotations.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/annotations`
  - Function: `void manageNetworkPolicyAnnotations(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （NetworkPolicy 名称）
    - `MetadataAnnotationForm`（管理注解请求对象，来自 `/src/types/kubernetes/common.ts`）
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/network/networkpolicy.ts#manageNetworkPolicyAnnotationsMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 删除 NetworkPolicy
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“删除应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:network:networkpolicy:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name`
  - Function: `void deleteNetworkPolicy(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （NetworkPolicy 名称）
  - Permission: `kubernetes:network:networkpolicy:delete`
- Mock
  - 函数：`/src/mock/kubernetes/network/networkpolicy.ts#deleteNetworkPolicyMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 批量删除 NetworkPolicy
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “删除”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:network:networkpolicy:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies`
  - Function: `void deleteNetworkPolicys(clusterUid: string, namespace: string, names: string[])`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - names: string[] （NetworkPolicy 名称列表）
  - Permission: `kubernetes:network:networkpolicy:delete`
- Mock
  - 函数：`/src/mock/kubernetes/network/networkpolicy.ts#deleteNetworkPolicysMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 导入 NetworkPolicy
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导入”按钮点击，弹框（BeeDialog）进行文档上传
  - 权限限制：`kubernetes:network:networkpolicy:import`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/import`
  - Function: `void importNetworkPolicy(clusterUid: string, namespace: string, formData: FormData, onProgress?: (progressEvent: AxiosProgressEvent) => void)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - formData: FormData （上传的文件）
    - onProgress?: (progressEvent: AxiosProgressEvent) => void （上传进度回调）
  - Permission: `kubernetes:network:networkpolicy:import`
- Mock
  - 函数：`/src/mock/kubernetes/network/networkpolicy.ts#importNetworkPolicyMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 导出 NetworkPolicy
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导出”按钮点击，保存文档
  - 权限限制：`kubernetes:network:networkpolicy:export`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/export`
  - Function: `void exportNetworkPolicy(clusterUid: string, namespace: string, params: Partial<NetworkPolicyQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - `NetworkPolicyQueryForm` 共享【查看 NetworkPolicy 列表】章节的实体定义
  - Permission: `kubernetes:network:networkpolicy:export`
- Mock
  - 函数：`/src/mock/kubernetes/network/networkpolicy.ts#exportNetworkPolicyMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

---

