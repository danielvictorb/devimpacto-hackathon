from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import io
import sys
import json
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))
from models.clustering_model import StudentClusteringModel

# Importar análise causal do mesmo diretório
from .causal_analysis import (
    analyze_causal_factors,
    load_dashboard_from_file,
    extract_relevant_data
)


router = APIRouter(prefix="/analysis", tags=["Analysis"])

MODEL_PATH = Path(__file__).parent.parent / "models" / "student_clustering_model.pkl"


class StudentData(BaseModel):
    ID: int
    Nome_Aluno: str
    Escola: str
    Serie: str
    Turma: str
    Genero: str
    Idade_Aluno: int
    Media_Geral: float
    Renda_Familiar: int
    Trabalha_Fora: str
    Tempo_Deslocamento_Min: int
    Cor_Raca: str
    Seguranca_Alimentar: str
    Acesso_Internet: str


class ClusterPrediction(BaseModel):
    student_id: int
    student_name: str
    cluster_id: int
    cluster_characteristics: Dict[str, Any]


class DashboardResponse(BaseModel):
    metadata: Dict[str, Any]
    resumo_geral: Dict[str, Any]
    clusters_globais: List[Dict[str, Any]]
    dados_por_turma: List[Dict[str, Any]]
    insights_principais: List[str]


def load_model() -> StudentClusteringModel:
    if not MODEL_PATH.exists():
        raise HTTPException(
            status_code=503,
            detail=f"Modelo não encontrado. Execute train_clustering.py primeiro."
        )
    
    try:
        model = StudentClusteringModel.load(str(MODEL_PATH))
        return model
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao carregar modelo: {str(e)}"
        )


@router.get("/")
async def clustering_health():
    try:
        model = load_model()
        return {
            "status": "healthy",
            "model_loaded": True,
            "n_clusters": model.n_clusters_global
        }
    except HTTPException as e:
        return {
            "status": "unhealthy",
            "model_loaded": False,
            "error": e.detail
        }


@router.post("/predict/single", response_model=ClusterPrediction)
async def predict_single_student(student: StudentData):
    try:
        model = load_model()
        student_dict = student.model_dump()
        df = pd.DataFrame([student_dict])
        cluster_id = model.predict_global(df)[0]
        
        return ClusterPrediction(
            student_id=student.ID,
            student_name=student.Nome_Aluno,
            cluster_id=int(cluster_id),
            cluster_characteristics={
                "cluster_id": int(cluster_id),
                "description": f"Cluster {cluster_id} - Padrões identificados pelo modelo"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar predição: {str(e)}"
        )


@router.post("/predict/batch")
async def predict_batch_students(students: List[StudentData]):
    try:
        model = load_model()
        students_dicts = [s.model_dump() for s in students]
        df = pd.DataFrame(students_dicts)
        clusters = model.predict_global(df)
        
        predictions = []
        for i, student in enumerate(students):
            predictions.append(
                ClusterPrediction(
                    student_id=student.ID,
                    student_name=student.Nome_Aluno,
                    cluster_id=int(clusters[i]),
                    cluster_characteristics={
                        "cluster_id": int(clusters[i]),
                        "description": f"Cluster {clusters[i]}"
                    }
                )
            )
        
        return predictions
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar predições em batch: {str(e)}"
        )


@router.post("/dashboard/generate", response_model=DashboardResponse)
async def generate_dashboard(students: List[StudentData]):
    try:
        model = load_model()
        students_dicts = [s.model_dump() for s in students]
        df = pd.DataFrame(students_dicts)
        dashboard_data = model.generate_dashboard_data(df)
        return dashboard_data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar dashboard: {str(e)}"
        )


@router.post("/dashboard/from-csv", response_model=DashboardResponse)
async def generate_dashboard_from_csv(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith('.csv'):
            raise HTTPException(
                status_code=400,
                detail="Arquivo deve ser CSV"
            )
        
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        model = load_model()
        dashboard_data = model.generate_dashboard_data(df)
        return dashboard_data
    except pd.errors.ParserError:
        raise HTTPException(
            status_code=400,
            detail="Erro ao processar CSV. Verifique o formato do arquivo."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar arquivo: {str(e)}"
        )


@router.get("/dashboard/example", response_model=DashboardResponse)
async def get_example_dashboard():
    example_path = Path(__file__).parent.parent / "models" / "dashboard_example.json"
    
    if not example_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Dashboard de exemplo não encontrado. Execute train_clustering.py primeiro."
        )
    
    try:
        import json
        with open(example_path, 'r', encoding='utf-8') as f:
            dashboard_data = json.load(f)
        return dashboard_data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao carregar dashboard de exemplo: {str(e)}"
        )


@router.get("/model/info")
async def get_model_info():
    try:
        model = load_model()
        return {
            "model_type": "K-Means Clustering",
            "n_clusters_global": model.n_clusters_global,
            "n_clusters_turma": model.n_clusters_turma,
            "features": model.feature_names,
            "model_path": str(MODEL_PATH),
            "model_exists": MODEL_PATH.exists()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao obter informações do modelo: {str(e)}"
        )


# =========================
# Análise Causal
# =========================

@router.post("/causal-analysis")
async def causal_analysis_from_dashboard(dashboard_data: Dict[str, Any], turma: Optional[str] = None):
    """
    Realiza análise causal completa a partir de dados do dashboard.
    
    Args:
        dashboard_data: Dados completos do dashboard JSON
        turma: Nome da turma específica (opcional). Se None, analisa todas as turmas.
    
    Returns:
        Análise causal completa com recomendações
    """
    try:
        resultado = analyze_causal_factors(dashboard_data, turma)
        
        # Salvar resultado em arquivo
        output_path = Path(__file__).parent.parent.parent / "utils" / "resultado_analise.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(resultado, f, ensure_ascii=False, indent=2)
        
        return resultado
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao realizar análise causal: {str(e)}"
        )


@router.get("/causal-analysis/turma/{turma_name}")
async def causal_analysis_by_turma(turma_name: str):
    """
    Realiza análise causal para uma turma específica usando dados do arquivo padrão.
    
    Args:
        turma_name: Nome da turma (ex: "1A", "2B")
    
    Returns:
        Análise causal completa da turma
    """
    try:
        # Carregar dados do arquivo padrão
        dashboard_path = Path(__file__).parent.parent.parent / "utils" / "dados_dashboard.json"
        
        if not dashboard_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Arquivo de dashboard não encontrado. Gere o dashboard primeiro."
            )
        
        dashboard_data = load_dashboard_from_file(str(dashboard_path))
        resultado = analyze_causal_factors(dashboard_data, turma=turma_name)
        
        # Salvar resultado em arquivo
        output_path = Path(__file__).parent.parent.parent / "utils" / "resultado_analise.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(resultado, f, ensure_ascii=False, indent=2)
        
        return resultado
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Arquivo de dashboard não encontrado."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao realizar análise causal: {str(e)}"
        )


@router.get("/causal-analysis/all")
async def causal_analysis_all_turmas(formato_relatorio: bool = False):
    """
    Realiza análise causal para todas as turmas usando dados do arquivo padrão.
    
    Args:
        formato_relatorio: Se True, gera relatório para diretor escolar (processa turma por turma)
    
    Returns:
        Análise causal completa de todas as turmas ou relatório consolidado
    """
    try:
        dashboard_path = Path(__file__).parent.parent.parent / "utils" / "dados_dashboard.json"
        
        if not dashboard_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Arquivo de dashboard não encontrado. Gere o dashboard primeiro."
            )
        
        dashboard_data = load_dashboard_from_file(str(dashboard_path))
        resultado = analyze_causal_factors(dashboard_data, turma=None, formato_relatorio=formato_relatorio)
        
        # Salvar resultado em arquivo
        if formato_relatorio:
            output_path = Path(__file__).parent.parent.parent / "utils" / "relatorio_diretor_escolar.json"
        else:
            output_path = Path(__file__).parent.parent.parent / "utils" / "resultado_analise.json"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(resultado, f, ensure_ascii=False, indent=2)
        
        return resultado
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Arquivo de dashboard não encontrado."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao realizar análise causal: {str(e)}"
        )


@router.get("/causal-analysis/extract-data")
async def extract_data_for_analysis(turma: Optional[str] = None):
    """
    Extrai dados relevantes para análise sem realizar a análise completa.
    Útil para debug e inspeção dos dados.
    
    Args:
        turma_name: Nome da turma específica (opcional)
    
    Returns:
        Dados extraídos e estruturados
    """
    try:
        dashboard_path = Path(__file__).parent.parent.parent / "utils" / "dados_dashboard.json"
        
        if not dashboard_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Arquivo de dashboard não encontrado."
            )
        
        dashboard_data = load_dashboard_from_file(str(dashboard_path))
        extracted = extract_relevant_data(dashboard_data, turma=turma)
        return extracted
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao extrair dados: {str(e)}"
        )

