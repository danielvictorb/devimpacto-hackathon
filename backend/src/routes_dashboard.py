"""
FastAPI Routes - Sistema Dashboard de Análise de Alunos
Rotas para o dashboard com dados socioeconômicos e clustering (Async)
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import List, Optional
import uuid

from .database import get_db
from .models_dashboard import (
    # Models
    Escola, Turma, Aluno, ClusterGlobal, ClusterTurma,
    DistribuicaoFaixa, FatorCritico, AlunoRisco,
    RelatorioGeral, PlanoAcao, Metadata
)

# Importar schemas do Pydantic (vamos criar depois se necessário)
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, date
from decimal import Decimal

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# ============================================
# SCHEMAS PYDANTIC
# ============================================

class EscolaBase(BaseModel):
    nome: str
    endereco: Optional[str] = None
    municipio: Optional[str] = None
    uf: Optional[str] = None
    cep: Optional[str] = None


class EscolaCreate(EscolaBase):
    pass


class EscolaResponse(EscolaBase):
    id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class TurmaBase(BaseModel):
    nome: str
    serie: Optional[str] = None
    ano_letivo: Optional[int] = None
    turno: Optional[str] = None
    total_alunos: int = 0
    media_geral: Optional[float] = None
    is_active: bool = True


class TurmaCreate(TurmaBase):
    escola_id: str


class TurmaResponse(TurmaBase):
    id: str
    escola_id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class AlunoBase(BaseModel):
    nome_aluno: str
    cpf_aluno: Optional[str] = None
    telefone_aluno: Optional[str] = None
    genero: Optional[str] = None
    idade_aluno: Optional[int] = None
    cor_raca: Optional[str] = None
    
    # Endereço
    endereco_completo: Optional[str] = None
    municipio: Optional[str] = None
    uf: Optional[str] = None
    cep: Optional[str] = None
    
    # Acadêmico
    serie: Optional[str] = None
    turma_nome: Optional[str] = None
    protocolo: Optional[str] = None
    status_matricula: Optional[str] = None
    
    # Socioeconômico
    renda_familiar: Optional[float] = None
    trabalha_fora: Optional[str] = None
    horas_trabalho_semana: int = 0
    
    # Notas
    matematica_1bim: Optional[float] = None
    matematica_2bim: Optional[float] = None
    matematica_3bim: Optional[float] = None
    matematica_4bim: Optional[float] = None
    media_matematica: Optional[float] = None
    
    portugues_1bim: Optional[float] = None
    portugues_2bim: Optional[float] = None
    portugues_3bim: Optional[float] = None
    portugues_4bim: Optional[float] = None
    media_portugues: Optional[float] = None
    
    media_geral: Optional[float] = None
    frequencia_percentual: Optional[float] = None


class AlunoCreate(AlunoBase):
    escola_id: str
    turma_id: str


class AlunoResponse(AlunoBase):
    id: int
    escola_id: str
    turma_id: str
    cluster_id: Optional[int] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class PlanoAcaoBase(BaseModel):
    numero_acao: Optional[int] = None
    titulo: str
    descricao: Optional[str] = None
    tipo: Optional[str] = None
    prazo: Optional[str] = None
    responsavel: Optional[str] = None
    impacto_esperado: Optional[str] = None
    status: str = "planejado"
    is_global: bool = False


class PlanoAcaoCreate(PlanoAcaoBase):
    turma_id: Optional[str] = None


class PlanoAcaoResponse(PlanoAcaoBase):
    id: str
    turma_id: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ============================================
# ESCOLAS
# ============================================

@router.post("/escolas/", response_model=EscolaResponse, status_code=status.HTTP_201_CREATED)
async def create_escola(escola: EscolaCreate, db: AsyncSession = Depends(get_db)):
    """Criar nova escola"""
    new_escola = Escola(**escola.model_dump())
    db.add(new_escola)
    await db.commit()
    await db.refresh(new_escola)
    return new_escola


@router.get("/escolas/", response_model=List[EscolaResponse])
async def get_escolas(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """Listar todas as escolas"""
    result = await db.execute(select(Escola).offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/escolas/{escola_id}", response_model=EscolaResponse)
async def get_escola(escola_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar escola por ID"""
    result = await db.execute(select(Escola).where(Escola.id == uuid.UUID(escola_id)))
    escola = result.scalar_one_or_none()
    if not escola:
        raise HTTPException(status_code=404, detail="Escola não encontrada")
    return escola


