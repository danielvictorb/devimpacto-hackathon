import pandas as pd
import sys
import json
from pathlib import Path

sys.path.append(str(Path(__file__).parent))

from models.clustering_model import StudentClusteringModel


def train_model():
    data_path = Path(__file__).parent.parent / "research" / "dados_alunos.csv"
    
    if not data_path.exists():
        raise FileNotFoundError(f"Arquivo de dados não encontrado: {data_path}")
    
    df = pd.read_csv(data_path)
    model = StudentClusteringModel(n_clusters_global=4, n_clusters_turma=3)
    metrics = model.train(df)
    
    model_path = Path(__file__).parent / "models" / "student_clustering_model.pkl"
    model.save(str(model_path))
    
    dashboard_data = model.generate_dashboard_data(df)
    output_path = Path(__file__).parent / "models" / "dashboard_example.json"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(dashboard_data, f, ensure_ascii=False, indent=2)
    
    return {
        'model_path': str(model_path),
        'dashboard_path': str(output_path),
        'metrics': metrics
    }


if __name__ == "__main__":
    train_model()

