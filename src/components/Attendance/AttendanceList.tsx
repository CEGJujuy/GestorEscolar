import React, { useEffect, useState } from 'react'
import { Calendar, Download, Filter, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Attendance, Student, Subject } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import { mockAttendance, mockStudents, mockSubjects } from '../../lib/mockData'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import jsPDF from 'jspdf'

const AttendanceList: React.FC = () => {
  const { user } = useAuth()
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'))
  const [selectedStudent, setSelectedStudent] = useState<string>('')

  useEffect(() => {
    fetchData()
  }, [user, selectedMonth, selectedStudent])

  const fetchData = async () => {
    try {
      const monthStart = startOfMonth(new Date(selectedMonth))
      const monthEnd = endOfMonth(new Date(selectedMonth))

      // Filter attendance based on month and user role
      let filteredAttendance = mockAttendance.filter(a => {
        const attendanceDate = new Date(a.date)
        return attendanceDate >= monthStart && attendanceDate <= monthEnd
      })
      
      if (selectedStudent) {
        filteredAttendance = filteredAttendance.filter(a => a.student_id === selectedStudent)
      }
      
      if (user?.role === 'docente') {
        filteredAttendance = filteredAttendance.filter(a => a.subject?.teacher_id === user.id)
      } else if (user?.role === 'familia') {
        const userStudentIds = mockStudents.filter(s => s.parent_id === user.id).map(s => s.id)
        filteredAttendance = filteredAttendance.filter(a => userStudentIds.includes(a.student_id))
      }
      
      setAttendance(filteredAttendance)
      
      // Filter students based on user role
      let filteredStudents = mockStudents
      if (user?.role === 'familia') {
        filteredStudents = mockStudents.filter(s => s.parent_id === user.id)
      }
      setStudents(filteredStudents)
      
      // Filter subjects based on user role
      let filteredSubjects = mockSubjects
      if (user?.role === 'docente') {
        filteredSubjects = mockSubjects.filter(s => s.teacher_id === user.id)
      }
      setSubjects(filteredSubjects)

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateAttendanceReport = async (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    const studentAttendance = attendance.filter(a => a.student_id === studentId)

    if (!student) return

    const pdf = new jsPDF()
    
    // Header
    pdf.setFontSize(20)
    pdf.text('Reporte de Asistencias', 20, 30)
    
    pdf.setFontSize(12)
    pdf.text(`Estudiante: ${student.full_name}`, 20, 50)
    pdf.text(`DNI: ${student.dni}`, 20, 60)
    pdf.text(`Período: ${format(new Date(selectedMonth), 'MMMM yyyy', { locale: es })}`, 20, 70)
    pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 80)

    // Statistics
    const totalDays = studentAttendance.length
    const presentDays = studentAttendance.filter(a => a.status === 'presente').length
    const absentDays = studentAttendance.filter(a => a.status === 'ausente').length
    const lateDays = studentAttendance.filter(a => a.status === 'tardanza').length
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays * 100).toFixed(1) : '0'

    pdf.setFontSize(14)
    pdf.text('Resumen:', 20, 100)
    pdf.setFontSize(10)
    pdf.text(`Total de días: ${totalDays}`, 20, 115)
    pdf.text(`Presentes: ${presentDays}`, 20, 125)
    pdf.text(`Ausentes: ${absentDays}`, 20, 135)
    pdf.text(`Tardanzas: ${lateDays}`, 20, 145)
    pdf.text(`Porcentaje de asistencia: ${attendanceRate}%`, 20, 155)

    // Attendance details
    let yPosition = 175
    pdf.setFontSize(14)
    pdf.text('Detalle de Asistencias:', 20, yPosition)
    
    yPosition += 20
    pdf.setFontSize(10)
    pdf.text('Fecha', 20, yPosition)
    pdf.text('Materia', 70, yPosition)
    pdf.text('Estado', 140, yPosition)
    
    yPosition += 10
    pdf.line(20, yPosition, 190, yPosition)
    
    studentAttendance.forEach(record => {
      yPosition += 15
      if (yPosition > 270) {
        pdf.addPage()
        yPosition = 30
      }
      pdf.text(format(new Date(record.date), 'dd/MM/yyyy'), 20, yPosition)
      pdf.text(record.subject?.name || '', 70, yPosition)
      pdf.text(record.status, 140, yPosition)
    })

    pdf.save(`asistencia_${student.full_name}_${selectedMonth}.pdf`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'presente':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'ausente':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'tardanza':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full"
    switch (status) {
      case 'presente':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'ausente':
        return `${baseClasses} bg-red-100 text-red-800`
      case 'tardanza':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      default:
        return baseClasses
    }
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
            <h1 className="text-2xl font-bold text-gray-800">Control de Asistencias</h1>
            <p className="text-gray-600 mt-1">
              Registro y seguimiento de asistencias estudiantiles
            </p>
          </div>
          {user?.role !== 'familia' && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Tomar Asistencia</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mes
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {user?.role !== 'familia' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estudiante
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estudiantes</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.full_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Materia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {record.student?.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {record.student?.full_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.subject?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(record.date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      <span className={getStatusBadge(record.status)}>
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => generateAttendanceReport(record.student_id)}
                      className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Reporte</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {attendance.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron registros de asistencia</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendanceList