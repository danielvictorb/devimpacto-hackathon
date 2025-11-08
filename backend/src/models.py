"""
Models SQLAlchemy - Sistema de Correção de Provas
Baseado no schema.md do projeto
"""
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Integer, Date, DECIMAL, CheckConstraint, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func, text
import uuid

# Import flexível - funciona tanto com import relativo quanto absoluto
try:
    from .database import Base
except ImportError:
    from database import Base


class Teacher(Base):
    """Tabela de Professores"""
    __tablename__ = "teachers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    access_code = Column(String(10), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    classes = relationship("Class", back_populates="teacher", cascade="all, delete-orphan")
    exams = relationship("Exam", back_populates="teacher", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Teacher(id={self.id}, name='{self.name}')>"


class Class(Base):
    """Tabela de Turmas"""
    __tablename__ = "classes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    
    # Detalhes da turma
    grade_level = Column(String(50))  # "9º Ano", "1º EM", etc.
    section = Column(String(1))  # "A", "B", "C"
    shift = Column(String(20))  # "Matutino", "Vespertino", "Noturno"
    
    # Informações adicionais
    school_year = Column(Integer)
    student_count = Column(Integer, default=0)  # Cache para performance
    is_active = Column(Boolean, default=True)  # Turma ativa ou arquivada
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relacionamentos
    teacher = relationship("Teacher", back_populates="classes")
    students = relationship("Student", back_populates="class_", cascade="all, delete-orphan")
    exams = relationship("Exam", back_populates="class_", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Class(id={self.id}, name='{self.name}', grade='{self.grade_level}', section='{self.section}')>"


class Student(Base):
    """Tabela de Estudantes com dados completos"""
    __tablename__ = "students"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    
    # DADOS BÁSICOS
    name = Column(String(255), nullable=False)
    gender = Column(String(20), CheckConstraint("gender IN ('Masculino', 'Feminino', 'Outro', 'Prefiro não informar')"))
    birth_date = Column(Date)
    cpf = Column(String(14), unique=True)
    phone = Column(String(20))
    registration_number = Column(String(50))
    access_code = Column(String(10), unique=True, nullable=False)
    
    # ENDEREÇO
    address_street = Column(String(255))
    address_city = Column(String(100))
    address_state = Column(String(2))
    address_zip = Column(String(10))
    
    # ACESSIBILIDADE
    has_disability = Column(Boolean, default=False)
    disability_type = Column(Text)
    
    # DADOS DO RESPONSÁVEL
    guardian_name = Column(String(255))
    guardian_relationship = Column(String(50))
    guardian_cpf = Column(String(14))
    guardian_phone = Column(String(20))
    
    # DADOS SOCIOECONÔMICOS
    family_income = Column(DECIMAL(10, 2))
    has_siblings = Column(Boolean)
    number_of_siblings = Column(Integer)
    siblings_ages = Column(Text)
    
    works_outside = Column(Boolean, default=False)
    work_hours_per_week = Column(Integer)
    work_type = Column(String(100))
    
    commute_time_minutes = Column(Integer)
    transport_type = Column(String(50))
    
    has_internet = Column(Boolean, default=False)
    has_computer = Column(Boolean, default=False)
    has_family_support = Column(Boolean)
    has_school_meals = Column(Boolean)
    
    # DADOS ACADÊMICOS (HISTÓRICO)
    math_grade = Column(DECIMAL(4, 2))
    portuguese_grade = Column(DECIMAL(4, 2))
    overall_average = Column(DECIMAL(4, 2))
    attendance_percentage = Column(DECIMAL(5, 2))
    
    # METADADOS
    enrollment_protocol = Column(String(50))
    enrollment_status = Column(
        String(50),
        CheckConstraint("enrollment_status IN ('active', 'inactive', 'transferred', 'graduated')"),
        default='active'
    )
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relacionamentos
    class_ = relationship("Class", back_populates="students")
    student_exams = relationship("StudentExam", back_populates="student", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Student(id={self.id}, name='{self.name}', class_id={self.class_id})>"


class Exam(Base):
    """Tabela de Provas"""
    __tablename__ = "exams"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    subject = Column(String(100), nullable=False)  # Disciplina: Matemática, Português
    total_points = Column(DECIMAL(5, 2), default=10.00)
    exam_date = Column(Date)
    period_type = Column(
        String(20),
        CheckConstraint("period_type IN ('bimestral', 'trimestral', 'semestral', 'anual', 'diagnostic', 'recovery')")
    )
    period_number = Column(Integer)
    school_year = Column(Integer, server_default=text("EXTRACT(YEAR FROM CURRENT_DATE)"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    class_ = relationship("Class", back_populates="exams")
    teacher = relationship("Teacher", back_populates="exams")
    questions = relationship("Question", back_populates="exam", cascade="all, delete-orphan")
    student_exams = relationship("StudentExam", back_populates="exam", cascade="all, delete-orphan")
    insights = relationship("ExamInsight", back_populates="exam", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Exam(id={self.id}, title='{self.title}')>"


class Question(Base):
    """Tabela de Questões das Provas"""
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    question_number = Column(Integer, nullable=False)
    question_type = Column(
        String(20),
        CheckConstraint("question_type IN ('multiple_choice', 'essay')"),
        nullable=False
    )
    points = Column(DECIMAL(5, 2), default=1.00)
    options = Column(JSONB)  
    expected_answer = Column(Text, nullable=False)
    grading_criteria = Column(Text)  
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    exam = relationship("Exam", back_populates="questions")
    student_answers = relationship("StudentAnswer", back_populates="question", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Question(id={self.id}, exam_id={self.exam_id}, number={self.question_number})>"


class StudentExam(Base):
    """Tabela de Provas Realizadas pelos Alunos"""
    __tablename__ = "student_exams"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    scanned_image_url = Column(Text, nullable=False)
    correction_status = Column(
        String(20),
        CheckConstraint("correction_status IN ('pending', 'processing', 'completed', 'error')"),
        default='pending'
    )
    ocr_raw_text = Column(Text)
    total_score = Column(DECIMAL(5, 2))
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    corrected_at = Column(DateTime(timezone=True))

    # Constraints de tabela
    __table_args__ = (
        # Um aluno só pode ter uma prova por exam_id
        UniqueConstraint('exam_id', 'student_id', name='uq_student_exam'),
    )

    # Relacionamentos
    exam = relationship("Exam", back_populates="student_exams")
    student = relationship("Student", back_populates="student_exams")
    answers = relationship("StudentAnswer", back_populates="student_exam", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<StudentExam(id={self.id}, student_id={self.student_id}, status='{self.correction_status}')>"


class StudentAnswer(Base):
    """Tabela de Respostas dos Alunos"""
    __tablename__ = "student_answers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_exam_id = Column(UUID(as_uuid=True), ForeignKey("student_exams.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    extracted_answer = Column(Text)
    ai_score = Column(DECIMAL(5, 2))
    ai_feedback = Column(Text)
    is_correct = Column(Boolean)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Constraints de tabela
    __table_args__ = (
        # Uma resposta única por questão em cada prova
        UniqueConstraint('student_exam_id', 'question_id', name='uq_student_answer'),
    )

    # Relacionamentos
    student_exam = relationship("StudentExam", back_populates="answers")
    question = relationship("Question", back_populates="student_answers")

    def __repr__(self):
        return f"<StudentAnswer(id={self.id}, question_id={self.question_id}, score={self.ai_score})>"


class ExamInsight(Base):
    """Tabela de Insights e Análises das Provas"""
    __tablename__ = "exam_insights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), unique=True, nullable=False)
    total_students = Column(Integer)
    average_score = Column(DECIMAL(5, 2))
    median_score = Column(DECIMAL(5, 2))
    highest_score = Column(DECIMAL(5, 2))
    lowest_score = Column(DECIMAL(5, 2))
    standard_deviation = Column(DECIMAL(5, 2))
    question_performance = Column(JSONB)  # Performance por questão
    at_risk_students = Column(JSONB)  # Alunos com risco de reprovação
    average_students = Column(JSONB)  # Alunos com desempenho médio
    top_students = Column(JSONB)  # Alunos com melhor desempenho
    ai_summary = Column(Text)  # Resumo gerado por IA
    ai_recommendations = Column(Text)  # Recomendações geradas por IA
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    exam = relationship("Exam", back_populates="insights")

    def __repr__(self):
        return f"<ExamInsight(id={self.id}, exam_id={self.exam_id}, avg_score={self.average_score})>"


# ============================================
# Schemas Pydantic (para validação no FastAPI)
# ============================================
from pydantic import BaseModel, EmailStr, Field, validator, field_serializer
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from decimal import Decimal
import uuid as uuid_lib


# ============== TEACHER SCHEMAS ==============

class TeacherBase(BaseModel):
    name: str = Field(..., max_length=255)
    email: EmailStr


class TeacherCreate(TeacherBase):
    access_code: str = Field(..., min_length=4, max_length=10)


class TeacherResponse(TeacherBase):
    id: uuid_lib.UUID
    access_code: str
    created_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            uuid_lib.UUID: str
        }


# ============== CLASS SCHEMAS ==============

class ClassBase(BaseModel):
    name: str = Field(..., max_length=100)
    school_year: Optional[int] = None


class ClassCreate(ClassBase):
    teacher_id: str  # UUID


class ClassResponse(ClassBase):
    id: uuid_lib.UUID  # Mudar para UUID
    teacher_id: uuid_lib.UUID  # Mudar para UUID
    created_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            uuid_lib.UUID: str
        }


# ============== STUDENT SCHEMAS ==============

class StudentBase(BaseModel):
    name: str = Field(..., max_length=255)
    gender: Optional[str] = None
    birth_date: Optional[date] = None
    cpf: Optional[str] = Field(None, max_length=14)
    phone: Optional[str] = Field(None, max_length=20)
    registration_number: Optional[str] = Field(None, max_length=50)
    
    # Endereço
    address_street: Optional[str] = None
    address_city: Optional[str] = None
    address_state: Optional[str] = Field(None, max_length=2)
    address_zip: Optional[str] = Field(None, max_length=10)
    
    # Acessibilidade
    has_disability: bool = False
    disability_type: Optional[str] = None
    
    # Responsável
    guardian_name: Optional[str] = None
    guardian_relationship: Optional[str] = None
    guardian_cpf: Optional[str] = None
    guardian_phone: Optional[str] = None
    
    # Socioeconômico
    family_income: Optional[Decimal] = None
    has_siblings: Optional[bool] = None
    number_of_siblings: Optional[int] = None
    siblings_ages: Optional[str] = None
    works_outside: bool = False
    work_hours_per_week: Optional[int] = None
    work_type: Optional[str] = None
    commute_time_minutes: Optional[int] = None
    transport_type: Optional[str] = None
    has_internet: bool = False
    has_computer: bool = False
    has_family_support: Optional[bool] = None
    has_school_meals: Optional[bool] = None
    
    # Acadêmico
    math_grade: Optional[Decimal] = None
    portuguese_grade: Optional[Decimal] = None
    overall_average: Optional[Decimal] = None
    attendance_percentage: Optional[Decimal] = None
    
    # Metadados
    enrollment_protocol: Optional[str] = None
    enrollment_status: str = 'active'


class StudentCreate(StudentBase):
    class_id: str  # UUID
    access_code: str = Field(..., min_length=4, max_length=10)


class StudentResponse(StudentBase):
    id: uuid_lib.UUID
    class_id: uuid_lib.UUID
    access_code: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_encoders = {
            uuid_lib.UUID: str
        }


# ============== EXAM SCHEMAS ==============

class ExamBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    subject: str = Field(..., max_length=100) 
    total_points: Decimal = Field(default=10.00)
    exam_date: Optional[date] = None
    period_type: Optional[str] = None
    period_number: Optional[int] = None
    school_year: Optional[int] = None


class ExamCreate(ExamBase):
    class_id: str  # UUID
    teacher_id: str  # UUID


class ExamResponse(ExamBase):
    id: uuid_lib.UUID
    class_id: uuid_lib.UUID
    teacher_id: uuid_lib.UUID
    created_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            uuid_lib.UUID: str
        }


# ============== QUESTION SCHEMAS ==============

class QuestionBase(BaseModel):
    question_number: int
    question_type: str  # 'multiple_choice' ou 'essay'
    points: Decimal = Field(default=1.00)
    options: Optional[Dict[str, str]] = None  
    expected_answer: str
    grading_criteria: Optional[str] = None


class QuestionCreate(QuestionBase):
    exam_id: str  # UUID


class QuestionResponse(QuestionBase):
    id: uuid_lib.UUID
    exam_id: uuid_lib.UUID
    created_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            uuid_lib.UUID: str
        }


# ============== STUDENT EXAM SCHEMAS ==============

class StudentExamBase(BaseModel):
    scanned_image_url: str
    correction_status: str = 'pending'
    ocr_raw_text: Optional[str] = None
    total_score: Optional[Decimal] = None


class StudentExamCreate(StudentExamBase):
    exam_id: str  # UUID
    student_id: str  # UUID


class StudentExamResponse(StudentExamBase):
    id: str
    exam_id: str
    student_id: str
    uploaded_at: datetime
    corrected_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============== STUDENT ANSWER SCHEMAS ==============

class StudentAnswerBase(BaseModel):
    extracted_answer: Optional[str] = None
    ai_score: Optional[Decimal] = None
    ai_feedback: Optional[str] = None
    is_correct: Optional[bool] = None


class StudentAnswerCreate(StudentAnswerBase):
    student_exam_id: str  # UUID
    question_id: str  # UUID


class StudentAnswerResponse(StudentAnswerBase):
    id: str
    student_exam_id: str
    question_id: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============== EXAM INSIGHT SCHEMAS ==============

class ExamInsightBase(BaseModel):
    total_students: Optional[int] = None
    average_score: Optional[Decimal] = None
    median_score: Optional[Decimal] = None
    highest_score: Optional[Decimal] = None
    lowest_score: Optional[Decimal] = None
    standard_deviation: Optional[Decimal] = None
    question_performance: Optional[Dict[str, Any]] = None
    at_risk_students: Optional[List[Dict[str, Any]]] = None
    average_students: Optional[List[Dict[str, Any]]] = None
    top_students: Optional[List[Dict[str, Any]]] = None
    ai_summary: Optional[str] = None
    ai_recommendations: Optional[str] = None


class ExamInsightCreate(ExamInsightBase):
    exam_id: str  # UUID


class ExamInsightResponse(ExamInsightBase):
    id: str
    exam_id: str
    generated_at: datetime

    class Config:
        from_attributes = True

