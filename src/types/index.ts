export interface User {
  id: string
  email: string
  role: 'director' | 'docente' | 'familia'
  full_name: string
  created_at: string
}

export interface Student {
  id: string
  full_name: string
  dni: string
  birth_date: string
  course_id: string
  parent_id: string
  created_at: string
  course?: Course
}

export interface Course {
  id: string
  name: string
  year: number
  division: string
  teacher_id: string
  created_at: string
  teacher?: User
}

export interface Subject {
  id: string
  name: string
  course_id: string
  teacher_id: string
  created_at: string
  course?: Course
  teacher?: User
}

export interface Grade {
  id: string
  student_id: string
  subject_id: string
  grade: number
  trimester: number
  date: string
  created_at: string
  student?: Student
  subject?: Subject
}

export interface Attendance {
  id: string
  student_id: string
  date: string
  status: 'presente' | 'ausente' | 'tardanza'
  subject_id: string
  created_at: string
  student?: Student
  subject?: Subject
}

export interface Notification {
  id: string
  title: string
  message: string
  recipient_id: string
  sender_id: string
  read: boolean
  created_at: string
  sender?: User
  recipient?: User
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  created_by: string
  created_at: string
  creator?: User
}

export interface Material {
  id: string
  title: string
  description: string
  file_url: string
  course_id: string
  uploaded_by: string
  created_at: string
  course?: Course
  uploader?: User
}