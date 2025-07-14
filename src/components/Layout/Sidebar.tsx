import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Users, 
  BookOpen, 
  ClipboardCheck, 
  Bell, 
  Calendar, 
  FileText,
  Settings,
  LogOut
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth()

  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
    ]

    if (user?.role === 'director') {
      return [
        ...baseItems,
        { icon: Users, label: 'Estudiantes', path: '/students' },
        { icon: BookOpen, label: 'Cursos', path: '/courses' },
        { icon: ClipboardCheck, label: 'Calificaciones', path: '/grades' },
        { icon: ClipboardCheck, label: 'Asistencias', path: '/attendance' },
        { icon: Bell, label: 'Notificaciones', path: '/notifications' },
        { icon: Calendar, label: 'Calendario', path: '/calendar' },
        { icon: FileText, label: 'Materiales', path: '/materials' },
        { icon: Settings, label: 'Configuración', path: '/settings' },
      ]
    }

    if (user?.role === 'docente') {
      return [
        ...baseItems,
        { icon: Users, label: 'Mis Estudiantes', path: '/students' },
        { icon: BookOpen, label: 'Mis Cursos', path: '/courses' },
        { icon: ClipboardCheck, label: 'Calificaciones', path: '/grades' },
        { icon: ClipboardCheck, label: 'Asistencias', path: '/attendance' },
        { icon: Bell, label: 'Notificaciones', path: '/notifications' },
        { icon: Calendar, label: 'Calendario', path: '/calendar' },
        { icon: FileText, label: 'Materiales', path: '/materials' },
      ]
    }

    if (user?.role === 'familia') {
      return [
        ...baseItems,
        { icon: Users, label: 'Mis Hijos', path: '/students' },
        { icon: ClipboardCheck, label: 'Calificaciones', path: '/grades' },
        { icon: ClipboardCheck, label: 'Asistencias', path: '/attendance' },
        { icon: Bell, label: 'Notificaciones', path: '/notifications' },
        { icon: Calendar, label: 'Calendario', path: '/calendar' },
        { icon: FileText, label: 'Materiales', path: '/materials' },
      ]
    }

    return baseItems
  }

  const menuItems = getMenuItems()

  return (
    <div className="bg-white h-screen w-64 shadow-lg border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">GestorEscolar</h1>
        <p className="text-sm text-gray-600 mt-1">Instituto Secundario</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{user?.full_name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={signOut}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar