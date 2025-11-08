"""
FastAPI + SQLAlchemy + Supabase
Sistema de Correção de Provas com IA
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
from contextlib import asynccontextmanager

from .database import engine, get_db, Base
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

from sqlalchemy import create_engine
# from sqlalchemy.pool import NullPool
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Fetch variables
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# Construct the SQLAlchemy connection string
DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)
# If using Transaction Pooler or Session Pooler, we want to ensure we disable SQLAlchemy client side pooling -
# https://docs.sqlalchemy.org/en/20/core/pooling.html#switching-pool-implementations
# engine = create_engine(DATABASE_URL, poolclass=NullPool)

# Test the connection
try:
    with engine.connect() as connection:
        print("Connection successful!")
except Exception as e:
    print(f"Failed to connect: {e}")


# Evento de startup para criar as tabelas
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Executa na inicialização e finalização da aplicação"""
    # Startup: Criar as tabelas no banco
    print("Criando tabelas no banco de dados...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[OK] Tabelas criadas com sucesso!")
    
    yield
    
    # Shutdown: Fechar conexões
    print("Fechando conexões com o banco...")
    await engine.dispose()
    print("[OK] Conexões fechadas!")


# Inicializar FastAPI com lifespan
app = FastAPI(
    title="Sistema de Correção de Provas - API",
    description="API para sistema de correção automática de provas com IA",
    version="1.0.0",
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# HEALTH CHECK
# ============================================

@app.get("/")
def read_root():
    """Rota raiz"""
    return {
        "message": "Sistema de Correção de Provas - API 🚀",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Verifica se a API e o banco estão funcionando"""
    try:
        from sqlalchemy import text
        await db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database error: {str(e)}")


# Incluir rotas
from .routes import router
app.include_router(router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
