"""
Models SQLAlchemy - Sistema Dashboard de Análise de Alunos
Baseado nos JSONs: dados_dashboard.json e relatorio_completo.json
"""
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Integer, Date, DECIMAL, Float, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

try:
    from .database import Base
except ImportError:
    from database import Base


# ==================== TABELAS PRINCIPAIS ====================

class Escola(Base):
    """Tabela de Escolas"""
    __tablename__ = "escolas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String(255), nullable=False)
    endereco = Column(String(500))
    municipio = Column(String(100))
    uf = Column(String(2))
    cep = Column(String(10))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relacionamentos
    turmas = relationship("Turma", back_populates="escola", cascade="all, delete-orphan")
    alunos = relationship("Aluno", back_populates="escola", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Escola(id={self.id}, nome='{self.nome}')>"


class Turma(Base):
    """Tabela de Turmas"""
    __tablename__ = "turmas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    escola_id = Column(UUID(as_uuid=True), ForeignKey("escolas.id", ondelete="CASCADE"), nullable=False)
    
    nome = Column(String(50), nullable=False)  # "1A", "2B", etc.
    serie = Column(String(50))  # "1º Ano", "2º Ano", etc.
    ano_letivo = Column(Integer)
    turno = Column(String(20))  # "Matutino", "Vespertino", "Noturno"
    
    # Estatísticas da turma
    total_alunos = Column(Integer, default=0)
    media_geral = Column(Float)
    desvio_padrao = Column(Float)
    pct_trabalha = Column(Float)
    renda_media = Column(Float)
    pct_pretos_pardos = Column(Float)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relacionamentos
    escola = relationship("Escola", back_populates="turmas")
    alunos = relationship("Aluno", back_populates="turma", cascade="all, delete-orphan")
    clusters_turma = relationship("ClusterTurma", back_populates="turma", cascade="all, delete-orphan")
    distribuicoes_faixa = relationship("DistribuicaoFaixa", back_populates="turma", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Turma(id={self.id}, nome='{self.nome}', serie='{self.serie}')>"


class Aluno(Base):
    """Tabela completa de Alunos com dados socioeconômicos"""
    __tablename__ = "alunos"

    id = Column(Integer, primary_key=True)  # ID original dos JSONs
    escola_id = Column(UUID(as_uuid=True), ForeignKey("escolas.id", ondelete="CASCADE"), nullable=False)
    turma_id = Column(UUID(as_uuid=True), ForeignKey("turmas.id", ondelete="CASCADE"), nullable=False)
    
    # DADOS PESSOAIS
    nome_aluno = Column(String(255), nullable=False)
    cpf_aluno = Column(String(14), unique=True)
    telefone_aluno = Column(String(20))
    genero = Column(String(1), CheckConstraint("genero IN ('M', 'F', 'O')"))
    idade_aluno = Column(Integer)
    cor_raca = Column(String(50))  # "Branca", "Preta", "Parda", "Amarela", "Indígena"
    
    # ENDEREÇO
    endereco_completo = Column(String(500))
    municipio = Column(String(100))
    uf = Column(String(2))
    cep = Column(String(10))
    
    # DADOS ACADÊMICOS
    serie = Column(String(50))
    turma_nome = Column(String(50))  # Nome da turma como string (ex: "1A", "2B")
    protocolo = Column(String(50))
    status_matricula = Column(String(50))
    
    # ACESSIBILIDADE
    deficiencia = Column(String(100))
    
    # RESPONSÁVEL
    nome_responsavel = Column(String(255))
    parentesco = Column(String(50))
    cpf_responsavel = Column(String(14))
    telefone_responsavel = Column(String(20))
    
    # DADOS SOCIOECONÔMICOS
    renda_familiar = Column(Float)
    tem_irmaos = Column(String(50))  # "Sim" ou "Não"
    numero_irmaos = Column(Integer)
    idades_irmaos = Column(String(100))
    
    # TRABALHO
    trabalha_fora = Column(String(50))  # "Sim" ou "Não"
    horas_trabalho_semana = Column(Integer, default=0)
    tipo_trabalho = Column(String(100))
    
    # DESLOCAMENTO
    tempo_deslocamento_min = Column(Integer)
    meio_transporte = Column(String(100))
    seguranca_trajeto = Column(String(50))
    
    # ACESSO E RECURSOS
    acesso_internet = Column(String(50))  # "Sim", "Não", "Apenas celular"
    tem_computador = Column(String(50))  # "Sim" ou "Não"
    
    # APOIO E AMBIENTE
    apoio_familiar_estudos = Column(String(50))  # "Alto", "Médio", "Baixo"
    ambiente_familiar = Column(String(50))  # "Tranquilo", "Conflituoso"
    responsabilidades_casa = Column(String(50))  # "Poucas", "Moderadas", "Muitas"
    
    # ALIMENTAÇÃO
    faz_refeicao_escola = Column(String(50))  # "Sim" ou "Não"
    refeicoes_diarias = Column(Integer)
    seguranca_alimentar = Column(String(100))  # "Segurança", "Leve Insegurança", etc.
    
    # CONTEXTO AMBIENTAL
    area_climatica = Column(String(100))
    impacto_seca = Column(String(100))
    area_risco_ambiental = Column(String(100))
    
    # NOTAS - MATEMÁTICA
    matematica_1bim = Column(Float)
    matematica_2bim = Column(Float)
    matematica_3bim = Column(Float)
    matematica_4bim = Column(Float)
    media_matematica = Column(Float)
    
    # NOTAS - PORTUGUÊS
    portugues_1bim = Column(Float)
    portugues_2bim = Column(Float)
    portugues_3bim = Column(Float)
    portugues_4bim = Column(Float)
    media_portugues = Column(Float)
    
    # DESEMPENHO GERAL
    media_geral = Column(Float)
    frequencia_percentual = Column(Float)
    
    # CLUSTER
    cluster_id = Column(Integer, ForeignKey("clusters_globais.cluster_id"))
    cluster_turma_id = Column(Integer)
    
    # METADADOS
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relacionamentos
    escola = relationship("Escola", back_populates="alunos")
    turma = relationship("Turma", back_populates="alunos")
    cluster = relationship("ClusterGlobal", back_populates="alunos")

    def __repr__(self):
        return f"<Aluno(id={self.id}, nome='{self.nome_aluno}', turma='{self.turma_nome}')>"


# ==================== TABELAS DE CLUSTERING ====================

class ClusterGlobal(Base):
    """Clusters globais (todos os alunos)"""
    __tablename__ = "clusters_globais"

    cluster_id = Column(Integer, primary_key=True)
    total_alunos = Column(Integer)
    percentual = Column(Float)
    
    # Características médias do cluster
    media_notas = Column(Float)
    renda_media = Column(Float)
    pct_trabalha = Column(Float)
    tempo_desl_medio = Column(Float)
    pct_pretos_pardos = Column(Float)
    pct_inseg_alimentar = Column(Float)
    
    # Features e descrição
    features_relevantes = Column(JSONB)  # Array de strings
    descricao = Column(Text)
    nivel_risco = Column(String(50))  # "Alto", "Médio", "Baixo"
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    alunos = relationship("Aluno", back_populates="cluster")

    def __repr__(self):
        return f"<ClusterGlobal(id={self.cluster_id}, alunos={self.total_alunos})>"


class ClusterTurma(Base):
    """Clusters específicos por turma"""
    __tablename__ = "clusters_turma"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    turma_id = Column(UUID(as_uuid=True), ForeignKey("turmas.id", ondelete="CASCADE"), nullable=False)
    cluster_id = Column(Integer)
    
    total_alunos = Column(Integer)
    percentual = Column(Float)
    
    # Características
    media_notas = Column(Float)
    renda_media = Column(Float)
    pct_trabalha = Column(Float)
    tempo_desl_medio = Column(Float)
    pct_pretos_pardos = Column(Float)
    pct_inseg_alimentar = Column(Float)
    pct_sem_internet = Column(Float)
    
    nivel_risco = Column(String(50))
    features_relevantes = Column(JSONB)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    turma = relationship("Turma", back_populates="clusters_turma")

    def __repr__(self):
        return f"<ClusterTurma(turma_id={self.turma_id}, cluster={self.cluster_id})>"


# ==================== TABELAS DE ANÁLISE E ESTATÍSTICAS ====================

class DistribuicaoFaixa(Base):
    """Distribuição de alunos por faixa de desempenho"""
    __tablename__ = "distribuicao_faixas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    turma_id = Column(UUID(as_uuid=True), ForeignKey("turmas.id", ondelete="CASCADE"))
    
    faixa = Column(String(50), nullable=False)  # "Baixo (0-4)", "Médio (4-7)", "Alto (7-10)"
    
    # Intervalo de notas
    nota_min = Column(Float)
    nota_max = Column(Float)
    nota_media = Column(Float)
    nota_mediana = Column(Float)
    
    # Estatísticas
    total_alunos = Column(Integer)
    percentual = Column(Float)
    pct_trabalha = Column(Float)
    renda_media = Column(Float)
    pct_pretos_pardos = Column(Float)
    
    # Se for None, é estatística global
    is_global = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    turma = relationship("Turma", back_populates="distribuicoes_faixa")

    def __repr__(self):
        return f"<DistribuicaoFaixa(faixa='{self.faixa}', alunos={self.total_alunos})>"


class FatorCritico(Base):
    """Fatores críticos que afetam os alunos"""
    __tablename__ = "fatores_criticos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    tipo_fator = Column(String(100), nullable=False)  # "trabalho", "baixa_renda", "deslocamento_longo", etc.
    descricao = Column(String(255))
    total_alunos_afetados = Column(Integer)
    percentual_afetados = Column(Float)
    
    # Pode ser global ou por turma
    turma_id = Column(UUID(as_uuid=True), ForeignKey("turmas.id", ondelete="CASCADE"))
    is_global = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<FatorCritico(tipo='{self.tipo_fator}', afetados={self.total_alunos_afetados})>"


class AlunoRisco(Base):
    """Alunos em situação de alto risco"""
    __tablename__ = "alunos_risco"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    aluno_id = Column(Integer, ForeignKey("alunos.id", ondelete="CASCADE"), nullable=False)
    
    nivel_risco = Column(String(50), nullable=False)  # "Alto", "Médio", "Baixo"
    fatores_risco = Column(JSONB)  # Array de fatores que contribuem para o risco
    
    # Pontuação de risco (calculada)
    score_risco = Column(Float)
    
    # Recomendações
    recomendacoes = Column(JSONB)
    
    # Acompanhamento
    data_identificacao = Column(DateTime(timezone=True), server_default=func.now())
    ultima_atualizacao = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    status_acompanhamento = Column(String(50))  # "Em acompanhamento", "Intervenção realizada", etc.
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<AlunoRisco(aluno_id={self.aluno_id}, nivel='{self.nivel_risco}')>"


# ==================== TABELAS DE RELATÓRIOS E INSIGHTS ====================

class RelatorioGeral(Base):
    """Relatórios e análises gerais"""
    __tablename__ = "relatorios_gerais"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    tipo_relatorio = Column(String(100), nullable=False)  # "analise_geral", "analise_turma", etc.
    titulo = Column(String(255))
    
    # Dados da análise
    resumo_estatistico = Column(Text)
    padroes_gerais = Column(Text)
    interpretacao_ia = Column(Text)
    
    # Correlações e insights
    correlacoes_identificadas = Column(JSONB)
    causas_subjacentes = Column(Text)
    observacoes = Column(Text)
    insights_principais = Column(JSONB)  # Array de strings
    
    # Metadados
    turma_id = Column(UUID(as_uuid=True), ForeignKey("turmas.id", ondelete="CASCADE"))
    data_geracao = Column(DateTime(timezone=True), server_default=func.now())
    total_alunos_analisados = Column(Integer)
    total_turmas_analisadas = Column(Integer)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<RelatorioGeral(tipo='{self.tipo_relatorio}', data='{self.data_geracao}')>"


class PlanoAcao(Base):
    """Planos de ação e intervenções"""
    __tablename__ = "planos_acao"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    numero_acao = Column(Integer)
    titulo = Column(String(255), nullable=False)
    descricao = Column(Text)
    
    tipo = Column(String(50))  # "pedagogico", "psicossocial", "externo"
    prazo = Column(String(50))  # "curto", "medio", "longo"
    responsavel = Column(String(255))
    impacto_esperado = Column(Text)
    
    # Pode ser global ou específico de turma
    turma_id = Column(UUID(as_uuid=True), ForeignKey("turmas.id", ondelete="CASCADE"))
    is_global = Column(Boolean, default=False)
    
    # Status de execução
    status = Column(String(50), default="planejado")  # "planejado", "em_execucao", "concluido", "cancelado"
    data_inicio = Column(Date)
    data_conclusao_prevista = Column(Date)
    data_conclusao_real = Column(Date)
    
    # Resultados
    resultados_obtidos = Column(Text)
    metricas_impacto = Column(JSONB)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<PlanoAcao(id={self.id}, titulo='{self.titulo}', tipo='{self.tipo}')>"


class Metadata(Base):
    """Metadados das análises e importações"""
    __tablename__ = "metadata"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    tipo = Column(String(100), nullable=False)  # "importacao", "analise", "dashboard"
    
    total_alunos = Column(Integer)
    total_turmas = Column(Integer)
    total_escolas = Column(Integer)
    
    data_geracao = Column(DateTime(timezone=True))
    data_importacao = Column(DateTime(timezone=True), server_default=func.now())
    
    # Informações sobre a fonte
    arquivo_origem = Column(String(255))
    formato = Column(String(50))
    
    # Status e validação
    status = Column(String(50), default="completo")
    erros = Column(JSONB)
    avisos = Column(JSONB)
    
    # Dados adicionais
    dados_adicionais = Column(JSONB)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Metadata(tipo='{self.tipo}', data='{self.data_geracao}')>"
