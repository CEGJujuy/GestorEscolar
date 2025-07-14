import React, { useEffect, useState } from 'react'
import { Users, BookOpen, ClipboardCheck, Bell, Calendar, TrendingUp } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { mockStudents, mockCourses, mockNotifications, mockEvents } from '../../lib/mockData'

interface DashboardStats {
  students: number
  courses: number
  notifications: number
  events: number
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    students: 0,
    courses: 0,
    notifications: 0,
    events: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    try {
      // Mock data filtering based on user role
      let studentsCount = mockStudents.length
      let coursesCount = mockCourses.length
      let notificationsCount = mockNotifications.filter(n => n.recipient_id === user?.id).length
      let eventsCount = mockEvents.length
      
      if (user?.role === 'docente') {
        studentsCount = mockStudents.filter(s => s.course?.teacher_id === user.id).length
        coursesCount = mockCourses.filter(c => c.teacher_id === user.id).length
      } else if (user?.role === 'familia') {
        studentsCount = mockStudents.filter(s => s.parent_id === user.id).length
        coursesCount = mockCourses.filter(c => 
          mockStudents.some(s => s.parent_id === user.id && s.course_id === c.id)
        ).length
      }

      setStats({
        students: studentsCount,
        courses: coursesCount,
        notifications: notificationsCount,
        events: eventsCount,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'director':
        return 'Panel de Control - Director'
      case 'docente':
        return 'Panel de Control - Docente'
      case 'familia':
        return 'Panel de Control - Familia'
      default:
        return 'Panel de Control'
    }
  }

  const getStatsCards = () => {
    if (user?.role === 'director') {
      return [
        {
          title: 'Total Estudiantes',
          value: stats.students,
          icon: Users,
          color: 'bg-blue-500',
          change: '+12%',
        },
        {
          title: 'Cursos Activos',
          value: stats.courses,
          icon: BookOpen,
          color: 'bg-green-500',
          change: '+5%',
        },
        {
          title: 'Notificaciones',
          value: stats.notifications,
          icon: Bell,
          color: 'bg-yellow-500',
          change: '+8%',
        },
        {
          title: 'Eventos del Mes',
          value: stats.events,
          icon: Calendar,
          color: 'bg-purple-500',
          change: '+3%',
        },
      ]
    }

    if (user?.role === 'docente') {
      return [
        {
          title: 'Mis Estudiantes',
          value: stats.students,
          icon: Users,
          color: 'bg-blue-500',
          change: '+2%',
        },
        {
          title: 'Mis Cursos',
          value: stats.courses,
          icon: BookOpen,
          color: 'bg-green-500',
          change: '0%',
        },
        {
          title: 'Notificaciones',
          value: stats.notifications,
          icon: Bell,
          color: 'bg-yellow-500',
          change: '+15%',
        },
        {
          title: 'Tareas Pendientes',
          value: 8,
          icon: ClipboardCheck,
          color: 'bg-red-500',
          change: '-10%',
        },
      ]
    }

    return [
      {
        title: 'Mis Hijos',
        value: 2,
        icon: Users,
        color: 'bg-blue-500',
        change: '0%',
      },
      {
        title: 'Notificaciones',
        value: stats.notifications,
        icon: Bell,
        color: 'bg-yellow-500',
        change: '+5%',
      },
      {
        title: 'Próximos Eventos',
        value: stats.events,
        icon: Calendar,
        color: 'bg-purple-500',
        change: '+2%',
      },
      {
        title: 'Materiales Nuevos',
        value: 12,
        icon: BookOpen,
        color: 'bg-green-500',
        change: '+20%',
      },
    ]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const statsCards = getStatsCards()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800">{getWelcomeMessage()}</h1>
        <p className="text-gray-600 mt-1">
          Resumen de actividades y estadísticas del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{card.change}</span>
              <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-600">
                Nueva calificación registrada en Matemáticas
              </p>
              <span className="text-xs text-gray-400">Hace 2 horas</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-600">
                Material subido para Historia
              </p>
              <span className="text-xs text-gray-400">Hace 4 horas</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-sm text-gray-600">
                Notificación enviada a padres
              </p>
              <span className="text-xs text-gray-400">Hace 6 horas</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Próximos Eventos</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-800">Reunión de Padres</h4>
              <p className="text-sm text-gray-600">15 de Noviembre - 18:00</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-800">Examen de Matemáticas</h4>
              <p className="text-sm text-gray-600">18 de Noviembre - 08:00</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-800">Acto del Día de la Tradición</h4>
              <p className="text-sm text-gray-600">20 de Noviembre - 10:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard