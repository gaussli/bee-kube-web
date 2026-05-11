# Bee Kube

基于 Vue 3 + TypeScript + Element Plus 构建的现代化 Kubernetes 管理平台。

[English](README.md) | [中文](README_zh.md)

## 功能特性

- **Kubernetes 管理**
  - 仪表盘，实时展示集群指标
  - 工作负载管理（Deployment、StatefulSet、DaemonSet、Job、CronJob）
  - 网络管理（Service、Ingress、NetworkPolicy）
  - 存储管理（PersistentVolume、PersistentVolumeClaim、StorageClass）
  - 配置管理（ConfigMap、Secret）
  - 安全管理（ServiceAccount、Role、ClusterRole、RoleBinding、ClusterRoleBinding）
  - 自定义资源定义（CRD）
  - 命名空间管理
  - 节点查看

- **系统管理**
  - 用户管理
  - 角色管理与权限分配
  - 菜单管理
  - 权限管理

- **技术栈**
  - Vue 3 Composition API
  - TypeScript
  - Vite
  - Pinia（状态管理）
  - Vue Router
  - Element Plus
  - SCSS

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm（推荐）或 npm

### 安装

```bash
# 克隆仓库
git clone https://github.com/gaussli/bee-kube-web.git
cd bee-kube-web

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 构建

```bash
# 生产环境构建
pnpm build

# 测试环境构建
pnpm build:test
```

### 代码规范

```bash
# 运行 ESLint
pnpm lint

# 使用 Prettier 格式化代码
pnpm prettier
```

## 项目结构

```
src/
├── api/                 # API 接口定义
├── assets/              # 静态资源
├── components/           # 可复用组件
│   ├── BeeButton/
│   ├── BeeDialog/
│   ├── BeeDivider/
│   ├── BeeTab/
│   ├── Layout/
│   └── ...
├── composables/         # Vue 组合式函数
├── mock/                # 开发环境 Mock 数据
├── router/              # 路由配置
│   ├── kubernetes/       # Kubernetes 模块路由
│   └── platform/         # 系统管理模块路由
├── stores/              # Pinia 状态管理
├── styles/              # 全局样式
├── types/               # TypeScript 类型定义
├── utils/               # 工具函数
└── views/               # 页面组件
    ├── home/
    ├── kubernetes/       # Kubernetes 管理页面
    ├── platform/         # 系统管理页面
    └── login/
```

## 技术栈

| 技术         | 说明                     |
| ------------ | ------------------------ |
| Vue 3        | 渐进式 JavaScript 框架   |
| TypeScript   | 类型化的 JavaScript 超集 |
| Vite         | 新一代前端构建工具       |
| Pinia        | 直观的状态管理解决方案   |
| Vue Router   | Vue.js 官方路由          |
| Element Plus | Vue 3 UI 组件库          |
| SCSS         | CSS 预处理器             |

## 开发

### 环境变量

创建不同环境的环境变量文件：

```env
# .env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Mock 数据

项目内置开发环境 Mock 数据，可在 `src/mock/index.ts` 中开启/关闭。

## License

MIT License - 详见 [LICENSE](LICENSE) 文件。

## 贡献

欢迎提交 Pull Request！
