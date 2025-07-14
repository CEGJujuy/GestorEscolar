// Mock data for local development without database
export const mockUsers = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'director@instituto.edu',
    role: 'director' as const,
    full_name: 'María González',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'docente@instituto.edu',
    role: 'docente' as const,
    full_name: 'Carlos Rodríguez',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'familia@instituto.edu',
    role: 'familia' as const,
    full_name: 'Ana Martínez',
    created_at: '2024-01-01T00:00:00Z'
  }
]

export const mockCourses = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Matemáticas',
    year: 3,
    division: 'A',
    teacher_id: '22222222-2222-2222-2222-222222222222',
    created_at: '2024-01-01T00:00:00Z',
    teacher: mockUsers[1]
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Historia',
    year: 3,
    division: 'A',
    teacher_id: '22222222-2222-2222-2222-222222222222',
    created_at: '2024-01-01T00:00:00Z',
    teacher: mockUsers[1]
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    name: 'Lengua',
    year: 2,
    division: 'B',
    teacher_id: '22222222-2222-2222-2222-222222222222',
    created_at: '2024-01-01T00:00:00Z',
    teacher: mockUsers[1]
  }
]

export const mockStudents = [
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    full_name: 'Juan Martínez',
    dni: '12345678',
    birth_date: '2008-05-15',
    course_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    parent_id: '33333333-3333-3333-3333-333333333333',
    created_at: '2024-01-01T00:00:00Z',
    course: mockCourses[0]
  },
  {
    id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    full_name: 'Sofía Martínez',
    dni: '87654321',
    birth_date: '2009-03-20',
    course_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    parent_id: '33333333-3333-3333-3333-333333333333',
    created_at: '2024-01-01T00:00:00Z',
    course: mockCourses[0]
  },
  {
    id: 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh',
    full_name: 'Pedro García',
    dni: '11223344',
    birth_date: '2007-08-10',
    course_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    parent_id: '33333333-3333-3333-3333-333333333333',
    created_at: '2024-01-01T00:00:00Z',
    course: mockCourses[1]
  }
]

export const mockSubjects = [
  {
    id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    name: 'Matemáticas',
    course_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    teacher_id: '22222222-2222-2222-2222-222222222222',
    created_at: '2024-01-01T00:00:00Z',
    course: mockCourses[0],
    teacher: mockUsers[1]
  },
  {
    id: 'gggggggg-gggg-gggg-gggg-gggggggggggg',
    name: 'Historia',
    course_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    teacher_id: '22222222-2222-2222-2222-222222222222',
    created_at: '2024-01-01T00:00:00Z',
    course: mockCourses[1],
    teacher: mockUsers[1]
  },
  {
    id: 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii',
    name: 'Lengua',
    course_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    teacher_id: '22222222-2222-2222-2222-222222222222',
    created_at: '2024-01-01T00:00:00Z',
    course: mockCourses[2],
    teacher: mockUsers[1]
  }
]

export const mockGrades = [
  {
    id: 'grade-1',
    student_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    subject_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    grade: 8,
    trimester: 1,
    date: '2024-04-15',
    created_at: '2024-04-15T00:00:00Z',
    student: mockStudents[0],
    subject: mockSubjects[0]
  },
  {
    id: 'grade-2',
    student_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    subject_id: 'gggggggg-gggg-gggg-gggg-gggggggggggg',
    grade: 9,
    trimester: 1,
    date: '2024-04-20',
    created_at: '2024-04-20T00:00:00Z',
    student: mockStudents[0],
    subject: mockSubjects[1]
  },
  {
    id: 'grade-3',
    student_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    subject_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    grade: 7,
    trimester: 1,
    date: '2024-04-15',
    created_at: '2024-04-15T00:00:00Z',
    student: mockStudents[1],
    subject: mockSubjects[0]
  },
  {
    id: 'grade-4',
    student_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    subject_id: 'gggggggg-gggg-gggg-gggg-gggggggggggg',
    grade: 8,
    trimester: 1,
    date: '2024-04-20',
    created_at: '2024-04-20T00:00:00Z',
    student: mockStudents[1],
    subject: mockSubjects[1]
  },
  {
    id: 'grade-5',
    student_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    subject_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    grade: 6,
    trimester: 2,
    date: '2024-08-15',
    created_at: '2024-08-15T00:00:00Z',
    student: mockStudents[0],
    subject: mockSubjects[0]
  }
]

