import React, { useEffect, useState } from 'react'
import { Plus, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Event } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import { es } from 'date-fns/locale'

const CalendarView: React.FC = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: ''
  })

  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  const fetchEvents = async () => {
    try {
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:users(*)
        `)
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'))
        .order('date', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      return
    }

    try {
      const { error } = await supabase
        .from('events')
        .insert({
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date,
          time: newEvent.time,
          created_by: user?.id
        })

      if (error) throw error

      // Reset form
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: ''
      })
      setShowNewEvent(false)
      
      // Refresh events
      fetchEvents()
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    return eachDayOfInterval({ start: monthStart, end: monthEnd })
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date))
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth()
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

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
            <h1 className="text-2xl font-bold text-gray-800">Calendario de Actividades</h1>
            <p className="text-gray-600 mt-1">
              Eventos y actividades programadas del instituto
            </p>
          </div>
          {user?.role !== 'familia' && (
            <button
              onClick={() => setShowNewEvent(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Evento</span>
            </button>
          )}
        </div>
      </div>

      {/* New Event Form */}
      {showNewEvent && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Nuevo Evento</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Título del evento"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora
              </label>
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descripción del evento"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={createEvent}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Evento
            </button>
            <button
              onClick={() => setShowNewEvent(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Hoy
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Week days header */}
            {weekDays.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map(day => {
              const dayEvents = getEventsForDate(day)
              const isSelected = selectedDate && isSameDay(day, selectedDate)
              const isTodayDate = isToday(day)

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`p-2 min-h-[80px] border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-blue-50 border-blue-300' : ''
                  } ${isTodayDate ? 'bg-blue-100' : ''}`}
                >
                  <div className={`text-sm font-medium ${
                    isTodayDate ? 'text-blue-600' : 'text-gray-800'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded truncate"
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} más
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {selectedDate 
              ? `Eventos del ${format(selectedDate, 'd MMMM', { locale: es })}`
              : 'Próximos Eventos'
            }
          </h3>

          <div className="space-y-4">
            {(selectedDate ? getEventsForDate(selectedDate) : events.slice(0, 5)).map(event => (
              <div key={event.id} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-800">{event.title}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{format(new Date(event.date), 'dd MMM yyyy', { locale: es })}</span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{event.time}</span>
                </div>
                {event.description && (
                  <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Creado por: {event.creator?.full_name}
                </p>
              </div>
            ))}

            {(selectedDate ? getEventsForDate(selectedDate) : events).length === 0 && (
              <p className="text-gray-500 text-center py-8">
                {selectedDate ? 'No hay eventos para esta fecha' : 'No hay eventos próximos'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarView