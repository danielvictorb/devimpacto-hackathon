from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Dict, Any
import pandas as pd
import io
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))
from models.clustering_model import StudentClusteringModel


router = APIRouter(prefix="/clustering", tags=["Clustering"])

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

