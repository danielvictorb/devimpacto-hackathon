"""
FastAPI Routes - Sistema de Correção de Provas
Rotas principais da API (Async)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from .database import get_db
from .models import (
    # Models
    Teacher, Class, Student, Exam, Question, StudentExam, StudentAnswer, ExamInsight,
    # Schemas
    TeacherCreate, TeacherResponse,
    ClassCreate, ClassResponse,
    StudentCreate, StudentResponse,
    ExamCreate, ExamResponse,
    QuestionCreate, QuestionResponse,
    StudentExamCreate, StudentExamResponse,
    StudentAnswerCreate, StudentAnswerResponse,
    ExamInsightCreate, ExamInsightResponse
)

router = APIRouter()


# ============================================
# TEACHERS (Professores)
# ============================================

@router.post("/teachers/", response_model=TeacherResponse, status_code=status.HTTP_201_CREATED, tags=["Teachers"])
async def create_teacher(teacher: TeacherCreate, db: AsyncSession = Depends(get_db)):
    """Criar novo professor"""
    # Verificar se email já existe
    result = await db.execute(select(Teacher).where(Teacher.email == teacher.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # Verificar se access_code já existe
    result = await db.execute(select(Teacher).where(Teacher.access_code == teacher.access_code))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Código de acesso já existe")
    
    new_teacher = Teacher(**teacher.model_dump())
    db.add(new_teacher)
    await db.commit()
    await db.refresh(new_teacher)
    return new_teacher


@router.get("/teachers/", response_model=List[TeacherResponse], tags=["Teachers"])
async def get_teachers(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """Listar todos os professores"""
    result = await db.execute(select(Teacher).offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/teachers/{teacher_id}", response_model=TeacherResponse, tags=["Teachers"])
async def get_teacher(teacher_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar professor por ID"""
    result = await db.execute(select(Teacher).where(Teacher.id == uuid.UUID(teacher_id)))
    teacher = result.scalar_one_or_none()
    if not teacher:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    return teacher


# ============================================
# CLASSES (Turmas)
# ============================================

@router.post("/classes/", response_model=ClassResponse, status_code=status.HTTP_201_CREATED, tags=["Classes"])
async def create_class(class_data: ClassCreate, db: AsyncSession = Depends(get_db)):
    """Criar nova turma"""
    # Verificar se professor existe
    result = await db.execute(select(Teacher).where(Teacher.id == uuid.UUID(class_data.teacher_id)))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    
    new_class = Class(**class_data.model_dump())
    db.add(new_class)
    await db.commit()
    await db.refresh(new_class)
    return new_class


