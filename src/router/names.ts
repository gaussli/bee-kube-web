export const RootRouteNames = {
  Root: {
    Login: 'login',
    Forbidden: '403',
    KubernetesDashboard: 'kubernetes:dashboard',
    PlatformDashboard: 'platform:dashboard',
  },
} as const

export const PlatformRouteNames = {
  User: {
    List: 'platform:system:user',
    Detail: 'platform:system:user:detail',
    Create: 'platform:system:user:create',
    Edit: 'platform:system:user:edit',
    AssignRoles: 'platform:system:user:assign-roles',
    AssignGroups: 'platform:system:user:assign-groups',
    AssignOrgs: 'platform:system:user:assign-orgs',
  },
  Group: {
    List: 'platform:system:group',
    Detail: 'platform:system:group:detail',
    Create: 'platform:system:group:create',
    Edit: 'platform:system:group:edit',
    AssignUsers: 'platform:system:group:assign-users',
    AssignRoles: 'platform:system:group:assign-roles',
  },
  Org: {
    List: 'platform:system:org',
    Detail: 'platform:system:org:detail',
    Create: 'platform:system:org:create',
    Edit: 'platform:system:org:edit',
    AssignUsers: 'platform:system:org:assign-users',
    AssignRoles: 'platform:system:org:assign-roles',
  },
  Role: {
    List: 'platform:system:role',
    Detail: 'platform:system:role:detail',
    Create: 'platform:system:role:create',
    Edit: 'platform:system:role:edit',
    AssignUsers: 'platform:system:role:assign-users',
    AssignGroups: 'platform:system:role:assign-groups',
    AssignOrgs: 'platform:system:role:assign-orgs',
    AssignPermissions: 'platform:system:role:assign-permissions',
  },
  Permission: {
    List: 'platform:system:permission',
    Detail: 'platform:system:permission:detail',
    Create: 'platform:system:permission:create',
    Edit: 'platform:system:permission:edit',
    AssignRoles: 'platform:system:permission:assign-roles',
  },
  Menu: {
    List: 'platform:system:menu',
    Detail: 'platform:system:menu:detail',
    Create: 'platform:system:menu:create',
    Edit: 'platform:system:menu:edit',
  },
} as const