@router.put("/escolas/{escola_id}", response_model=EscolaResponse)
async def update_escola(escola_id: str, escola_update: EscolaCreate, db: AsyncSession = Depends(get_db)):
    """Atualizar dados da escola"""
    result = await db.execute(select(Escola).where(Escola.id == uuid.UUID(escola_id)))
    escola = result.scalar_one_or_none()
    if not escola:
        raise HTTPException(status_code=404, detail="Escola não encontrada")
    
    for key, value in escola_update.model_dump(exclude_unset=True).items():
        setattr(escola, key, value)
    
    await db.commit()
    await db.refresh(escola)
    return escola


@router.delete("/escolas/{escola_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_escola(escola_id: str, db: AsyncSession = Depends(get_db)):
    """Deletar escola"""
    result = await db.execute(select(Escola).where(Escola.id == uuid.UUID(escola_id)))
    escola = result.scalar_one_or_none()
    if not escola:
        raise HTTPException(status_code=404, detail="Escola não encontrada")
    
    await db.delete(escola)
    await db.commit()
    return None


# ============================================
# TURMAS
# ============================================

@router.post("/turmas/", response_model=TurmaResponse, status_code=status.HTTP_201_CREATED)
async def create_turma(turma: TurmaCreate, db: AsyncSession = Depends(get_db)):
    """Criar nova turma"""
    # Verificar se escola existe
    result = await db.execute(select(Escola).where(Escola.id == uuid.UUID(turma.escola_id)))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Escola não encontrada")
    
    new_turma = Turma(**turma.model_dump())
    db.add(new_turma)
    await db.commit()
    await db.refresh(new_turma)
    return new_turma


@router.get("/turmas/", response_model=List[TurmaResponse])
async def get_turmas(
    skip: int = 0, 
    limit: int = 100, 
    escola_id: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    """Listar todas as turmas"""
    query = select(Turma)
    if escola_id:
        query = query.where(Turma.escola_id == uuid.UUID(escola_id))
    if is_active is not None:
        query = query.where(Turma.is_active == is_active)
    
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/turmas/{turma_id}", response_model=TurmaResponse)
async def get_turma(turma_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar turma por ID"""
    result = await db.execute(select(Turma).where(Turma.id == uuid.UUID(turma_id)))
    turma = result.scalar_one_or_none()
    if not turma:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    return turma


@router.put("/turmas/{turma_id}", response_model=TurmaResponse)
async def update_turma(turma_id: str, turma_update: TurmaCreate, db: AsyncSession = Depends(get_db)):
    """Atualizar dados da turma"""
    result = await db.execute(select(Turma).where(Turma.id == uuid.UUID(turma_id)))
    turma = result.scalar_one_or_none()
    if not turma:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    for key, value in turma_update.model_dump(exclude_unset=True).items():
        setattr(turma, key, value)
    
    await db.commit()
    await db.refresh(turma)
    return turma


@router.delete("/turmas/{turma_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_turma(turma_id: str, db: AsyncSession = Depends(get_db)):
    """Deletar turma"""
    result = await db.execute(select(Turma).where(Turma.id == uuid.UUID(turma_id)))
    turma = result.scalar_one_or_none()
    if not turma:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    await db.delete(turma)
    await db.commit()
    return None


# ============================================
# ALUNOS
# ============================================

@router.post("/alunos/", response_model=AlunoResponse, status_code=status.HTTP_201_CREATED)
async def create_aluno(aluno: AlunoCreate, db: AsyncSession = Depends(get_db)):
    """Criar novo aluno"""
    # Verificar se escola existe
    result = await db.execute(select(Escola).where(Escola.id == uuid.UUID(aluno.escola_id)))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Escola não encontrada")
    
    # Verificar se turma existe
    result = await db.execute(select(Turma).where(Turma.id == uuid.UUID(aluno.turma_id)))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    # Verificar se CPF já existe
    if aluno.cpf_aluno:
        result = await db.execute(select(Aluno).where(Aluno.cpf_aluno == aluno.cpf_aluno))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="CPF já cadastrado")
    
    new_aluno = Aluno(**aluno.model_dump())
    db.add(new_aluno)
    await db.commit()
    await db.refresh(new_aluno)
    return new_aluno


@router.get("/alunos/", response_model=List[AlunoResponse])
async def get_alunos(
    skip: int = 0, 
    limit: int = 100,
    turma_id: Optional[str] = None,
    escola_id: Optional[str] = None,
    cluster_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    """Listar todos os alunos"""
    query = select(Aluno)
    if turma_id:
        query = query.where(Aluno.turma_id == uuid.UUID(turma_id))
    if escola_id:
        query = query.where(Aluno.escola_id == uuid.UUID(escola_id))
    if cluster_id is not None:
        query = query.where(Aluno.cluster_id == cluster_id)
    
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/alunos/{aluno_id}", response_model=AlunoResponse)
async def get_aluno(aluno_id: int, db: AsyncSession = Depends(get_db)):
    """Buscar aluno por ID"""
    result = await db.execute(select(Aluno).where(Aluno.id == aluno_id))
    aluno = result.scalar_one_or_none()
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return aluno


@router.put("/alunos/{aluno_id}", response_model=AlunoResponse)
async def update_aluno(aluno_id: int, aluno_update: AlunoCreate, db: AsyncSession = Depends(get_db)):
    """Atualizar dados do aluno"""
    result = await db.execute(select(Aluno).where(Aluno.id == aluno_id))
    aluno = result.scalar_one_or_none()
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    for key, value in aluno_update.model_dump(exclude_unset=True).items():
        setattr(aluno, key, value)
    
    await db.commit()
    await db.refresh(aluno)
    return aluno


@router.delete("/alunos/{aluno_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_aluno(aluno_id: int, db: AsyncSession = Depends(get_db)):
    """Deletar aluno"""
    result = await db.execute(select(Aluno).where(Aluno.id == aluno_id))
    aluno = result.scalar_one_or_none()
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    await db.delete(aluno)
    await db.commit()
    return None


# ============================================
# CLUSTERS GLOBAIS
# ============================================

@router.get("/clusters-globais/")
async def get_clusters_globais(db: AsyncSession = Depends(get_db)):
    """Listar todos os clusters globais"""
    result = await db.execute(select(ClusterGlobal))
    return result.scalars().all()


@router.get("/clusters-globais/{cluster_id}")
async def get_cluster_global(cluster_id: int, db: AsyncSession = Depends(get_db)):
    """Buscar cluster global por ID"""
    result = await db.execute(select(ClusterGlobal).where(ClusterGlobal.cluster_id == cluster_id))
    cluster = result.scalar_one_or_none()
    if not cluster:
        raise HTTPException(status_code=404, detail="Cluster não encontrado")
    return cluster


# ============================================
# CLUSTERS POR TURMA
# ============================================

@router.get("/turmas/{turma_id}/clusters")
async def get_clusters_turma(turma_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar clusters de uma turma específica"""
    result = await db.execute(select(ClusterTurma).where(ClusterTurma.turma_id == uuid.UUID(turma_id)))
    return result.scalars().all()


# ============================================
# DISTRIBUIÇÃO POR FAIXAS
# ============================================

@router.get("/distribuicao-faixas/")
async def get_distribuicao_faixas(
    turma_id: Optional[str] = None,
    is_global: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    """Buscar distribuição de alunos por faixas de desempenho"""
    query = select(DistribuicaoFaixa)
    if turma_id:
        query = query.where(DistribuicaoFaixa.turma_id == uuid.UUID(turma_id))
    if is_global is not None:
        query = query.where(DistribuicaoFaixa.is_global == is_global)
    
    result = await db.execute(query)
    return result.scalars().all()


# ============================================
# FATORES CRÍTICOS
# ============================================

@router.get("/fatores-criticos/")
async def get_fatores_criticos(
    turma_id: Optional[str] = None,
    is_global: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    """Buscar fatores críticos que afetam os alunos"""
    query = select(FatorCritico)
    if turma_id:
        query = query.where(FatorCritico.turma_id == uuid.UUID(turma_id))
    if is_global is not None:
        query = query.where(FatorCritico.is_global == is_global)
    
    result = await db.execute(query)
    return result.scalars().all()


# ============================================
# ALUNOS EM RISCO
# ============================================

@router.get("/alunos-risco/")
async def get_alunos_risco(
    nivel_risco: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Buscar alunos em situação de risco"""
    query = select(AlunoRisco)
    if nivel_risco:
        query = query.where(AlunoRisco.nivel_risco == nivel_risco)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/alunos/{aluno_id}/risco")
async def get_aluno_risco(aluno_id: int, db: AsyncSession = Depends(get_db)):
    """Buscar informações de risco de um aluno específico"""
    result = await db.execute(select(AlunoRisco).where(AlunoRisco.aluno_id == aluno_id))
    return result.scalars().all()


# ============================================
# RELATÓRIOS GERAIS
# ============================================

@router.get("/relatorios/")
async def get_relatorios(
    tipo_relatorio: Optional[str] = None,
    turma_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Buscar relatórios e análises gerais"""
    query = select(RelatorioGeral)
    if tipo_relatorio:
        query = query.where(RelatorioGeral.tipo_relatorio == tipo_relatorio)
    if turma_id:
        query = query.where(RelatorioGeral.turma_id == uuid.UUID(turma_id))
    
    result = await db.execute(query.order_by(RelatorioGeral.data_geracao.desc()))
    return result.scalars().all()


@router.get("/relatorios/{relatorio_id}")
async def get_relatorio(relatorio_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar relatório específico por ID"""
    result = await db.execute(select(RelatorioGeral).where(RelatorioGeral.id == uuid.UUID(relatorio_id)))
    relatorio = result.scalar_one_or_none()
    if not relatorio:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    return relatorio


# ============================================
# PLANOS DE AÇÃO
# ============================================

@router.post("/planos-acao/", response_model=PlanoAcaoResponse, status_code=status.HTTP_201_CREATED)
async def create_plano_acao(plano: PlanoAcaoCreate, db: AsyncSession = Depends(get_db)):
    """Criar novo plano de ação"""
    if plano.turma_id:
        # Verificar se turma existe
        result = await db.execute(select(Turma).where(Turma.id == uuid.UUID(plano.turma_id)))
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    new_plano = PlanoAcao(**plano.model_dump())
    db.add(new_plano)
    await db.commit()
    await db.refresh(new_plano)
    return new_plano


@router.get("/planos-acao/", response_model=List[PlanoAcaoResponse])
async def get_planos_acao(
    turma_id: Optional[str] = None,
    tipo: Optional[str] = None,
    status: Optional[str] = None,
    is_global: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    """Listar todos os planos de ação"""
    query = select(PlanoAcao)
    if turma_id:
        query = query.where(PlanoAcao.turma_id == uuid.UUID(turma_id))
    if tipo:
        query = query.where(PlanoAcao.tipo == tipo)
    if status:
        query = query.where(PlanoAcao.status == status)
    if is_global is not None:
        query = query.where(PlanoAcao.is_global == is_global)
    
    result = await db.execute(query.order_by(PlanoAcao.created_at.desc()))
    return result.scalars().all()


@router.get("/planos-acao/{plano_id}", response_model=PlanoAcaoResponse)
async def get_plano_acao(plano_id: str, db: AsyncSession = Depends(get_db)):
    """Buscar plano de ação por ID"""
    result = await db.execute(select(PlanoAcao).where(PlanoAcao.id == uuid.UUID(plano_id)))
    plano = result.scalar_one_or_none()
    if not plano:
        raise HTTPException(status_code=404, detail="Plano de ação não encontrado")
    return plano


@router.put("/planos-acao/{plano_id}", response_model=PlanoAcaoResponse)
async def update_plano_acao(plano_id: str, plano_update: PlanoAcaoCreate, db: AsyncSession = Depends(get_db)):
    """Atualizar plano de ação"""
    result = await db.execute(select(PlanoAcao).where(PlanoAcao.id == uuid.UUID(plano_id)))
    plano = result.scalar_one_or_none()
    if not plano:
        raise HTTPException(status_code=404, detail="Plano de ação não encontrado")
    
    for key, value in plano_update.model_dump(exclude_unset=True).items():
        setattr(plano, key, value)
    
    await db.commit()
    await db.refresh(plano)
    return plano


@router.delete("/planos-acao/{plano_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_plano_acao(plano_id: str, db: AsyncSession = Depends(get_db)):
    """Deletar plano de ação"""
    result = await db.execute(select(PlanoAcao).where(PlanoAcao.id == uuid.UUID(plano_id)))
    plano = result.scalar_one_or_none()
    if not plano:
        raise HTTPException(status_code=404, detail="Plano de ação não encontrado")
    
    await db.delete(plano)
    await db.commit()
    return None


# ============================================
# ESTATÍSTICAS E ANALYTICS
# ============================================

@router.get("/estatisticas/geral")
async def get_estatisticas_gerais(db: AsyncSession = Depends(get_db)):
    """Obter estatísticas gerais do sistema"""
    # Total de alunos
    result = await db.execute(select(func.count(Aluno.id)))
    total_alunos = result.scalar()
    
    # Total de turmas
    result = await db.execute(select(func.count(Turma.id)))
    total_turmas = result.scalar()
    
    # Total de escolas
    result = await db.execute(select(func.count(Escola.id)))
    total_escolas = result.scalar()
    
    # Média geral de notas
    result = await db.execute(select(func.avg(Aluno.media_geral)))
    media_geral = result.scalar()
    
    # Alunos em risco
    result = await db.execute(
        select(func.count(AlunoRisco.id)).where(AlunoRisco.nivel_risco == "Alto")
    )
    alunos_risco_alto = result.scalar()
    
    return {
        "total_alunos": total_alunos,
        "total_turmas": total_turmas,
        "total_escolas": total_escolas,
        "media_geral": float(media_geral) if media_geral else None,
        "alunos_risco_alto": alunos_risco_alto
    }


@router.get("/estatisticas/turma/{turma_id}")
async def get_estatisticas_turma(turma_id: str, db: AsyncSession = Depends(get_db)):
    """Obter estatísticas de uma turma específica"""
    # Verificar se turma existe
    result = await db.execute(select(Turma).where(Turma.id == uuid.UUID(turma_id)))
    turma = result.scalar_one_or_none()
    if not turma:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    # Total de alunos na turma
    result = await db.execute(
        select(func.count(Aluno.id)).where(Aluno.turma_id == uuid.UUID(turma_id))
    )
    total_alunos = result.scalar()
    
    # Média da turma
    result = await db.execute(
        select(func.avg(Aluno.media_geral)).where(Aluno.turma_id == uuid.UUID(turma_id))
    )
    media_turma = result.scalar()
    
    # Alunos que trabalham
    result = await db.execute(
        select(func.count(Aluno.id)).where(
            and_(
                Aluno.turma_id == uuid.UUID(turma_id),
                Aluno.trabalha_fora == "Sim"
            )
        )
    )
    alunos_trabalham = result.scalar()
    
    return {
        "turma_id": turma_id,
        "turma_nome": turma.nome,
        "total_alunos": total_alunos,
        "media_turma": float(media_turma) if media_turma else None,
        "alunos_trabalham": alunos_trabalham,
        "percentual_trabalham": (alunos_trabalham / total_alunos * 100) if total_alunos > 0 else 0
    }


# ============================================
# METADATA
# ============================================

@router.get("/metadata/")
async def get_metadata(
    tipo: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Buscar metadados das análises"""
    query = select(Metadata)
    if tipo:
        query = query.where(Metadata.tipo == tipo)
    
    result = await db.execute(query.order_by(Metadata.created_at.desc()))
    return result.scalars().all()
