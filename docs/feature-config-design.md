# ConfigMap 功能

## 查看 ConfigMap 列表
- 页面效果
  - 触发条件：功能菜单“ConfigMap 管理”点击
  - 权限限制：`kubernetes:config:configmap:view`
  - 路由跳转
    - Name: `kubernetes:config:configmap`
    - Path: `/kubernetes/clusters/:clusterUid/configmaps`
    - Component: `/src/view/kubernetes/config/configmap/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/configmaps`
  - Function: `PageVo<ConfigMapListVo> getConfigMapList(clusterUid: string, params: Partial<ConfigMapQueryForm>)`
    - clusterUid: string （集群 UID）
    - `ConfigMapQueryForm`（ConfigMap 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （ConfigMap 名称）
      - namespace: string （命名空间名称）
      - labelSelector: Record<string, string> （标签过滤）
    - `ConfigMapListVo`（ConfigMap 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （ConfigMap 名称）
      - description?: string （ConfigMap 描述）
      - dataCount: number （键值对数量）
      - immutable: boolean （是否不可变）
- Mock
  - 函数：`/src/mock/kubernetes/config/configmap.ts#getConfigMapListMock()`
  - 数据：`/src/mock/kubernetes/config/configmapData.ts#mockConfigMaps`，模拟数量：32
  - 逻辑
    - 基于 `mockConfigMaps` 进行 `namespace` 精准过滤，得到 `filteredNamespace`
    - 基于 `filteredNamespace` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filteredNamespace` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 ConfigMap 详情
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“详情”按钮点击
  - 权限限制：`kubernetes:config:configmap:view`
  - 路由跳转
    - Name: `kubernetes:config:configmap:detail`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name`
    - Component: `/src/view/kubernetes/config/configmap/detail/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name`
  - Function: `ConfigMapDetailVo getConfigMapDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （ConfigMap 名称）
    - `ConfigMapDetailVo`（ConfigMap 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （ConfigMap 描述）
      - metadata: ObjectMeta （ConfigMap 的资源元数据，详见 ### ObjectMeta）
      - immutable?: boolean （是否不可变）
      - data: Record<string, string> （键值对配置数据，明文）
      - binaryData: Record<string, string> （二进制数据，base64 编码）
- Mock
  - 函数：`/src/mock/kubernetes/config/configmap.ts#getConfigMapDetailMock()`
  - 数据：`/src/mock/kubernetes/config/configmapData.ts#mockConfigMapDetail`
  - 逻辑：直接返回 `mockConfigMapDetail`

## 查看 ConfigMap YAML
- 页面效果
  - 触发条件：详情页 -> “YAML” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/yaml`
  - Function: `ConfigMapYamlVo getConfigMapYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （ConfigMap 名称）
    - `ConfigMapYamlVo`: （ConfigMap YAML 响应对象）
      - yaml: string（ConfigMap YAML 文本）
- Mock
  - 函数：`/src/mock/kubernetes/config/configmap.ts#getConfigMapYamlMock()`
  - 数据：`/src/mock/kubernetes/config/configmapData.ts#mockConfigMapYaml`
  - 逻辑：直接返回 `mockConfigMapYaml`

## 创建 ConfigMap
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “创建”按钮点击
  - 权限限制：`kubernetes:config:configmap:create`
  - 路由跳转
    - Name: `kubernetes:config:configmap:create`
    - Path: `/kubernetes/clusters/:clusterUid/configmaps/create`
    - Component: `/src/view/kubernetes/config/configmap/create.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/configmaps`
  - Function: `void createConfigMap(clusterUid: string, data: ConfigMapCreateForm)`
    - clusterUid: string （集群 UID）
    - `ConfigMapCreateForm`（ConfigMap 创建请求对象）
      - description?: string （ConfigMap 描述）
      - metadata: ObjectMeta （ConfigMap 的资源元数据，详见 ### ObjectMeta）
      - data: Record<string, string> （键值对配置数据）
      - binaryData?: Record<string, string> （二进制数据，base64）
      - immutable?: boolean （是否不可变）
  - Permission: `kubernetes:config:configmap:create`
