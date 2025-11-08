/**
 * Tipos TypeScript para dados do aluno
 * Baseados nos modelos do backend (models.py)
 */

export interface Student {
  id: string;
  class_id: string;
  
  // Dados básicos
  name: string;
  gender?: "Masculino" | "Feminino" | "Outro" | "Prefiro não informar";
  birth_date?: string;
  cpf?: string;
  phone?: string;
  registration_number?: string;
  access_code: string;
  
  // Endereço
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  
  // Acessibilidade
  has_disability?: boolean;
  disability_type?: string;
  
  // Dados do responsável
  guardian_name?: string;
  guardian_relationship?: string;
  guardian_cpf?: string;
  guardian_phone?: string;
  
  // Dados socioeconômicos
  family_income?: number;
  has_siblings?: boolean;
  number_of_siblings?: number;
  siblings_ages?: string;
  works_outside?: boolean;
  work_hours_per_week?: number;
  work_type?: string;
  commute_time_minutes?: number;
  transport_type?: string;
  has_internet?: boolean;
  has_computer?: boolean;
  has_family_support?: boolean;
  has_school_meals?: boolean;
  
  // Dados acadêmicos
  math_grade?: number;
  portuguese_grade?: number;
  overall_average?: number;
  attendance_percentage?: number;
  
  // Metadados
  enrollment_protocol?: string;
  enrollment_status?: "active" | "inactive" | "transferred" | "graduated";
  created_at: string;
  updated_at: string;
}

export interface Exam {
  id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  description?: string;
  total_points: number;
  exam_date?: string;
  period_type?: "bimestral" | "trimestral" | "semestral" | "anual" | "diagnostic" | "recovery";
  period_number?: number;
  school_year: number;
  created_at: string;
}

export interface Question {
  id: string;
  exam_id: string;
  question_number: number;
  question_type: "multiple_choice" | "essay";
  points: number;
  expected_answer: string;
  grading_criteria?: string;
  created_at: string;
}

export interface StudentExam {
  id: string;
  exam_id: string;
  student_id: string;
  scanned_file_path?: string;
  total_score?: number;
  percentage?: number;
  submitted_at: string;
  graded_at?: string;
  status: "submitted" | "grading" | "graded";
}

export interface StudentAnswer {
  id: string;
  student_exam_id: string;
  question_id: string;
  student_answer?: string;
  score_awarded?: number;
  feedback?: string;
  created_at: string;
}

export interface ExamInsight {
  id: string;
  exam_id: string;
  class_average?: number;
  highest_score?: number;
  lowest_score?: number;
  standard_deviation?: number;
  difficulty_topics?: Record<string, any>;
  common_errors?: Record<string, any>;
  recommendations?: Record<string, any>;
  generated_at: string;
}

// Tipos derivados para visualização

export interface StudentPerformance {
  student: Student;
  exams: Array<{
    exam: Exam;
    studentExam: StudentExam;
    answers: StudentAnswer[];
  }>;
  statistics: {
    totalExams: number;
    averageScore: number;
    bestScore: number;
    worstScore: number;
    improvementRate: number;
  };
}

export interface StudentInsight {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  subjectPerformance: {
    subject: string;
    average: number;
    trend: "improving" | "stable" | "declining";
  }[];
}

export interface ComparisonData {
  studentAverage: number;
  classAverage: number;
  position: number;
  totalStudents: number;
  percentile: number;
}
