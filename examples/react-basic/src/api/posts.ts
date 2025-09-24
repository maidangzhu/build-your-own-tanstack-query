// 模拟的文章数据类型
export interface Post {
  id: number
  title: string
  body: string
  userId: number
}

// 模拟的用户数据类型
export interface User {
  id: number
  name: string
  username: string
  email: string
}

// 模拟的文章数据
const mockPosts: Post[] = [
  {
    id: 1,
    title: "TanStack Query 入门指南",
    body: "TanStack Query 是一个强大的数据获取和状态管理库，它可以帮助你更好地管理服务器状态。",
    userId: 1
  },
  {
    id: 2,
    title: "React Hooks 最佳实践",
    body: "React Hooks 为函数组件带来了状态管理和生命周期功能，让我们来看看如何正确使用它们。",
    userId: 2
  },
  {
    id: 3,
    title: "TypeScript 进阶技巧",
    body: "TypeScript 提供了强大的类型系统，让我们探索一些高级的类型操作技巧。",
    userId: 1
  },
  {
    id: 4,
    title: "现代前端开发工具链",
    body: "现代前端开发需要各种工具的配合，从构建工具到测试框架，让我们了解完整的工具链。",
    userId: 3
  },
  {
    id: 5,
    title: "性能优化实战",
    body: "Web 应用的性能优化是一个系统性工程，涉及多个层面的优化策略。",
    userId: 2
  }
]

// 模拟的用户数据
const mockUsers: User[] = [
  {
    id: 1,
    name: "张三",
    username: "zhangsan",
    email: "zhangsan@example.com"
  },
  {
    id: 2,
    name: "李四",
    username: "lisi",
    email: "lisi@example.com"
  },
  {
    id: 3,
    name: "王五",
    username: "wangwu",
    email: "wangwu@example.com"
  }
]

// 模拟网络延迟的工具函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟随机失败
const shouldFail = () => Math.random() < 0.1 // 10% 的概率失败

// API 函数：获取所有文章
export const fetchPosts = async (): Promise<Post[]> => {
  await delay(800) // 模拟网络延迟
  
  if (shouldFail()) {
    throw new Error('获取文章列表失败，请稍后重试')
  }
  
  return [...mockPosts]
}

// API 函数：根据 ID 获取单个文章
export const fetchPost = async (id: number): Promise<Post> => {
  await delay(600)
  
  if (shouldFail()) {
    throw new Error(`获取文章 ${id} 失败，请稍后重试`)
  }
  
  const post = mockPosts.find(p => p.id === id)
  if (!post) {
    throw new Error(`文章 ${id} 不存在`)
  }
  
  return { ...post }
}

// API 函数：获取用户信息
export const fetchUser = async (id: number): Promise<User> => {
  await delay(400)
  
  if (shouldFail()) {
    throw new Error(`获取用户 ${id} 失败，请稍后重试`)
  }
  
  const user = mockUsers.find(u => u.id === id)
  if (!user) {
    throw new Error(`用户 ${id} 不存在`)
  }
  
  return { ...user }
}

// API 函数：创建新文章
export const createPost = async (newPost: Omit<Post, 'id'>): Promise<Post> => {
  await delay(1000)
  
  if (shouldFail()) {
    throw new Error('创建文章失败，请稍后重试')
  }
  
  const post: Post = {
    id: Math.max(...mockPosts.map(p => p.id)) + 1,
    ...newPost
  }
  
  mockPosts.push(post)
  return { ...post }
}

// API 函数：更新文章
export const updatePost = async (id: number, updates: Partial<Omit<Post, 'id'>>): Promise<Post> => {
  await delay(800)
  
  if (shouldFail()) {
    throw new Error(`更新文章 ${id} 失败，请稍后重试`)
  }
  
  const index = mockPosts.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error(`文章 ${id} 不存在`)
  }
  
  mockPosts[index] = { ...mockPosts[index], ...updates }
  return { ...mockPosts[index] }
}

// API 函数：删除文章
export const deletePost = async (id: number): Promise<void> => {
  await delay(600)
  
  if (shouldFail()) {
    throw new Error(`删除文章 ${id} 失败，请稍后重试`)
  }
  
  const index = mockPosts.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error(`文章 ${id} 不存在`)
  }
  
  mockPosts.splice(index, 1)
}

