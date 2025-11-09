/**
 * Serviço de Dados - SabiaR
 * Dados mockados para visão do diretor (sem backend)
 */

import dadosDashboard from "./dados_dashboard.json";
import { Turma, Aluno } from "./types/dashboard";

const dados = dadosDashboard as any;

// ========== DADOS GERAIS ==========

export function obterMetadata() {
  return dados.metadata;
}

export function obterResumoGeral() {
  return dados.resumo_geral;
}

export function obterClustersGlobais() {
  return dados.clusters_globais;
}

// ========== ALUNOS ==========

export function listarTodosAlunos(): Aluno[] {
  // Coleta todos os alunos de todos os clusters
  const alunos: Aluno[] = [];
  dados.clusters_globais.forEach((cluster: any) => {
    // Mapear campos do JSON para o formato esperado
    const alunosMapeados = cluster.alunos.map((aluno: any) => ({
      ...aluno,
      nota_media: aluno.media_geral || 0,
      frequencia_pct: aluno.frequencia_percentual || 0,
      nivel_desempenho:
        aluno.media_geral >= 7
          ? "Alto"
          : aluno.media_geral >= 4
          ? "Médio"
          : "Baixo",
      risco:
        aluno.media_geral < 4 || aluno.frequencia_percentual < 75
          ? "Alto"
          : "Baixo",
      trabalha: aluno.trabalha_fora || "Não",
    }));
    alunos.push(...alunosMapeados);
  });
  return alunos;
}

export function obterAluno(alunoId: number): Aluno | undefined {
  const todosAlunos = listarTodosAlunos();
  return todosAlunos.find((a) => a.id === alunoId);
}

export function listarAlunosPorCluster(clusterId: number): Aluno[] {
  const cluster = dados.clusters_globais.find(
    (c: any) => c.cluster_id === clusterId
  );
  if (!cluster) return [];

  return cluster.alunos.map((aluno: any) => ({
    ...aluno,
    nota_media: aluno.media_geral || 0,
    frequencia_pct: aluno.frequencia_percentual || 0,
    nivel_desempenho:
      aluno.media_geral >= 7
        ? "Alto"
        : aluno.media_geral >= 4
        ? "Médio"
        : "Baixo",
    risco:
      aluno.media_geral < 4 || aluno.frequencia_percentual < 75
        ? "Alto"
        : "Baixo",
    trabalha: aluno.trabalha_fora || "Não",
  }));
}

// ========== TURMAS ==========
// As turmas são criadas dinamicamente a partir dos alunos

let turmasCache: Turma[] | null = null;

function construirTurmas(): Turma[] {
  if (turmasCache) return turmasCache;

  const todosAlunos = listarTodosAlunos();
  const turmasMap = new Map<string, Aluno[]>();

  // Agrupar alunos por turma
  todosAlunos.forEach((aluno) => {
    const turmaId = aluno.turma;
    if (!turmasMap.has(turmaId)) {
      turmasMap.set(turmaId, []);
    }
    turmasMap.get(turmaId)!.push(aluno);
  });

  // Criar objetos de turma
  turmasCache = Array.from(turmasMap.entries()).map(([turmaId, alunos]) => {
    const mediaNotas =
      alunos.reduce((sum, a) => sum + a.nota_media, 0) / alunos.length;
    const frequenciaMedia =
      alunos.reduce((sum, a) => sum + a.frequencia_pct, 0) / alunos.length;

    // Estimar aprovação baseado em média e frequência
    const aprovacaoEstimada =
      (alunos.filter((a) => a.nota_media >= 5 && a.frequencia_pct >= 75)
        .length /
        alunos.length) *
      100;

    // Agrupar alunos em clusters para esta turma
    const clustersMap = new Map<number, Aluno[]>();
    alunos.forEach((aluno) => {
      if (!clustersMap.has(aluno.cluster_global)) {
        clustersMap.set(aluno.cluster_global, []);
      }
      clustersMap.get(aluno.cluster_global)!.push(aluno);
    });

    const clusters = Array.from(clustersMap.entries()).map(
      ([clusterId, alunosCluster]) => {
        const clusterGlobal = dados.clusters_globais.find(
          (c: any) => c.cluster_id === clusterId
        );
        return {
          cluster_id: clusterId,
          total_alunos: alunosCluster.length,
          percentual: (alunosCluster.length / alunos.length) * 100,
          caracteristicas: clusterGlobal?.caracteristicas || {
            media_notas: 0,
            renda_media: 0,
            pct_trabalha: 0,
            tempo_desl_medio: 0,
            pct_pretos_pardos: 0,
            pct_inseg_alimentar: 0,
          },
          features_relevantes: clusterGlobal?.features_relevantes || [],
        };
      }
    );

    return {
      turma_id: turmaId,
      nome: turmaId,
      serie: alunos[0]?.serie || "1º Ano",
      total_alunos: alunos.length,
      estatisticas: {
        media_notas: mediaNotas,
        frequencia_media: frequenciaMedia,
        aprovacao_estimada: aprovacaoEstimada,
      },
      clusters: clusters,
      alunos: alunos,
    };
  });

  return turmasCache;
}

export function listarTurmas(): Turma[] {
  return construirTurmas();
}

export function obterTurma(turmaId: string): Turma | undefined {
  return construirTurmas().find((t) => t.turma_id === turmaId);
}

export function obterTurmaPorNome(nome: string): Turma | undefined {
  return construirTurmas().find((t) => t.nome === nome);
}

export function listarAlunosPorTurma(turmaId: string): Aluno[] {
  const turma = obterTurma(turmaId);
  return turma?.alunos || [];
}

// ========== ESTATÍSTICAS ==========

export function obterEstatisticasGerais() {
  const { metadata, resumo_geral } = dados;

  return {
    totalAlunos: metadata.total_alunos,
    totalTurmas: metadata.total_turmas,
    alunosRiscoAlto: resumo_geral.alunos_risco_alto,
    mediaGeral: resumo_geral.por_faixa
      .reduce(
        (sum: number, faixa: any) =>
          sum + (faixa.intervalo_notas.media * faixa.percentual) / 100,
        0
      )
      .toFixed(2),
    distribuicaoPorFaixa: resumo_geral.por_faixa,
    fatoresCriticos: resumo_geral.fatores_criticos,
  };
}
