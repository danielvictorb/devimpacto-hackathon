export interface DadosDashboard {
  metadata: {
    total_alunos: number;
    total_turmas: number;
    data_geracao: string;
  };
  resumo_geral: {
    por_faixa: Array<{
      faixa: string;
      intervalo_notas: {
        min: number;
        max: number;
        media: number;
        mediana: number;
      };
      total_alunos: number;
      percentual: number;
      pct_trabalha: number;
      renda_media: number;
      pct_pretos_pardos: number;
    }>;
    fatores_criticos: {
      trabalho: number;
      baixa_renda: number;
      deslocamento_longo: number;
      inseg_alimentar: number;
      sem_internet: number;
      pretos_pardos_indigenas: number;
    };
    alunos_risco_alto: number;
  };
  clusters_globais: Array<{
    cluster_id: number;
    total_alunos: number;
    percentual: number;
    caracteristicas: {
      media_notas: number;
      renda_media: number;
      pct_trabalha: number;
      tempo_desl_medio: number;
      pct_pretos_pardos: number;
      pct_inseg_alimentar: number;
    };
    features_relevantes: string[];
    alunos: Aluno[];
  }>;
  turmas: Turma[];
}

export interface Aluno {
  id: number;
  escola: string;
  endereco_escola: string;
  serie: string;
  turma: string;
  nome_aluno: string;
  genero: string;
  idade_aluno: number;
  cpf_aluno: string;
  telefone_aluno: string;
  endereco_completo: string;
  municipio: string;
  uf: string;
  cep: string;
  deficiencia: string | null;
  nome_responsavel: string;
  parentesco: string;
  cpf_responsavel: string;
  telefone_responsavel: string;
  email_responsavel: string;
  renda_familiar: number;
  bolsa_familia: string;
  auxilio_brasil: string;
  tempo_deslocamento_min: number;
  meio_transporte: string;
  acesso_internet: string;
  tipo_moradia: string;
  num_comodos: number;
  inseguranca_alimentar: string;
  ativ_extraclasse: string;
  trabalha: string;
  hrs_trab_semana: number | null;
  apoio_estudos: string;
  nota_media: number;
  frequencia_pct: number;
  nivel_desempenho: string;
  risco: string;
  cluster_global: number;
}

export interface Turma {
  turma_id: string;
  nome: string;
  serie: string;
  total_alunos: number;
  estatisticas: {
    media_notas: number;
    frequencia_media: number;
    aprovacao_estimada: number;
  };
  clusters: Array<{
    cluster_id: number;
    total_alunos: number;
    percentual: number;
    caracteristicas: {
      media_notas: number;
      renda_media: number;
      pct_trabalha: number;
      tempo_desl_medio: number;
      pct_pretos_pardos: number;
      pct_inseg_alimentar: number;
    };
    features_relevantes: string[];
  }>;
  analise_causal?: {
    insights_principais: string[];
    recomendacoes: string[];
    fatores_impacto: Array<{
      fator: string;
      impacto: string;
      descricao: string;
    }>;
  };
  alunos: Aluno[];
}
