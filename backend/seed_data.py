"""
Criar dados iniciais para o hackathon
Executa: python seed_data.py
"""
import asyncio
import sys
from pathlib import Path

# Adicionar o diretório src ao path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.database import AsyncSessionLocal
from src.models import Teacher
import uuid

# UUID FIXO - Mesmo que está no frontend!
TEACHER_ID_MOCK = "550e8400-e29b-41d4-a716-446655440000"


async def seed():
    """Criar professor de teste no banco"""
    async with AsyncSessionLocal() as db:
        try:
            # Criar professor de teste
            teacher = Teacher(
                id=uuid.UUID(TEACHER_ID_MOCK),
                name="Professor(a) Demo",
                email="professor@sabiar.com",
                access_code="DEMO2025"
            )
            db.add(teacher)
            await db.commit()
            
            print("=" * 60)
            print("✅ Professor criado com sucesso!")
            print("=" * 60)
            print(f"📝 ID: {TEACHER_ID_MOCK}")
            print(f"📧 Email: professor@sabiar.com")
            print(f"🔑 Código de Acesso: DEMO2025")
            print(f"👤 Nome: Professor(a) Demo")
            print("=" * 60)
            print("\n💡 Use este ID no frontend para testar!")
            print(f"   TEACHER_ID_MOCK = \"{TEACHER_ID_MOCK}\"\n")
            
        except Exception as e:
            print("=" * 60)
            print(f"ℹ️  Professor já existe no banco ou erro:")
            print(f"   {e}")
            print("=" * 60)
            print("\n✅ Isso é normal se você já rodou este script antes!")
            print("   O professor demo já está cadastrado.\n")


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("CRIANDO PROFESSOR DEMO PARA O HACKATHON")
    print("=" * 60 + "\n")
    
    asyncio.run(seed())
    
    print("=" * 60)
    print("PROCESSO CONCLUÍDO!")
    print("=" * 60 + "\n")

