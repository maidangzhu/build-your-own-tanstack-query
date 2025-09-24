import React, { useState } from 'react'
import { useMutation } from '@the-tanstack-query/react'
import { createPost, Post } from '../api/posts'

interface CreatePostProps {
  onSuccess?: (post: Post) => void
}

const CreatePost: React.FC<CreatePostProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [userId, setUserId] = useState(1)

  // 使用 useMutation 处理文章创建
  const {
    mutate: handleCreatePost,
    mutateAsync: createPostAsync,
    isPending,
    isError,
    isSuccess,
    error,
    data: createdPost,
    reset
  } = useMutation({
    mutationFn: createPost,
    onSuccess: (post) => {
      // 创建成功后重置表单
      setTitle('')
      setBody('')
      setUserId(1)
      onSuccess?.(post)
    },
    onError: (error) => {
      console.error('创建文章失败:', error)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !body.trim()) {
      alert('请填写标题和内容')
      return
    }

    // 使用 mutate 方法（不等待结果）
    handleCreatePost({
      title: title.trim(),
      body: body.trim(),
      userId
    })
  }

  const handleSubmitAsync = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !body.trim()) {
      alert('请填写标题和内容')
      return
    }

    try {
      // 使用 mutateAsync 方法（等待结果）
      const newPost = await createPostAsync({
        title: title.trim(),
        body: body.trim(),
        userId
      })
      console.log('文章创建成功:', newPost)
    } catch (error) {
      console.error('文章创建失败:', error)
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px' }}>创建新文章</h2>
      
      {isSuccess && createdPost && (
        <div className="success">
          <h4>文章创建成功！</h4>
          <p><strong>标题:</strong> {createdPost.title}</p>
          <p><strong>ID:</strong> {createdPost.id}</p>
          <button 
            className="btn btn-secondary mt-4" 
            onClick={reset}
          >
            继续创建
          </button>
        </div>
      )}
      
      {isError && (
        <div className="error">
          <h4>创建失败</h4>
          <p>{error?.message || '未知错误'}</p>
          <button 
            className="btn btn-secondary mt-4" 
            onClick={reset}
          >
            重试
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">标题</label>
          <input
            id="title"
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入文章标题"
            disabled={isPending}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="body" className="form-label">内容</label>
          <textarea
            id="body"
            className="form-input"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="请输入文章内容"
            disabled={isPending}
            style={{ resize: 'vertical', minHeight: '100px' }}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="userId" className="form-label">作者 ID</label>
          <select
            id="userId"
            className="form-input"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            disabled={isPending}
          >
            <option value={1}>张三 (ID: 1)</option>
            <option value={2}>李四 (ID: 2)</option>
            <option value={3}>王五 (ID: 3)</option>
          </select>
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            className="btn"
            disabled={isPending || !title.trim() || !body.trim()}
          >
            {isPending ? '创建中...' : '创建文章 (mutate)'}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            disabled={isPending || !title.trim() || !body.trim()}
            onClick={handleSubmitAsync}
          >
            {isPending ? '创建中...' : '创建文章 (async)'}
          </button>
        </div>
      </form>
      
      <div style={{ 
        marginTop: '24px', 
        padding: '16px', 
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#666'
      }}>
        <p><strong>说明:</strong></p>
        <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
          <li><strong>mutate:</strong> 异步执行，不等待结果，适用于不需要处理结果的场景</li>
          <li><strong>mutateAsync:</strong> 返回 Promise，可以等待结果和处理错误</li>
          <li>两种方式都会触发相同的 onSuccess 和 onError 回调</li>
        </ul>
      </div>
    </div>
  )
}

export default CreatePost

