"""
FastAPI Routes - Sistema de Correção de Provas
Rotas principais da API (Async)
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid
import shutil
from pathlib import Path
import os
from datetime import datetime

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

# Criar pasta temp se não existir
TEMP_DIR = Path(__file__).parent / "temp"
TEMP_DIR.mkdir(exist_ok=True)


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


@router.put("/classes/{class_id}", response_model=ClassResponse, tags=["Classes"])
async def update_class(class_id: str, class_update: ClassCreate, db: AsyncSession = Depends(get_db)):
    """Atualizar dados da turma"""
    result = await db.execute(select(Class).where(Class.id == uuid.UUID(class_id)))
    class_ = result.scalar_one_or_none()
    if not class_:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    # Verificar se novo professor existe
    if class_update.teacher_id:
        result = await db.execute(select(Teacher).where(Teacher.id == uuid.UUID(class_update.teacher_id)))
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Professor não encontrado")
    
    for key, value in class_update.model_dump(exclude_unset=True).items():
        setattr(class_, key, value)
    
    await db.commit()
    await db.refresh(class_)
    return class_


@router.delete("/classes/{class_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Classes"])
async def delete_class(class_id: str, db: AsyncSession = Depends(get_db)):
    """Deletar turma"""
    result = await db.execute(select(Class).where(Class.id == uuid.UUID(class_id)))
    class_ = result.scalar_one_or_none()
    if not class_:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    await db.delete(class_)
    await db.commit()
    return None


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


@router.put("/teachers/{teacher_id}", response_model=TeacherResponse, tags=["Teachers"])
async def update_teacher(teacher_id: str, teacher_update: TeacherCreate, db: AsyncSession = Depends(get_db)):
    """Atualizar dados do professor"""
    result = await db.execute(select(Teacher).where(Teacher.id == uuid.UUID(teacher_id)))
    teacher = result.scalar_one_or_none()
    if not teacher:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    
    # Verificar email duplicado se estiver sendo alterado
    if teacher_update.email != teacher.email:
        result = await db.execute(select(Teacher).where(Teacher.email == teacher_update.email))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    for key, value in teacher_update.model_dump(exclude_unset=True).items():
        setattr(teacher, key, value)
    
    await db.commit()
    await db.refresh(teacher)
    return teacher


@router.delete("/teachers/{teacher_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Teachers"])
async def delete_teacher(teacher_id: str, db: AsyncSession = Depends(get_db)):
    """Deletar professor"""
    result = await db.execute(select(Teacher).where(Teacher.id == uuid.UUID(teacher_id)))
    teacher = result.scalar_one_or_none()
    if not teacher:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    
    await db.delete(teacher)
    await db.commit()
    return None


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


@router.delete("/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Students"])
async def delete_student(student_id: str, db: AsyncSession = Depends(get_db)):
    """Deletar aluno"""
    result = await db.execute(select(Student).where(Student.id == uuid.UUID(student_id)))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    await db.delete(student)
    await db.commit()
    return None


@router.get("/classes/{class_id}/students", response_model=List[StudentResponse], tags=["Classes"])
async def get_class_students(class_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar todos os alunos de uma turma"""
    result = await db.execute(select(Class).where(Class.id == uuid.UUID(class_id)))
    class_ = result.scalar_one_or_none()
    if not class_:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    result = await db.execute(select(Student).where(Student.class_id == uuid.UUID(class_id)))
    return result.scalars().all()


# ============================================
# EXAMS (Provas) - COMENTADO
# ============================================

# @router.post("/exams/", response_model=ExamResponse, status_code=status.HTTP_201_CREATED, tags=["Exams"])
# async def create_exam(exam: ExamCreate, db: AsyncSession = Depends(get_db)):
#     """Criar nova prova"""
#     # Verificar se turma existe
#     result = await db.execute(select(Class).where(Class.id == uuid.UUID(exam.class_id)))
#     if not result.scalar_one_or_none():
#         raise HTTPException(status_code=404, detail="Turma não encontrada")
#     
#     # Verificar se professor existe
#     result = await db.execute(select(Teacher).where(Teacher.id == uuid.UUID(exam.teacher_id)))
#     if not result.scalar_one_or_none():
#         raise HTTPException(status_code=404, detail="Professor não encontrado")
#     
#     new_exam = Exam(**exam.model_dump())
#     db.add(new_exam)
#     await db.commit()
#     await db.refresh(new_exam)
#     return new_exam


