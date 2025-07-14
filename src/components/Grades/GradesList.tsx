import React, { useEffect, useState } from 'react'
import { Plus, Search, Download, Filter } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Grade, Student, Subject } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import jsPDF from 'jspdf'

const GradesList: React.FC = () => {
  const { user } = useAuth()
  const [grades, setGrades] = useState<Grade[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrimester, setSelectedTrimester] = useState<number>(1)
  const [selectedStudent, setSelectedStudent] = useState<string>('')

  useEffect(() => {
    fetchData()
  }, [user, selectedTrimester, selectedStudent])

  const fetchData = async () => {
    try {
      // Fetch grades
      let gradesQuery = supabase
        .from('grades')
        .select(`
          *,
          student:students(*),
          subject:subjects(*)
        `)
        .eq('trimester', selectedTrimester)

      if (selectedStudent) {
        gradesQuery = gradesQuery.eq('student_id', selectedStudent)
      }

      if (user?.role === 'docente') {
        gradesQuery = gradesQuery.eq('subjects.teacher_id', user.id)
      } else if (user?.role === 'familia') {
        gradesQuery = gradesQuery.eq('students.parent_id', user.id)
      }

      const { data: gradesData, error: gradesError } = await gradesQuery

      if (gradesError) throw gradesError
      setGrades(gradesData || [])

      // Fetch students for filter
      let studentsQuery = supabase.from('students').select('*')
      
      if (user?.role === 'familia') {
        studentsQuery = studentsQuery.eq('parent_id', user.id)
      }

      const { data: studentsData, error: studentsError } = await studentsQuery

      if (studentsError) throw studentsError
      setStudents(studentsData || [])

      // Fetch subjects
      let subjectsQuery = supabase.from('subjects').select('*')
      
      if (user?.role === 'docente') {
        subjectsQuery = subjectsQuery.eq('teacher_id', user.id)
      }

      const { data: subjectsData, error: subjectsError } = await subjectsQuery

      if (subjectsError) throw subjectsError
      setSubjects(subjectsData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReportCard = async (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    const studentGrades = grades.filter(g => g.student_id === studentId)

    if (!student) return

    const pdf = new jsPDF()
    
    // Header
    pdf.setFontSize(20)
    pdf.text('Boletín de Calificaciones', 20, 30)
    
    pdf.setFontSize(12)
    pdf.text(`Estudiante: ${student.full_name}`, 20, 50)
    pdf.text(`DNI: ${student.dni}`, 20, 60)
    pdf.text(`Trimestre: ${selectedTrimester}`, 20, 70)
    pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 80)

    // Grades table
    let yPosition = 100
    pdf.setFontSize(14)
    pdf.text('Calificaciones:', 20, yPosition)
    
    yPosition += 20
    pdf.setFontSize(10)
    pdf.text('Materia', 20, yPosition)
    pdf.text('Nota', 120, yPosition)
    
    yPosition += 10
    pdf.line(20, yPosition, 190, yPosition)
    
    studentGrades.forEach(grade => {
      yPosition += 15
      pdf.text(grade.subject?.name || '', 20, yPosition)
      pdf.text(grade.grade.toString(), 120, yPosition)
    })

    // Calculate average
    const average = studentGrades.reduce((sum, grade) => sum + grade.grade, 0) / studentGrades.length
    yPosition += 20
    pdf.setFontSize(12)
    pdf.text(`Promedio: ${average.toFixed(2)}`, 20, yPosition)

    pdf.save(`boletin_${student.full_name}_trimestre_${selectedTrimester}.pdf`)
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
            <h1 className="text-2xl font-bold text-gray-800">Calificaciones</h1>
            <p className="text-gray-600 mt-1">
              Gestión y consulta de notas por materia
            </p>
          </div>
          {user?.role !== 'familia' && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nueva Calificación</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trimestre
            </label>
            <select
              value={selectedTrimester}
              onChange={(e) => setSelectedTrimester(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>Primer Trimestre</option>
              <option value={2}>Segundo Trimestre</option>
              <option value={3}>Tercer Trimestre</option>
            </select>
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

      {/* Grades Table */}
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
                  Calificación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {grade.student?.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {grade.student?.full_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {grade.subject?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      grade.grade >= 7 
                        ? 'bg-green-100 text-green-800'
                        : grade.grade >= 4
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(grade.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => generateReportCard(grade.student_id)}
                      className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Boletín</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {grades.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron calificaciones</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GradesList