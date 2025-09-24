# TanStack Query 项目架构

这个项目实现了一个简化版的 TanStack Query 库，包含核心功能和 React adapter。

## 整体架构

```mermaid
graph TB
    subgraph "Examples"
        E1[React Basic Example]
    end
    
    subgraph "React Adapter (@the-tanstack-query/react)"
        R1[QueryClientProvider]
        R2[useQuery Hook]
        R3[useMutation Hook]
        R4[useQueryClient Hook]
    end
    
    subgraph "Core Library (@the-tanstack-query/core)"
        C1[QueryClient]
        C2[QueryCache]
        C3[Query]
        C4[QueryObserver]
        C5[useBaseQuery]
        C6[Mutation Logic]
    end
    
    subgraph "Browser APIs"
        B1[React Hooks]
        B2[Promise/Fetch]
        B3[Memory Storage]
    end
    
    E1 --> R1
    E1 --> R2
    E1 --> R3
    
    R1 --> C1
    R2 --> C5
    R3 --> C6
    R4 --> C1
    
    C1 --> C2
    C5 --> C4
    C4 --> C3
    C3 --> B2
    C2 --> B3
    
    R2 --> B1
    R3 --> B1
    R4 --> B1
```

## 包结构

### 核心包 (`packages/core`)

核心包提供了 TanStack Query 的基础功能，不依赖任何 UI 框架。

```mermaid
graph LR
    subgraph "Core Package"
        QC[QueryClient] --> QCache[QueryCache]
        QC --> Q[Query]
        QObserver[QueryObserver] --> Q
        UBQ[useBaseQuery] --> QObserver
        UQ[useQuery] --> UBQ
        
        QCache --> |manages| Q
        Q --> |executes| QF[QueryFunction]
    end
```

**主要组件：**

- **QueryClient**: 查询客户端，管理所有查询和缓存
- **QueryCache**: 查询缓存，存储和管理查询实例
- **Query**: 单个查询实例，包含查询状态和数据
- **QueryObserver**: 查询观察者，监听查询状态变化
- **useBaseQuery**: 基础查询 hook，提供查询逻辑

### React 适配器 (`packages/react`)

React 适配器为 React 应用提供了易用的 hooks 和组件。

```mermaid
graph LR
    subgraph "React Package"
        QCP[QueryClientProvider] --> |provides| QC[QueryClient]
        UQC[useQueryClient] --> |consumes| QC
        UQ[useQuery] --> UQC
        UQ --> CORE[Core useQuery]
        UM[useMutation] --> |independent| LOGIC[Mutation Logic]
    end
```

**主要组件：**

- **QueryClientProvider**: React Context Provider，提供 QueryClient 实例
- **useQueryClient**: 获取 QueryClient 实例的 hook
- **useQuery**: React 版本的查询 hook
- **useMutation**: 数据变更 hook

## 数据流

### 查询数据流

```mermaid
sequenceDiagram
    participant Component
    participant useQuery
    participant QueryClient
    participant QueryCache
    participant Query
    participant API
    
    Component->>useQuery: 调用 useQuery
    useQuery->>QueryClient: 获取或创建查询
    QueryClient->>QueryCache: 检查缓存
    
    alt 缓存存在且新鲜
        QueryCache-->>useQuery: 返回缓存数据
        useQuery-->>Component: 返回数据和状态
    else 缓存不存在或过期
        QueryCache->>Query: 创建或获取查询实例
        Query->>API: 执行查询函数
        API-->>Query: 返回数据
        Query-->>QueryCache: 更新缓存
        QueryCache-->>useQuery: 返回新数据
        useQuery-->>Component: 返回数据和状态
    end
```

### 变更数据流

```mermaid
sequenceDiagram
    participant Component
    participant useMutation
    participant API
    participant QueryClient
    
    Component->>useMutation: 调用 mutate
    useMutation->>API: 执行变更函数
    API-->>useMutation: 返回结果
    useMutation->>QueryClient: 触发缓存失效
    QueryClient-->>Component: 重新获取相关数据
```

## 状态管理

### 查询状态

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: 开始查询
    Loading --> Success: 查询成功
    Loading --> Error: 查询失败
    Success --> Loading: 重新查询
    Error --> Loading: 重试
    Success --> Stale: 数据过期
    Stale --> Loading: 后台更新
```

### 变更状态

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Pending: 开始变更
    Pending --> Success: 变更成功
    Pending --> Error: 变更失败
    Success --> Idle: 重置
    Error --> Idle: 重置
```

## 缓存策略

### 缓存层次

```mermaid
graph TB
    subgraph "内存缓存"
        QC[Query Cache]
        subgraph "查询实例"
            Q1[Query 1]
            Q2[Query 2]
            Q3[Query N...]
        end
    end
    
    subgraph "查询键映射"
        QK1["['posts'] → Query 1"]
        QK2["['post', 1] → Query 2"]
        QK3["['user', 1] → Query N"]
    end
    
    QC --> Q1
    QC --> Q2
    QC --> Q3
    
    QK1 -.-> Q1
    QK2 -.-> Q2
    QK3 -.-> Q3
```

### 缓存生命周期

```mermaid
timeline
    title 查询缓存生命周期
    
    section 创建阶段
        查询执行 : 创建 Query 实例
        数据获取 : 执行 queryFn
        缓存存储 : 存储到 QueryCache
    
    section 使用阶段
        数据新鲜 : 直接返回缓存数据
        数据过期 : 后台重新获取
        组件卸载 : 减少引用计数
    
    section 清理阶段
        无引用 : 标记为可清理
        超时清理 : 从缓存中移除
```

## 关键设计模式

### 1. 观察者模式
QueryObserver 监听 Query 状态变化，通知 React 组件更新。

### 2. 单例模式
QueryClient 通常作为单例使用，管理全局缓存状态。

### 3. 工厂模式
QueryCache 根据查询键创建和管理 Query 实例。

### 4. 策略模式
不同的缓存策略（staleTime, cacheTime）影响查询行为。

## 扩展点

### 1. 自定义缓存存储
可以扩展缓存存储到 localStorage 或 IndexedDB。

### 2. 中间件系统
添加查询和变更的中间件支持。

### 3. 开发者工具
集成 React DevTools 或独立的调试工具。

### 4. 离线支持
添加网络状态检测和离线缓存功能。

### 5. 其他框架适配器
创建 Vue、Angular 等框架的适配器。

## 性能考虑

### 1. 内存管理
- 自动清理未使用的查询
- 引用计数管理
- 内存泄漏防护

### 2. 网络优化
- 请求去重
- 并发控制
- 智能重试

### 3. 渲染优化
- 最小化重新渲染
- 状态变化批处理
- 组件级别的缓存

这个架构设计确保了代码的可维护性、可扩展性和性能，同时保持了简洁的 API 设计。

