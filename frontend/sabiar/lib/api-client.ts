/**
 * Exemplo de como chamar a API do Backend (FastAPI + SQLAlchemy)
 * Use isso no frontend Next.js para fazer requisições ao backend
 */

import type { Student, StudentExam, StudentAnswer, Exam, ExamInsight, StudentPerformance, ComparisonData } from './types/student'

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
// STUDENTS API (Sistema de Correção de Provas)
// ============================================

export const studentsAPI = {
  // Buscar estudante por ID
  get: async (studentId: string): Promise<Student> => {
    return fetchAPI(`/students/${studentId}`)
  },

  // Listar estudantes por turma
  listByClass: async (classId: string, skip = 0, limit = 100): Promise<Student[]> => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      class_id: classId,
    })
    return fetchAPI(`/students/?${params}`)
  },

  // Buscar provas do estudante
  getExams: async (studentId: string): Promise<StudentExam[]> => {
    return fetchAPI(`/students/${studentId}/exams`)
  },

  // Buscar desempenho completo do estudante
  getPerformance: async (studentId: string): Promise<StudentPerformance> => {
    const student = await fetchAPI(`/students/${studentId}`)
    const exams = await fetchAPI(`/students/${studentId}/exams`)
    
    // Calcular estatísticas
    const scores = exams.map((e: StudentExam) => e.percentage || 0)
    const statistics = {
      totalExams: exams.length,
      averageScore: scores.reduce((a: number, b: number) => a + b, 0) / scores.length || 0,
      bestScore: Math.max(...scores, 0),
      worstScore: Math.min(...scores, 100),
      improvementRate: calculateImprovementRate(scores),
    }

    return { student, exams, statistics }
  },

  // Comparar aluno com a turma
  getComparison: async (studentId: string): Promise<ComparisonData> => {
    return fetchAPI(`/students/${studentId}/comparison`)
  },
}

// ============================================
// EXAMS API
// ============================================

export const examsAPI = {
  // Buscar prova por ID
  get: async (examId: string): Promise<Exam> => {
    return fetchAPI(`/exams/${examId}`)
  },

  // Buscar insights da prova
  getInsights: async (examId: string): Promise<ExamInsight> => {
    return fetchAPI(`/exams/${examId}/insights`)
  },

  // Buscar provas submetidas
  getStudentExams: async (examId: string): Promise<StudentExam[]> => {
    return fetchAPI(`/exams/${examId}/student-exams`)
  },
}

// ============================================
// STUDENT EXAMS API
// ============================================

export const studentExamsAPI = {
  // Buscar prova do aluno
  get: async (studentExamId: string): Promise<StudentExam> => {
    return fetchAPI(`/student-exams/${studentExamId}`)
  },

  // Buscar respostas do aluno
  getAnswers: async (studentExamId: string): Promise<StudentAnswer[]> => {
    return fetchAPI(`/student-exams/${studentExamId}/answers`)
  },
}

// Helper para calcular taxa de melhoria
function calculateImprovementRate(scores: number[]): number {
  if (scores.length < 2) return 0
  
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2))
  const secondHalf = scores.slice(Math.floor(scores.length / 2))
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
  
  return ((secondAvg - firstAvg) / firstAvg) * 100
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