# @router.get("/exams/", response_model=List[ExamResponse], tags=["Exams"])
# async def get_exams(skip: int = 0, limit: int = 100, class_id: str = None, teacher_id: str = None, db: AsyncSession = Depends(get_db)):
#     """Listar todas as provas"""
#     query = select(Exam)
#     if class_id:
#         query = query.where(Exam.class_id == uuid.UUID(class_id))
#     if teacher_id:
#         query = query.where(Exam.teacher_id == uuid.UUID(teacher_id))
#     
#     result = await db.execute(query.offset(skip).limit(limit))
#     return result.scalars().all()


# @router.get("/exams/{exam_id}", response_model=ExamResponse, tags=["Exams"])
# async def get_exam(exam_id: str, db: AsyncSession = Depends(get_db)):
#     """Buscar prova por ID"""
#     result = await db.execute(select(Exam).where(Exam.id == uuid.UUID(exam_id)))
#     exam = result.scalar_one_or_none()
#     if not exam:
#         raise HTTPException(status_code=404, detail="Prova não encontrada")
#     return exam


# ============================================
# QUESTIONS (Questões) - COMENTADO
# ============================================

# @router.post("/questions/", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED, tags=["Questions"])
# async def create_question(question: QuestionCreate, db: AsyncSession = Depends(get_db)):
#     """Criar nova questão"""
#     # Verificar se prova existe
#     result = await db.execute(select(Exam).where(Exam.id == uuid.UUID(question.exam_id)))
#     if not result.scalar_one_or_none():
#         raise HTTPException(status_code=404, detail="Prova não encontrada")
#     
#     new_question = Question(**question.model_dump())
#     db.add(new_question)
#     await db.commit()
#     await db.refresh(new_question)
#     return new_question


# @router.get("/exams/{exam_id}/questions", response_model=List[QuestionResponse], tags=["Questions"])
# async def get_exam_questions(exam_id: str, db: AsyncSession = Depends(get_db)):
#     """Buscar todas as questões de uma prova"""
#     result = await db.execute(select(Exam).where(Exam.id == uuid.UUID(exam_id)))
#     exam = result.scalar_one_or_none()
#     if not exam:
#         raise HTTPException(status_code=404, detail="Prova não encontrada")
#     
#     # Buscar questões
#     result = await db.execute(select(Question).where(Question.exam_id == uuid.UUID(exam_id)))
#     return result.scalars().all()


# ============================================
# STUDENT EXAMS (Provas dos Alunos) - COMENTADO
# ============================================

# @router.post("/student-exams/", response_model=StudentExamResponse, status_code=status.HTTP_201_CREATED, tags=["Student Exams"])
# async def create_student_exam(student_exam: StudentExamCreate, db: AsyncSession = Depends(get_db)):
#     """Submeter prova escaneada do aluno"""
#     # Verificar se prova existe
#     result = await db.execute(select(Exam).where(Exam.id == uuid.UUID(student_exam.exam_id)))
#     if not result.scalar_one_or_none():
#         raise HTTPException(status_code=404, detail="Prova não encontrada")
#     
#     # Verificar se aluno existe
#     result = await db.execute(select(Student).where(Student.id == uuid.UUID(student_exam.student_id)))
#     if not result.scalar_one_or_none():
#         raise HTTPException(status_code=404, detail="Aluno não encontrado")
#     
#     # Verificar se já existe prova submetida
#     result = await db.execute(
#         select(StudentExam).where(
#             StudentExam.exam_id == uuid.UUID(student_exam.exam_id),
#             StudentExam.student_id == uuid.UUID(student_exam.student_id)
#         )
#     )
#     if result.scalar_one_or_none():
#         raise HTTPException(status_code=400, detail="Aluno já tem prova submetida para este exame")
#     
#     new_student_exam = StudentExam(**student_exam.model_dump())
#     db.add(new_student_exam)
#     await db.commit()
#     await db.refresh(new_student_exam)
#     return new_student_exam


# @router.get("/student-exams/{student_exam_id}", response_model=StudentExamResponse, tags=["Student Exams"])
# async def get_student_exam(student_exam_id: str, db: AsyncSession = Depends(get_db)):
#     """Buscar prova do aluno por ID"""
#     result = await db.execute(select(StudentExam).where(StudentExam.id == uuid.UUID(student_exam_id)))
#     student_exam = result.scalar_one_or_none()
#     if not student_exam:
#         raise HTTPException(status_code=404, detail="Prova do aluno não encontrada")
#     return student_exam


