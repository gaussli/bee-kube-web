# Deployment 功能

## 查看 Deployment 列表
- 页面效果
  - 触发条件：功能菜单“Deployment 管理”点击
  - 权限限制：`kubernetes:workload:deployment:view`
  - 路由跳转
    - Name: `kubernetes:workload:deployment`
    - Path: `/kubernetes/clusters/:clusterUid/deployments`
    - Component: `/src/view/kubernetes/workload/deployment/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/deployments`
  - Function: `PageVo<DeploymentListVo> getDeploymentList(clusterUid: string, params: Partial<DeploymentQueryForm>)`
    - clusterUid: string （集群 UID）
    - `DeploymentQueryForm`（Deployment 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Deployment 名称）
      - namespace: string （命名空间名称）
      - status: `DeploymentStatus` （状态，来自 `/src/config/kubernetes/workload/deployment.ts`）
      - labelSelector: Record<string, string> （标签过滤）
    - `DeploymentListVo`（Deployment 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （Deployment 名称）
      - description?: string （Deployment 描述）
      - status: `DeploymentStatus` （状态，来自 `/src/config/kubernetes/workload/deployment.ts`）
      - statusMsg?: string （状态信息）
      - replicas: number （期望副本数）
      - readyReplicas: number （就绪副本数）
      - updateStrategyType: `DeploymentUpdateStrategyType` （更新策略，来自 `/src/config/kubernetes/workload/deployment.ts`））
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#getDeploymentListMock()`
  - 数据：`/src/mock/kubernetes/workload/deploymentData.ts#mockDeployments`，模拟数量：32
  - 逻辑
    - 基于 `mockDeployments` 进行 `status` 精准过滤，得到 `filtered`
    - 基于 `filtered` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filtered` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 Deployment 详情
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“详情”按钮点击
  - 权限限制：`kubernetes:workload:deployment:view`
  - 路由跳转
    - Name: `kubernetes:workload:deployment:detail`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name`
    - Component: `/src/view/kubernetes/workload/deployment/detail/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name`
  - Function: `DeploymentDetailVo getDeploymentDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentDetailVo`（Deployment 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （Deployment 描述）
      - status: `DeploymentStatus` （状态，来自 `/src/config/kubernetes/workload/deployment.ts`）
      - statusMsg?: string （状态信息）
      - metadata: `ObjectMeta` （Deployment 的资源元数据，详见 ### ObjectMeta）
      - spec: `DeploymentSpec` （Deployment 的规格定义，详见 ### DeploymentSpec）
      - statusObj: `DeploymentStatusObj` （Deployment 的观测状态，详见 ### DeploymentStatusObj）
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#getDeploymentDetailMock()`
  - 数据：`/src/mock/kubernetes/workload/deploymentData.ts#mockDeploymentDetail`
  - 逻辑：直接返回 `mockDeploymentDetail`

## 查看 Deployment YAML
- 页面效果
  - 触发条件：详情页 -> “YAML” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/yaml`
  - Function: `DeploymentYamlVo getDeploymentYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentYamlVo`: （Deployment YAML 响应对象）
      - yaml: string（Deployment YAML 文本）
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#getDeploymentYamlMock()`
  - 数据：`/src/mock/kubernetes/workload/deploymentData.ts#mockDeploymentYaml`
  - 逻辑：直接返回 `mockDeploymentYaml`

