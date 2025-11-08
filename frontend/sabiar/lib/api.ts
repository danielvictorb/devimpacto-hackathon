/**
 * Serviço de API - SabiaR
 * Comunicação com o backend FastAPI
 */

// UUID fixo do professor para o hackathon (hardcoded)
export const TEACHER_ID_MOCK = "550e8400-e29b-41d4-a716-446655440000";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ========== TURMAS ==========

export async function criarTurma(data: {
  name: string;
  grade_level: string;
  section: string;
  shift?: string;
  school_year: number;
}) {
  const response = await fetch(`${API_URL}/classes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      teacher_id: TEACHER_ID_MOCK,
      ...data,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Erro ao criar turma");
  }
  return response.json();
}

export async function listarTurmas() {
  const url = `${API_URL}/teachers/${TEACHER_ID_MOCK}/classes`;
  console.log('🔍 Buscando turmas:', url);
  
  const response = await fetch(url);
  
  console.log('📡 Response status:', response.status);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Erro desconhecido" }));
    console.error('❌ Erro na resposta:', error);
    throw new Error(error.detail || "Erro ao buscar turmas");
  }
  
  const data = await response.json();
  console.log('✅ Turmas recebidas:', data);
  return data;
}

export async function buscarTurma(classId: string) {
  const response = await fetch(`${API_URL}/classes/${classId}`);
  if (!response.ok) throw new Error("Erro ao buscar turma");
  return response.json();
}

// ========== PROVAS ==========

export async function criarProva(data: {
  class_id: string;
  title: string;
  description?: string;
  subject: string; // "Matemática" ou "Português"
  exam_date: string;
  period_type?: string;
  period_number?: number;
  school_year?: number;
}) {
  const response = await fetch(`${API_URL}/exams/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      teacher_id: TEACHER_ID_MOCK,
      total_points: 10, // Será calculado com base nas questões
      ...data,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Erro ao criar prova");
  }
  return response.json();
}

export async function criarQuestao(data: {
  exam_id: string;
  question_number: number;
  question_type: "multiple_choice" | "essay";
  points: number;
  options?: { A: string; B: string; C: string; D: string; E?: string };
  expected_answer: string; // "B" para múltipla, texto para dissertativa
  grading_criteria?: string; // Rubrica
}) {
  const response = await fetch(`${API_URL}/questions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Erro ao criar questão");
  }
  return response.json();
}

export async function listarProvas() {
  const response = await fetch(
    `${API_URL}/exams/?teacher_id=${TEACHER_ID_MOCK}`
  );
  if (!response.ok) throw new Error("Erro ao buscar provas");
  return response.json();
}

export async function buscarProva(examId: string) {
  const response = await fetch(`${API_URL}/exams/${examId}`);
  if (!response.ok) throw new Error("Erro ao buscar prova");
  return response.json();
}

export async function buscarQuestoes(examId: string) {
  const response = await fetch(`${API_URL}/exams/${examId}/questions`);
  if (!response.ok) throw new Error("Erro ao buscar questões");
  return response.json();
}

// ========== ALUNOS ==========

export async function listarAlunos(classId?: string) {
  const url = classId
    ? `${API_URL}/students/?class_id=${classId}`
    : `${API_URL}/students/`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Erro ao buscar alunos");
  return response.json();
}

export async function buscarAluno(studentId: string) {
  const response = await fetch(`${API_URL}/students/${studentId}`);
  if (!response.ok) throw new Error("Erro ao buscar aluno");
  return response.json();
}

// ========== INSIGHTS ==========

export async function buscarInsightsProva(examId: string) {
  const response = await fetch(`${API_URL}/exams/${examId}/insights`);
  if (!response.ok) throw new Error("Erro ao buscar insights");
  return response.json();
}

// ========== UPLOAD DE PROVAS ==========

export async function uploadProvaAluno(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload-prova/`, {
    method: "POST",
    body: formData, // Não adicionar Content-Type, o browser adiciona automaticamente com boundary
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Erro no upload" }));
    throw new Error(error.detail || "Erro ao fazer upload");
  }

  return response.json();
}

// ========== HEALTH CHECK ==========

export async function verificarBackend() {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
