# PersistentVolumeClaim 功能

## 查看 PersistentVolumeClaim 列表
- 页面效果
  - 触发条件：功能菜单“PersistentVolumeClaim 管理”点击
  - 权限限制：`kubernetes:storage:persistentvolumeclaim:view`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolumeclaim`
    - Path: `/kubernetes/clusters/:clusterUid/persistentvolumeclaims`
    - Component: `/src/view/kubernetes/storage/persistentvolumeclaim/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/persistentvolumeclaims`
  - Function: `PageVo<PersistentVolumeClaimListVo> getPersistentVolumeClaimList(clusterUid: string, params: Partial<PersistentVolumeClaimQueryForm>)`
    - clusterUid: string （集群 UID）
    - `PersistentVolumeClaimQueryForm`（PersistentVolumeClaim 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （PersistentVolumeClaim 名称）
      - namespace: string （命名空间名称）
      - status: string （绑定状态，取值 Pending / Bound / Lost）
      - labelSelector: Record<string, string> （标签过滤）
    - `PersistentVolumeClaimListVo`（PersistentVolumeClaim 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （PersistentVolumeClaim 名称）
      - description?: string （PersistentVolumeClaim 描述）
      - status: string （绑定状态，取值 Pending / Bound / Lost）
      - volume: string （绑定的 PersistentVolume 名称）
      - capacity: Quantity （申请存储容量，详见 ### Quantity）
      - accessModes: PersistentVolumeAccessMode[] （访问模式，如 ReadWriteOnce / ReadOnlyMany / ReadWriteMany / ReadWriteOncePod）
      - storageClassName: string （关联的 StorageClass 名称）
      - volumeMode: PersistentVolumeMode （卷模式，取值 Filesystem / Block）
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolumeclaim.ts#getPersistentVolumeClaimListMock()`
  - 数据：`/src/mock/kubernetes/storage/persistentvolumeclaimData.ts#mockPersistentVolumeClaims`，模拟数量：32
  - 逻辑
    - 基于 `mockPersistentVolumeClaims` 进行 `namespace` 精准过滤，得到 `filteredNamespace`
    - 基于 `filteredNamespace` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `filteredNamespace` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 PersistentVolumeClaim 详情
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“详情”按钮点击
  - 权限限制：`kubernetes:storage:persistentvolumeclaim:view`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolumeclaim:detail`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name`
    - Component: `/src/view/kubernetes/storage/persistentvolumeclaim/detail/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name`
  - Function: `PersistentVolumeClaimDetailVo getPersistentVolumeClaimDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （PersistentVolumeClaim 名称）
    - `PersistentVolumeClaimDetailVo`（PersistentVolumeClaim 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （PersistentVolumeClaim 描述）
      - metadata: ObjectMeta （PersistentVolumeClaim 的资源元数据，详见 ### ObjectMeta）
      - spec: PersistentVolumeClaimSpec （PersistentVolumeClaim 的规格定义，详见 ### PersistentVolumeClaimSpec）
      - statusObj: PersistentVolumeClaimStatusObj （PersistentVolumeClaim 的观测状态，详见 ### PersistentVolumeClaimStatusObj）
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolumeclaim.ts#getPersistentVolumeClaimDetailMock()`
  - 数据：`/src/mock/kubernetes/storage/persistentvolumeclaimData.ts#mockPersistentVolumeClaimDetail`
  - 逻辑：直接返回 `mockPersistentVolumeClaimDetail`

## 查看 PersistentVolumeClaim YAML
- 页面效果
  - 触发条件：详情页 -> “YAML” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/yaml`
  - Function: `PersistentVolumeClaimYamlVo getPersistentVolumeClaimYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （PersistentVolumeClaim 名称）
    - `PersistentVolumeClaimYamlVo`: （PersistentVolumeClaim YAML 响应对象）
      - yaml: string（PersistentVolumeClaim YAML 文本）
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolumeclaim.ts#getPersistentVolumeClaimYamlMock()`
  - 数据：`/src/mock/kubernetes/storage/persistentvolumeclaimData.ts#mockPersistentVolumeClaimYaml`
  - 逻辑：直接返回 `mockPersistentVolumeClaimYaml`

