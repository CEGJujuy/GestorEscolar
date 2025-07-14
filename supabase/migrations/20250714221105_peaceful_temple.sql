/*
  # Esquema inicial para GestorEscolar

  1. Nuevas Tablas
    - `users` - Usuarios del sistema (director, docente, familia)
    - `students` - Información de estudiantes
    - `courses` - Cursos y materias
    - `subjects` - Materias por curso
    - `grades` - Calificaciones de estudiantes
    - `attendance` - Registros de asistencia
    - `notifications` - Notificaciones del sistema
    - `events` - Eventos del calendario
    - `materials` - Materiales educativos

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas de acceso basadas en roles
    - Restricciones por usuario autenticado

  3. Datos de prueba
    - Usuarios de ejemplo para cada rol
    - Estudiantes, cursos y datos relacionados
*/

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('director', 'docente', 'familia')),
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de estudiantes
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  dni text UNIQUE NOT NULL,
  birth_date date NOT NULL,
  course_id uuid REFERENCES courses(id),
  parent_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de cursos
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  year integer NOT NULL CHECK (year >= 1 AND year <= 6),
  division text NOT NULL,
  teacher_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de materias
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  course_id uuid REFERENCES courses(id),
  teacher_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de calificaciones
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id),
  subject_id uuid REFERENCES subjects(id),
  grade integer NOT NULL CHECK (grade >= 1 AND grade <= 10),
  trimester integer NOT NULL CHECK (trimester >= 1 AND trimester <= 3),
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de asistencias
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id),
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL CHECK (status IN ('presente', 'ausente', 'tardanza')),
  subject_id uuid REFERENCES subjects(id),
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  recipient_id uuid REFERENCES users(id),
  sender_id uuid REFERENCES users(id),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de eventos
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  time time NOT NULL,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de materiales
CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  course_id uuid REFERENCES courses(id),
  uploaded_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Directors can read all users" ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'director'
    )
  );

-- Políticas para estudiantes
CREATE POLICY "Directors can manage all students" ON students
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'director'
    )
  );

CREATE POLICY "Teachers can read their students" ON students
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN courses c ON c.teacher_id = u.id
      WHERE u.id = auth.uid() AND u.role = 'docente' AND c.id = students.course_id
    )
  );

CREATE POLICY "Parents can read their children" ON students
  FOR SELECT TO authenticated
  USING (parent_id = auth.uid());

-- Políticas para cursos
CREATE POLICY "Directors can manage all courses" ON courses
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'director'
    )
  );

CREATE POLICY "Teachers can read their courses" ON courses
  FOR SELECT TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Parents can read courses of their children" ON courses
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.parent_id = auth.uid() AND s.course_id = courses.id
    )
  );

-- Políticas para materias
CREATE POLICY "Directors can manage all subjects" ON subjects
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'director'
    )
  );

CREATE POLICY "Teachers can manage their subjects" ON subjects
  FOR ALL TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Parents can read subjects of their children's courses" ON subjects
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.parent_id = auth.uid() AND s.course_id = subjects.course_id
    )
  );

-- Políticas para calificaciones
CREATE POLICY "Directors can manage all grades" ON grades
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'director'
    )
  );

CREATE POLICY "Teachers can manage grades for their subjects" ON grades
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subjects s
      WHERE s.id = grades.subject_id AND s.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Parents can read their children's grades" ON grades
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = grades.student_id AND s.parent_id = auth.uid()
    )
  );

-- Políticas para asistencias
CREATE POLICY "Directors can manage all attendance" ON attendance
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'director'
    )
  );

CREATE POLICY "Teachers can manage attendance for their subjects" ON attendance
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subjects s
      WHERE s.id = attendance.subject_id AND s.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Parents can read their children's attendance" ON attendance
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = attendance.student_id AND s.parent_id = auth.uid()
    )
  );

-- Políticas para notificaciones
CREATE POLICY "Users can read their notifications" ON notifications
  FOR SELECT TO authenticated
  USING (recipient_id = auth.uid() OR sender_id = auth.uid());

CREATE POLICY "Directors and teachers can send notifications" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('director', 'docente')
    )
  );

-- Políticas para eventos
CREATE POLICY "Everyone can read events" ON events
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Directors and teachers can manage events" ON events
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('director', 'docente')
    )
  );

-- Políticas para materiales
CREATE POLICY "Everyone can read materials" ON materials
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Directors and teachers can manage materials" ON materials
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('director', 'docente')
    )
  );

-- Insertar usuarios de prueba
INSERT INTO users (id, email, role, full_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'director@instituto.edu', 'director', 'María González'),
  ('22222222-2222-2222-2222-222222222222', 'docente@instituto.edu', 'docente', 'Carlos Rodríguez'),
  ('33333333-3333-3333-3333-333333333333', 'familia@instituto.edu', 'familia', 'Ana Martínez');

-- Insertar cursos de prueba
INSERT INTO courses (id, name, year, division, teacher_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Matemáticas', 3, 'A', '22222222-2222-2222-2222-222222222222'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Historia', 3, 'A', '22222222-2222-2222-2222-222222222222');

-- Insertar estudiantes de prueba
INSERT INTO students (id, full_name, dni, birth_date, course_id, parent_id) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Juan Martínez', '12345678', '2008-05-15', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Sofía Martínez', '87654321', '2009-03-20', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333');

-- Insertar materias de prueba
INSERT INTO subjects (id, name, course_id, teacher_id) VALUES
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Matemáticas', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', 'Historia', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222');

-- Insertar calificaciones de prueba
INSERT INTO grades (student_id, subject_id, grade, trimester, date) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 8, 1, '2024-04-15'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 9, 1, '2024-04-20'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 7, 1, '2024-04-15'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 8, 1, '2024-04-20');

-- Insertar asistencias de prueba
INSERT INTO attendance (student_id, date, status, subject_id) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '2024-11-01', 'presente', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '2024-11-02', 'presente', 'gggggggg-gggg-gggg-gggg-gggggggggggg'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2024-11-01', 'tardanza', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2024-11-02', 'presente', 'gggggggg-gggg-gggg-gggg-gggggggggggg');

-- Insertar eventos de prueba
INSERT INTO events (title, description, date, time, created_by) VALUES
  ('Reunión de Padres', 'Reunión informativa sobre el progreso académico', '2024-11-15', '18:00', '11111111-1111-1111-1111-111111111111'),
  ('Examen de Matemáticas', 'Evaluación del primer trimestre', '2024-11-18', '08:00', '22222222-2222-2222-2222-222222222222'),
  ('Acto del Día de la Tradición', 'Celebración del Día de la Tradición Argentina', '2024-11-20', '10:00', '11111111-1111-1111-1111-111111111111');

-- Insertar notificaciones de prueba
INSERT INTO notifications (title, message, recipient_id, sender_id) VALUES
  ('Reunión de Padres', 'Se convoca a reunión de padres el día 15 de noviembre a las 18:00 hs.', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
  ('Calificaciones Actualizadas', 'Se han actualizado las calificaciones del primer trimestre.', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222');

-- Insertar materiales de prueba
INSERT INTO materials (title, description, file_url, course_id, uploaded_by) VALUES
  ('Guía de Matemáticas - Unidad 1', 'Material de estudio para la primera unidad de matemáticas', 'https://example.com/math-guide-1.pdf', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
  ('Historia Argentina - Siglo XIX', 'Resumen de los principales eventos del siglo XIX en Argentina', 'https://example.com/history-19th.pdf', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222');