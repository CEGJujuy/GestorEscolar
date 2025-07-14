import React, { useEffect, useState } from 'react'
import { Plus, Send, Bell, MessageSquare, Users } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Notification, Student } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const NotificationsList: React.FC = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewNotification, setShowNewNotification] = useState(false)
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    recipients: [] as string[]
  })

  useEffect(() => {
    fetchNotifications()
    if (user?.role !== 'familia') {
      fetchStudents()
    }
  }, [user])

  const fetchNotifications = async () => {
    try {
      let query = supabase
        .from('notifications')
        .select(`
          *,
          sender:users!notifications_sender_id_fkey(*),
          recipient:users!notifications_recipient_id_fkey(*)
        `)
        .order('created_at', { ascending: false })

      if (user?.role === 'familia') {
        query = query.eq('recipient_id', user.id)
      }

      const { data, error } = await query

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      let query = supabase
        .from('students')
        .select('*, parent:users!students_parent_id_fkey(*)')

      if (user?.role === 'docente') {
        query = query.eq('courses.teacher_id', user.id)
      }

      const { data, error } = await query

      if (error) throw error
      setStudents(data || [])
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const sendNotification = async () => {
    if (!newNotification.title || !newNotification.message || newNotification.recipients.length === 0) {
      return
    }

    try {
      const notifications = newNotification.recipients.map(recipientId => ({
        title: newNotification.title,
        message: newNotification.message,
        recipient_id: recipientId,
        sender_id: user?.id,
        read: false
      }))

      const { error } = await supabase
        .from('notifications')
        .insert(notifications)

      if (error) throw error

      // Reset form
      setNewNotification({
        title: '',
        message: '',
        recipients: []
      })
      setShowNewNotification(false)
      
      // Refresh notifications
      fetchNotifications()

      // Here you would integrate with WhatsApp API
      // sendWhatsAppNotifications(notifications)

    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const getUniqueParents = () => {
    const parents = students.map(student => student.parent_id)
    return [...new Set(parents)]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notificaciones</h1>
            <p className="text-gray-600 mt-1">
              {user?.role === 'familia' 
                ? 'Mensajes y comunicados del instituto'
                : 'Envío de comunicados a padres y familias'
              }
            </p>
          </div>
          {user?.role !== 'familia' && (
            <button
              onClick={() => setShowNewNotification(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Notificación</span>
            </button>
          )}
        </div>
      </div>

      {/* New Notification Form */}
      {showNewNotification && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Nueva Notificación</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={newNotification.title}
                onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Título de la notificación"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje
              </label>
              <textarea
                value={newNotification.message}
                onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contenido del mensaje"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destinatarios
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newNotification.recipients.length === getUniqueParents().length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewNotification(prev => ({ ...prev, recipients: getUniqueParents() }))
                      } else {
                        setNewNotification(prev => ({ ...prev, recipients: [] }))
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="font-medium">Todos los padres</span>
                </label>
                {students.map(student => (
                  <label key={student.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newNotification.recipients.includes(student.parent_id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewNotification(prev => ({
                            ...prev,
                            recipients: [...prev.recipients, student.parent_id]
                          }))
                        } else {
                          setNewNotification(prev => ({
                            ...prev,
                            recipients: prev.recipients.filter(id => id !== student.parent_id)
                          }))
                        }
                      }}
                      className="mr-2"
                    />
                    <span>Padre/Madre de {student.full_name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={sendNotification}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Notificación</span>
              </button>
              <button
                onClick={() => setShowNewNotification(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {user?.role === 'familia' ? 'Mensajes Recibidos' : 'Notificaciones Enviadas'}
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                !notification.read && user?.role === 'familia' ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    !notification.read && user?.role === 'familia' 
                      ? 'bg-blue-500' 
                      : 'bg-gray-400'
                  }`}>
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-semibold text-gray-800">
                        {notification.title}
                      </h4>
                      {!notification.read && user?.role === 'familia' && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          Nuevo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>
                        {user?.role === 'familia' 
                          ? `De: ${notification.sender?.full_name}`
                          : `Para: ${notification.recipient?.full_name}`
                        }
                      </span>
                      <span>
                        {format(new Date(notification.created_at), 'dd MMM yyyy, HH:mm', { locale: es })}
                      </span>
                    </div>
                  </div>
                </div>
                {!notification.read && user?.role === 'familia' && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Marcar como leído
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay notificaciones</p>
          </div>
        )}
      </div>

      {/* WhatsApp Integration Info */}
      {user?.role !== 'familia' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-sm font-semibold text-green-800">
                Integración con WhatsApp
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Las notificaciones también se pueden enviar automáticamente por WhatsApp. 
                Configura la API de WhatsApp Business en la sección de configuración.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationsList