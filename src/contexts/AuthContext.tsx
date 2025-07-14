import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '../types'
import { mockUsers } from '../lib/mockData'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock authentication - find user by email
    const foundUser = mockUsers.find(u => u.email === email)
    
    if (!foundUser) {
      throw new Error('Usuario no encontrado')
    }
    
    // Simple password validation (in real app, this would be properly hashed)
    const validPasswords: Record<string, string> = {
      'director@instituto.edu': 'director123',
      'docente@instituto.edu': 'docente123',
      'familia@instituto.edu': 'familia123'
    }
    
    if (validPasswords[email] !== password) {
      throw new Error('Contraseña incorrecta')
    }
    
    setUser(foundUser)
    localStorage.setItem('currentUser', JSON.stringify(foundUser))
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}