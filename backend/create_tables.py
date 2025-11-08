"""
Script para criar todas as tabelas no banco de dados Supabase
Executa: python create_tables.py
"""
import asyncio
import sys
from pathlib import Path

# Adicionar o diretório src ao path
sys.path.insert(0, str(Path(__file__).parent / "src"))

# Importar diretamente do src (não relativo)
from src.database import engine, Base
from src.models import (
    Teacher, Class, Student, Exam, Question, 
    StudentExam, StudentAnswer, ExamInsight
)


async def create_tables():
    """Cria todas as tabelas definidas nos models"""
    print("Conectando ao banco de dados...")
    
    try:
        async with engine.begin() as conn:
            print("Dropando tabelas existentes (se houver)...")
            await conn.run_sync(Base.metadata.drop_all)
            
            print("Criando todas as tabelas...")
            await conn.run_sync(Base.metadata.create_all)
            
        print("[OK] Tabelas criadas com sucesso!")
        print("\nTabelas criadas:")
        print("  - teachers (Professores)")
        print("  - classes (Turmas)")
        print("  - students (Estudantes)")
        print("  - exams (Provas)")
        print("  - questions (Questões)")
        print("  - student_exams (Provas dos alunos)")
        print("  - student_answers (Respostas dos alunos)")
        print("  - exam_insights (Insights das provas)")
        
    except Exception as e:
        print(f"[ERRO] ao criar tabelas: {e}")
        raise
    finally:
        await engine.dispose()


if __name__ == "__main__":
    print("=" * 60)
    print("INICIANDO CRIAÇÃO DAS TABELAS NO SUPABASE")
    print("=" * 60)
    
    asyncio.run(create_tables())
    
    print("\n" + "=" * 60)
    print("PROCESSO CONCLUÍDO!")
    print("=" * 60)
