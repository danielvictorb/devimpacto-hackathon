'use client'

/**
 * Exemplo de componente usando Supabase
 * 
 * Este é um exemplo completo de como usar o Supabase em um componente Next.js
 */

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export default function SupabaseExampleComponent() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchUsers()
    
    // Opcional: Configurar subscription para atualizações em tempo real
    const unsubscribe = setupRealtimeSubscription()
    
    // Cleanup ao desmontar
    return () => {
      unsubscribe()
    }
  }, [])

  // Função para buscar usuários
  async function fetchUsers() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('users') // Substitua pelo nome da sua tabela
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar usuários:', err)
    } finally {
      setLoading(false)
    }
  }

  // Função para adicionar novo usuário
  async function addUser(name: string, email: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email }])
        .select()

      if (error) throw error

      // Atualizar estado local
      if (data) {
        setUsers([...data, ...users])
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao adicionar usuário:', err)
    }
  }

  // Função para deletar usuário
  async function deleteUser(id: string) {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Atualizar estado local
      setUsers(users.filter(user => user.id !== id))
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao deletar usuário:', err)
    }
  }

  // Configurar subscription para atualizações em tempo real
  function setupRealtimeSubscription() {
    const channel = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Escuta todos os eventos (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'users',
        },
        (payload) => {
          console.log('Mudança detectada:', payload)
          
          // Recarregar dados quando houver mudança
          fetchUsers()
        }
      )
      .subscribe()

    // Retorna função de cleanup
    return () => {
      supabase.removeChannel(channel)
    }
  }

  if (loading) {
    return <div className="p-4">Carregando...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">Erro: {error}</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Exemplo Supabase</h1>
      
      <div className="mb-4">
        <button
          onClick={() => addUser('Novo Usuário', 'novo@email.com')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Adicionar Usuário
        </button>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={() => deleteUser(user.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Deletar
            </button>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <p className="text-gray-500">Nenhum usuário encontrado</p>
      )}
    </div>
  )
}