export const KubernetesRouteNames = {
  Cluster: {
    List: 'kubernetes:cluster',
    Register: 'kubernetes:cluster:register',
    Edit: 'kubernetes:cluster:edit',
  },

  Node: {
    List: 'kubernetes:node',
    Detail: 'kubernetes:node:detail',
    ManageLabels: 'kubernetes:node:manage-labels',
    ManageAnnotations: 'kubernetes:node:manage-annotations',
    ManageTopologies: 'kubernetes:node:manage-topologies',
  },

  CustomResourceDefinition: {
    List: 'kubernetes:storage:customresourcedefinition',
    Detail: 'kubernetes:storage:customresourcedefinition:detail',
    Create: 'kubernetes:storage:customresourcedefinition:create',
    CreateYaml: 'kubernetes:storage:customresourcedefinition:create:yaml',
    Edit: 'kubernetes:storage:customresourcedefinition:edit',
    EditYaml: 'kubernetes:storage:customresourcedefinition:edit:yaml',
  },

  Namespace: {
    List: 'kubernetes:namespace',
    Detail: 'kubernetes:namespace:detail',
    Create: 'kubernetes:namespace:create',
    CreateYaml: 'kubernetes:namespace:create:yaml',
    Edit: 'kubernetes:namespace:edit',
    EditYaml: 'kubernetes:namespace:edit:yaml',
    ManageLabels: 'kubernetes:namespace:manage-labels',
    ManageAnnotations: 'kubernetes:namespace:manage-annotations',
  },

  ResourceQuota: {
    List: 'kubernetes:resourcequota',
    Detail: 'kubernetes:resourcequota:detail',
    Create: 'kubernetes:resourcequota:create',
    CreateYaml: 'kubernetes:resourcequota:create:yaml',
    Edit: 'kubernetes:resourcequota:edit',
    EditYaml: 'kubernetes:resourcequota:edit:yaml',
  },

  LimitRange: {
    List: 'kubernetes:limitrange',
    Detail: 'kubernetes:limitrange:detail',
    Create: 'kubernetes:limitrange:create',
    CreateYaml: 'kubernetes:limitrange:create:yaml',
    Edit: 'kubernetes:limitrange:edit',
    EditYaml: 'kubernetes:limitrange:edit:yaml',
  },

  Deployment: {
    List: 'kubernetes:workload:deployment',
    Detail: 'kubernetes:workload:deployment:detail',
    Create: 'kubernetes:workload:deployment:create',
    CreateYaml: 'kubernetes:workload:deployment:create:yaml',
    Edit: 'kubernetes:workload:deployment:edit',
    EditYaml: 'kubernetes:workload:deployment:edit:yaml',
    ManageLabels: 'kubernetes:workload:deployment:manage-labels',
    ManageAnnotations: 'kubernetes:workload:deployment:manage-annotations',
  },

  StatefulSet: {
    List: 'kubernetes:workload:statefulset',
    Detail: 'kubernetes:workload:statefulset:detail',
    Create: 'kubernetes:workload:statefulset:create',
    CreateYaml: 'kubernetes:workload:statefulset:create:yaml',
    Edit: 'kubernetes:workload:statefulset:edit',
    EditYaml: 'kubernetes:workload:statefulset:edit:yaml',
    ManageLabels: 'kubernetes:workload:statefulset:manage-labels',
    ManageAnnotations: 'kubernetes:workload:statefulset:manage-annotations',
  },

  DaemonSet: {
    List: 'kubernetes:workload:daemonset',
    Detail: 'kubernetes:workload:daemonset:detail',
    Create: 'kubernetes:workload:daemonset:create',
    CreateYaml: 'kubernetes:workload:daemonset:create:yaml',
    Edit: 'kubernetes:workload:daemonset:edit',
    EditYaml: 'kubernetes:workload:daemonset:edit:yaml',
    ManageLabels: 'kubernetes:workload:daemonset:manage-labels',
    ManageAnnotations: 'kubernetes:workload:daemonset:manage-annotations',
  },

  Job: {
    List: 'kubernetes:workload:job',
    Detail: 'kubernetes:workload:job:detail',
    Create: 'kubernetes:workload:job:create',
    CreateYaml: 'kubernetes:workload:job:create:yaml',
    Edit: 'kubernetes:workload:job:edit',
    EditYaml: 'kubernetes:workload:job:edit:yaml',
    ManageLabels: 'kubernetes:workload:job:manage-labels',
    ManageAnnotations: 'kubernetes:workload:job:manage-annotations',
  },

  CronJob: {
    List: 'kubernetes:workload:cronjob',
    Detail: 'kubernetes:workload:cronjob:detail',
    Create: 'kubernetes:workload:cronjob:create',
    CreateYaml: 'kubernetes:workload:cronjob:create:yaml',
    Edit: 'kubernetes:workload:cronjob:edit',
    EditYaml: 'kubernetes:workload:cronjob:edit:yaml',
    ManageLabels: 'kubernetes:workload:cronjob:manage-labels',
    ManageAnnotations: 'kubernetes:workload:cronjob:manage-annotations',
  },

  ConfigMap: {
    List: 'kubernetes:config:configmap',
    Detail: 'kubernetes:config:configmap:detail',
    Create: 'kubernetes:config:configmap:create',
    CreateYaml: 'kubernetes:config:configmap:create:yaml',
    Edit: 'kubernetes:config:configmap:edit',
    EditYaml: 'kubernetes:config:configmap:edit:yaml',
    ManageLabels: 'kubernetes:config:configmap:manage-labels',
    ManageAnnotations: 'kubernetes:config:configmap:manage-annotations',
  },

  Secret: {
    List: 'kubernetes:config:secret',
    Detail: 'kubernetes:config:secret:detail',
    Create: 'kubernetes:config:secret:create',
    CreateYaml: 'kubernetes:config:secret:create:yaml',
    Edit: 'kubernetes:config:secret:edit',
    EditYaml: 'kubernetes:config:secret:edit:yaml',
    ManageLabels: 'kubernetes:config:secret:manage-labels',
    ManageAnnotations: 'kubernetes:config:secret:manage-annotations',
  },

  Service: {
    List: 'kubernetes:network:service',
    Detail: 'kubernetes:network:service:detail',
    Create: 'kubernetes:network:service:create',
    CreateYaml: 'kubernetes:network:service:create:yaml',
    Edit: 'kubernetes:network:service:edit',
    EditYaml: 'kubernetes:network:service:edit:yaml',
    ManageLabels: 'kubernetes:network:service:manage-labels',
    ManageAnnotations: 'kubernetes:network:service:manage-annotations',
  },

  Ingress: {
    List: 'kubernetes:network:ingress',
    Detail: 'kubernetes:network:ingress:detail',
    Create: 'kubernetes:network:ingress:create',
    CreateYaml: 'kubernetes:network:ingress:create:yaml',
    Edit: 'kubernetes:network:ingress:edit',
    EditYaml: 'kubernetes:network:ingress:edit:yaml',
    ManageLabels: 'kubernetes:network:ingress:manage-labels',
    ManageAnnotations: 'kubernetes:network:ingress:manage-annotations',
  },

  NetworkPolicy: {
    List: 'kubernetes:network:networkpolicy',
    Detail: 'kubernetes:network:networkpolicy:detail',
    Create: 'kubernetes:network:networkpolicy:create',
    CreateYaml: 'kubernetes:network:networkpolicy:create:yaml',
    Edit: 'kubernetes:network:networkpolicy:edit',
    EditYaml: 'kubernetes:network:networkpolicy:edit:yaml',
    ManageLabels: 'kubernetes:network:networkpolicy:manage-labels',
    ManageAnnotations: 'kubernetes:network:networkpolicy:manage-annotations',
  },

  PersistentVolume: {
    List: 'kubernetes:storage:persistentvolume',
    Detail: 'kubernetes:storage:persistentvolume:detail',
    Create: 'kubernetes:storage:persistentvolume:create',
    CreateYaml: 'kubernetes:storage:persistentvolume:create:yaml',
    Edit: 'kubernetes:storage:persistentvolume:edit',
    EditYaml: 'kubernetes:storage:persistentvolume:edit:yaml',
    ManageLabels: 'kubernetes:storage:persistentvolume:manage-labels',
    ManageAnnotations: 'kubernetes:storage:persistentvolume:manage-annotations',
  },

  PersistentVolumeClaim: {
    List: 'kubernetes:storage:persistentvolumeclaim',
    Detail: 'kubernetes:storage:persistentvolumeclaim:detail',
    Create: 'kubernetes:storage:persistentvolumeclaim:create',
    CreateYaml: 'kubernetes:storage:persistentvolumeclaim:create:yaml',
    Edit: 'kubernetes:storage:persistentvolumeclaim:edit',
    EditYaml: 'kubernetes:storage:persistentvolumeclaim:edit:yaml',
    ManageLabels: 'kubernetes:storage:persistentvolumeclaim:manage-labels',
    ManageAnnotations: 'kubernetes:storage:persistentvolumeclaim:manage-annotations',
  },

  StorageClass: {
    List: 'kubernetes:storage:storageclass',
    Detail: 'kubernetes:storage:storageclass:detail',
    Create: 'kubernetes:storage:storageclass:create',
    CreateYaml: 'kubernetes:storage:storageclass:create:yaml',
    Edit: 'kubernetes:storage:storageclass:edit',
    EditYaml: 'kubernetes:storage:storageclass:edit:yaml',
    ManageLabels: 'kubernetes:storage:storageclass:manage-labels',
    ManageAnnotations: 'kubernetes:storage:storageclass:manage-annotations',
  },

  ServiceAccount: {
    List: 'kubernetes:security:serviceaccount',
    Detail: 'kubernetes:security:serviceaccount:detail',
    Create: 'kubernetes:security:serviceaccount:create',
    CreateYaml: 'kubernetes:security:serviceaccount:create:yaml',
    Edit: 'kubernetes:security:serviceaccount:edit',
    EditYaml: 'kubernetes:security:serviceaccount:edit:yaml',
    ManageLabels: 'kubernetes:security:serviceaccount:manage-labels',
    ManageAnnotations: 'kubernetes:security:serviceaccount:manage-annotations',
  },

  ClusterRole: {
    List: 'kubernetes:security:clusterrole',
    Detail: 'kubernetes:security:clusterrole:detail',
    Create: 'kubernetes:security:clusterrole:create',
    CreateYaml: 'kubernetes:security:clusterrole:create:yaml',
    Edit: 'kubernetes:security:clusterrole:edit',
    EditYaml: 'kubernetes:security:clusterrole:edit:yaml',
    ManageLabels: 'kubernetes:security:clusterrole:manage-labels',
    ManageAnnotations: 'kubernetes:security:clusterrole:manage-annotations',
  },

  ClusterRoleBinding: {
    List: 'kubernetes:security:clusterrolebinding',
    Detail: 'kubernetes:security:clusterrolebinding:detail',
    Create: 'kubernetes:security:clusterrolebinding:create',
    CreateYaml: 'kubernetes:security:clusterrolebinding:create:yaml',
    Edit: 'kubernetes:security:clusterrolebinding:edit',
    EditYaml: 'kubernetes:security:clusterrolebinding:edit:yaml',
    ManageLabels: 'kubernetes:security:clusterrolebinding:manage-labels',
    ManageAnnotations: 'kubernetes:security:clusterrolebinding:manage-annotations',
  },

  Role: {
    List: 'kubernetes:security:role',
    Detail: 'kubernetes:security:role:detail',
    Create: 'kubernetes:security:role:create',
    CreateYaml: 'kubernetes:security:role:create:yaml',
    Edit: 'kubernetes:security:role:edit',
    EditYaml: 'kubernetes:security:role:edit:yaml',
    ManageLabels: 'kubernetes:security:role:manage-labels',
    ManageAnnotations: 'kubernetes:security:role:manage-annotations',
  },

  RoleBinding: {
    List: 'kubernetes:security:rolebinding',
    Detail: 'kubernetes:security:rolebinding:detail',
    Create: 'kubernetes:security:rolebinding:create',
    CreateYaml: 'kubernetes:security:rolebinding:create:yaml',
    Edit: 'kubernetes:security:rolebinding:edit',
    EditYaml: 'kubernetes:security:rolebinding:edit:yaml',
    ManageLabels: 'kubernetes:security:rolebinding:manage-labels',
    ManageAnnotations: 'kubernetes:security:rolebinding:manage-annotations',
  },
} as const
