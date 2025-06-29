# TanStack Query 手写实现
这是一个 pnpm workspace 项目，用于手写实现 TanStack Query 的核心功能。

## 项目结构

```
the-tanstack-query/
├── packages/
│   ├── core/           # 核心实现包
│   │   └── src/
│   │       ├── index.ts
│   │       ├── query-client.ts    # TODO: QueryClient 实现
│   │       ├── query.ts           # TODO: Query 逻辑
│   │       ├── mutation.ts        # TODO: Mutation 逻辑
│   │       └── types.ts           # TODO: 类型定义
│   └── react/          # React 适配器包
│       └── src/
│           ├── index.ts
│           ├── use-query.ts           # TODO: useQuery hook
│           ├── use-mutation.ts        # TODO: useMutation hook
│           ├── query-client-provider.tsx  # TODO: Provider 组件
│           └── types.ts               # TODO: React 类型
├── apps/               # 示例应用
├── tools/              # 工具包
└── pnpm-workspace.yaml
```

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式（监听文件变化）
pnpm dev

# 构建所有包
pnpm build

# 类型检查
pnpm type-check
```

## 包依赖关系

- `@tanstack-query/react` 依赖 `@tanstack-query/core`
- 使用 `workspace:*` 协议管理内部依赖

## 下一步

现在所有的基础架子都搭建好了，你可以开始在 TODO 标记的文件中实现具体的功能：

1. 从 `packages/core/src/` 开始实现核心逻辑
2. 然后实现 `packages/react/src/` 中的 React hooks
3. 最后可以在 `apps/` 目录下创建示例应用进行测试 