/**
 * Exemplo de como chamar a API do Backend (FastAPI + SQLAlchemy)
 * Use isso no frontend Next.js para fazer requisições ao backend
 */

// ============================================
// CONFIGURAÇÃO BASE
// ============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Helper para fazer requisições
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erro desconhecido' }))
    throw new Error(error.detail || `HTTP error! status: ${response.status}`)
  }

  // Se for DELETE, retorna null
  if (response.status === 204) {
    return null
  }

  return response.json()
}

// ============================================
// USERS API
// ============================================

export interface User {
  id: number
  name: string
  email: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface UserCreate {
  name: string
  email: string
  is_active?: boolean
}

export const usersAPI = {
  // Criar usuário
  create: async (user: UserCreate): Promise<User> => {
    return fetchAPI('/users/', {
      method: 'POST',
      body: JSON.stringify(user),
    })
  },

  // Listar usuários
  list: async (skip = 0, limit = 100): Promise<User[]> => {
    return fetchAPI(`/users/?skip=${skip}&limit=${limit}`)
  },

  // Buscar usuário por ID
  get: async (id: number): Promise<User> => {
    return fetchAPI(`/users/${id}`)
  },

  // Atualizar usuário
  update: async (id: number, user: UserCreate): Promise<User> => {
    return fetchAPI(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    })
  },

  // Deletar usuário
  delete: async (id: number): Promise<void> => {
    return fetchAPI(`/users/${id}`, {
      method: 'DELETE',
    })
  },

  // Buscar posts do usuário
  getPosts: async (id: number): Promise<Post[]> => {
    return fetchAPI(`/users/${id}/posts`)
  },
}

// ============================================
// POSTS API
// ============================================

export interface Post {
  id: number
  title: string
  content: string
  is_published: boolean
  views: number
  author_id: number
  created_at: string
  updated_at?: string
}

export interface PostCreate {
  title: string
  content: string
  author_id: number
  is_published?: boolean
}

export const postsAPI = {
  // Criar post
  create: async (post: PostCreate): Promise<Post> => {
    return fetchAPI('/posts/', {
      method: 'POST',
      body: JSON.stringify(post),
    })
  },

  // Listar posts
  list: async (skip = 0, limit = 100): Promise<Post[]> => {
    return fetchAPI(`/posts/?skip=${skip}&limit=${limit}`)
  },

  // Buscar post por ID
  get: async (id: number): Promise<Post> => {
    return fetchAPI(`/posts/${id}`)
  },

  // Deletar post
  delete: async (id: number): Promise<void> => {
    return fetchAPI(`/posts/${id}`, {
      method: 'DELETE',
    })
  },
}

// ============================================
// STUDENTS API
// ============================================

export interface Student {
  id: number
  name: string
  age?: number
  grade?: number
  course?: string
  email: string
  phone?: string
  enrollment_date: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface StudentCreate {
  name: string
  age?: number
  grade?: number
  course?: string
  email: string
  phone?: string
  is_active?: boolean
}

export const studentsAPI = {
  // Criar estudante
  create: async (student: StudentCreate): Promise<Student> => {
    return fetchAPI('/students/', {
      method: 'POST',
      body: JSON.stringify(student),
    })
  },

  // Listar estudantes
  list: async (skip = 0, limit = 100, course?: string): Promise<Student[]> => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    })
    if (course) params.append('course', course)
    
    return fetchAPI(`/students/?${params}`)
  },

  // Buscar estudante por ID
  get: async (id: number): Promise<Student> => {
    return fetchAPI(`/students/${id}`)
  },

  // Atualizar estudante
  update: async (id: number, student: StudentCreate): Promise<Student> => {
    return fetchAPI(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(student),
    })
  },

  // Deletar estudante
  delete: async (id: number): Promise<void> => {
    return fetchAPI(`/students/${id}`, {
      method: 'DELETE',
    })
  },
}

// ============================================
// HEALTH CHECK
// ============================================

export const healthAPI = {
  // Verificar se API está online
  check: async (): Promise<{ status: string; database: string }> => {
    return fetchAPI('/health')
  },
}

// ============================================
// EXEMPLO DE USO EM COMPONENTES
// ============================================

/*
'use client'
import { useState, useEffect } from 'react'
import { usersAPI, User } from '@/lib/api-client'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const data = await usersAPI.list()
      setUsers(data)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    try {
      await usersAPI.create({
        name: 'Novo Usuário',
        email: 'novo@email.com',
        is_active: true
      })
      loadUsers() // Recarregar lista
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <button onClick={handleCreate}>Criar Usuário</button>
      {users.map(user => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  )
}
*/