# @router.get("/exams/{exam_id}/student-exams", response_model=List[StudentExamResponse], tags=["Student Exams"])
# async def get_exam_student_exams(exam_id: str, db: AsyncSession = Depends(get_db)):
#     """Buscar todas as provas submetidas para um exame"""
#     result = await db.execute(select(Exam).where(Exam.id == uuid.UUID(exam_id)))
#     exam = result.scalar_one_or_none()
#     if not exam:
#         raise HTTPException(status_code=404, detail="Prova não encontrada")
#     
#     # Buscar provas dos alunos
#     result = await db.execute(select(StudentExam).where(StudentExam.exam_id == uuid.UUID(exam_id)))
#     return result.scalars().all()


# ============================================
# STUDENT ANSWERS (Respostas dos Alunos) - COMENTADO
# ============================================

# @router.post("/student-answers/", response_model=StudentAnswerResponse, status_code=status.HTTP_201_CREATED, tags=["Student Answers"])
# async def create_student_answer(answer: StudentAnswerCreate, db: AsyncSession = Depends(get_db)):
#     """Criar resposta do aluno para uma questão"""
#     new_answer = StudentAnswer(**answer.model_dump())
#     db.add(new_answer)
#     await db.commit()
#     await db.refresh(new_answer)
#     return new_answer


# @router.get("/student-exams/{student_exam_id}/answers", response_model=List[StudentAnswerResponse], tags=["Student Answers"])
# async def get_student_exam_answers(student_exam_id: str, db: AsyncSession = Depends(get_db)):
#     """Buscar todas as respostas de uma prova do aluno"""
#     result = await db.execute(select(StudentExam).where(StudentExam.id == uuid.UUID(student_exam_id)))
#     student_exam = result.scalar_one_or_none()
#     if not student_exam:
#         raise HTTPException(status_code=404, detail="Prova do aluno não encontrada")
#     
#     # Buscar respostas
#     result = await db.execute(select(StudentAnswer).where(StudentAnswer.student_exam_id == uuid.UUID(student_exam_id)))
#     return result.scalars().all()


# ============================================
# EXAM INSIGHTS (Análises das Provas) - COMENTADO
# ============================================

# @router.post("/exam-insights/", response_model=ExamInsightResponse, status_code=status.HTTP_201_CREATED, tags=["Exam Insights"])
# async def create_exam_insight(insight: ExamInsightCreate, db: AsyncSession = Depends(get_db)):
#     """Criar análise/insights da prova"""
#     # Verificar se prova existe
#     result = await db.execute(select(Exam).where(Exam.id == uuid.UUID(insight.exam_id)))
#     if not result.scalar_one_or_none():
#         raise HTTPException(status_code=404, detail="Prova não encontrada")
#     
#     # Verificar se já existe análise
#     result = await db.execute(select(ExamInsight).where(ExamInsight.exam_id == uuid.UUID(insight.exam_id)))
#     if result.scalar_one_or_none():
#         raise HTTPException(status_code=400, detail="Já existe análise para esta prova")
#     
#     new_insight = ExamInsight(**insight.model_dump())
#     db.add(new_insight)
#     await db.commit()
#     await db.refresh(new_insight)
#     return new_insight


# @router.get("/exams/{exam_id}/insights", response_model=ExamInsightResponse, tags=["Exam Insights"])
# async def get_exam_insights(exam_id: str, db: AsyncSession = Depends(get_db)):
#     """Buscar análise/insights de uma prova"""
#     result = await db.execute(select(ExamInsight).where(ExamInsight.exam_id == uuid.UUID(exam_id)))
#     insight = result.scalar_one_or_none()
#     if not insight:
#         raise HTTPException(status_code=404, detail="Análise não encontrada")
#     return insight


# ============================================
# STATISTICS & REPORTS (Estatísticas e Relatórios)
# ============================================

@router.get("/statistics/overview", tags=["Statistics"])
async def get_overview_statistics(db: AsyncSession = Depends(get_db)):
    """Obter estatísticas gerais do sistema"""
    from sqlalchemy import func as sql_func
    
    # Total de professores
    result = await db.execute(select(sql_func.count(Teacher.id)))
    total_teachers = result.scalar()
    
    # Total de turmas
    result = await db.execute(select(sql_func.count(Class.id)))
    total_classes = result.scalar()
    
    # Total de alunos
    result = await db.execute(select(sql_func.count(Student.id)))
    total_students = result.scalar()
    
    # Total de provas
    result = await db.execute(select(sql_func.count(Exam.id)))
    total_exams = result.scalar()
    
    return {
        "total_teachers": total_teachers,
        "total_classes": total_classes,
        "total_students": total_students,
        "total_exams": total_exams,
        "timestamp": datetime.now()
    }