export const mockAttendance = [
  {
    id: 'att-1',
    student_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    date: '2024-11-01',
    status: 'presente' as const,
    subject_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    created_at: '2024-11-01T00:00:00Z',
    student: mockStudents[0],
    subject: mockSubjects[0]
  },
  {
    id: 'att-2',
    student_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    date: '2024-11-02',
    status: 'presente' as const,
    subject_id: 'gggggggg-gggg-gggg-gggg-gggggggggggg',
    created_at: '2024-11-02T00:00:00Z',
    student: mockStudents[0],
    subject: mockSubjects[1]
  },
  {
    id: 'att-3',
    student_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    date: '2024-11-01',
    status: 'tardanza' as const,
    subject_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    created_at: '2024-11-01T00:00:00Z',
    student: mockStudents[1],
    subject: mockSubjects[0]
  },
  {
    id: 'att-4',
    student_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    date: '2024-11-02',
    status: 'presente' as const,
    subject_id: 'gggggggg-gggg-gggg-gggg-gggggggggggg',
    created_at: '2024-11-02T00:00:00Z',
    student: mockStudents[1],
    subject: mockSubjects[1]
  },
  {
    id: 'att-5',
    student_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    date: '2024-11-03',
    status: 'ausente' as const,
    subject_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    created_at: '2024-11-03T00:00:00Z',
    student: mockStudents[0],
    subject: mockSubjects[0]
  }
]

export const mockNotifications = [
  {
    id: 'notif-1',
    title: 'Reunión de Padres',
    message: 'Se convoca a reunión de padres el día 15 de noviembre a las 18:00 hs.',
    recipient_id: '33333333-3333-3333-3333-333333333333',
    sender_id: '11111111-1111-1111-1111-111111111111',
    read: false,
    created_at: '2024-11-10T10:00:00Z',
    sender: mockUsers[0],
    recipient: mockUsers[2]
  },
  {
    id: 'notif-2',
    title: 'Calificaciones Actualizadas',
    message: 'Se han actualizado las calificaciones del primer trimestre.',
    recipient_id: '33333333-3333-3333-3333-333333333333',
    sender_id: '22222222-2222-2222-2222-222222222222',
    read: true,
    created_at: '2024-11-08T14:30:00Z',
    sender: mockUsers[1],
    recipient: mockUsers[2]
  },
  {
    id: 'notif-3',
    title: 'Examen de Matemáticas',
    message: 'Recordatorio: Examen de matemáticas el próximo lunes 18 de noviembre.',
    recipient_id: '33333333-3333-3333-3333-333333333333',
    sender_id: '22222222-2222-2222-2222-222222222222',
    read: false,
    created_at: '2024-11-12T09:15:00Z',
    sender: mockUsers[1],
    recipient: mockUsers[2]
  }
]

export const mockEvents = [
  {
    id: 'event-1',
    title: 'Reunión de Padres',
    description: 'Reunión informativa sobre el progreso académico',
    date: '2024-11-15',
    time: '18:00',
    created_by: '11111111-1111-1111-1111-111111111111',
    created_at: '2024-11-01T00:00:00Z',
    creator: mockUsers[0]
  },
  {
    id: 'event-2',
    title: 'Examen de Matemáticas',
    description: 'Evaluación del primer trimestre',
    date: '2024-11-18',
    time: '08:00',
    created_by: '22222222-2222-2222-2222-222222222222',
    created_at: '2024-11-05T00:00:00Z',
    creator: mockUsers[1]
  },
  {
    id: 'event-3',
    title: 'Acto del Día de la Tradición',
    description: 'Celebración del Día de la Tradición Argentina',
    date: '2024-11-20',
    time: '10:00',
    created_by: '11111111-1111-1111-1111-111111111111',
    created_at: '2024-11-02T00:00:00Z',
    creator: mockUsers[0]
  },
  {
    id: 'event-4',
    title: 'Feria de Ciencias',
    description: 'Exposición de proyectos científicos de los estudiantes',
    date: '2024-12-05',
    time: '14:00',
    created_by: '11111111-1111-1111-1111-111111111111',
    created_at: '2024-11-03T00:00:00Z',
    creator: mockUsers[0]
  }
]

export const mockMaterials = [
  {
    id: 'mat-1',
    title: 'Guía de Matemáticas - Unidad 1',
    description: 'Material de estudio para la primera unidad de matemáticas',
    file_url: 'https://example.com/math-guide-1.pdf',
    course_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    uploaded_by: '22222222-2222-2222-2222-222222222222',
    created_at: '2024-10-15T00:00:00Z',
    course: mockCourses[0],
    uploader: mockUsers[1]
  },
  {
    id: 'mat-2',
    title: 'Historia Argentina - Siglo XIX',
    description: 'Resumen de los principales eventos del siglo XIX en Argentina',
    file_url: 'https://example.com/history-19th.pdf',
    course_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    uploaded_by: '22222222-2222-2222-2222-222222222222',
    created_at: '2024-10-20T00:00:00Z',
    course: mockCourses[1],
    uploader: mockUsers[1]
  },
  {
    id: 'mat-3',
    title: 'Ejercicios de Álgebra',
    description: 'Práctica de ecuaciones y sistemas de ecuaciones',
    file_url: 'https://example.com/algebra-exercises.pdf',
    course_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    uploaded_by: '22222222-2222-2222-2222-222222222222',
    created_at: '2024-10-25T00:00:00Z',
    course: mockCourses[0],
    uploader: mockUsers[1]
  }
]