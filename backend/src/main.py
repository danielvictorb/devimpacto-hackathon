"""
FastAPI + SQLAlchemy + Supabase
Sistema de Correção de Provas com IA
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid

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

# ============================================
# Teste de conexão síncrona (psycopg2)
# ============================================
from sqlalchemy import create_engine
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

# Construct the SQLAlchemy connection string (SÍNCRONO - psycopg2)
DATABASE_URL_SYNC = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

# Create the SQLAlchemy engine (SÍNCRONO - para testes)
engine_sync = create_engine(DATABASE_URL_SYNC)

# Test the connection
print("=" * 60)
print("Testando conexão síncrona com Supabase (psycopg2)...")
try:
    with engine_sync.connect() as connection:
        print("✅ Connection successful!")
except Exception as e:
    print(f"❌ Failed to connect: {e}")
print("=" * 60)
print()


# Inicializar FastAPI (sem eventos problemáticos)
app = FastAPI(
    title="Sistema de Correção de Provas - API",
    description="API para sistema de correção automática de provas com IA",
    version="1.0.0"
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
from .clustering_routes import router as clustering_router

app.include_router(router)
app.include_router(clustering_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