@router.get("/statistics/classes/{class_id}", tags=["Statistics"])
async def get_class_statistics(class_id: str, db: AsyncSession = Depends(get_db)):
    """Obter estatísticas detalhadas de uma turma"""
    from sqlalchemy import func as sql_func
    
    # Verificar se turma existe
    result = await db.execute(select(Class).where(Class.id == uuid.UUID(class_id)))
    class_ = result.scalar_one_or_none()
    if not class_:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    # Contar alunos
    result = await db.execute(
        select(sql_func.count(Student.id)).where(Student.class_id == uuid.UUID(class_id))
    )
    student_count = result.scalar()
    
    # Estatísticas de gênero
    result = await db.execute(
        select(Student.gender, sql_func.count(Student.id))
        .where(Student.class_id == uuid.UUID(class_id))
        .group_by(Student.gender)
    )
    gender_stats = {row[0] or "Não informado": row[1] for row in result.all()}
    
    # Média geral da turma
    result = await db.execute(
        select(sql_func.avg(Student.overall_average))
        .where(Student.class_id == uuid.UUID(class_id))
    )
    class_average = result.scalar()
    
    # Média de frequência
    result = await db.execute(
        select(sql_func.avg(Student.attendance_percentage))
        .where(Student.class_id == uuid.UUID(class_id))
    )
    attendance_avg = result.scalar()
    
    return {
        "class_id": class_id,
        "class_name": class_.name,
        "student_count": student_count,
        "gender_distribution": gender_stats,
        "class_average": float(class_average) if class_average else None,
        "attendance_average": float(attendance_avg) if attendance_avg else None,
        "timestamp": datetime.now()
    }


@router.get("/statistics/students/{student_id}", tags=["Statistics"])
async def get_student_statistics(student_id: str, db: AsyncSession = Depends(get_db)):
    """Obter estatísticas detalhadas de um aluno"""
    from sqlalchemy import func as sql_func
    
    # Buscar aluno
    result = await db.execute(select(Student).where(Student.id == uuid.UUID(student_id)))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    # Contar provas realizadas
    result = await db.execute(
        select(sql_func.count(StudentExam.id))
        .where(StudentExam.student_id == uuid.UUID(student_id))
    )
    exams_taken = result.scalar()
    
    # Média das provas
    result = await db.execute(
        select(sql_func.avg(StudentExam.total_score))
        .where(StudentExam.student_id == uuid.UUID(student_id))
    )
    exam_average = result.scalar()
    
    return {
        "student_id": student_id,
        "student_name": student.name,
        "class_id": str(student.class_id),
        "exams_taken": exams_taken,
        "exam_average": float(exam_average) if exam_average else None,
        "overall_average": float(student.overall_average) if student.overall_average else None,
        "math_grade": float(student.math_grade) if student.math_grade else None,
        "portuguese_grade": float(student.portuguese_grade) if student.portuguese_grade else None,
        "attendance_percentage": float(student.attendance_percentage) if student.attendance_percentage else None,
        "has_disability": student.has_disability,
        "works_outside": student.works_outside,
        "timestamp": datetime.now()
    }


@router.get("/teachers/{teacher_id}/statistics", tags=["Statistics"])
async def get_teacher_statistics(teacher_id: str, db: AsyncSession = Depends(get_db)):
    """Obter estatísticas de um professor"""
    from sqlalchemy import func as sql_func
    
    # Verificar se professor existe
    result = await db.execute(select(Teacher).where(Teacher.id == uuid.UUID(teacher_id)))
    teacher = result.scalar_one_or_none()
    if not teacher:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    
    # Contar turmas
    result = await db.execute(
        select(sql_func.count(Class.id)).where(Class.teacher_id == uuid.UUID(teacher_id))
    )
    total_classes = result.scalar()
    
    # Contar alunos (através das turmas)
    result = await db.execute(
        select(sql_func.count(Student.id))
        .join(Class, Student.class_id == Class.id)
        .where(Class.teacher_id == uuid.UUID(teacher_id))
    )
    total_students = result.scalar()
    
    # Contar provas
    result = await db.execute(
        select(sql_func.count(Exam.id)).where(Exam.teacher_id == uuid.UUID(teacher_id))
    )
    total_exams = result.scalar()
    
    return {
        "teacher_id": teacher_id,
        "teacher_name": teacher.name,
        "total_classes": total_classes,
        "total_students": total_students,
        "total_exams": total_exams,
        "timestamp": datetime.now()
    }


