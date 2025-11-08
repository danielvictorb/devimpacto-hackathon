"""
FastAPI Routes - Sistema de Correção de Provas
Rotas principais da API
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
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
def create_teacher(teacher: TeacherCreate, db: Session = Depends(get_db)):
    """Criar novo professor"""
    if db.query(Teacher).filter(Teacher.email == teacher.email).first():
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    if db.query(Teacher).filter(Teacher.access_code == teacher.access_code).first():
        raise HTTPException(status_code=400, detail="Código de acesso já existe")
    
    new_teacher = Teacher(**teacher.model_dump())
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)
    return new_teacher


@router.get("/teachers/", response_model=List[TeacherResponse], tags=["Teachers"])
def get_teachers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Listar todos os professores"""
    return db.query(Teacher).offset(skip).limit(limit).all()


@router.get("/teachers/{teacher_id}", response_model=TeacherResponse, tags=["Teachers"])
def get_teacher(teacher_id: str, db: Session = Depends(get_db)):
    """Buscar professor por ID"""
    teacher = db.query(Teacher).filter(Teacher.id == uuid.UUID(teacher_id)).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    return teacher


# ============================================
# CLASSES (Turmas)
# ============================================

@router.post("/classes/", response_model=ClassResponse, status_code=status.HTTP_201_CREATED, tags=["Classes"])
def create_class(class_data: ClassCreate, db: Session = Depends(get_db)):
    """Criar nova turma"""
    if not db.query(Teacher).filter(Teacher.id == uuid.UUID(class_data.teacher_id)).first():
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    
    new_class = Class(**class_data.model_dump())
    db.add(new_class)
    db.commit()
    db.refresh(new_class)
    return new_class