## 查看 Deployment 关联 Pod 列表
- 页面效果
  - 触发条件：详情页 -> “容器组” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/pods`
  - Function: `PageVo<DeploymentPodListVo> getDeploymentPodList(clusterUid: string, namespace: string, name: string, params: Partial<DeploymentPodQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentPodQueryForm`（Deployment 关联 Pod 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Pod 名称）
      - status: PodStatus （Pod 状态）
    - `DeploymentPodListVo` （Deployment 关联 Pod 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
      - name: string （Pod 名称）
      - ip: string （Pod IP）
      - status: PodStatus （Pod 状态）
      - statusMsg: string （Pod 状态信息）
      - restarts: number （Pod 重启次数）
      - nodeIp: string （Pod 所属节点 IP）
      - nodeName: string （Pod 所属节点名称）
      - readyContainerCount: number （Pod 就绪容器数量）
      - containerCount: number （Pod 容器总数）
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#getDeploymentPodListMock()`
  - 数据：`/src/mock/kubernetes/workload/deploymentData.ts#mockDeploymentPods`，模拟数量：24
  - 逻辑
    - 基于 `mockDeploymentPods` 进行 `status` 精准过滤，得到 `filtered`
    - 基于 `filtered` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filtered` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 Deployment 历史版本列表
- 页面效果
  - 触发条件：详情页 -> “部署历史” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/history`
  - Function: `PageVo<DeploymentHistoryRevisionListVo> getDeploymentHistoryRevisionList(clusterUid: string, namespace: string, name: string, params: Partial<DeploymentHistoryRevisionQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentHistoryRevisionQueryForm`（Deployment 历史版本查询条件请求对象） 继承 `PageForm`
      - revision: number （版本名称）
      - changeCause: string （变更原因）
    - `DeploymentHistoryRevisionListVo` （Deployment 历史版本列表项响应对象） 继承 `HistoryRevision`
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#getDeploymentHistoryRevisionListMock()`
  - 数据：`/src/mock/kubernetes/workload/deploymentData.ts#mockDeploymentHistoryRevisions`，模拟数量：24
  - 逻辑
    - 基于 `mockDeploymentHistoryRevisions` 进行 `revision` 精准过滤和 `changeCause` 模糊过滤，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 Deployment 关联网络资源
- 页面效果
  - 触发条件：详情页 -> “关联网络” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/network`
  - Function: `DeploymentNetworkVo getDeploymentNetwork(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentNetworkVo` （Deployment 关联网络资源响应对象）
      - services: DeploymentServiceListVo[] （关联的 Service 列表）
      - ingresses: DeploymentIngressListVo[] （关联的 Ingress 列表）
      - `DeploymentServiceListVo` （Deployment 关联 Service 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
        - name: string （Service 名称）
        - description: string （Service 描述）
        - type: ServiceType （Service 类型，来自 `/src/config/kubernetes/network/service.ts`）
        - clusterIp: string （集群内部 IP，ClusterIP / NodePort / LoadBalancer 类型自动分配）
        - externalName: string （外部域名，仅 ExternalName 类型生效）
        - headless: boolean （是否为 Headless Service，clusterIp 为 None）
      - `DeploymentIngressListVo` （Deployment 关联 Ingress 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
        - name: string （Ingress 名称）
        - description: string （Ingress 描述）
        - ingressClassName?: string （Ingress 类名，对应 IngressClassName 资源名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#getDeploymentNetworkMock()`
  - 数据
    - `/src/mock/kubernetes/workload/deploymentData.ts#mockDeploymentServices`，模拟数量：8
    - `/src/mock/kubernetes/workload/deploymentData.ts#mockDeploymentIngresses`，模拟数量：8
  - 逻辑
    - 直接基于 `mockDeploymentServices`、`mockDeploymentIngresses` 构建返回对象

## 查看 Deployment 事件列表
- 页面效果
  - 触发条件：详情页 -> “事件信息” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/events`
  - Function: `PageVo<EventListVo> getDeploymentEventList(clusterUid: string, namespace: string, name: string, params: Partial<EventQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `EventQueryForm`（事件查询条件请求对象，来自 `/src/types/kubernetes/event/index.ts`）
    - `EventListVo`（事件列表项响应对象，来自 `/src/types/kubernetes/event/index.ts`）
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#getDeploymentEventListMock()`
  - 数据：`/src/mock/kubernetes/workload/deploymentData.ts#mockDeploymentEvents`，模拟数量：24
  - 逻辑
    - 基于 `mockDeploymentEvents` 进行 `type` 精准过滤，得到 `filtered`
    - 基于 `filtered` 进行 `reason` 精准过滤，得到 `filteredReason`
    - 基于 `filtered` 进行 `note` 模糊过滤，得到 `filteredNote`
    - 基于 `filteredReason` 和 `filteredNote` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 Deployment 监控数据
- 页面效果
  - 触发条件：详情页 -> “监控数据” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/monitor`
  - Function: `DeploymentMonitorVo getDeploymentMonitor(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentMonitorVo` （Deployment 监控响应对象）
      - {TODO: DeploymentMonitorVo 对象属性}
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#getDeploymentMonitorMock()`
  - 数据：`/src/mock/kubernetes/workload/deploymentData.ts#mockDeploymentMonitor`，模拟数量：24
  - 逻辑
    - 直接返回 `mockDeploymentMonitor` {TODO：暂为空对象}

## 创建 Deployment
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “创建”按钮点击
  - 权限限制：`kubernetes:workload:deployment:create`
  - 路由跳转
    - Name: `kubernetes:workload:deployment:create`
    - Path: `/kubernetes/clusters/:clusterUid/deployments/create`
    - Component: `/src/view/kubernetes/workload/deployment/create/index.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/deployments`
  - Function: `void createDeployment(clusterUid: string, data: Partial<DeploymentCreateForm>)`
    - clusterUid: string （集群 UID）
    - `DeploymentCreateForm` （Deployment 创建请求对象）
      - description?: string （Deployment 描述）
      - metadata: ObjectMeta （Deployment 的资源元数据，详见 ### ObjectMeta）
      - spec: DeploymentSpec （Deployment 的规格定义，详见 ### DeploymentSpec）
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#createDeploymentMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 创建 Deployment（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “YAML”按钮点击
  - 权限限制：`kubernetes:workload:deployment:create`
  - 路由跳转
    - Name: `kubernetes:workload:deployment:create:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/deployments/create/yaml`
    - Component: `/src/view/kubernetes/workload/deployment/create/yaml.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/deployments/yaml`
  - Function: `void createDeploymentYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （Deployment YAML 字符串）
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#createDeploymentYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 更新 Deployment
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑应用”按钮点击
  - 权限限制：`kubernetes:workload:deployment:edit`
  - 路由跳转
    - Name: `kubernetes:workload:deployment:edit`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/edit`
    - Component: `/src/view/kubernetes/workload/deployment/edit/index.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name`
  - Function: `void updateDeployment(clusterUid: string, namespace: string, name: string, data: Partial<DeploymentUpdateForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentUpdateForm` （Deployment 更新请求对象）
      - description?: string （Deployment 描述）
      - metadata: ObjectMeta （Deployment 的资源元数据，详见 ### ObjectMeta）
      - spec: DeploymentSpec （Deployment 的规格定义，详见 ### DeploymentSpec）
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#updateDeploymentMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`
    

## 更新 Deployment（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑YAML”按钮点击
  - 权限限制：`kubernetes:workload:deployment:edit`
  - 路由跳转
    - Name: `kubernetes:workload:deployment:edit:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/edit/yaml`
    - Component: `/src/view/kubernetes/workload/deployment/edit/yaml.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/yaml`
  - Function: `void updateDeploymentYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - yaml: string （Deployment YAML 字符串）
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#updateDeploymentYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 管理 Deployment 标签
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改标签”按钮点击
  - 权限限制：`kubernetes:workload:deployment:edit`
  - 路由跳转
    - Name: `kubernetes:workload:deployment:edit:labels`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/edit/labels`
    - Component: `/src/view/kubernetes/workload/deployment/edit/labels.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/labels`
  - Function: `void manageDeploymentLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `MetadataLabelForm`（管理标签请求对象，来自 `/src/types/kubernetes/common.ts`）
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#manageDeploymentLabelMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 管理 Deployment 注解
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改注解”按钮点击
  - 权限限制：`kubernetes:workload:deployment:edit`
  - 路由跳转
    - Name: `kubernetes:workload:deployment:edit:annotations`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/edit/annotations`
    - Component: `/src/view/kubernetes/workload/deployment/edit/annotations.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/annotations`
  - Function: `void manageDeploymentAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `MetadataAnnotationForm`（管理注解请求对象，来自 `/src/types/kubernetes/common.ts`）
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#manageDeploymentAnnotationMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 删除 Deployment
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“删除应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:deployment:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name`
  - Function: `void deleteDeployment(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#deleteDeploymentMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 批量删除 Deployment
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “删除”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:deployment:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/deployments`
  - Function: `void deleteDeployments(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （Deployment UID 列表）
- Mock
  - 函数：`/src/mock/kubernetes/workload/deployment.ts#deleteDeploymentsMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 导入 Deployment
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导入”按钮点击，弹框（BeeDialog）进行文档上传
  - 权限限制：`kubernetes:workload:deployment:import`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/deployments/import`
  - Function: `void importDeployment(clusterUid: string, formData: FormData, onProgress?: (progressEvent: AxiosProgressEvent) => void)`
    - clusterUid: string （集群 UID）
    - formData: FormData （上传的文件）
    - onProgress?: (progressEvent: AxiosProgressEvent) => void （上传进度回调）- Mock
- 函数：`/src/mock/kubernetes/workload/deployment.ts#importDeploymentMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 导出 Deployment
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导出”按钮点击，保存文档
  - 权限限制：`kubernetes:workload:deployment:export`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/deployments/export`
  - Function: `void exportDeployment(clusterUid: string, params: Partial<DeploymentQueryForm>)`
    - clusterUid: string （集群 UID）
    - `DeploymentQueryForm` 共享【查看 Deployment 详情】章节的实体定义
- 函数：`/src/mock/kubernetes/workload/deployment.ts#exportDeploymentMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 扩缩容 Deployment
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“扩缩容”按钮点击，弹框（BeeDialog）输入副本数并确认
  - 权限限制：`kubernetes:workload:deployment:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/scale`
  - Function: `void scaleDeployment(clusterUid: string, namespace: string, name: string, data: DeploymentScaleForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentScaleForm` （Deployment 扩缩容请求对象）
      - replicas: number （期望副本数）
- 函数：`/src/mock/kubernetes/workload/deployment.ts#scaleDeploymentMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 重启 Deployment
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“重启应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:deployment:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/restart`
  - Function: `void restartDeployment(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
- 函数：`/src/mock/kubernetes/workload/deployment.ts#restartDeploymentMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 暂停 Deployment 更新
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“暂停更新”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:deployment:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/pause`
  - Function: `void pauseDeployment(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
- 函数：`/src/mock/kubernetes/workload/deployment.ts#pauseDeploymentMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 恢复 Deployment 更新
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“恢复更新”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:deployment:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/resume`
  - Function: `void resumeDeployment(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
- 函数：`/src/mock/kubernetes/workload/deployment.ts#resumeDeploymentMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 回滚 Deployment
- 页面效果
  - 触发条件：详情页 -> “部署历史” TAB 页 -> 部署历史表格 -> 行内“回滚到这”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:deployment:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/rollback`
  - Function: `void rollbackDeployment(clusterUid: string, namespace: string, name: string, data: DeploymentRollbackForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentRollbackForm` （Deployment 回滚请求对象）
      - revision: number （目标历史版本号）
- 函数：`/src/mock/kubernetes/workload/deployment.ts#rollbackDeploymentMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

# StatefulSet 功能

## 查看 StatefulSet 列表
- 页面效果
  - 触发条件：功能菜单“StatefulSet 管理”点击
  - 权限限制：`kubernetes:workload:statefulset:view`
  - 路由跳转
    - Name: `kubernetes:workload:statefulset`
    - Path: `/kubernetes/clusters/:clusterUid/statefulsets`
    - Component: `/src/view/kubernetes/workload/statefulset/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/statefulsets`
  - Function: `PageVo<StatefulSetListVo> getStatefulSetList(clusterUid: string, params: Partial<StatefulSetQueryForm>)`
    - clusterUid: string （集群 UID）
    - `StatefulSetQueryForm`（StatefulSet 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （StatefulSet 名称）
      - namespace: string （命名空间名称）
      - status: StatefulSetStatus （状态，来自 `/src/config/kubernetes/workload/statefulset.ts`）
      - labelSelector: Record<string, string> （标签过滤）
    - `StatefulSetListVo`（StatefulSet 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （StatefulSet 名称）
      - description?: string （StatefulSet 描述）
      - status: StatefulSetStatus （状态，来自 `/src/config/kubernetes/workload/statefulset.ts`）
      - statusMsg?: string （状态信息）
      - replicas: number （期望副本数）
      - readyReplicas: number （就绪副本数）
      - updateStrategyType: StatefulSetUpdateStrategyType （更新策略）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#getStatefulSetListMock()`
  - 数据：`/src/mock/kubernetes/workload/statefulsetData.ts#mockStatefulSets`，模拟数量：32
  - 逻辑
    - 基于 `mockStatefulSets` 进行 `status` 精准过滤，得到 `filtered`
    - 基于 `filtered` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filtered` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 StatefulSet 详情
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“详情”按钮点击
  - 权限限制：`kubernetes:workload:statefulset:view`
  - 路由跳转
    - Name: `kubernetes:workload:statefulset:detail`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name`
    - Component: `/src/view/kubernetes/workload/statefulset/detail/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name`
  - Function: `StatefulSetDetailVo getStatefulSetDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetDetailVo`（StatefulSet 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （StatefulSet 描述）
      - status: StatefulSetStatus （状态，来自 `/src/config/kubernetes/workload/statefulset.ts`）
      - statusMsg?: string （状态信息）
      - metadata: ObjectMeta （StatefulSet 的资源元数据，详见 ### ObjectMeta）
      - spec: StatefulSetSpec （StatefulSet 的规格定义，详见 ### StatefulSetSpec）
      - statusObj: StatefulSetStatusObj （StatefulSet 的观测状态，详见 ### StatefulSetStatusObj）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#getStatefulSetDetailMock()`
  - 数据：`/src/mock/kubernetes/workload/statefulsetData.ts#mockStatefulSetDetail`
  - 逻辑：直接返回 `mockStatefulSetDetail`

## 查看 StatefulSet YAML
- 页面效果
  - 触发条件：详情页 -> “YAML” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/yaml`
  - Function: `StatefulSetYamlVo getStatefulSetYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetYamlVo`: （StatefulSet YAML 响应对象）
      - yaml: string（StatefulSet YAML 文本）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#getStatefulSetYamlMock()`
  - 数据：`/src/mock/kubernetes/workload/statefulsetData.ts#mockStatefulSetYaml`
  - 逻辑：直接返回 `mockStatefulSetYaml`

## 查看 StatefulSet 关联 Pod 列表
- 页面效果
  - 触发条件：详情页 -> “容器组” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/pods`
  - Function: `PageVo<StatefulSetPodListVo> getStatefulSetPodList(clusterUid: string, namespace: string, name: string, params: Partial<StatefulSetPodQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetPodQueryForm`（StatefulSet 关联 Pod 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Pod 名称）
      - status: PodStatus （Pod 状态）
    - `StatefulSetPodListVo` （StatefulSet 关联 Pod 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
      - name: string （Pod 名称）
      - ip: string （Pod IP）
      - status: PodStatus （Pod 状态）
      - statusMsg: string （Pod 状态信息）
      - restarts: number （Pod 重启次数）
      - nodeIp: string （Pod 所属节点 IP）
      - nodeName: string （Pod 所属节点名称）
      - readyContainerCount: number （Pod 就绪容器数量）
      - containerCount: number （Pod 容器总数）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#getStatefulSetPodListMock()`
  - 数据：`/src/mock/kubernetes/workload/statefulsetData.ts#mockStatefulSetPods`，模拟数量：24
  - 逻辑
    - 基于 `mockStatefulSetPods` 进行 `status` 精准过滤，得到 `filtered`
    - 基于 `filtered` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filtered` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 StatefulSet 历史版本列表
- 页面效果
  - 触发条件：详情页 -> “部署历史” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/history`
  - Function: `PageVo<StatefulSetHistoryRevisionListVo> getStatefulSetHistoryRevisionList(clusterUid: string, namespace: string, name: string, params: Partial<StatefulSetHistoryRevisionQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetHistoryRevisionQueryForm`（StatefulSet 历史版本查询条件请求对象） 继承 `PageForm`
      - revision: number （版本名称）
      - changeCause: string （变更原因）
    - `StatefulSetHistoryRevisionListVo` （StatefulSet 历史版本列表项响应对象）继承 `HistoryRevision`
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#getStatefulSetHistoryRevisionListMock()`
  - 数据：`/src/mock/kubernetes/workload/statefulsetData.ts#mockStatefulSetHistoryRevisions`，模拟数量：24
  - 逻辑
    - 基于 `mockStatefulSetHistoryRevisions` 进行 `revision` 精准过滤和 `changeCause` 模糊过滤，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 StatefulSet 关联网络资源
- 页面效果
  - 触发条件：详情页 -> “关联网络” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/network`
  - Function: `StatefulSetNetworkVo getStatefulSetNetwork(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetNetworkVo` （StatefulSet 关联网络资源响应对象）
      - services: StatefulSetServiceListVo[] （关联的 Service 列表）
      - ingresses: StatefulSetIngressListVo[] （关联的 Ingress 列表）
      - `StatefulSetServiceListVo` （StatefulSet 关联 Service 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
        - name: string （Service 名称）
        - description: string （Service 描述）
        - type: ServiceType （Service 类型，来自 `/src/config/kubernetes/network/service.ts`）
        - clusterIp: string （集群内部 IP，ClusterIP / NodePort / LoadBalancer 类型自动分配）
        - externalName: string （外部域名，仅 ExternalName 类型生效）
        - headless: boolean （是否为 Headless Service，clusterIp 为 None；StatefulSet 通常依赖无头 Service 提供稳定网络标识）
      - `StatefulSetIngressListVo` （StatefulSet 关联 Ingress 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
        - name: string （Ingress 名称）
        - description: string （Ingress 描述）
        - ingressClassName?: string （Ingress 类名，对应 IngressClassName 资源名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#getStatefulSetNetworkMock()`
  - 数据
    - `/src/mock/kubernetes/workload/statefulsetData.ts#mockStatefulSetServices`，模拟数量：8
    - `/src/mock/kubernetes/workload/statefulsetData.ts#mockStatefulSetIngresses`，模拟数量：8
  - 逻辑
    - 直接基于 `mockStatefulSetServices`、`mockStatefulSetIngresses` 构建返回对象

## 查看 StatefulSet 事件列表
- 页面效果
  - 触发条件：详情页 -> “事件信息” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/events`
  - Function: `PageVo<EventListVo> getStatefulSetEventList(clusterUid: string, namespace: string, name: string, params: Partial<EventQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `EventQueryForm`（事件查询条件请求对象，来自 `/src/types/kubernetes/event/index.ts`）
    - `EventListVo`（事件列表项响应对象，来自 `/src/types/kubernetes/event/index.ts`）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#getStatefulSetEventListMock()`
  - 数据：`/src/mock/kubernetes/workload/statefulsetData.ts#mockStatefulSetEvents`，模拟数量：24
  - 逻辑
    - 基于 `mockStatefulSetEvents` 进行 `type` 精准过滤，得到 `filtered`
    - 基于 `filtered` 进行 `reason` 精准过滤，得到 `filteredReason`
    - 基于 `filtered` 进行 `note` 模糊过滤，得到 `filteredNote`
    - 基于 `filteredReason` 和 `filteredNote` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 StatefulSet 监控数据
- 页面效果
  - 触发条件：详情页 -> “监控数据” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/monitor`
  - Function: `StatefulSetMonitorVo getStatefulSetMonitor(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetMonitorVo` （StatefulSet 监控响应对象）
      - {TODO: StatefulSetMonitorVo 对象属性}
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#getStatefulSetMonitorMock()`
  - 数据：`/src/mock/kubernetes/workload/statefulsetData.ts#mockStatefulSetMonitor`，模拟数量：24
  - 逻辑
    - 直接返回 `mockStatefulSetMonitor` {TODO：暂为空对象}

## 创建 StatefulSet
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “创建”按钮点击
  - 权限限制：`kubernetes:workload:statefulset:create`
  - 路由跳转
    - Name: `kubernetes:workload:statefulset:create`
    - Path: `/kubernetes/clusters/:clusterUid/statefulsets/create`
    - Component: `/src/view/kubernetes/workload/statefulset/create/index.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/statefulsets`
  - Function: `void createStatefulSet(clusterUid: string, data: Partial<StatefulSetCreateForm>)`
    - clusterUid: string （集群 UID）
    - `StatefulSetCreateForm` （StatefulSet 创建请求对象）
      - description?: string （StatefulSet 描述）
      - metadata: ObjectMeta （StatefulSet 的资源元数据，详见 ### ObjectMeta）
      - spec: StatefulSetSpec （StatefulSet 的规格定义，详见 ### StatefulSetSpec）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#createStatefulSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 创建 StatefulSet（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “YAML”按钮点击
  - 权限限制：`kubernetes:workload:statefulset:create`
  - 路由跳转
    - Name: `kubernetes:workload:statefulset:create:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/statefulsets/create/yaml`
    - Component: `/src/view/kubernetes/workload/statefulset/create/yaml.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/statefulsets/yaml`
  - Function: `void createStatefulSetYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （StatefulSet YAML 字符串）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#createStatefulSetYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 更新 StatefulSet
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑应用”按钮点击
  - 权限限制：`kubernetes:workload:statefulset:edit`
  - 路由跳转
    - Name: `kubernetes:workload:statefulset:edit`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/edit`
    - Component: `/src/view/kubernetes/workload/statefulset/edit/index.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name`
  - Function: `void updateStatefulSet(clusterUid: string, namespace: string, name: string, data: Partial<StatefulSetUpdateForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetUpdateForm` （StatefulSet 更新请求对象）
      - description?: string （StatefulSet 描述）
      - metadata: ObjectMeta （StatefulSet 的资源元数据，详见 ### ObjectMeta）
      - spec: StatefulSetSpec （StatefulSet 的规格定义，详见 ### StatefulSetSpec）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#updateStatefulSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 更新 StatefulSet（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑YAML”按钮点击
  - 权限限制：`kubernetes:workload:statefulset:edit`
  - 路由跳转
    - Name: `kubernetes:workload:statefulset:edit:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/edit/yaml`
    - Component: `/src/view/kubernetes/workload/statefulset/edit/yaml.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/yaml`
  - Function: `void updateStatefulSetYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - yaml: string （StatefulSet YAML 字符串）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#updateStatefulSetYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 管理 StatefulSet 标签
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改标签”按钮点击
  - 权限限制：`kubernetes:workload:statefulset:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/labels`
  - Function: `void manageStatefulSetLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `MetadataLabelForm`（管理标签请求对象，来自 `/src/types/kubernetes/common.ts`）
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#manageStatefulSetLabelMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 管理 StatefulSet 注解
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改注解”按钮点击
  - 权限限制：`kubernetes:workload:statefulset:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/annotations`
  - Function: `void manageStatefulSetAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `MetadataAnnotationForm`（管理注解请求对象，来自 `/src/types/kubernetes/common.ts`）
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#manageStatefulSetAnnotationMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 删除 StatefulSet
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“删除应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:statefulset:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name`
  - Function: `void deleteStatefulSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#deleteStatefulSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 批量删除 StatefulSet
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “删除”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:statefulset:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/statefulsets`
  - Function: `void deleteStatefulSets(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （StatefulSet UID 列表）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#deleteStatefulSetsMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 导入 StatefulSet
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导入”按钮点击，弹框（BeeDialog）进行文档上传
  - 权限限制：`kubernetes:workload:statefulset:import`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/statefulsets/import`
  - Function: `void importStatefulSet(clusterUid: string, formData: FormData, onProgress?: (progressEvent: AxiosProgressEvent) => void)`
    - clusterUid: string （集群 UID）
    - formData: FormData （上传的文件）
    - onProgress?: (progressEvent: AxiosProgressEvent) => void （上传进度回调）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#importStatefulSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 导出 StatefulSet
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导出”按钮点击，保存文档
  - 权限限制：`kubernetes:workload:statefulset:export`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/statefulsets/export`
  - Function: `void exportStatefulSet(clusterUid: string, params: Partial<StatefulSetQueryForm>)`
    - clusterUid: string （集群 UID）
    - `StatefulSetQueryForm` 共享【查看 StatefulSet 详情】章节的实体定义
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#exportStatefulSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 扩缩容 StatefulSet
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“扩缩容”按钮点击，弹框（BeeDialog）输入副本数并确认
  - 权限限制：`kubernetes:workload:statefulset:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/scale`
  - Function: `void scaleStatefulSet(clusterUid: string, namespace: string, name: string, data: StatefulSetScaleForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetScaleForm` （StatefulSet 扩缩容请求对象）
      - replicas: number （期望副本数）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#scaleStatefulSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 滚动更新分区 StatefulSet
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“滚动更新分区”按钮点击，弹框（BeeDialog）输入分区序号并确认
  - 权限限制：`kubernetes:workload:statefulset:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/partition`
  - Function: `void partitionStatefulSet(clusterUid: string, namespace: string, name: string, data: StatefulSetPartitionForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetPartitionForm` （StatefulSet 滚动更新分区请求对象）
      - partition: number （分区序号，序号大于等于该值的 Pod 才会被滚动更新）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#partitionStatefulSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 重启 StatefulSet
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“重启应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:statefulset:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/restart`
  - Function: `void restartStatefulSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#restartStatefulSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 暂停 StatefulSet 更新
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“暂停更新”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:statefulset:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/pause`
  - Function: `void pauseStatefulSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#pauseStatefulSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 恢复 StatefulSet 更新
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“恢复更新”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:statefulset:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/resume`
  - Function: `void resumeStatefulSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#resumeStatefulSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 回滚 StatefulSet
- 页面效果
  - 触发条件：详情页 -> “部署历史” TAB 页 -> 部署历史表格 -> 行内“回滚到这”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:statefulset:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/rollback`
  - Function: `void rollbackStatefulSet(clusterUid: string, namespace: string, name: string, data: StatefulSetRollbackForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetRollbackForm` （StatefulSet 回滚请求对象）
      - revision: number （目标历史版本号）
- Mock
  - 函数：`/src/mock/kubernetes/workload/statefulset.ts#rollbackStatefulSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

# DaemonSet 功能

## 查看 DaemonSet 列表
- 页面效果
  - 触发条件：功能菜单“DaemonSet 管理”点击
  - 权限限制：`kubernetes:workload:daemonset:view`
  - 路由跳转
    - Name: `kubernetes:workload:daemonset`
    - Path: `/kubernetes/clusters/:clusterUid/daemonsets`
    - Component: `/src/view/kubernetes/workload/daemonset/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/daemonsets`
  - Function: `PageVo<DaemonSetListVo> getDaemonSetList(clusterUid: string, params: Partial<DaemonSetQueryForm>)`
    - clusterUid: string （集群 UID）
    - `DaemonSetQueryForm`（DaemonSet 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （DaemonSet 名称）
      - namespace: string （命名空间名称）
      - status: DaemonSetStatus （状态，来自 `/src/config/kubernetes/workload/daemonset.ts`）
      - labelSelector: Record<string, string> （标签过滤）
    - `DaemonSetListVo`（DaemonSet 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （DaemonSet 名称）
      - description?: string （DaemonSet 描述）
      - status: DaemonSetStatus （状态，来自 `/src/config/kubernetes/workload/daemonset.ts`）
      - statusMsg?: string （状态信息）
      - desiredNumberScheduled: number （目标调度 Pod 总数）
      - numberReady: number （就绪 Pod 数）
      - updateStrategyType: DaemonSetUpdateStrategyType （更新策略）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#getDaemonSetListMock()`
  - 数据：`/src/mock/kubernetes/workload/daemonsetData.ts#mockDaemonSets`，模拟数量：32
  - 逻辑
    - 基于 `mockDaemonSets` 进行 `status` 精准过滤，得到 `filtered`
    - 基于 `filtered` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filtered` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 DaemonSet 详情
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“详情”按钮点击
  - 权限限制：`kubernetes:workload:daemonset:view`
  - 路由跳转
    - Name: `kubernetes:workload:daemonset:detail`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name`
    - Component: `/src/view/kubernetes/workload/daemonset/detail/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name`
  - Function: `DaemonSetDetailVo getDaemonSetDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetDetailVo`（DaemonSet 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （DaemonSet 描述）
      - status: DaemonSetStatus （状态，来自 `/src/config/kubernetes/workload/daemonset.ts`）
      - statusMsg?: string （状态信息）
      - metadata: ObjectMeta （DaemonSet 的资源元数据，详见 ### ObjectMeta）
      - spec: DaemonSetSpec （DaemonSet 的规格定义，详见 ### DaemonSetSpec）
      - statusObj: DaemonSetStatusObj （DaemonSet 的观测状态，详见 ### DaemonSetStatusObj）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#getDaemonSetDetailMock()`
  - 数据：`/src/mock/kubernetes/workload/daemonsetData.ts#mockDaemonSetDetail`
  - 逻辑：直接返回 `mockDaemonSetDetail`

## 查看 DaemonSet YAML
- 页面效果
  - 触发条件：详情页 -> “YAML” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/yaml`
  - Function: `DaemonSetYamlVo getDaemonSetYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetYamlVo`: （DaemonSet YAML 响应对象）
      - yaml: string（DaemonSet YAML 文本）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#getDaemonSetYamlMock()`
  - 数据：`/src/mock/kubernetes/workload/daemonsetData.ts#mockDaemonSetYaml`
  - 逻辑：直接返回 `mockDaemonSetYaml`

## 查看 DaemonSet 关联 Pod 列表
- 页面效果
  - 触发条件：详情页 -> “容器组” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/pods`
  - Function: `PageVo<DaemonSetPodListVo> getDaemonSetPodList(clusterUid: string, namespace: string, name: string, params: Partial<DaemonSetPodQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetPodQueryForm`（DaemonSet 关联 Pod 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Pod 名称）
      - status: PodStatus （Pod 状态）
    - `DaemonSetPodListVo` （DaemonSet 关联 Pod 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
      - name: string （Pod 名称）
      - ip: string （Pod IP）
      - status: PodStatus （Pod 状态）
      - statusMsg: string （Pod 状态信息）
      - restarts: number （Pod 重启次数）
      - nodeIp: string （Pod 所属节点 IP）
      - nodeName: string （Pod 所属节点名称）
      - readyContainerCount: number （Pod 就绪容器数量）
      - containerCount: number （Pod 容器总数）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#getDaemonSetPodListMock()`
  - 数据：`/src/mock/kubernetes/workload/daemonsetData.ts#mockDaemonSetPods`，模拟数量：24
  - 逻辑
    - 基于 `mockDaemonSetPods` 进行 `status` 精准过滤，得到 `filtered`
    - 基于 `filtered` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filtered` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 DaemonSet 历史版本列表
- 页面效果
  - 触发条件：详情页 -> “部署历史” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/history`
  - Function: `PageVo<DaemonSetHistoryRevisionListVo> getDaemonSetHistoryRevisionList(clusterUid: string, namespace: string, name: string, params: Partial<DaemonSetHistoryRevisionQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetHistoryRevisionQueryForm`（DaemonSet 历史版本查询条件请求对象） 继承 `PageForm`
      - revision: number （版本名称）
      - changeCause: string （变更原因）
    - `DaemonSetHistoryRevisionListVo` （DaemonSet 历史版本列表项响应对象）继承 `HistoryRevision`
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#getDaemonSetHistoryRevisionListMock()`
  - 数据：`/src/mock/kubernetes/workload/daemonsetData.ts#mockDaemonSetHistoryRevisions`，模拟数量：24
  - 逻辑
    - 基于 `mockDaemonSetHistoryRevisions` 进行 `revision` 精准过滤和 `changeCause` 模糊过滤，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 DaemonSet 关联网络资源
- 页面效果
  - 触发条件：详情页 -> “关联网络” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/network`
  - Function: `DaemonSetNetworkVo getDaemonSetNetwork(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetNetworkVo` （DaemonSet 关联网络资源响应对象）
      - services: DaemonSetServiceListVo[] （关联的 Service 列表）
      - ingresses: DaemonSetIngressListVo[] （关联的 Ingress 列表）
      - `DaemonSetServiceListVo` （DaemonSet 关联 Service 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
        - name: string （Service 名称）
        - description: string （Service 描述）
        - type: ServiceType （Service 类型，来自 `/src/config/kubernetes/network/service.ts`）
        - clusterIp: string （集群内部 IP，ClusterIP / NodePort / LoadBalancer 类型自动分配）
        - externalName: string （外部域名，仅 ExternalName 类型生效）
        - headless: boolean （是否为 Headless Service，clusterIp 为 None）
      - `DaemonSetIngressListVo` （DaemonSet 关联 Ingress 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
        - name: string （Ingress 名称）
        - description: string （Ingress 描述）
        - ingressClassName?: string （Ingress 类名，对应 IngressClassName 资源名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#getDaemonSetNetworkMock()`
  - 数据
    - `/src/mock/kubernetes/workload/daemonsetData.ts#mockDaemonSetServices`，模拟数量：8
    - `/src/mock/kubernetes/workload/daemonsetData.ts#mockDaemonSetIngresses`，模拟数量：8
  - 逻辑
    - 直接基于 `mockDaemonSetServices`、`mockDaemonSetIngresses` 构建返回对象

## 查看 DaemonSet 事件列表
- 页面效果
  - 触发条件：详情页 -> “事件信息” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/events`
  - Function: `PageVo<EventListVo> getDaemonSetEventList(clusterUid: string, namespace: string, name: string, params: Partial<EventQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `EventQueryForm`（事件查询条件请求对象，来自 `/src/types/kubernetes/event/index.ts`）
    - `EventListVo`（事件列表项响应对象，来自 `/src/types/kubernetes/event/index.ts`）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#getDaemonSetEventListMock()`
  - 数据：`/src/mock/kubernetes/workload/daemonsetData.ts#mockDaemonSetEvents`，模拟数量：24
  - 逻辑
    - 基于 `mockDaemonSetEvents` 进行 `type` 精准过滤，得到 `filtered`
    - 基于 `filtered` 进行 `reason` 精准过滤，得到 `filteredReason`
    - 基于 `filtered` 进行 `note` 模糊过滤，得到 `filteredNote`
    - 基于 `filteredReason` 和 `filteredNote` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 DaemonSet 监控数据
- 页面效果
  - 触发条件：详情页 -> “监控数据” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/monitor`
  - Function: `DaemonSetMonitorVo getDaemonSetMonitor(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetMonitorVo` （DaemonSet 监控响应对象）
      - {TODO: DaemonSetMonitorVo 对象属性}
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#getDaemonSetMonitorMock()`
  - 数据：`/src/mock/kubernetes/workload/daemonsetData.ts#mockDaemonSetMonitor`，模拟数量：24
  - 逻辑
    - 直接返回 `mockDaemonSetMonitor` {TODO：暂为空对象}

## 创建 DaemonSet
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “创建”按钮点击
  - 权限限制：`kubernetes:workload:daemonset:create`
  - 路由跳转
    - Name: `kubernetes:workload:daemonset:create`
    - Path: `/kubernetes/clusters/:clusterUid/daemonsets/create`
    - Component: `/src/view/kubernetes/workload/daemonset/create/index.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/daemonsets`
  - Function: `void createDaemonSet(clusterUid: string, data: Partial<DaemonSetCreateForm>)`
    - clusterUid: string （集群 UID）
    - `DaemonSetCreateForm` （DaemonSet 创建请求对象）
      - description?: string （DaemonSet 描述）
      - metadata: ObjectMeta （DaemonSet 的资源元数据，详见 ### ObjectMeta）
      - spec: DaemonSetSpec （DaemonSet 的规格定义，详见 ### DaemonSetSpec）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#createDaemonSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 创建 DaemonSet（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “YAML”按钮点击
  - 权限限制：`kubernetes:workload:daemonset:create`
  - 路由跳转
    - Name: `kubernetes:workload:daemonset:create:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/daemonsets/create/yaml`
    - Component: `/src/view/kubernetes/workload/daemonset/create/yaml.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/daemonsets/yaml`
  - Function: `void createDaemonSetYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （DaemonSet YAML 字符串）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#createDaemonSetYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 更新 DaemonSet
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑应用”按钮点击
  - 权限限制：`kubernetes:workload:daemonset:edit`
  - 路由跳转
    - Name: `kubernetes:workload:daemonset:edit`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/edit`
    - Component: `/src/view/kubernetes/workload/daemonset/edit/index.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name`
  - Function: `void updateDaemonSet(clusterUid: string, namespace: string, name: string, data: Partial<DaemonSetUpdateForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetUpdateForm` （DaemonSet 更新请求对象）
      - description?: string （DaemonSet 描述）
      - metadata: ObjectMeta （DaemonSet 的资源元数据，详见 ### ObjectMeta）
      - spec: DaemonSetSpec （DaemonSet 的规格定义，详见 ### DaemonSetSpec）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#updateDaemonSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 更新 DaemonSet（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑YAML”按钮点击
  - 权限限制：`kubernetes:workload:daemonset:edit`
  - 路由跳转
    - Name: `kubernetes:workload:daemonset:edit:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/edit/yaml`
    - Component: `/src/view/kubernetes/workload/daemonset/edit/yaml.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/yaml`
  - Function: `void updateDaemonSetYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - yaml: string （DaemonSet YAML 字符串）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#updateDaemonSetYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 管理 DaemonSet 标签
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改标签”按钮点击
  - 权限限制：`kubernetes:workload:daemonset:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/labels`
  - Function: `void manageDaemonSetLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `MetadataLabelForm`（管理标签请求对象，来自 `/src/types/kubernetes/common.ts`）
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#manageDaemonSetLabelMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 管理 DaemonSet 注解
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改注解”按钮点击
  - 权限限制：`kubernetes:workload:daemonset:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/annotations`
  - Function: `void manageDaemonSetAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `MetadataAnnotationForm`（管理注解请求对象，来自 `/src/types/kubernetes/common.ts`）
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#manageDaemonSetAnnotationMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 删除 DaemonSet
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“删除应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:daemonset:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name`
  - Function: `void deleteDaemonSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#deleteDaemonSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 批量删除 DaemonSet
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “删除”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:daemonset:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/daemonsets`
  - Function: `void deleteDaemonSets(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （DaemonSet UID 列表）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#deleteDaemonSetsMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 导入 DaemonSet
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导入”按钮点击，弹框（BeeDialog）进行文档上传
  - 权限限制：`kubernetes:workload:daemonset:import`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/daemonsets/import`
  - Function: `void importDaemonSet(clusterUid: string, formData: FormData, onProgress?: (progressEvent: AxiosProgressEvent) => void)`
    - clusterUid: string （集群 UID）
    - formData: FormData （上传的文件）
    - onProgress?: (progressEvent: AxiosProgressEvent) => void （上传进度回调）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#importDaemonSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 导出 DaemonSet
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导出”按钮点击，保存文档
  - 权限限制：`kubernetes:workload:daemonset:export`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/daemonsets/export`
  - Function: `void exportDaemonSet(clusterUid: string, params: Partial<DaemonSetQueryForm>)`
    - clusterUid: string （集群 UID）
    - `DaemonSetQueryForm` 共享【查看 DaemonSet 详情】章节的实体定义
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#exportDaemonSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 重启 DaemonSet
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“重启应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:daemonset:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/restart`
  - Function: `void restartDaemonSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#restartDaemonSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 暂停 DaemonSet 更新
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“暂停更新”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:daemonset:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/pause`
  - Function: `void pauseDaemonSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#pauseDaemonSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 恢复 DaemonSet 更新
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“恢复更新”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:daemonset:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/resume`
  - Function: `void resumeDaemonSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#resumeDaemonSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 回滚 DaemonSet
- 页面效果
  - 触发条件：详情页 -> “部署历史” TAB 页 -> 部署历史表格 -> 行内“回滚到这”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:daemonset:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/rollback`
  - Function: `void rollbackDaemonSet(clusterUid: string, namespace: string, name: string, data: DaemonSetRollbackForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetRollbackForm` （DaemonSet 回滚请求对象）
      - revision: number （目标历史版本号）
- Mock
  - 函数：`/src/mock/kubernetes/workload/daemonset.ts#rollbackDaemonSetMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

# Job 功能

## 查看 Job 列表
- 页面效果
  - 触发条件：功能菜单“Job 管理”点击
  - 权限限制：`kubernetes:workload:job:view`
  - 路由跳转
    - Name: `kubernetes:workload:job`
    - Path: `/kubernetes/clusters/:clusterUid/jobs`
    - Component: `/src/view/kubernetes/workload/job/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/jobs`
  - Function: `PageVo<JobListVo> getJobList(clusterUid: string, params: Partial<JobQueryForm>)`
    - clusterUid: string （集群 UID）
    - `JobQueryForm`（Job 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Job 名称）
      - namespace: string （命名空间名称）
      - status: JobStatus （状态，来自 `/src/config/kubernetes/workload/job.ts`）
    - `JobListVo`（Job 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （Job 名称）
      - description?: string （Job 描述）
      - status: JobStatus （状态，来自 `/src/config/kubernetes/workload/job.ts`）
      - statusMsg?: string （状态信息）
      - active: number （运行中的 Pod 数）
      - succeeded: number （已成功完成的 Pod 数）
      - failed: number （已失败的 Pod 数）
      - completions: number （需要成功完成的 Pod 数）
      - parallelism: number （并行运行的 Pod 数）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#getJobListMock()`
  - 数据：`/src/mock/kubernetes/workload/jobData.ts#mockJobs`，模拟数量：32
  - 逻辑
    - 基于 `mockJobs` 进行 `status` 精准过滤，得到 `filtered`
    - 基于 `filtered` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filtered` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 Job 详情
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“详情”按钮点击
  - 权限限制：`kubernetes:workload:job:view`
  - 路由跳转
    - Name: `kubernetes:workload:job:detail`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name`
    - Component: `/src/view/kubernetes/workload/job/detail/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name`
  - Function: `JobDetailVo getJobDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `JobDetailVo`（Job 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （Job 描述）
      - status: JobStatus （状态，来自 `/src/config/kubernetes/workload/job.ts`）
      - statusMsg?: string （状态信息）
      - metadata: ObjectMeta （Job 的资源元数据，详见 ### ObjectMeta）
      - spec: JobSpec （Job 的规格定义，详见 ### JobSpec）
      - statusObj: JobStatusObj （Job 的观测状态，详见 ### JobStatusObj）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#getJobDetailMock()`
  - 数据：`/src/mock/kubernetes/workload/jobData.ts#mockJobDetail`
  - 逻辑：直接返回 `mockJobDetail`

## 查看 Job YAML
- 页面效果
  - 触发条件：详情页 -> “YAML” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/yaml`
  - Function: `JobYamlVo getJobYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `JobYamlVo`: （Job YAML 响应对象）
      - yaml: string（Job YAML 文本）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#getJobYamlMock()`
  - 数据：`/src/mock/kubernetes/workload/jobData.ts#mockJobYaml`
  - 逻辑：直接返回 `mockJobYaml`

## 查看 Job 关联 Pod 列表
- 页面效果
  - 触发条件：详情页 -> “容器组” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/pods`
  - Function: `PageVo<JobPodListVo> getJobPodList(clusterUid: string, namespace: string, name: string, params: Partial<JobPodQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `JobPodQueryForm`（Job 关联 Pod 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Pod 名称）
      - status: PodStatus （Pod 状态）
    - `JobPodListVo` （Job 关联 Pod 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
      - name: string （Pod 名称）
      - ip: string （Pod IP）
      - status: PodStatus （Pod 状态）
      - statusMsg: string （Pod 状态信息）
      - restarts: number （Pod 重启次数）
      - nodeIp: string （Pod 所属节点 IP）
      - nodeName: string （Pod 所属节点名称）
      - readyContainerCount: number （Pod 就绪容器数量）
      - containerCount: number （Pod 容器总数）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#getJobPodListMock()`
  - 数据：`/src/mock/kubernetes/workload/jobData.ts#mockJobPods`，模拟数量：24
  - 逻辑
    - 基于 `mockJobPods` 进行 `status` 精准过滤，得到 `filtered`
    - 基于 `filtered` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filtered` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 Job 事件列表
- 页面效果
  - 触发条件：详情页 -> “事件信息” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/events`
  - Function: `PageVo<EventListVo> getJobEventList(clusterUid: string, namespace: string, name: string, params: Partial<EventQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `EventQueryForm`（事件查询条件请求对象，来自 `/src/types/kubernetes/event/index.ts`）
    - `EventListVo`（事件列表项响应对象，来自 `/src/types/kubernetes/event/index.ts`）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#getJobEventListMock()`
  - 数据：`/src/mock/kubernetes/workload/jobData.ts#mockJobEvents`，模拟数量：24
  - 逻辑
    - 基于 `mockJobEvents` 进行 `type` 精准过滤，得到 `filtered`
    - 基于 `filtered` 进行 `reason` 精准过滤，得到 `filteredReason`
    - 基于 `filtered` 进行 `note` 模糊过滤，得到 `filteredNote`
    - 基于 `filteredReason` 和 `filteredNote` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 Job 监控数据
- 页面效果
  - 触发条件：详情页 -> “监控数据” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/monitor`
  - Function: `JobMonitorVo getJobMonitor(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `JobMonitorVo` （Job 监控响应对象）
      - {TODO: JobMonitorVo 对象属性}
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#getJobMonitorMock()`
  - 数据：`/src/mock/kubernetes/workload/jobData.ts#mockJobMonitor`，模拟数量：24
  - 逻辑
    - 直接返回 `mockJobMonitor` {TODO：暂为空对象}

## 创建 Job
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “创建”按钮点击
  - 权限限制：`kubernetes:workload:job:create`
  - 路由跳转
    - Name: `kubernetes:workload:job:create`
    - Path: `/kubernetes/clusters/:clusterUid/jobs/create`
    - Component: `/src/view/kubernetes/workload/job/create/index.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/jobs`
  - Function: `void createJob(clusterUid: string, data: Partial<JobCreateForm>)`
    - clusterUid: string （集群 UID）
    - `JobCreateForm` （Job 创建请求对象）
      - description?: string （Job 描述）
      - metadata: ObjectMeta （Job 的资源元数据，详见 ### ObjectMeta）
      - spec: JobSpec （Job 的规格定义，详见 ### JobSpec）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#createJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 创建 Job（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “YAML”按钮点击
  - 权限限制：`kubernetes:workload:job:create`
  - 路由跳转
    - Name: `kubernetes:workload:job:create:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/jobs/create/yaml`
    - Component: `/src/view/kubernetes/workload/job/create/yaml.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/jobs/yaml`
  - Function: `void createJobYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （Job YAML 字符串）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#createJobYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 更新 Job
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑应用”按钮点击
  - 权限限制：`kubernetes:workload:job:edit`
  - 路由跳转
    - Name: `kubernetes:workload:job:edit`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/edit`
    - Component: `/src/view/kubernetes/workload/job/edit/index.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name`
  - Function: `void updateJob(clusterUid: string, namespace: string, name: string, data: Partial<JobUpdateForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `JobUpdateForm` （Job 更新请求对象）
      - description?: string （Job 描述）
      - metadata: ObjectMeta （Job 的资源元数据，详见 ### ObjectMeta）
      - spec: JobSpec （Job 的规格定义，详见 ### JobSpec）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#updateJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 更新 Job（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑YAML”按钮点击
  - 权限限制：`kubernetes:workload:job:edit`
  - 路由跳转
    - Name: `kubernetes:workload:job:edit:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/edit/yaml`
    - Component: `/src/view/kubernetes/workload/job/edit/yaml.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/yaml`
  - Function: `void updateJobYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - yaml: string （Job YAML 字符串）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#updateJobYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 管理 Job 标签
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改标签”按钮点击
  - 权限限制：`kubernetes:workload:job:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/labels`
  - Function: `void manageJobLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `MetadataLabelForm`（管理标签请求对象，来自 `/src/types/kubernetes/common.ts`）
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#manageJobLabelMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 管理 Job 注解
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改注解”按钮点击
  - 权限限制：`kubernetes:workload:job:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/annotations`
  - Function: `void manageJobAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `MetadataAnnotationForm`（管理注解请求对象，来自 `/src/types/kubernetes/common.ts`）
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#manageJobAnnotationMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 删除 Job
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“删除应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:job:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name`
  - Function: `void deleteJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#deleteJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 批量删除 Job
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “删除”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:job:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/jobs`
  - Function: `void deleteJobs(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （Job UID 列表）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#deleteJobsMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 导入 Job
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导入”按钮点击，弹框（BeeDialog）进行文档上传
  - 权限限制：`kubernetes:workload:job:import`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/jobs/import`
  - Function: `void importJob(clusterUid: string, formData: FormData, onProgress?: (progressEvent: AxiosProgressEvent) => void)`
    - clusterUid: string （集群 UID）
    - formData: FormData （上传的文件）
    - onProgress?: (progressEvent: AxiosProgressEvent) => void （上传进度回调）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#importJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 导出 Job
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导出”按钮点击，保存文档
  - 权限限制：`kubernetes:workload:job:export`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/jobs/export`
  - Function: `void exportJob(clusterUid: string, params: Partial<JobQueryForm>)`
    - clusterUid: string （集群 UID）
    - `JobQueryForm` 共享【查看 Job 详情】章节的实体定义
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#exportJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 手动重跑 Job
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“手动重跑”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:job:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/rerun`
  - Function: `void rerunJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#rerunJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 暂停 Job 更新
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“暂停更新”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:job:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/pause`
  - Function: `void pauseJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#pauseJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 恢复 Job 更新
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“恢复更新”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:job:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/resume`
  - Function: `void resumeJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/job.ts#resumeJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

# CronJob 功能

## 查看 CronJob 列表
- 页面效果
  - 触发条件：功能菜单“CronJob 管理”点击
  - 权限限制：`kubernetes:workload:cronjob:view`
  - 路由跳转
    - Name: `kubernetes:workload:cronjob`
    - Path: `/kubernetes/clusters/:clusterUid/cronjobs`
    - Component: `/src/view/kubernetes/workload/cronjob/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/cronjobs`
  - Function: `PageVo<CronJobListVo> getCronJobList(clusterUid: string, params: Partial<CronJobQueryForm>)`
    - clusterUid: string （集群 UID）
    - `CronJobQueryForm`（CronJob 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （CronJob 名称）
      - namespace: string （命名空间名称）
      - status: CronJobStatus （状态，来自 `/src/config/kubernetes/workload/cronjob.ts`）
    - `CronJobListVo`（CronJob 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （CronJob 名称）
      - description?: string （CronJob 描述）
      - status: CronJobStatus （状态，来自 `/src/config/kubernetes/workload/cronjob.ts`）
      - statusMsg?: string （状态信息）
      - schedule: string （Cron 调度表达式）
      - active: number （当前运行中的 Job 数）
      - lastScheduleTime: string （最近一次触发时间）
      - suspend: boolean （是否已暂停）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#getCronJobListMock()`
  - 数据：`/src/mock/kubernetes/workload/cronjobData.ts#mockCronJobs`，模拟数量：32
  - 逻辑
    - 基于 `mockCronJobs` 进行 `status` 精准过滤，得到 `filtered`
    - 基于 `filtered` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filtered` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 CronJob 详情
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“详情”按钮点击
  - 权限限制：`kubernetes:workload:cronjob:view`
  - 路由跳转
    - Name: `kubernetes:workload:cronjob:detail`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name`
    - Component: `/src/view/kubernetes/workload/cronjob/detail/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name`
  - Function: `CronJobDetailVo getCronJobDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `CronJobDetailVo`（CronJob 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （CronJob 描述）
      - status: CronJobStatus （状态，来自 `/src/config/kubernetes/workload/cronjob.ts`）
      - statusMsg?: string （状态信息）
      - metadata: ObjectMeta （CronJob 的资源元数据，详见 ### ObjectMeta）
      - spec: CronJobSpec （CronJob 的规格定义，详见 ### CronJobSpec）
      - statusObj: CronJobStatusObj （CronJob 的观测状态，详见 ### CronJobStatusObj）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#getCronJobDetailMock()`
  - 数据：`/src/mock/kubernetes/workload/cronjobData.ts#mockCronJobDetail`
  - 逻辑：直接返回 `mockCronJobDetail`

## 查看 CronJob YAML
- 页面效果
  - 触发条件：详情页 -> “YAML” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/yaml`
  - Function: `CronJobYamlVo getCronJobYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `CronJobYamlVo`: （CronJob YAML 响应对象）
      - yaml: string（CronJob YAML 文本）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#getCronJobYamlMock()`
  - 数据：`/src/mock/kubernetes/workload/cronjobData.ts#mockCronJobYaml`
  - 逻辑：直接返回 `mockCronJobYaml`

## 查看 CronJob 关联 Job 列表
- 页面效果
  - 触发条件：详情页 -> “关联任务” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/jobs`
  - Function: `PageVo<CronJobJobListVo> getCronJobJobList(clusterUid: string, namespace: string, name: string, params: Partial<CronJobJobQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `CronJobJobQueryForm`（CronJob 关联 Job 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Job 名称）
      - status: JobStatus （Job 状态）
    - `CronJobJobListVo` （CronJob 关联 Job 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
      - name: string （Job 名称）
      - status: JobStatus （Job 状态）
      - statusMsg: string （Job 状态信息）
      - active: number （运行中的 Pod 数）
      - succeeded: number （已成功完成的 Pod 数）
      - failed: number （已失败的 Pod 数）
      - completions: number （需要成功完成的 Pod 数）
      - parallelism: number （并行运行的 Pod 数）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#getCronJobJobListMock()`
  - 数据：`/src/mock/kubernetes/workload/cronjobData.ts#mockCronJobJobs`，模拟数量：24
  - 逻辑
    - 基于 `mockCronJobJobs` 进行 `status` 精准过滤，得到 `filtered`
    - 基于 `filtered` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filtered` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 CronJob 事件列表
- 页面效果
  - 触发条件：详情页 -> “事件信息” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/events`
  - Function: `PageVo<EventListVo> getCronJobEventList(clusterUid: string, namespace: string, name: string, params: Partial<EventQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `EventQueryForm`（事件查询条件请求对象，来自 `/src/types/kubernetes/event/index.ts`）
    - `EventListVo`（事件列表项响应对象，来自 `/src/types/kubernetes/event/index.ts`）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#getCronJobEventListMock()`
  - 数据：`/src/mock/kubernetes/workload/cronjobData.ts#mockCronJobEvents`，模拟数量：24
  - 逻辑
    - 基于 `mockCronJobEvents` 进行 `type` 精准过滤，得到 `filtered`
    - 基于 `filtered` 进行 `reason` 精准过滤，得到 `filteredReason`
    - 基于 `filtered` 进行 `note` 模糊过滤，得到 `filteredNote`
    - 基于 `filteredReason` 和 `filteredNote` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 CronJob 监控数据
- 页面效果
  - 触发条件：详情页 -> “监控数据” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/monitor`
  - Function: `CronJobMonitorVo getCronJobMonitor(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `CronJobMonitorVo` （CronJob 监控响应对象）
      - {TODO: CronJobMonitorVo 对象属性}
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#getCronJobMonitorMock()`
  - 数据：`/src/mock/kubernetes/workload/cronjobData.ts#mockCronJobMonitor`，模拟数量：24
  - 逻辑
    - 直接返回 `mockCronJobMonitor` {TODO：暂为空对象}

## 创建 CronJob
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “创建”按钮点击
  - 权限限制：`kubernetes:workload:cronjob:create`
  - 路由跳转
    - Name: `kubernetes:workload:cronjob:create`
    - Path: `/kubernetes/clusters/:clusterUid/cronjobs/create`
    - Component: `/src/view/kubernetes/workload/cronjob/create/index.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/cronjobs`
  - Function: `void createCronJob(clusterUid: string, data: Partial<CronJobCreateForm>)`
    - clusterUid: string （集群 UID）
    - `CronJobCreateForm` （CronJob 创建请求对象）
      - description?: string （CronJob 描述）
      - metadata: ObjectMeta （CronJob 的资源元数据，详见 ### ObjectMeta）
      - spec: CronJobSpec （CronJob 的规格定义，详见 ### CronJobSpec）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#createCronJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 创建 CronJob（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “YAML”按钮点击
  - 权限限制：`kubernetes:workload:cronjob:create`
  - 路由跳转
    - Name: `kubernetes:workload:cronjob:create:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/cronjobs/create/yaml`
    - Component: `/src/view/kubernetes/workload/cronjob/create/yaml.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/cronjobs/yaml`
  - Function: `void createCronJobYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （CronJob YAML 字符串）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#createCronJobYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 更新 CronJob
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑应用”按钮点击
  - 权限限制：`kubernetes:workload:cronjob:edit`
  - 路由跳转
    - Name: `kubernetes:workload:cronjob:edit`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/edit`
    - Component: `/src/view/kubernetes/workload/cronjob/edit/index.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name`
  - Function: `void updateCronJob(clusterUid: string, namespace: string, name: string, data: Partial<CronJobUpdateForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `CronJobUpdateForm` （CronJob 更新请求对象）
      - description?: string （CronJob 描述）
      - metadata: ObjectMeta （CronJob 的资源元数据，详见 ### ObjectMeta）
      - spec: CronJobSpec （CronJob 的规格定义，详见 ### CronJobSpec）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#updateCronJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 更新 CronJob（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑YAML”按钮点击
  - 权限限制：`kubernetes:workload:cronjob:edit`
  - 路由跳转
    - Name: `kubernetes:workload:cronjob:edit:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/edit/yaml`
    - Component: `/src/view/kubernetes/workload/cronjob/edit/yaml.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/yaml`
  - Function: `void updateCronJobYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - yaml: string （CronJob YAML 字符串）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#updateCronJobYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 管理 CronJob 标签
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改标签”按钮点击
  - 权限限制：`kubernetes:workload:cronjob:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/labels`
  - Function: `void manageCronJobLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `MetadataLabelForm`（管理标签请求对象，来自 `/src/types/kubernetes/common.ts`）
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#manageCronJobLabelMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 管理 CronJob 注解
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改注解”按钮点击
  - 权限限制：`kubernetes:workload:cronjob:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/annotations`
  - Function: `void manageCronJobAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `MetadataAnnotationForm`（管理注解请求对象，来自 `/src/types/kubernetes/common.ts`）
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#manageCronJobAnnotationMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 删除 CronJob
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“删除应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:cronjob:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name`
  - Function: `void deleteCronJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#deleteCronJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 批量删除 CronJob
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “删除”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:cronjob:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/cronjobs`
  - Function: `void deleteCronJobs(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （CronJob UID 列表）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#deleteCronJobsMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 导入 CronJob
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导入”按钮点击，弹框（BeeDialog）进行文档上传
  - 权限限制：`kubernetes:workload:cronjob:import`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/cronjobs/import`
  - Function: `void importCronJob(clusterUid: string, formData: FormData, onProgress?: (progressEvent: AxiosProgressEvent) => void)`
    - clusterUid: string （集群 UID）
    - formData: FormData （上传的文件）
    - onProgress?: (progressEvent: AxiosProgressEvent) => void （上传进度回调）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#importCronJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 导出 CronJob
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导出”按钮点击，保存文档
  - 权限限制：`kubernetes:workload:cronjob:export`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/cronjobs/export`
  - Function: `void exportCronJob(clusterUid: string, params: Partial<CronJobQueryForm>)`
    - clusterUid: string （集群 UID）
    - `CronJobQueryForm` 共享【查看 CronJob 详情】章节的实体定义
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#exportCronJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 立即触发 CronJob
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“立即触发”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:cronjob:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/trigger`
  - Function: `void triggerCronJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#triggerCronJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 暂停 CronJob 更新
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“暂停更新”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:cronjob:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/pause`
  - Function: `void pauseCronJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#pauseCronJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 恢复 CronJob 更新
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“恢复更新”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:workload:cronjob:edit`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/resume`
  - Function: `void resumeCronJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
- Mock
  - 函数：`/src/mock/kubernetes/workload/cronjob.ts#resumeCronJobMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