- Mock
  - 函数：`/src/mock/kubernetes/config/configmap.ts#createConfigMapMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 创建 ConfigMap（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “YAML”按钮点击
  - 权限限制：`kubernetes:config:configmap:create`
  - 路由跳转
    - Name: `kubernetes:config:configmap:create:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/configmaps/create/yaml`
    - Component: `/src/view/kubernetes/config/configmap/create/yaml.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/configmaps/yaml`
  - Function: `void createConfigMapYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （ConfigMap YAML 字符串）
  - Permission: `kubernetes:config:configmap:create`
- Mock
  - 函数：`/src/mock/kubernetes/config/configmap.ts#createConfigMapYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 更新 ConfigMap
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑应用”按钮点击
  - 权限限制：`kubernetes:config:configmap:edit`
  - 路由跳转
    - Name: `kubernetes:config:configmap:edit`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/edit`
    - Component: `/src/view/kubernetes/config/configmap/edit.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/configmaps/:name`
  - Function: `void updateConfigMap(clusterUid: string, namespace: string, name: string, data: ConfigMapUpdateForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （ConfigMap 名称）
    - `ConfigMapUpdateForm`（ConfigMap 更新请求对象）
      - description?: string （ConfigMap 描述）
      - metadata: ObjectMeta （ConfigMap 的资源元数据，详见 ### ObjectMeta）
      - data: Record<string, string> （键值对配置数据）
      - binaryData?: Record<string, string> （二进制数据，base64）
      - immutable?: boolean （是否不可变）
  - Permission: `kubernetes:config:configmap:edit`
- Mock
  - 函数：`/src/mock/kubernetes/config/configmap.ts#updateConfigMapMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 更新 ConfigMap（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑YAML”按钮点击
  - 权限限制：`kubernetes:config:configmap:edit`
  - 路由跳转
    - Name: `kubernetes:config:configmap:edit:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/edit/yaml`
    - Component: `/src/view/kubernetes/config/configmap/edit/yaml.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/yaml`
  - Function: `void updateConfigMapYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （ConfigMap 名称）
    - yaml: string （ConfigMap YAML 字符串）
  - Permission: `kubernetes:config:configmap:edit`
- Mock
  - 函数：`/src/mock/kubernetes/config/configmap.ts#updateConfigMapYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 管理 ConfigMap 标签
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改标签”按钮点击
  - 权限限制：`kubernetes:config:configmap:edit`
  - 路由跳转
    - Name: `kubernetes:config:configmap:edit:labels`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/edit/labels`
    - Component: `/src/view/kubernetes/config/configmap/edit/labels.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/configmaps/:name/labels`
  - Function: `void manageConfigMapLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （ConfigMap 名称）
    - `MetadataLabelForm`（管理标签请求对象，来自 `/src/types/kubernetes/common.ts`）
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/config/configmap.ts#manageConfigMapLabelMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 管理 ConfigMap 注解
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改注解”按钮点击
  - 权限限制：`kubernetes:config:configmap:edit`
  - 路由跳转
    - Name: `kubernetes:config:configmap:edit:annotations`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/edit/annotations`
    - Component: `/src/view/kubernetes/config/configmap/edit/annotations.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/configmaps/:name/annotations`
  - Function: `void manageConfigMapAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （ConfigMap 名称）
    - `MetadataAnnotationForm`（管理注解请求对象，来自 `/src/types/kubernetes/common.ts`）
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/config/configmap.ts#manageConfigMapAnnotationMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 删除 ConfigMap
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“删除应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:config:configmap:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name`
  - Function: `void deleteConfigMap(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （ConfigMap 名称）
  - Permission: `kubernetes:config:configmap:delete`
- Mock
  - 函数：`/src/mock/kubernetes/config/configmap.ts#deleteConfigMapMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 批量删除 ConfigMap
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “删除”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:config:configmap:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/configmaps`
  - Function: `void deleteConfigMaps(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （ConfigMap UID 列表）
  - Permission: `kubernetes:config:configmap:delete`
- Mock
  - 函数：`/src/mock/kubernetes/config/configmap.ts#deleteConfigMapsMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 导入 ConfigMap
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导入”按钮点击，弹框（BeeDialog）进行文档上传
  - 权限限制：`kubernetes:config:configmap:import`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/configmaps/import`
  - Function: `void importConfigMap(clusterUid: string, data: ConfigMapYamlForm)`
    - clusterUid: string （集群 UID）
    - `ConfigMapYamlForm`（ConfigMap YAML 导入请求对象）
      - yaml: string （ConfigMap YAML 字符串）
  - Permission: `kubernetes:config:configmap:import`
- Mock
  - 函数：`/src/mock/kubernetes/config/configmap.ts#importConfigMapMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 导出 ConfigMap
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导出”按钮点击，保存文档
  - 权限限制：`kubernetes:config:configmap:export`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/configmaps/export`
  - Function: `void exportConfigMap(clusterUid: string, params: Partial<ConfigMapQueryForm>)`
    - clusterUid: string （集群 UID）
    - `ConfigMapQueryForm` 共享【查看 ConfigMap 列表】章节的实体定义
  - Permission: `kubernetes:config:configmap:export`
- Mock
  - 函数：`/src/mock/kubernetes/config/configmap.ts#exportConfigMapMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 克隆 ConfigMap
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“克隆”按钮点击，弹框（BeeDialog）输入目标命名空间与名称并确认
  - 权限限制：`kubernetes:config:configmap:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/clone`
  - Function: `void cloneConfigMap(clusterUid: string, namespace: string, name: string, data: ConfigMapCloneForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （源 ConfigMap 名称）
    - `ConfigMapCloneForm`（ConfigMap 克隆请求对象）
      - targetNamespace: string （目标命名空间名称，可跨命名空间克隆）
      - targetName: string （目标 ConfigMap 名称）
  - Permission: `kubernetes:config:configmap:create`
- Mock
  - 函数：`/src/mock/kubernetes/config/configmap.ts#cloneConfigMapMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

# Secret 功能

## 查看 Secret 列表
- 页面效果
  - 触发条件：功能菜单“Secret 管理”点击
  - 权限限制：`kubernetes:config:secret:view`
  - 路由跳转
    - Name: `kubernetes:config:secret`
    - Path: `/kubernetes/clusters/:clusterUid/secrets`
    - Component: `/src/view/kubernetes/config/secret/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/secrets`
  - Function: `PageVo<SecretListVo> getSecretList(clusterUid: string, params: Partial<SecretQueryForm>)`
    - clusterUid: string （集群 UID）
    - `SecretQueryForm`（Secret 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Secret 名称）
      - namespace: string （命名空间名称）
      - type: SecretType （密钥类型，来自 `/src/config/kubernetes/config/secret.ts`）
      - labelSelector: Record<string, string> （标签过滤）
    - `SecretListVo`（Secret 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （Secret 名称）
      - description?: string （Secret 描述）
      - type: SecretType （密钥类型，来自 `/src/config/kubernetes/config/secret.ts`）
      - dataCount: number （数据条目数）
      - immutable: boolean （是否不可变）
- Mock
  - 函数：`/src/mock/kubernetes/config/secret.ts#getSecretListMock()`
  - 数据：`/src/mock/kubernetes/config/secretData.ts#mockSecrets`，模拟数量：32
  - 逻辑
    - 基于 `mockSecrets` 进行 `namespace` 精准过滤，得到 `filteredNamespace`
    - 基于 `filteredNamespace` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filteredNamespace` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 Secret 详情

> 安全约束：列表/详情/编辑回显均不直接展示明文 value，仅用户主动点击「显示」时本地 base64 解码预览，不落日志。

- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“详情”按钮点击
  - 权限限制：`kubernetes:config:secret:view`
  - 路由跳转
    - Name: `kubernetes:config:secret:detail`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name`
    - Component: `/src/view/kubernetes/config/secret/detail/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name`
  - Function: `SecretDetailVo getSecretDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Secret 名称）
    - `SecretDetailVo`（Secret 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （Secret 描述）
      - type: SecretType （密钥类型，来自 `/src/config/kubernetes/config/secret.ts`）
      - metadata: ObjectMeta （Secret 的资源元数据，详见 ### ObjectMeta）
      - data: Record<string, string> （密文数据，base64 编码，展示时脱敏）
      - stringData?: Record<string, string> （明文数据，写入时自动 base64 编码存储）
      - immutable?: boolean （是否不可变）
- Mock
  - 函数：`/src/mock/kubernetes/config/secret.ts#getSecretDetailMock()`
  - 数据：`/src/mock/kubernetes/config/secretData.ts#mockSecretDetail`
  - 逻辑：直接返回 `mockSecretDetail`

## 查看 Secret YAML
- 页面效果
  - 触发条件：详情页 -> “YAML” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/yaml`
  - Function: `SecretYamlVo getSecretYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Secret 名称）
    - `SecretYamlVo`: （Secret YAML 响应对象）
      - yaml: string（Secret YAML 文本）
- Mock
  - 函数：`/src/mock/kubernetes/config/secret.ts#getSecretYamlMock()`
  - 数据：`/src/mock/kubernetes/config/secretData.ts#mockSecretYaml`
  - 逻辑：直接返回 `mockSecretYaml`

## 创建 Secret
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “创建”按钮点击
  - 权限限制：`kubernetes:config:secret:create`
  - 路由跳转
    - Name: `kubernetes:config:secret:create`
    - Path: `/kubernetes/clusters/:clusterUid/secrets/create`
    - Component: `/src/view/kubernetes/config/secret/create.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/secrets`
  - Function: `void createSecret(clusterUid: string, data: SecretCreateForm)`
    - clusterUid: string （集群 UID）
    - `SecretCreateForm`（Secret 创建请求对象）
      - description?: string （Secret 描述）
      - metadata: ObjectMeta （Secret 的资源元数据，详见 ### ObjectMeta）
      - type: SecretType （密钥类型，来自 `/src/config/kubernetes/config/secret.ts`）
      - data: Record<string, string> （密文数据，base64 编码）
      - stringData?: Record<string, string> （明文数据，自动 base64 编码存储）
      - immutable?: boolean （是否不可变）
  - Permission: `kubernetes:config:secret:create`
- Mock
  - 函数：`/src/mock/kubernetes/config/secret.ts#createSecretMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 创建 Secret（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “YAML”按钮点击
  - 权限限制：`kubernetes:config:secret:create`
  - 路由跳转
    - Name: `kubernetes:config:secret:create:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/secrets/create/yaml`
    - Component: `/src/view/kubernetes/config/secret/create/yaml.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/secrets/yaml`
  - Function: `void createSecretYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （Secret YAML 字符串）
  - Permission: `kubernetes:config:secret:create`
- Mock
  - 函数：`/src/mock/kubernetes/config/secret.ts#createSecretYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 更新 Secret
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑应用”按钮点击
  - 权限限制：`kubernetes:config:secret:edit`
  - 路由跳转
    - Name: `kubernetes:config:secret:edit`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/edit`
    - Component: `/src/view/kubernetes/config/secret/edit.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/secrets/:name`
  - Function: `void updateSecret(clusterUid: string, namespace: string, name: string, data: SecretUpdateForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Secret 名称）
    - `SecretUpdateForm`（Secret 更新请求对象）
      - description?: string （Secret 描述）
      - metadata: ObjectMeta （Secret 的资源元数据，详见 ### ObjectMeta）
      - type: SecretType （密钥类型，来自 `/src/config/kubernetes/config/secret.ts`）
      - data: Record<string, string> （密文数据，base64 编码）
      - stringData?: Record<string, string> （明文数据，自动 base64 编码存储）
      - immutable?: boolean （是否不可变）
  - Permission: `kubernetes:config:secret:edit`
- Mock
  - 函数：`/src/mock/kubernetes/config/secret.ts#updateSecretMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 更新 Secret（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑YAML”按钮点击
  - 权限限制：`kubernetes:config:secret:edit`
  - 路由跳转
    - Name: `kubernetes:config:secret:edit:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/edit/yaml`
    - Component: `/src/view/kubernetes/config/secret/edit/yaml.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/yaml`
  - Function: `void updateSecretYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Secret 名称）
    - yaml: string （Secret YAML 字符串）
  - Permission: `kubernetes:config:secret:edit`
- Mock
  - 函数：`/src/mock/kubernetes/config/secret.ts#updateSecretYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 管理 Secret 标签
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改标签”按钮点击
  - 权限限制：`kubernetes:config:secret:edit`
  - 路由跳转
    - Name: `kubernetes:config:secret:edit:labels`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/edit/labels`
    - Component: `/src/view/kubernetes/config/secret/edit/labels.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/secrets/:name/labels`
  - Function: `void manageSecretLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Secret 名称）
    - `MetadataLabelForm`（管理标签请求对象，来自 `/src/types/kubernetes/common.ts`）
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/config/secret.ts#manageSecretLabelMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 管理 Secret 注解
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改注解”按钮点击
  - 权限限制：`kubernetes:config:secret:edit`
  - 路由跳转
    - Name: `kubernetes:config:secret:edit:annotations`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/edit/annotations`
    - Component: `/src/view/kubernetes/config/secret/edit/annotations.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/secrets/:name/annotations`
  - Function: `void manageSecretAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Secret 名称）
    - `MetadataAnnotationForm`（管理注解请求对象，来自 `/src/types/kubernetes/common.ts`）
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/config/secret.ts#manageSecretAnnotationMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 删除 Secret
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“删除应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:config:secret:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name`
  - Function: `void deleteSecret(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Secret 名称）
  - Permission: `kubernetes:config:secret:delete`
- Mock
  - 函数：`/src/mock/kubernetes/config/secret.ts#deleteSecretMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 批量删除 Secret
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “删除”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:config:secret:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/secrets`
  - Function: `void deleteSecrets(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （Secret UID 列表）
  - Permission: `kubernetes:config:secret:delete`
- Mock
  - 函数：`/src/mock/kubernetes/config/secret.ts#deleteSecretsMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 导入 Secret
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导入”按钮点击，弹框（BeeDialog）进行文档上传
  - 权限限制：`kubernetes:config:secret:import`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/secrets/import`
  - Function: `void importSecret(clusterUid: string, data: SecretYamlForm)`
    - clusterUid: string （集群 UID）
    - `SecretYamlForm`（Secret YAML 导入请求对象）
      - yaml: string （Secret YAML 字符串）
  - Permission: `kubernetes:config:secret:import`
- Mock
  - 函数：`/src/mock/kubernetes/config/secret.ts#importSecretMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 导出 Secret
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导出”按钮点击，保存文档
  - 权限限制：`kubernetes:config:secret:export`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/secrets/export`
  - Function: `void exportSecret(clusterUid: string, params: Partial<SecretQueryForm>)`
    - clusterUid: string （集群 UID）
    - `SecretQueryForm` 共享【查看 Secret 列表】章节的实体定义
  - Permission: `kubernetes:config:secret:export`
- Mock
  - 函数：`/src/mock/kubernetes/config/secret.ts#exportSecretMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 克隆 Secret
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“克隆”按钮点击，弹框（BeeDialog）输入目标命名空间与名称并确认
  - 权限限制：`kubernetes:config:secret:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/clone`
  - Function: `void cloneSecret(clusterUid: string, namespace: string, name: string, data: SecretCloneForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （源 Secret 名称）
    - `SecretCloneForm`（Secret 克隆请求对象）
      - targetNamespace: string （目标命名空间名称，可跨命名空间克隆）
      - targetName: string （目标 Secret 名称）
  - Permission: `kubernetes:config:secret:create`
- Mock
  - 函数：`/src/mock/kubernetes/config/secret.ts#cloneSecretMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

---

