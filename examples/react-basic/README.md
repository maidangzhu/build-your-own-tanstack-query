# TanStack Query React 示例

这是一个使用自建 TanStack Query 库的 React 示例应用，展示了数据查询、缓存管理和状态处理的核心功能。

## 功能特性

### 🚀 核心功能
- **数据查询**: 使用 `useQuery` hook 获取和缓存数据
- **数据变更**: 使用 `useMutation` hook 处理数据创建和更新
- **缓存管理**: 自动缓存查询结果，支持缓存失效和重新获取
- **错误处理**: 完善的错误状态管理和重试机制
- **加载状态**: 清晰的加载状态指示

### 📋 示例场景
1. **文章列表查询**: 展示如何获取和显示数据列表
2. **文章详情查询**: 演示依赖查询（先获取文章，再获取作者信息）
3. **文章创建**: 使用 mutation 创建新文章，并自动更新缓存

## 快速开始

### 安装依赖
```bash
# 在项目根目录
pnpm install
```

### 构建核心库
```bash
# 构建 core 包
cd packages/core
pnpm build

# 构建 react 包
cd ../react
pnpm build
```

### 启动示例应用
```bash
# 启动开发服务器
cd examples/react-basic
pnpm dev
```

应用将在 http://localhost:3000 启动。

## 项目结构

```
examples/react-basic/
├── src/
│   ├── api/
│   │   └── posts.ts          # 模拟 API 服务
│   ├── components/
│   │   ├── PostsList.tsx     # 文章列表组件
│   │   ├── PostDetail.tsx    # 文章详情组件
│   │   └── CreatePost.tsx    # 创建文章组件
│   ├── App.tsx               # 主应用组件
│   ├── main.tsx              # 应用入口
│   └── index.css             # 全局样式
├── index.html
├── vite.config.ts
└── package.json
```

## 核心概念演示

### 1. 基础查询 (useQuery)

```tsx
const { data, isLoading, isError, error, refetch } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts
})
```

### 2. 依赖查询

```tsx
// 只有当 post 存在时才查询作者信息
const { data: author } = useQuery({
  queryKey: ['user', post?.userId],
  queryFn: () => fetchUser(post!.userId),
  enabled: !!post?.userId
})
```

### 3. 数据变更 (useMutation)

```tsx
const { mutate, isPending, isError } = useMutation({
  mutationFn: createPost,
  onSuccess: (post) => {
    // 创建成功后使相关查询缓存失效
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  }
})
```

### 4. 缓存管理

```tsx
// 清除所有缓存
queryClient.clear()

// 使特定查询失效
queryClient.invalidateQueries({ queryKey: ['posts'] })
```

## 技术特性

### 🎯 查询缓存
- 自动缓存查询结果
- 支持 staleTime 和 cacheTime 配置
- 智能的后台更新机制

### 🔄 状态管理
- 加载状态 (isLoading)
- 错误状态 (isError, error)
- 成功状态 (isSuccess)
- 重新获取 (refetch)

### 🚦 错误处理
- 自动重试机制
- 用户友好的错误提示
- 手动重试功能

### 🎨 用户体验
- 响应式设计
- 现代化 UI
- 清晰的状态反馈
- 调试信息展示

## 开发说明

### 模拟 API
项目使用模拟的 API 服务 (`src/api/posts.ts`)，包含：
- 随机网络延迟 (400-1000ms)
- 10% 的随机失败率
- 内存中的数据存储

### 样式系统
使用纯 CSS 实现，包含：
- 响应式布局
- 现代化设计
- 深色模式友好的配色
- 动画和过渡效果

### 调试功能
- 控制台日志输出
- 缓存状态显示
- 错误信息展示
- 性能监控

## 学习要点

1. **理解查询键 (Query Keys)**: 查询键是缓存的标识符
2. **掌握状态管理**: 学会处理 loading、error、success 状态
3. **缓存策略**: 了解何时使用缓存，何时重新获取
4. **错误处理**: 实现用户友好的错误处理机制
5. **性能优化**: 合理使用依赖查询和缓存失效

## 扩展建议

- 添加无限滚动功能
- 实现乐观更新
- 添加离线支持
- 集成真实的后端 API
- 添加单元测试和集成测试