## 创建 PersistentVolumeClaim
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “创建”按钮点击
  - 权限限制：`kubernetes:storage:persistentvolumeclaim:create`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolumeclaim:create`
    - Path: `/kubernetes/clusters/:clusterUid/persistentvolumeclaims/create`
    - Component: `/src/view/kubernetes/storage/persistentvolumeclaim/create.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/persistentvolumeclaims`
  - Function: `void createPersistentVolumeClaim(clusterUid: string, data: PersistentVolumeClaimCreateForm)`
    - clusterUid: string （集群 UID）
    - `PersistentVolumeClaimCreateForm`（PersistentVolumeClaim 创建请求对象）
      - description?: string （PersistentVolumeClaim 描述）
      - metadata: ObjectMeta （PersistentVolumeClaim 的资源元数据，详见 ### ObjectMeta）
      - namespace: string （目标命名空间名称）
      - accessModes: PersistentVolumeAccessMode[] （访问模式）
      - storageClassName?: string （关联的 StorageClass 名称）
      - resources: VolumeResourceRequirements （资源申请，详见 ### VolumeResourceRequirements）
      - volumeMode?: PersistentVolumeMode （卷模式，取值 Filesystem / Block）
      - dataSource?: string （数据源，引用的数据源名称）
  - Permission: `kubernetes:storage:persistentvolumeclaim:create`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolumeclaim.ts#createPersistentVolumeClaimMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 创建 PersistentVolumeClaim（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “YAML”按钮点击
  - 权限限制：`kubernetes:storage:persistentvolumeclaim:create`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolumeclaim:create:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/persistentvolumeclaims/create/yaml`
    - Component: `/src/view/kubernetes/storage/persistentvolumeclaim/create/yaml.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/persistentvolumeclaims/yaml`
  - Function: `void createPersistentVolumeClaimYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （PersistentVolumeClaim YAML 字符串）
  - Permission: `kubernetes:storage:persistentvolumeclaim:create`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolumeclaim.ts#createPersistentVolumeClaimYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 更新 PersistentVolumeClaim
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑应用”按钮点击
  - 权限限制：`kubernetes:storage:persistentvolumeclaim:edit`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolumeclaim:edit`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/edit`
    - Component: `/src/view/kubernetes/storage/persistentvolumeclaim/edit.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/persistentvolumeclaims/:name`
  - Function: `void updatePersistentVolumeClaim(clusterUid: string, namespace: string, name: string, data: PersistentVolumeClaimUpdateForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （PersistentVolumeClaim 名称）
    - `PersistentVolumeClaimUpdateForm`（PersistentVolumeClaim 更新请求对象）
      - description?: string （PersistentVolumeClaim 描述）
      - metadata: ObjectMeta （PersistentVolumeClaim 的资源元数据，详见 ### ObjectMeta）
      - accessModes: PersistentVolumeAccessMode[] （访问模式）
      - resources: VolumeResourceRequirements （资源申请，详见 ### VolumeResourceRequirements）
  - Permission: `kubernetes:storage:persistentvolumeclaim:edit`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolumeclaim.ts#updatePersistentVolumeClaimMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 更新 PersistentVolumeClaim（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑YAML”按钮点击
  - 权限限制：`kubernetes:storage:persistentvolumeclaim:edit`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolumeclaim:edit:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/edit/yaml`
    - Component: `/src/view/kubernetes/storage/persistentvolumeclaim/edit/yaml.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/yaml`
  - Function: `void updatePersistentVolumeClaimYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （PersistentVolumeClaim 名称）
    - yaml: string （PersistentVolumeClaim YAML 字符串）
  - Permission: `kubernetes:storage:persistentvolumeclaim:edit`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolumeclaim.ts#updatePersistentVolumeClaimYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 管理 PersistentVolumeClaim 标签
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改标签”按钮点击
  - 权限限制：`kubernetes:storage:persistentvolumeclaim:edit`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolumeclaim:edit:labels`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/edit/labels`
    - Component: `/src/view/kubernetes/storage/persistentvolumeclaim/edit/labels.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/persistentvolumeclaims/:name/labels`
  - Function: `void managePersistentVolumeClaimLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （PersistentVolumeClaim 名称）
    - `MetadataLabelForm`（管理标签请求对象，来自 `/src/types/kubernetes/common.ts`）
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolumeclaim.ts#managePersistentVolumeClaimLabelMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 管理 PersistentVolumeClaim 注解
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改注解”按钮点击
  - 权限限制：`kubernetes:storage:persistentvolumeclaim:edit`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolumeclaim:edit:annotations`
    - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/edit/annotations`
    - Component: `/src/view/kubernetes/storage/persistentvolumeclaim/edit/annotations.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/persistentvolumeclaims/:name/annotations`
  - Function: `void managePersistentVolumeClaimAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （PersistentVolumeClaim 名称）
    - `MetadataAnnotationForm`（管理注解请求对象，来自 `/src/types/kubernetes/common.ts`）
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolumeclaim.ts#managePersistentVolumeClaimAnnotationMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 删除 PersistentVolumeClaim
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“删除应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:storage:persistentvolumeclaim:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name`
  - Function: `void deletePersistentVolumeClaim(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （PersistentVolumeClaim 名称）
  - Permission: `kubernetes:storage:persistentvolumeclaim:delete`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolumeclaim.ts#deletePersistentVolumeClaimMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 批量删除 PersistentVolumeClaim
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “删除”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:storage:persistentvolumeclaim:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/persistentvolumeclaims`
  - Function: `void deletePersistentVolumeClaims(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （PersistentVolumeClaim UID 列表）
  - Permission: `kubernetes:storage:persistentvolumeclaim:delete`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolumeclaim.ts#deletePersistentVolumeClaimsMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 导入 PersistentVolumeClaim
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导入”按钮点击，弹框（BeeDialog）进行文档上传
  - 权限限制：`kubernetes:storage:persistentvolumeclaim:import`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/persistentvolumeclaims/import`
  - Function: `void importPersistentVolumeClaim(clusterUid: string, data: PersistentVolumeClaimYamlForm)`
    - clusterUid: string （集群 UID）
    - `PersistentVolumeClaimYamlForm`（PersistentVolumeClaim YAML 导入请求对象）
      - yaml: string （PersistentVolumeClaim YAML 字符串）
  - Permission: `kubernetes:storage:persistentvolumeclaim:import`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolumeclaim.ts#importPersistentVolumeClaimMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 导出 PersistentVolumeClaim
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导出”按钮点击，保存文档
  - 权限限制：`kubernetes:storage:persistentvolumeclaim:export`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/persistentvolumeclaims/export`
  - Function: `void exportPersistentVolumeClaim(clusterUid: string, params: Partial<PersistentVolumeClaimQueryForm>)`
    - clusterUid: string （集群 UID）
    - `PersistentVolumeClaimQueryForm` 共享【查看 PersistentVolumeClaim 列表】章节的实体定义
  - Permission: `kubernetes:storage:persistentvolumeclaim:export`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolumeclaim.ts#exportPersistentVolumeClaimMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 克隆 PersistentVolumeClaim
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“克隆”按钮点击，弹框（BeeDialog）输入目标命名空间与名称并确认
  - 权限限制：`kubernetes:storage:persistentvolumeclaim:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/clone`
  - Function: `void clonePersistentVolumeClaim(clusterUid: string, namespace: string, name: string, data: PersistentVolumeClaimCloneForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （源 PersistentVolumeClaim 名称）
    - `PersistentVolumeClaimCloneForm`（PersistentVolumeClaim 克隆请求对象）
      - targetNamespace: string （目标命名空间名称，可跨命名空间克隆）
      - targetName: string （目标 PersistentVolumeClaim 名称）
  - Permission: `kubernetes:storage:persistentvolumeclaim:create`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolumeclaim.ts#clonePersistentVolumeClaimMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

---

# PersistentVolume 功能

## 查看 PersistentVolume 列表
- 页面效果
  - 触发条件：功能菜单“PersistentVolume 管理”点击
  - 权限限制：`kubernetes:storage:persistentvolume:view`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolume`
    - Path: `/kubernetes/clusters/:clusterUid/persistentvolumes`
    - Component: `/src/view/kubernetes/storage/persistentvolume/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/persistentvolumes`
  - Function: `PageVo<PersistentVolumeListVo> getPersistentVolumeList(clusterUid: string, params: Partial<PersistentVolumeQueryForm>)`
    - clusterUid: string （集群 UID）
    - `PersistentVolumeQueryForm`（PersistentVolume 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （PersistentVolume 名称）
      - status: string （状态，取值 Available / Bound / Released / Failed）
      - labelSelector: Record<string, string> （标签过滤）
    - `PersistentVolumeListVo`（PersistentVolume 列表项响应对象） 继承 `UidEntity`, `Clustered`, `AuditEntity`, `DeletableEntity`
      - name: string （PersistentVolume 名称）
      - description?: string （PersistentVolume 描述）
      - status: string （状态，取值 Available / Bound / Released / Failed）
      - capacity: Quantity （存储容量，详见 ### Quantity）
      - accessModes: PersistentVolumeAccessMode[] （访问模式）
      - reclaimPolicy: string （回收策略，取值 Delete / Retain / Recycle）
      - storageClassName: string （关联的 StorageClass 名称）
      - claimRef: string （绑定的 PersistentVolumeClaim 名称）
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolume.ts#getPersistentVolumeListMock()`
  - 数据：`/src/mock/kubernetes/storage/persistentvolumeData.ts#mockPersistentVolumes`，模拟数量：32
  - 逻辑
    - 基于 `mockPersistentVolumes` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `mockPersistentVolumes` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 PersistentVolume 详情
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“详情”按钮点击
  - 权限限制：`kubernetes:storage:persistentvolume:view`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolume:detail`
    - Path: `/kubernetes/clusters/:clusterUid/persistentvolumes/:name`
    - Component: `/src/view/kubernetes/storage/persistentvolume/detail/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/persistentvolumes/:name`
  - Function: `PersistentVolumeDetailVo getPersistentVolumeDetail(clusterUid: string, name: string)`
    - clusterUid: string （集群 UID）
    - name: string （PersistentVolume 名称）
    - `PersistentVolumeDetailVo`（PersistentVolume 详情响应对象） 继承 `UidEntity`, `Clustered`, `AuditEntity`, `DeletableEntity`
      - description?: string （PersistentVolume 描述）
      - metadata: ObjectMeta （PersistentVolume 的资源元数据，详见 ### ObjectMeta）
      - spec: PersistentVolumeSpec （PersistentVolume 的规格定义，详见 ### PersistentVolumeSpec）
      - statusObj: PersistentVolumeStatusObj （PersistentVolume 的观测状态，详见 ### PersistentVolumeStatusObj）
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolume.ts#getPersistentVolumeDetailMock()`
  - 数据：`/src/mock/kubernetes/storage/persistentvolumeData.ts#mockPersistentVolumeDetail`
  - 逻辑：直接返回 `mockPersistentVolumeDetail`

## 查看 PersistentVolume YAML
- 页面效果
  - 触发条件：详情页 -> “YAML” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/persistentvolumes/:name/yaml`
  - Function: `PersistentVolumeYamlVo getPersistentVolumeYaml(clusterUid: string, name: string)`
    - clusterUid: string （集群 UID）
    - name: string （PersistentVolume 名称）
    - `PersistentVolumeYamlVo`: （PersistentVolume YAML 响应对象）
      - yaml: string（PersistentVolume YAML 文本）
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolume.ts#getPersistentVolumeYamlMock()`
  - 数据：`/src/mock/kubernetes/storage/persistentvolumeData.ts#mockPersistentVolumeYaml`
  - 逻辑：直接返回 `mockPersistentVolumeYaml`

## 创建 PersistentVolume
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “创建”按钮点击
  - 权限限制：`kubernetes:storage:persistentvolume:create`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolume:create`
    - Path: `/kubernetes/clusters/:clusterUid/persistentvolumes/create`
    - Component: `/src/view/kubernetes/storage/persistentvolume/create.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/persistentvolumes`
  - Function: `void createPersistentVolume(clusterUid: string, data: PersistentVolumeCreateForm)`
    - clusterUid: string （集群 UID）
    - `PersistentVolumeCreateForm`（PersistentVolume 创建请求对象）
      - description?: string （PersistentVolume 描述）
      - metadata: ObjectMeta （PersistentVolume 的资源元数据，详见 ### ObjectMeta）
      - capacity: Quantity （存储容量，详见 ### Quantity）
      - accessModes: PersistentVolumeAccessMode[] （访问模式）
      - reclaimPolicy?: string （回收策略）
      - storageClassName?: string （关联的 StorageClass 名称）
      - persistentVolumeSource: PersistentVolumeSource （存储后端来源，详见 ### PersistentVolumeSource）
  - Permission: `kubernetes:storage:persistentvolume:create`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolume.ts#createPersistentVolumeMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 创建 PersistentVolume（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “YAML”按钮点击
  - 权限限制：`kubernetes:storage:persistentvolume:create`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolume:create:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/persistentvolumes/create/yaml`
    - Component: `/src/view/kubernetes/storage/persistentvolume/create/yaml.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/persistentvolumes/yaml`
  - Function: `void createPersistentVolumeYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （PersistentVolume YAML 字符串）
  - Permission: `kubernetes:storage:persistentvolume:create`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolume.ts#createPersistentVolumeYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 更新 PersistentVolume
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑应用”按钮点击
  - 权限限制：`kubernetes:storage:persistentvolume:edit`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolume:edit`
    - Path: `/kubernetes/clusters/:clusterUid/persistentvolumes/:name/edit`
    - Component: `/src/view/kubernetes/storage/persistentvolume/edit.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/persistentvolumes/:name`
  - Function: `void updatePersistentVolume(clusterUid: string, name: string, data: PersistentVolumeUpdateForm)`
    - clusterUid: string （集群 UID）
    - name: string （PersistentVolume 名称）
    - `PersistentVolumeUpdateForm`（PersistentVolume 更新请求对象）
      - description?: string （PersistentVolume 描述）
      - metadata: ObjectMeta （PersistentVolume 的资源元数据，详见 ### ObjectMeta）
      - accessModes: PersistentVolumeAccessMode[] （访问模式）
      - reclaimPolicy?: string （回收策略）
  - Permission: `kubernetes:storage:persistentvolume:edit`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolume.ts#updatePersistentVolumeMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 更新 PersistentVolume（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑YAML”按钮点击
  - 权限限制：`kubernetes:storage:persistentvolume:edit`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolume:edit:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/persistentvolumes/:name/edit/yaml`
    - Component: `/src/view/kubernetes/storage/persistentvolume/edit/yaml.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/persistentvolumes/:name/yaml`
  - Function: `void updatePersistentVolumeYaml(clusterUid: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - name: string （PersistentVolume 名称）
    - yaml: string （PersistentVolume YAML 字符串）
  - Permission: `kubernetes:storage:persistentvolume:edit`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolume.ts#updatePersistentVolumeYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 管理 PersistentVolume 标签
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改标签”按钮点击
  - 权限限制：`kubernetes:storage:persistentvolume:edit`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolume:edit:labels`
    - Path: `/kubernetes/clusters/:clusterUid/persistentvolumes/:name/edit/labels`
    - Component: `/src/view/kubernetes/storage/persistentvolume/edit/labels.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/persistentvolumes/:name/labels`
  - Function: `void managePersistentVolumeLabel(clusterUid: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - name: string （PersistentVolume 名称）
    - `MetadataLabelForm`（管理标签请求对象，来自 `/src/types/kubernetes/common.ts`）
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolume.ts#managePersistentVolumeLabelMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 管理 PersistentVolume 注解
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改注解”按钮点击
  - 权限限制：`kubernetes:storage:persistentvolume:edit`
  - 路由跳转
    - Name: `kubernetes:storage:persistentvolume:edit:annotations`
    - Path: `/kubernetes/clusters/:clusterUid/persistentvolumes/:name/edit/annotations`
    - Component: `/src/view/kubernetes/storage/persistentvolume/edit/annotations.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/persistentvolumes/:name/annotations`
  - Function: `void managePersistentVolumeAnnotation(clusterUid: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - name: string （PersistentVolume 名称）
    - `MetadataAnnotationForm`（管理注解请求对象，来自 `/src/types/kubernetes/common.ts`）
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolume.ts#managePersistentVolumeAnnotationMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 删除 PersistentVolume
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“删除应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:storage:persistentvolume:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/persistentvolumes/:name`
  - Function: `void deletePersistentVolume(clusterUid: string, name: string)`
    - clusterUid: string （集群 UID）
    - name: string （PersistentVolume 名称）
  - Permission: `kubernetes:storage:persistentvolume:delete`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolume.ts#deletePersistentVolumeMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 批量删除 PersistentVolume
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “删除”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:storage:persistentvolume:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/persistentvolumes`
  - Function: `void deletePersistentVolumes(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （PersistentVolume UID 列表）
  - Permission: `kubernetes:storage:persistentvolume:delete`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolume.ts#deletePersistentVolumesMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 导入 PersistentVolume
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导入”按钮点击，弹框（BeeDialog）进行文档上传
  - 权限限制：`kubernetes:storage:persistentvolume:import`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/persistentvolumes/import`
  - Function: `void importPersistentVolume(clusterUid: string, data: PersistentVolumeYamlForm)`
    - clusterUid: string （集群 UID）
    - `PersistentVolumeYamlForm`（PersistentVolume YAML 导入请求对象）
      - yaml: string （PersistentVolume YAML 字符串）
  - Permission: `kubernetes:storage:persistentvolume:import`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolume.ts#importPersistentVolumeMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 导出 PersistentVolume
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导出”按钮点击，保存文档
  - 权限限制：`kubernetes:storage:persistentvolume:export`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/persistentvolumes/export`
  - Function: `void exportPersistentVolume(clusterUid: string, params: Partial<PersistentVolumeQueryForm>)`
    - clusterUid: string （集群 UID）
    - `PersistentVolumeQueryForm` 共享【查看 PersistentVolume 列表】章节的实体定义
  - Permission: `kubernetes:storage:persistentvolume:export`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolume.ts#exportPersistentVolumeMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 克隆 PersistentVolume
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“克隆”按钮点击，弹框（BeeDialog）输入目标名称并确认
  - 权限限制：`kubernetes:storage:persistentvolume:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/persistentvolumes/:name/clone`
  - Function: `void clonePersistentVolume(clusterUid: string, name: string, data: PersistentVolumeCloneForm)`
    - clusterUid: string （集群 UID）
    - name: string （源 PersistentVolume 名称）
    - `PersistentVolumeCloneForm`（PersistentVolume 克隆请求对象）
      - targetName: string （目标 PersistentVolume 名称）
  - Permission: `kubernetes:storage:persistentvolume:create`
- Mock
  - 函数：`/src/mock/kubernetes/storage/persistentvolume.ts#clonePersistentVolumeMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

---

# StorageClass 功能

## 查看 StorageClass 列表
- 页面效果
  - 触发条件：功能菜单“StorageClass 管理”点击
  - 权限限制：`kubernetes:storage:storageclass:view`
  - 路由跳转
    - Name: `kubernetes:storage:storageclass`
    - Path: `/kubernetes/clusters/:clusterUid/storageclasses`
    - Component: `/src/view/kubernetes/storage/storageclass/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/storageclasses`
  - Function: `PageVo<StorageClassListVo> getStorageClassList(clusterUid: string, params: Partial<StorageClassQueryForm>)`
    - clusterUid: string （集群 UID）
    - `StorageClassQueryForm`（StorageClass 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （StorageClass 名称）
      - labelSelector: Record<string, string> （标签过滤）
    - `StorageClassListVo`（StorageClass 列表项响应对象） 继承 `UidEntity`, `Clustered`, `AuditEntity`, `DeletableEntity`
      - name: string （StorageClass 名称）
      - description?: string （StorageClass 描述）
      - provisioner: string （存储插件供应商）
      - reclaimPolicy: string （回收策略，取值 Delete / Retain）
      - volumeBindingMode: string （卷绑定模式，取值 Immediate / WaitForFirstConsumer）
      - allowVolumeExpansion: boolean （是否允许卷扩容）
- Mock
  - 函数：`/src/mock/kubernetes/storage/storageclass.ts#getStorageClassListMock()`
  - 数据：`/src/mock/kubernetes/storage/storageclassData.ts#mockStorageClasses`，模拟数量：32
  - 逻辑
    - 基于 `mockStorageClasses` 进行 `uid` 精准过滤，得到 `filteredUid`
    - 基于 `mockStorageClasses` 进行 `name` 模糊过滤，得到 `filteredName`
    - 基于 `filteredUid` 和 `filteredName` 求合集，得到 `matched`
    - 基于 `matched`、`page`、`pageSize` 计算截取并构建返回对象

## 查看 StorageClass 详情
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“详情”按钮点击
  - 权限限制：`kubernetes:storage:storageclass:view`
  - 路由跳转
    - Name: `kubernetes:storage:storageclass:detail`
    - Path: `/kubernetes/clusters/:clusterUid/storageclasses/:name`
    - Component: `/src/view/kubernetes/storage/storageclass/detail/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/storageclasses/:name`
  - Function: `StorageClassDetailVo getStorageClassDetail(clusterUid: string, name: string)`
    - clusterUid: string （集群 UID）
    - name: string （StorageClass 名称）
    - `StorageClassDetailVo`（StorageClass 详情响应对象） 继承 `UidEntity`, `Clustered`, `AuditEntity`, `DeletableEntity`
      - description?: string （StorageClass 描述）
      - metadata: ObjectMeta （StorageClass 的资源元数据，详见 ### ObjectMeta）
      - provisioner: string （存储插件供应商）
      - parameters: Record<string, string> （存储插件参数）
      - reclaimPolicy: string （回收策略）
      - volumeBindingMode: string （卷绑定模式）
      - allowVolumeExpansion: boolean （是否允许卷扩容）
- Mock
  - 函数：`/src/mock/kubernetes/storage/storageclass.ts#getStorageClassDetailMock()`
  - 数据：`/src/mock/kubernetes/storage/storageclassData.ts#mockStorageClassDetail`
  - 逻辑：直接返回 `mockStorageClassDetail`

## 查看 StorageClass YAML
- 页面效果
  - 触发条件：详情页 -> “YAML” TAB 点击
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/storageclasses/:name/yaml`
  - Function: `StorageClassYamlVo getStorageClassYaml(clusterUid: string, name: string)`
    - clusterUid: string （集群 UID）
    - name: string （StorageClass 名称）
    - `StorageClassYamlVo`: （StorageClass YAML 响应对象）
      - yaml: string（StorageClass YAML 文本）
- Mock
  - 函数：`/src/mock/kubernetes/storage/storageclass.ts#getStorageClassYamlMock()`
  - 数据：`/src/mock/kubernetes/storage/storageclassData.ts#mockStorageClassYaml`
  - 逻辑：直接返回 `mockStorageClassYaml`

## 创建 StorageClass
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “创建”按钮点击
  - 权限限制：`kubernetes:storage:storageclass:create`
  - 路由跳转
    - Name: `kubernetes:storage:storageclass:create`
    - Path: `/kubernetes/clusters/:clusterUid/storageclasses/create`
    - Component: `/src/view/kubernetes/storage/storageclass/create.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/storageclasses`
  - Function: `void createStorageClass(clusterUid: string, data: StorageClassCreateForm)`
    - clusterUid: string （集群 UID）
    - `StorageClassCreateForm`（StorageClass 创建请求对象）
      - description?: string （StorageClass 描述）
      - metadata: ObjectMeta （StorageClass 的资源元数据，详见 ### ObjectMeta）
      - provisioner: string （存储插件供应商）
      - parameters: Record<string, string> （存储插件参数）
      - reclaimPolicy?: string （回收策略）
      - volumeBindingMode?: string （卷绑定模式）
      - allowVolumeExpansion?: boolean （是否允许卷扩容）
  - Permission: `kubernetes:storage:storageclass:create`
- Mock
  - 函数：`/src/mock/kubernetes/storage/storageclass.ts#createStorageClassMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 创建 StorageClass（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 工具栏 -> “YAML”按钮点击
  - 权限限制：`kubernetes:storage:storageclass:create`
  - 路由跳转
    - Name: `kubernetes:storage:storageclass:create:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/storageclasses/create/yaml`
    - Component: `/src/view/kubernetes/storage/storageclass/create/yaml.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/storageclasses/yaml`
  - Function: `void createStorageClassYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （StorageClass YAML 字符串）
  - Permission: `kubernetes:storage:storageclass:create`
- Mock
  - 函数：`/src/mock/kubernetes/storage/storageclass.ts#createStorageClassYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 更新 StorageClass
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑应用”按钮点击
  - 权限限制：`kubernetes:storage:storageclass:edit`
  - 路由跳转
    - Name: `kubernetes:storage:storageclass:edit`
    - Path: `/kubernetes/clusters/:clusterUid/storageclasses/:name/edit`
    - Component: `/src/view/kubernetes/storage/storageclass/edit.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/storageclasses/:name`
  - Function: `void updateStorageClass(clusterUid: string, name: string, data: StorageClassUpdateForm)`
    - clusterUid: string （集群 UID）
    - name: string （StorageClass 名称）
    - `StorageClassUpdateForm`（StorageClass 更新请求对象）
      - description?: string （StorageClass 描述）
      - metadata: ObjectMeta （StorageClass 的资源元数据，详见 ### ObjectMeta）
      - parameters: Record<string, string> （存储插件参数）
      - reclaimPolicy?: string （回收策略）
      - allowVolumeExpansion?: boolean （是否允许卷扩容）
  - Permission: `kubernetes:storage:storageclass:edit`
- Mock
  - 函数：`/src/mock/kubernetes/storage/storageclass.ts#updateStorageClassMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 更新 StorageClass（YAML 方式）
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“编辑YAML”按钮点击
  - 权限限制：`kubernetes:storage:storageclass:edit`
  - 路由跳转
    - Name: `kubernetes:storage:storageclass:edit:yaml`
    - Path: `/kubernetes/clusters/:clusterUid/storageclasses/:name/edit/yaml`
    - Component: `/src/view/kubernetes/storage/storageclass/edit/yaml.vue`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/storageclasses/:name/yaml`
  - Function: `void updateStorageClassYaml(clusterUid: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - name: string （StorageClass 名称）
    - yaml: string （StorageClass YAML 字符串）
  - Permission: `kubernetes:storage:storageclass:edit`
- Mock
  - 函数：`/src/mock/kubernetes/storage/storageclass.ts#updateStorageClassYamlMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 管理 StorageClass 标签
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改标签”按钮点击
  - 权限限制：`kubernetes:storage:storageclass:edit`
  - 路由跳转
    - Name: `kubernetes:storage:storageclass:edit:labels`
    - Path: `/kubernetes/clusters/:clusterUid/storageclasses/:name/edit/labels`
    - Component: `/src/view/kubernetes/storage/storageclass/edit/labels.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/storageclasses/:name/labels`
  - Function: `void manageStorageClassLabel(clusterUid: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - name: string （StorageClass 名称）
    - `MetadataLabelForm`（管理标签请求对象，来自 `/src/types/kubernetes/common.ts`）
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/storage/storageclass.ts#manageStorageClassLabelMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 管理 StorageClass 注解
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“修改注解”按钮点击
  - 权限限制：`kubernetes:storage:storageclass:edit`
  - 路由跳转
    - Name: `kubernetes:storage:storageclass:edit:annotations`
    - Path: `/kubernetes/clusters/:clusterUid/storageclasses/:name/edit/annotations`
    - Component: `/src/view/kubernetes/storage/storageclass/edit/annotations.vue`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/storageclasses/:name/annotations`
  - Function: `void manageStorageClassAnnotation(clusterUid: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - name: string （StorageClass 名称）
    - `MetadataAnnotationForm`（管理注解请求对象，来自 `/src/types/kubernetes/common.ts`）
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）
- Mock
  - 函数：`/src/mock/kubernetes/storage/storageclass.ts#manageStorageClassAnnotationMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 删除 StorageClass
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“删除应用”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:storage:storageclass:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/storageclasses/:name`
  - Function: `void deleteStorageClass(clusterUid: string, name: string)`
    - clusterUid: string （集群 UID）
    - name: string （StorageClass 名称）
  - Permission: `kubernetes:storage:storageclass:delete`
- Mock
  - 函数：`/src/mock/kubernetes/storage/storageclass.ts#deleteStorageClassMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 批量删除 StorageClass
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “删除”按钮点击，弹框（BeeDialog）进行二次确认
  - 权限限制：`kubernetes:storage:storageclass:delete`
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/storageclasses`
  - Function: `void deleteStorageClasses(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （StorageClass UID 列表）
  - Permission: `kubernetes:storage:storageclass:delete`
- Mock
  - 函数：`/src/mock/kubernetes/storage/storageclass.ts#deleteStorageClassesMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`

## 导入 StorageClass
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导入”按钮点击，弹框（BeeDialog）进行文档上传
  - 权限限制：`kubernetes:storage:storageclass:import`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/storageclasses/import`
  - Function: `void importStorageClass(clusterUid: string, data: StorageClassYamlForm)`
    - clusterUid: string （集群 UID）
    - `StorageClassYamlForm`（StorageClass YAML 导入请求对象）
      - yaml: string （StorageClass YAML 字符串）
  - Permission: `kubernetes:storage:storageclass:import`
- Mock
  - 函数：`/src/mock/kubernetes/storage/storageclass.ts#importStorageClassMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名')`

## 导出 StorageClass
- 页面效果
  - 触发条件：列表页 -> 底部栏 -> “导出”按钮点击，保存文档
  - 权限限制：`kubernetes:storage:storageclass:export`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/storageclasses/export`
  - Function: `void exportStorageClass(clusterUid: string, params: Partial<StorageClassQueryForm>)`
    - clusterUid: string （集群 UID）
    - `StorageClassQueryForm` 共享【查看 StorageClass 列表】章节的实体定义
  - Permission: `kubernetes:storage:storageclass:export`
- Mock
  - 函数：`/src/mock/kubernetes/storage/storageclass.ts#exportStorageClassMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)

## 克隆 StorageClass
- 页面效果
  - 触发条件：列表页 -> 表格 -> 行内“克隆”按钮点击，弹框（BeeDialog）输入目标名称并确认
  - 权限限制：`kubernetes:storage:storageclass:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/storageclasses/:name/clone`
  - Function: `void cloneStorageClass(clusterUid: string, name: string, data: StorageClassCloneForm)`
    - clusterUid: string （集群 UID）
    - name: string （源 StorageClass 名称）
    - `StorageClassCloneForm`（StorageClass 克隆请求对象）
      - targetName: string （目标 StorageClass 名称）
  - Permission: `kubernetes:storage:storageclass:create`
- Mock
  - 函数：`/src/mock/kubernetes/storage/storageclass.ts#cloneStorageClassMock()`
  - 逻辑
    - 不实现逻辑，直接打印一句日志，格式：`console.log('[Mock] 方法名', ...入参)`
