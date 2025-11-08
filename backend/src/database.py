"""
Configuração do SQLAlchemy para conectar com Supabase (PostgreSQL)
Usando conexões assíncronas com asyncpg
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Pegar as credenciais do .env
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# Debug - remover depois
print(f"DEBUG - USER: {USER}")
print(f"DEBUG - PASSWORD: {'***' if PASSWORD else None}")
print(f"DEBUG - HOST: {HOST}")
print(f"DEBUG - PORT: {PORT}")
print(f"DEBUG - DBNAME: {DBNAME}")

if not all([USER, PASSWORD, HOST, PORT, DBNAME]):
    raise ValueError("Credenciais do banco não encontradas no arquivo .env")

# Construir a connection string para async (asyncpg)
# Formato: postgresql+asyncpg://user:password@host:port/dbname
# Adicionar SSL mode require para Supabase
DATABASE_URL = f"postgresql+asyncpg://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?ssl=require"

# Debug - mostrar URL sem senha
safe_url = f"postgresql+asyncpg://{USER}:***@{HOST}:{PORT}/{DBNAME}?ssl=require"
print(f"DEBUG - DATABASE_URL: {safe_url}")
print()

# Criar async engine do SQLAlchemy
# pool_pre_ping=True: verifica se a conexão está ativa antes de usar
# echo=True: mostra os SQLs gerados (útil para debug, remova em produção)
engine = create_async_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=True,  # Mude para False em produção
    pool_size=5,
    max_overflow=10
)

# Criar AsyncSessionLocal para fazer queries
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Base class para os models
Base = declarative_base()


# Dependency para usar nas rotas do FastAPI
async def get_db():
    """
    Dependency que cria uma sessão do banco de dados para cada request
    e fecha automaticamente quando a request termina
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