@router.get("/classes/", response_model=List[ClassResponse], tags=["Classes"])
async def get_classes(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """Listar todas as turmas"""
    result = await db.execute(select(Class).offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/classes/{class_id}", response_model=ClassResponse, tags=["Classes"])
async def get_class(class_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar turma por ID"""
    result = await db.execute(select(Class).where(Class.id == uuid.UUID(class_id)))
    class_ = result.scalar_one_or_none()
    if not class_:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    return class_


@router.get("/teachers/{teacher_id}/classes", response_model=List[ClassResponse], tags=["Teachers"])
async def get_teacher_classes(teacher_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar todas as turmas de um professor"""
    result = await db.execute(select(Teacher).where(Teacher.id == uuid.UUID(teacher_id)))
    teacher = result.scalar_one_or_none()
@router.get("/teachers/{teacher_id}/classes", response_model=List[ClassResponse], tags=["Teachers"])
async def get_teacher_classes(teacher_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar todas as turmas de um professor"""
    result = await db.execute(select(Teacher).where(Teacher.id == uuid.UUID(teacher_id)))
    teacher = result.scalar_one_or_none()
    if not teacher:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    
    # Buscar as turmas do professor
    result = await db.execute(select(Class).where(Class.teacher_id == uuid.UUID(teacher_id)))
    return result.scalars().all()


# ============================================
# STUDENTS (Alunos)
# ============================================

@router.post("/students/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED, tags=["Students"])
async def create_student(student: StudentCreate, db: AsyncSession = Depends(get_db)):
    """Criar novo aluno"""
    # Verificar se turma existe
    result = await db.execute(select(Class).where(Class.id == uuid.UUID(student.class_id)))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    # Verificar se access_code já existe
    result = await db.execute(select(Student).where(Student.access_code == student.access_code))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Código de acesso já existe")
    
    # Verificar se CPF já existe
    if student.cpf:
        result = await db.execute(select(Student).where(Student.cpf == student.cpf))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="CPF já cadastrado")
    
    new_student = Student(**student.model_dump())
    db.add(new_student)
    await db.commit()
    await db.refresh(new_student)
    return new_student


@router.get("/students/", response_model=List[StudentResponse], tags=["Students"])
async def get_students(skip: int = 0, limit: int = 100, class_id: str = None, db: AsyncSession = Depends(get_db)):
    """Listar todos os alunos"""
    query = select(Student)
    if class_id:
        query = query.where(Student.class_id == uuid.UUID(class_id))
    
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/students/{student_id}", response_model=StudentResponse, tags=["Students"])
async def get_student(student_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar aluno por ID"""
    result = await db.execute(select(Student).where(Student.id == uuid.UUID(student_id)))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return student


@router.put("/students/{student_id}", response_model=StudentResponse, tags=["Students"])
async def update_student(student_id: str, student_update: StudentCreate, db: AsyncSession = Depends(get_db)):
    """Atualizar dados do aluno"""
    result = await db.execute(select(Student).where(Student.id == uuid.UUID(student_id)))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    for key, value in student_update.model_dump(exclude_unset=True).items():
        setattr(student, key, value)
    
    await db.commit()
    await db.refresh(student)
    return student


# ============================================
# EXAMS (Provas)
# ============================================

@router.post("/exams/", response_model=ExamResponse, status_code=status.HTTP_201_CREATED, tags=["Exams"])
async def create_exam(exam: ExamCreate, db: AsyncSession = Depends(get_db)):
    """Criar nova prova"""
    # Verificar se turma existe
    result = await db.execute(select(Class).where(Class.id == uuid.UUID(exam.class_id)))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    # Verificar se professor existe
    result = await db.execute(select(Teacher).where(Teacher.id == uuid.UUID(exam.teacher_id)))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    
    new_exam = Exam(**exam.model_dump())
    db.add(new_exam)
    await db.commit()
    await db.refresh(new_exam)
    return new_exam


@router.get("/exams/", response_model=List[ExamResponse], tags=["Exams"])
async def get_exams(skip: int = 0, limit: int = 100, class_id: str = None, teacher_id: str = None, db: AsyncSession = Depends(get_db)):
    """Listar todas as provas"""
    query = select(Exam)
    if class_id:
        query = query.where(Exam.class_id == uuid.UUID(class_id))
    if teacher_id:
        query = query.where(Exam.teacher_id == uuid.UUID(teacher_id))
    
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/exams/{exam_id}", response_model=ExamResponse, tags=["Exams"])
async def get_exam(exam_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar prova por ID"""
    result = await db.execute(select(Exam).where(Exam.id == uuid.UUID(exam_id)))
    exam = result.scalar_one_or_none()
    if not exam:
        raise HTTPException(status_code=404, detail="Prova não encontrada")
    return exam


# ============================================
# QUESTIONS (Questões)
# ============================================

@router.post("/questions/", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED, tags=["Questions"])
async def create_question(question: QuestionCreate, db: AsyncSession = Depends(get_db)):
    """Criar nova questão"""
    # Verificar se prova existe
    result = await db.execute(select(Exam).where(Exam.id == uuid.UUID(question.exam_id)))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Prova não encontrada")
    
    new_question = Question(**question.model_dump())
    db.add(new_question)
    await db.commit()
    await db.refresh(new_question)
    return new_question


@router.get("/exams/{exam_id}/questions", response_model=List[QuestionResponse], tags=["Questions"])
async def get_exam_questions(exam_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar todas as questões de uma prova"""
    result = await db.execute(select(Exam).where(Exam.id == uuid.UUID(exam_id)))
    exam = result.scalar_one_or_none()
    if not exam:
        raise HTTPException(status_code=404, detail="Prova não encontrada")
    
    # Buscar questões
    result = await db.execute(select(Question).where(Question.exam_id == uuid.UUID(exam_id)))
    return result.scalars().all()


# ============================================
# STUDENT EXAMS (Provas dos Alunos)
# ============================================

@router.post("/student-exams/", response_model=StudentExamResponse, status_code=status.HTTP_201_CREATED, tags=["Student Exams"])
async def create_student_exam(student_exam: StudentExamCreate, db: AsyncSession = Depends(get_db)):
    """Submeter prova escaneada do aluno"""
    # Verificar se prova existe
    result = await db.execute(select(Exam).where(Exam.id == uuid.UUID(student_exam.exam_id)))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Prova não encontrada")
    
    # Verificar se aluno existe
    result = await db.execute(select(Student).where(Student.id == uuid.UUID(student_exam.student_id)))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    # Verificar se já existe prova submetida
    result = await db.execute(
        select(StudentExam).where(
            StudentExam.exam_id == uuid.UUID(student_exam.exam_id),
            StudentExam.student_id == uuid.UUID(student_exam.student_id)
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Aluno já tem prova submetida para este exame")
    
    new_student_exam = StudentExam(**student_exam.model_dump())
    db.add(new_student_exam)
    await db.commit()
    await db.refresh(new_student_exam)
    return new_student_exam


@router.get("/student-exams/{student_exam_id}", response_model=StudentExamResponse, tags=["Student Exams"])
async def get_student_exam(student_exam_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar prova do aluno por ID"""
    result = await db.execute(select(StudentExam).where(StudentExam.id == uuid.UUID(student_exam_id)))
    student_exam = result.scalar_one_or_none()
    if not student_exam:
        raise HTTPException(status_code=404, detail="Prova do aluno não encontrada")
    return student_exam


@router.get("/exams/{exam_id}/student-exams", response_model=List[StudentExamResponse], tags=["Student Exams"])
async def get_exam_student_exams(exam_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar todas as provas submetidas para um exame"""
    result = await db.execute(select(Exam).where(Exam.id == uuid.UUID(exam_id)))
    exam = result.scalar_one_or_none()
    if not exam:
        raise HTTPException(status_code=404, detail="Prova não encontrada")
    
    # Buscar provas dos alunos
    result = await db.execute(select(StudentExam).where(StudentExam.exam_id == uuid.UUID(exam_id)))
    return result.scalars().all()


# ============================================
# STUDENT ANSWERS (Respostas dos Alunos)
# ============================================

@router.post("/student-answers/", response_model=StudentAnswerResponse, status_code=status.HTTP_201_CREATED, tags=["Student Answers"])
async def create_student_answer(answer: StudentAnswerCreate, db: AsyncSession = Depends(get_db)):
    """Criar resposta do aluno para uma questão"""
    new_answer = StudentAnswer(**answer.model_dump())
    db.add(new_answer)
    await db.commit()
    await db.refresh(new_answer)
    return new_answer


@router.get("/student-exams/{student_exam_id}/answers", response_model=List[StudentAnswerResponse], tags=["Student Answers"])
async def get_student_exam_answers(student_exam_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar todas as respostas de uma prova do aluno"""
    result = await db.execute(select(StudentExam).where(StudentExam.id == uuid.UUID(student_exam_id)))
    student_exam = result.scalar_one_or_none()
    if not student_exam:
        raise HTTPException(status_code=404, detail="Prova do aluno não encontrada")
    
    # Buscar respostas
    result = await db.execute(select(StudentAnswer).where(StudentAnswer.student_exam_id == uuid.UUID(student_exam_id)))
    return result.scalars().all()


# ============================================
# EXAM INSIGHTS (Análises das Provas)
# ============================================

@router.post("/exam-insights/", response_model=ExamInsightResponse, status_code=status.HTTP_201_CREATED, tags=["Exam Insights"])
async def create_exam_insight(insight: ExamInsightCreate, db: AsyncSession = Depends(get_db)):
    """Criar análise/insights da prova"""
    # Verificar se prova existe
    result = await db.execute(select(Exam).where(Exam.id == uuid.UUID(insight.exam_id)))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Prova não encontrada")
    
    # Verificar se já existe análise
    result = await db.execute(select(ExamInsight).where(ExamInsight.exam_id == uuid.UUID(insight.exam_id)))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Já existe análise para esta prova")
    
    new_insight = ExamInsight(**insight.model_dump())
    db.add(new_insight)
    await db.commit()
    await db.refresh(new_insight)
    return new_insight


@router.get("/exams/{exam_id}/insights", response_model=ExamInsightResponse, tags=["Exam Insights"])
async def get_exam_insights(exam_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar análise/insights de uma prova"""
    result = await db.execute(select(ExamInsight).where(ExamInsight.exam_id == uuid.UUID(exam_id)))
    insight = result.scalar_one_or_none()
    if not insight:
        raise HTTPException(status_code=404, detail="Análise não encontrada")
    return insight
