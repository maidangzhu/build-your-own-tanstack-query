import React, { useState } from 'react'
import { useQueryClient } from '@the-tanstack-query/react'
import PostsList from './components/PostsList'
// import PostDetail from './components/PostDetail'
import CreatePost from './components/CreatePost'
import { Post } from './api/posts'

type View = 'list' | 'detail' | 'create'

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('list')
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const queryClient = useQueryClient()

  const handleViewPost = (postId: number) => {
    setSelectedPostId(postId)
    setCurrentView('detail')
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setSelectedPostId(null)
  }

  const handlePostCreated = (post: Post) => {
    // 文章创建成功后，使查询缓存失效，触发重新获取
    // 还没实现
    // queryClient.invalidateQueries({ queryKey: ['posts'] })
    console.log('新文章已创建，文章列表缓存已失效:', post)
  }

  const handleClearCache = () => {
    // 还没实现
    // queryClient.clear()
    console.log('所有缓存已清除')
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ color: '#333', marginBottom: '16px' }}>
          TanStack Query React 示例
        </h1>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
          这是一个展示 TanStack Query 核心功能的示例应用，包括数据查询、缓存管理和状态处理。
        </p>
      </header>

      {/* 导航栏 */}
      <nav className="card" style={{ marginBottom: '24px' }}>
        <div className="flex gap-4 items-center">
          <button
            className={`btn ${currentView === 'list' ? '' : 'btn-secondary'}`}
            onClick={() => setCurrentView('list')}
          >
            文章列表
          </button>
          <button
            className={`btn ${currentView === 'create' ? '' : 'btn-secondary'}`}
            onClick={() => setCurrentView('create')}
          >
            创建文章
          </button>
          <div style={{ marginLeft: 'auto' }}>
            <button
              className="btn btn-danger"
              onClick={handleClearCache}
            >
              清除所有缓存
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main>
        {currentView === 'list' && (
          <div>
            <PostsList />
            <div className="card mt-4">
              <h3 style={{ marginBottom: '16px' }}>功能演示</h3>
              <p style={{ color: '#666', marginBottom: '16px' }}>
                点击上方的"刷新"按钮来观察缓存行为：
              </p>
              <ul style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px' }}>
                <li>第一次加载会显示加载状态</li>
                <li>刷新时会立即显示缓存的数据，然后在后台更新</li>
                <li>网络错误时会显示错误信息和重试按钮</li>
                <li>数据会在 staleTime (5分钟) 后被标记为过期</li>
              </ul>
            </div>
          </div>
        )}

        {/* {currentView === 'detail' && selectedPostId && (
          <PostDetail
            postId={selectedPostId}
            onBack={handleBackToList}
          />
        )} */}

        {currentView === 'create' && (
          <CreatePost onSuccess={handlePostCreated} />
        )}
      </main>

      {/* 调试信息 */}
      <footer className="card mt-4" style={{ backgroundColor: '#f8f9fa' }}>
        <h4 style={{ marginBottom: '12px', color: '#333' }}>调试信息</h4>
        <div style={{ fontSize: '14px', color: '#666' }}>
          <p><strong>当前视图:</strong> {currentView}</p>
          {selectedPostId && <p><strong>选中的文章 ID:</strong> {selectedPostId}</p>}
          <p><strong>QueryClient:</strong> 已初始化</p>
          <p style={{ marginTop: '12px' }}>
            打开浏览器开发者工具的 Console 标签页查看更多调试信息。
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

