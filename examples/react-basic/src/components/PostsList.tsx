import React from 'react'
import { useQuery } from '@the-tanstack-query/react'
import { fetchPosts, Post } from '../api/posts'

const PostsList: React.FC = () => {
  // 使用 useQuery 获取文章列表
  const {
    data: posts,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  })

  if (isLoading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          <span style={{ marginLeft: '12px' }}>正在加载文章列表...</span>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="card">
        <div className="error">
          <h3>加载失败</h3>
          <p>{error?.message || '未知错误'}</p>
          <button 
            className="btn btn-secondary mt-4" 
            onClick={() => refetch()}
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2>文章列表</h2>
        <button 
          className="btn btn-secondary" 
          onClick={() => refetch()}
        >
          刷新
        </button>
      </div>
      
      {posts && posts.length > 0 ? (
        <ul className="list">
          {posts.map((post) => (
            <li key={post.id} className="list-item">
              <h3 style={{ marginBottom: '8px', color: '#007bff' }}>
                {post.title}
              </h3>
              <p style={{ color: '#666', marginBottom: '8px' }}>
                {post.body}
              </p>
              <small style={{ color: '#999' }}>
                作者 ID: {post.userId} | 文章 ID: {post.id}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center" style={{ color: '#666', padding: '40px' }}>
          暂无文章
        </p>
      )}
    </div>
  )
}

export default PostsList

