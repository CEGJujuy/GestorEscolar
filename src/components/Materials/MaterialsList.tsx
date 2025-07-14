import React, { useEffect, useState } from 'react'
import { Plus, Download, FileText, Upload, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Material, Course } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const MaterialsList: React.FC = () => {
  const { user } = useAuth()
  const [materials, setMaterials] = useState<Material[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    course_id: '',
    file: null as File | null
  })

  useEffect(() => {
    fetchData()
  }, [user, selectedCourse])

  const fetchData = async () => {
    try {
      // Fetch materials
      let materialsQuery = supabase
        .from('materials')
        .select(`
          *,
          course:courses(*),
          uploader:users(*)
        `)
        .order('created_at', { ascending: false })

      if (selectedCourse) {
        materialsQuery = materialsQuery.eq('course_id', selectedCourse)
      }

      if (user?.role === 'docente') {
        materialsQuery = materialsQuery.eq('uploaded_by', user.id)
      } else if (user?.role === 'familia') {
        // Get courses of user's children
        const { data: students } = await supabase
          .from('students')
          .select('course_id')
          .eq('parent_id', user.id)
        
        const courseIds = students?.map(s => s.course_id) || []
        if (courseIds.length > 0) {
          materialsQuery = materialsQuery.in('course_id', courseIds)
        }
      }

      const { data: materialsData, error: materialsError } = await materialsQuery

      if (materialsError) throw materialsError
      setMaterials(materialsData || [])

      // Fetch courses
      let coursesQuery = supabase.from('courses').select('*')
      
      if (user?.role === 'docente') {
        coursesQuery = coursesQuery.eq('teacher_id', user.id)
      } else if (user?.role === 'familia') {
        const { data: students } = await supabase
          .from('students')
          .select('course_id')
          .eq('parent_id', user.id)
        
        const courseIds = students?.map(s => s.course_id) || []
        if (courseIds.length > 0) {
          coursesQuery = coursesQuery.in('id', courseIds)
        }
      }

      const { data: coursesData, error: coursesError } = await coursesQuery

      if (coursesError) throw coursesError
      setCourses(coursesData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const uploadMaterial = async () => {
    if (!newMaterial.title || !newMaterial.course_id || !newMaterial.file) {
      return
    }

    try {
      // In a real implementation, you would upload the file to Supabase Storage
      // For now, we'll simulate with a placeholder URL
      const fileUrl = `https://example.com/files/${newMaterial.file.name}`

      const { error } = await supabase
        .from('materials')
        .insert({
          title: newMaterial.title,
          description: newMaterial.description,
          file_url: fileUrl,
          course_id: newMaterial.course_id,
          uploaded_by: user?.id
        })

      if (error) throw error

      // Reset form
      setNewMaterial({
        title: '',
        description: '',
        course_id: '',
        file: null
      })
      setShowUpload(false)
      
      // Refresh materials
      fetchData()
    } catch (error) {
      console.error('Error uploading material:', error)
    }
  }

  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            <h1 className="text-2xl font-bold text-gray-800">Materiales Educativos</h1>
            <p className="text-gray-600 mt-1">
              Recursos y materiales de estudio por curso
            </p>
          </div>
          {user?.role !== 'familia' && (
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Subir Material</span>
            </button>
          )}
        </div>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Subir Nuevo Material</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={newMaterial.title}
                onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Título del material"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curso
              </label>
              <select
                value={newMaterial.course_id}
                onChange={(e) => setNewMaterial(prev => ({ ...prev, course_id: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar curso</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} - {course.year}° {course.division}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={newMaterial.description}
                onChange={(e) => setNewMaterial(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descripción del material"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo
              </label>
              <input
                type="file"
                onChange={(e) => setNewMaterial(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={uploadMaterial}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Subir Material
            </button>
            <button
              onClick={() => setShowUpload(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar materiales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los cursos</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} - {course.year}° {course.division}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <div key={material.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{material.title}</h3>
                  <p className="text-sm text-gray-600">
                    {material.course?.name} - {material.course?.year}° {material.course?.division}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {material.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>Por: {material.uploader?.full_name}</span>
              <span>{format(new Date(material.created_at), 'dd MMM yyyy', { locale: es })}</span>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Descargar</span>
            </button>
          </div>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron materiales</p>
        </div>
      )}
    </div>
  )
}

export default MaterialsList