@router.get("/classes/", response_model=List[ClassResponse], tags=["Classes"])
def get_classes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Listar todas as turmas"""
    return db.query(Class).offset(skip).limit(limit).all()


@router.get("/classes/{class_id}", response_model=ClassResponse, tags=["Classes"])
def get_class(class_id: str, db: Session = Depends(get_db)):
    """Buscar turma por ID"""
    class_ = db.query(Class).filter(Class.id == uuid.UUID(class_id)).first()
    if not class_:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    return class_


@router.get("/teachers/{teacher_id}/classes", response_model=List[ClassResponse], tags=["Teachers"])
def get_teacher_classes(teacher_id: str, db: Session = Depends(get_db)):
    """Buscar todas as turmas de um professor"""
    teacher = db.query(Teacher).filter(Teacher.id == uuid.UUID(teacher_id)).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    return teacher.classes


# ============================================
# STUDENTS (Alunos)
# ============================================

@router.post("/students/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED, tags=["Students"])
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    """Criar novo aluno"""
    if not db.query(Class).filter(Class.id == uuid.UUID(student.class_id)).first():
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    if db.query(Student).filter(Student.access_code == student.access_code).first():
        raise HTTPException(status_code=400, detail="Código de acesso já existe")
    
    if student.cpf and db.query(Student).filter(Student.cpf == student.cpf).first():
        raise HTTPException(status_code=400, detail="CPF já cadastrado")
    
    new_student = Student(**student.model_dump())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student


@router.get("/students/", response_model=List[StudentResponse], tags=["Students"])
def get_students(skip: int = 0, limit: int = 100, class_id: str = None, db: Session = Depends(get_db)):
    """Listar todos os alunos"""
    query = db.query(Student)
    if class_id:
        query = query.filter(Student.class_id == uuid.UUID(class_id))
    return query.offset(skip).limit(limit).all()


@router.get("/students/{student_id}", response_model=StudentResponse, tags=["Students"])
def get_student(student_id: str, db: Session = Depends(get_db)):
    """Buscar aluno por ID"""
    student = db.query(Student).filter(Student.id == uuid.UUID(student_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return student


@router.put("/students/{student_id}", response_model=StudentResponse, tags=["Students"])
def update_student(student_id: str, student_update: StudentCreate, db: Session = Depends(get_db)):
    """Atualizar dados do aluno"""
    student = db.query(Student).filter(Student.id == uuid.UUID(student_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    for key, value in student_update.model_dump(exclude_unset=True).items():
        setattr(student, key, value)
    
    db.commit()
    db.refresh(student)
    return student


# ============================================
# EXAMS (Provas)
# ============================================

@router.post("/exams/", response_model=ExamResponse, status_code=status.HTTP_201_CREATED, tags=["Exams"])
def create_exam(exam: ExamCreate, db: Session = Depends(get_db)):
    """Criar nova prova"""
    if not db.query(Class).filter(Class.id == uuid.UUID(exam.class_id)).first():
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    if not db.query(Teacher).filter(Teacher.id == uuid.UUID(exam.teacher_id)).first():
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    
    new_exam = Exam(**exam.model_dump())
    db.add(new_exam)
    db.commit()
    db.refresh(new_exam)
    return new_exam


@router.get("/exams/", response_model=List[ExamResponse], tags=["Exams"])
def get_exams(skip: int = 0, limit: int = 100, class_id: str = None, teacher_id: str = None, db: Session = Depends(get_db)):
    """Listar todas as provas"""
    query = db.query(Exam)
    if class_id:
        query = query.filter(Exam.class_id == uuid.UUID(class_id))
    if teacher_id:
        query = query.filter(Exam.teacher_id == uuid.UUID(teacher_id))
    return query.offset(skip).limit(limit).all()


@router.get("/exams/{exam_id}", response_model=ExamResponse, tags=["Exams"])
def get_exam(exam_id: str, db: Session = Depends(get_db)):
    """Buscar prova por ID"""
    exam = db.query(Exam).filter(Exam.id == uuid.UUID(exam_id)).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Prova não encontrada")
    return exam


# ============================================
# QUESTIONS (Questões)
# ============================================

@router.post("/questions/", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED, tags=["Questions"])
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    """Criar nova questão"""
    if not db.query(Exam).filter(Exam.id == uuid.UUID(question.exam_id)).first():
        raise HTTPException(status_code=404, detail="Prova não encontrada")
    
    new_question = Question(**question.model_dump())
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question


@router.get("/exams/{exam_id}/questions", response_model=List[QuestionResponse], tags=["Questions"])
def get_exam_questions(exam_id: str, db: Session = Depends(get_db)):
    """Buscar todas as questões de uma prova"""
    exam = db.query(Exam).filter(Exam.id == uuid.UUID(exam_id)).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Prova não encontrada")
    return exam.questions


# ============================================
# STUDENT EXAMS (Provas dos Alunos)
# ============================================

@router.post("/student-exams/", response_model=StudentExamResponse, status_code=status.HTTP_201_CREATED, tags=["Student Exams"])
def create_student_exam(student_exam: StudentExamCreate, db: Session = Depends(get_db)):
    """Submeter prova escaneada do aluno"""
    if not db.query(Exam).filter(Exam.id == uuid.UUID(student_exam.exam_id)).first():
        raise HTTPException(status_code=404, detail="Prova não encontrada")
    
    if not db.query(Student).filter(Student.id == uuid.UUID(student_exam.student_id)).first():
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    existing = db.query(StudentExam).filter(
        StudentExam.exam_id == uuid.UUID(student_exam.exam_id),
        StudentExam.student_id == uuid.UUID(student_exam.student_id)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Aluno já tem prova submetida para este exame")
    
    new_student_exam = StudentExam(**student_exam.model_dump())
    db.add(new_student_exam)
    db.commit()
    db.refresh(new_student_exam)
    return new_student_exam


@router.get("/student-exams/{student_exam_id}", response_model=StudentExamResponse, tags=["Student Exams"])
def get_student_exam(student_exam_id: str, db: Session = Depends(get_db)):
    """Buscar prova do aluno por ID"""
    student_exam = db.query(StudentExam).filter(StudentExam.id == uuid.UUID(student_exam_id)).first()
    if not student_exam:
        raise HTTPException(status_code=404, detail="Prova do aluno não encontrada")
    return student_exam


@router.get("/exams/{exam_id}/student-exams", response_model=List[StudentExamResponse], tags=["Student Exams"])
def get_exam_student_exams(exam_id: str, db: Session = Depends(get_db)):
    """Buscar todas as provas submetidas para um exame"""
    exam = db.query(Exam).filter(Exam.id == uuid.UUID(exam_id)).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Prova não encontrada")
    return exam.student_exams


# ============================================
# STUDENT ANSWERS (Respostas dos Alunos)
# ============================================

@router.post("/student-answers/", response_model=StudentAnswerResponse, status_code=status.HTTP_201_CREATED, tags=["Student Answers"])
def create_student_answer(answer: StudentAnswerCreate, db: Session = Depends(get_db)):
    """Criar resposta do aluno para uma questão"""
    new_answer = StudentAnswer(**answer.model_dump())
    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)
    return new_answer


@router.get("/student-exams/{student_exam_id}/answers", response_model=List[StudentAnswerResponse], tags=["Student Answers"])
def get_student_exam_answers(student_exam_id: str, db: Session = Depends(get_db)):
    """Buscar todas as respostas de uma prova do aluno"""
    student_exam = db.query(StudentExam).filter(StudentExam.id == uuid.UUID(student_exam_id)).first()
    if not student_exam:
        raise HTTPException(status_code=404, detail="Prova do aluno não encontrada")
    return student_exam.answers


# ============================================
# EXAM INSIGHTS (Análises das Provas)
# ============================================

@router.post("/exam-insights/", response_model=ExamInsightResponse, status_code=status.HTTP_201_CREATED, tags=["Exam Insights"])
def create_exam_insight(insight: ExamInsightCreate, db: Session = Depends(get_db)):
    """Criar análise/insights da prova"""
    if not db.query(Exam).filter(Exam.id == uuid.UUID(insight.exam_id)).first():
        raise HTTPException(status_code=404, detail="Prova não encontrada")
    
    existing = db.query(ExamInsight).filter(ExamInsight.exam_id == uuid.UUID(insight.exam_id)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Já existe análise para esta prova")
    
    new_insight = ExamInsight(**insight.model_dump())
    db.add(new_insight)
    db.commit()
    db.refresh(new_insight)
    return new_insight


@router.get("/exams/{exam_id}/insights", response_model=ExamInsightResponse, tags=["Exam Insights"])
def get_exam_insights(exam_id: str, db: Session = Depends(get_db)):
    """Buscar análise/insights de uma prova"""
    insight = db.query(ExamInsight).filter(ExamInsight.exam_id == uuid.UUID(exam_id)).first()
    if not insight:
        raise HTTPException(status_code=404, detail="Análise não encontrada")
    return insight
