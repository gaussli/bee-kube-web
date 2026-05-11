# Bee Kube

A modern Kubernetes management platform built with Vue 3, TypeScript, and Element Plus.

[English](README.md) | [中文](README_zh.md)

## Features

- **Kubernetes Management**
  - Dashboard with real-time cluster metrics
  - Workload management (Deployment, StatefulSet, DaemonSet, Job, CronJob)
  - Network management (Service, Ingress, NetworkPolicy)
  - Storage management (PersistentVolume, PersistentVolumeClaim, StorageClass)
  - Configuration management (ConfigMap, Secret)
  - Security management (ServiceAccount, Role, ClusterRole, RoleBinding, ClusterRoleBinding)
  - Custom Resource Definitions (CRD)
  - Namespace management
  - Node inspection

- **System Management**
  - User management
  - Role management with permission assignment
  - Menu management
  - Permission management

- **Modern Tech Stack**
  - Vue 3 Composition API
  - TypeScript
  - Vite
  - Pinia (state management)
  - Vue Router
  - Element Plus
  - SCSS

## Quick Start

### Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/gaussli/bee-kube-web.git
cd bee-kube-web

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Build

```bash
# Build for production
pnpm build

# Build for test environment
pnpm build:test
```

### Lint

```bash
# Run ESLint
pnpm lint

# Format code with Prettier
pnpm prettier
```

## Project Structure

```
src/
├── api/                 # API interfaces
├── assets/              # Static assets
├── components/           # Reusable components
│   ├── BeeButton/
│   ├── BeeDialog/
│   ├── BeeDivider/
│   ├── BeeTab/
│   ├── Layout/
│   └── ...
├── composables/         # Vue composables
├── mock/                # Mock data for development
├── router/              # Route configuration
│   ├── kubernetes/      # Kubernetes module routes
│   └── platform/        # Platform module routes
├── stores/              # Pinia stores
├── styles/              # Global styles
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── views/               # Page components
    ├── home/
    ├── kubernetes/      # Kubernetes management views
    ├── platform/        # System management views
    └── login/
```

## Tech Stack

| Technology   | Description                           |
| ------------ | ------------------------------------- |
| Vue 3        | Progressive JavaScript framework      |
| TypeScript   | Typed superset of JavaScript          |
| Vite         | Next-generation frontend build tool   |
| Pinia        | Intuitive, type-safe state management |
| Vue Router   | The official router for Vue.js        |
| Element Plus | Vue 3 UI library                      |
| SCSS         | CSS preprocessor                      |

## Development

### Environment Variables

Create `.env` files for different environments:

```env
# .env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Mock Data

The project includes mock data for development. Enable/disable mock mode in `src/mock/index.ts`.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