# ============================================
# SEARCH & FILTERS (Busca e Filtros)
# ============================================

@router.get("/search/students", response_model=List[StudentResponse], tags=["Search"])
async def search_students(
    name: str = None,
    class_id: str = None,
    has_disability: bool = None,
    works_outside: bool = None,
    min_average: float = None,
    max_average: float = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Buscar alunos com filtros avançados"""
    query = select(Student)
    
    if name:
        query = query.where(Student.name.ilike(f"%{name}%"))
    
    if class_id:
        query = query.where(Student.class_id == uuid.UUID(class_id))
    
    if has_disability is not None:
        query = query.where(Student.has_disability == has_disability)
    
    if works_outside is not None:
        query = query.where(Student.works_outside == works_outside)
    
    if min_average is not None:
        query = query.where(Student.overall_average >= min_average)
    
    if max_average is not None:
        query = query.where(Student.overall_average <= max_average)
    
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/search/classes", response_model=List[ClassResponse], tags=["Search"])
async def search_classes(
    name: str = None,
    teacher_id: str = None,
    grade_level: str = None,
    shift: str = None,
    is_active: bool = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Buscar turmas com filtros"""
    query = select(Class)
    
    if name:
        query = query.where(Class.name.ilike(f"%{name}%"))
    
    if teacher_id:
        query = query.where(Class.teacher_id == uuid.UUID(teacher_id))
    
    if grade_level:
        query = query.where(Class.grade_level == grade_level)
    
    if shift:
        query = query.where(Class.shift == shift)
    
    if is_active is not None:
        query = query.where(Class.is_active == is_active)
    
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()


# ============================================
# BULK OPERATIONS (Operações em Lote)
# ============================================

@router.post("/bulk/students", response_model=List[StudentResponse], tags=["Bulk Operations"])
async def create_students_bulk(students: List[StudentCreate], db: AsyncSession = Depends(get_db)):
    """Criar múltiplos alunos de uma vez"""
    created_students = []
    
    for student_data in students:
        # Verificar se turma existe
        result = await db.execute(select(Class).where(Class.id == uuid.UUID(student_data.class_id)))
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail=f"Turma {student_data.class_id} não encontrada")
        
        # Verificar access_code único
        result = await db.execute(select(Student).where(Student.access_code == student_data.access_code))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail=f"Código de acesso {student_data.access_code} já existe")
        
        new_student = Student(**student_data.model_dump())
        db.add(new_student)
        created_students.append(new_student)
    
    await db.commit()
    
    # Refresh todos os alunos criados
    for student in created_students:
        await db.refresh(student)
    
    return created_students


@router.delete("/bulk/students", status_code=status.HTTP_204_NO_CONTENT, tags=["Bulk Operations"])
async def delete_students_bulk(student_ids: List[str], db: AsyncSession = Depends(get_db)):
    """Deletar múltiplos alunos de uma vez"""
    for student_id in student_ids:
        result = await db.execute(select(Student).where(Student.id == uuid.UUID(student_id)))
        student = result.scalar_one_or_none()
        if student:
            await db.delete(student)
    
    await db.commit()
    return None


# ============================================
# UPLOAD (Para OCR)
# ============================================

@router.post("/upload-prova/", tags=["Upload"])
async def upload_prova(file: UploadFile = File(...)):
    """
    Upload de prova do aluno para OCR
    Salva na pasta temp/ para processamento com Google Vision
    """
    # Validar tipo de arquivo
    if not file.content_type or not (
        file.content_type.startswith("image/") or
        file.content_type == "application/pdf"
    ):
        raise HTTPException(
            status_code=400,
            detail="Tipo de arquivo inválido. Envie PDF, JPG ou PNG."
        )
    
    # Gerar nome único
    file_extension = os.path.splitext(file.filename or "prova.pdf")[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = TEMP_DIR / unique_filename
    
    # Salvar arquivo
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar arquivo: {str(e)}")
    
    return {
        "filename": unique_filename,
        "original_filename": file.filename,
        "path": str(file_path),
        "size": os.path.getsize(file_path),
        "message": "Arquivo salvo com sucesso! Pronto para OCR."
    }
