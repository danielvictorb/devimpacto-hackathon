import pandas as pd
import numpy as np
import joblib
from pathlib import Path
from datetime import datetime
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from typing import Dict, List, Any, Tuple


class StudentClusteringModel:
    
    def __init__(self, n_clusters_global: int = 4, n_clusters_turma: int = 3):
        self.n_clusters_global = n_clusters_global
        self.n_clusters_turma = n_clusters_turma
        self.kmeans_global = None
        self.scaler_global = None
        self.feature_names = [
            'Media_Geral',
            'Renda_Familiar',
            'Trabalha_Num',
            'Tempo_Deslocamento_Min',
            'Cor_Raca_Num',
            'Seg_Alimentar_Num'
        ]
        
    def _prepare_features(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        
        if 'Trabalha_Num' not in df.columns:
            df['Trabalha_Num'] = (df['Trabalha_Fora'] == 'Sim').astype(int)
        
        if 'Tem_Internet_Num' not in df.columns:
            df['Tem_Internet_Num'] = df['Acesso_Internet'].apply(lambda x: 0 if x == 'Não' else 1)
        if 'Cor_Raca_Num' not in df.columns:
            raca_map = {'Branca': 0, 'Preta': 1, 'Parda': 1, 'Indígena': 1}
            df['Cor_Raca_Num'] = df['Cor_Raca'].map(raca_map)
        if 'Seg_Alimentar_Num' not in df.columns:
            seg_alim_map = {
                'Segura': 0,
                'Leve Insegurança': 1,
                'Moderada Insegurança': 2,
                'Grave Insegurança': 3
            }
            df['Seg_Alimentar_Num'] = df['Seguranca_Alimentar'].map(seg_alim_map)
        
        return df
    
    def train(self, df: pd.DataFrame) -> Dict[str, Any]:
        df = self._prepare_features(df)
        X_global = df[self.feature_names].fillna(0)
        
        self.scaler_global = StandardScaler()
        X_scaled = self.scaler_global.fit_transform(X_global)
        
        self.kmeans_global = KMeans(
            n_clusters=self.n_clusters_global,
            random_state=42,
            n_init=10,
            max_iter=300
        )
        clusters = self.kmeans_global.fit_predict(X_scaled)
        df['Cluster_Global'] = clusters
        
        inertia = self.kmeans_global.inertia_
        
        return {
            'n_clusters': self.n_clusters_global,
            'inertia': float(inertia),
            'n_samples': len(df),
            'features': self.feature_names,
            'trained_at': datetime.now().isoformat()
        }
    
    def predict_global(self, df: pd.DataFrame) -> np.ndarray:
        if self.kmeans_global is None or self.scaler_global is None:
            raise ValueError("Modelo não foi treinado. Execute train() primeiro.")
        
        df = self._prepare_features(df)
        X = df[self.feature_names].fillna(0)
        X_scaled = self.scaler_global.transform(X)
        
        return self.kmeans_global.predict(X_scaled)
    
    def train_turma_clusters(self, df: pd.DataFrame, turma: str) -> Tuple[KMeans, StandardScaler]:
        df_turma = df[df['Turma'] == turma].copy()
        
        if len(df_turma) < 2:
            return None, None
        
        df_turma = self._prepare_features(df_turma)
        X_turma = df_turma[self.feature_names].fillna(0)
        
        scaler_turma = StandardScaler()
        X_scaled = scaler_turma.fit_transform(X_turma)
        
        n_clusters = min(self.n_clusters_turma, len(df_turma) // 5)
        if n_clusters < 2:
            return None, None
        
        kmeans_turma = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        kmeans_turma.fit(X_scaled)
        
        return kmeans_turma, scaler_turma
    
    def generate_dashboard_data(self, df: pd.DataFrame) -> Dict[str, Any]:
        df = self._prepare_features(df)
        
        if 'Cluster_Global' not in df.columns:
            df['Cluster_Global'] = self.predict_global(df)
        
        def classificar_faixa(media):
            if media < 4:
                return 'Baixo (0-4)'
            elif media < 7:
                return 'Médio (4-7)'
            else:
                return 'Alto (7-10)'
        
        df['Faixa_Desempenho'] = df['Media_Geral'].apply(classificar_faixa)
        
        metadata = {
            'total_alunos': len(df),
            'total_turmas': df['Turma'].nunique(),
            'data_geracao': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        resumo_faixas = []
        for faixa in ['Baixo (0-4)', 'Médio (4-7)', 'Alto (7-10)']:
            alunos = df[df['Faixa_Desempenho'] == faixa]
            if len(alunos) > 0:
                resumo_faixas.append({
                    'faixa': faixa,
                    'intervalo_notas': {
                        'min': round(float(alunos['Media_Geral'].min()), 2),
                        'max': round(float(alunos['Media_Geral'].max()), 2),
                        'media': round(float(alunos['Media_Geral'].mean()), 2),
                        'mediana': round(float(alunos['Media_Geral'].median()), 2)
                    },
                    'total_alunos': len(alunos),
                    'percentual': round(len(alunos) / len(df) * 100, 1),
                    'pct_trabalha': round((alunos['Trabalha_Fora'] == 'Sim').sum() / len(alunos) * 100, 1),
                    'renda_media': round(float(alunos['Renda_Familiar'].mean()), 0),
                    'pct_pretos_pardos': round((alunos['Cor_Raca'].isin(['Preta', 'Parda', 'Indígena'])).sum() / len(alunos) * 100, 1)
                })
        
        fatores_criticos = {
            'trabalho': int((df['Trabalha_Fora'] == 'Sim').sum()),
            'baixa_renda': int((df['Renda_Familiar'] < 1500).sum()),
            'deslocamento_longo': int((df['Tempo_Deslocamento_Min'] > 60).sum()),
            'inseg_alimentar': int((df['Seguranca_Alimentar'] != 'Segura').sum()),
            'sem_internet': int((df['Acesso_Internet'] == 'Não').sum()),
            'pretos_pardos_indigenas': int((df['Cor_Raca'].isin(['Preta', 'Parda', 'Indígena'])).sum())
        }
        
        clusters_globais = []
        for cluster_id in range(self.n_clusters_global):
            cluster_alunos = df[df['Cluster_Global'] == cluster_id]
            
            if len(cluster_alunos) == 0:
                continue
            
            cluster_data = {
                'cluster_id': int(cluster_id),
                'total_alunos': len(cluster_alunos),
                'percentual': round(len(cluster_alunos) / len(df) * 100, 1),
                'caracteristicas': {
                    'media_notas': round(float(cluster_alunos['Media_Geral'].mean()), 2),
                    'renda_media': round(float(cluster_alunos['Renda_Familiar'].mean()), 0),
                    'pct_trabalha': round((cluster_alunos['Trabalha_Fora'] == 'Sim').sum() / len(cluster_alunos) * 100, 1),
                    'tempo_desl_medio': round(float(cluster_alunos['Tempo_Deslocamento_Min'].mean()), 0),
                    'pct_pretos_pardos': round((cluster_alunos['Cor_Raca'].isin(['Preta', 'Parda', 'Indígena'])).sum() / len(cluster_alunos) * 100, 1),
                    'pct_inseg_alimentar': round((cluster_alunos['Seguranca_Alimentar'] != 'Segura').sum() / len(cluster_alunos) * 100, 1)
                },
                'features_relevantes': self._generate_features_relevantes(cluster_alunos),
                'alunos': self._convert_alunos_to_dict(cluster_alunos)
            }
            
            clusters_globais.append(cluster_data)
        
        dados_por_turma = []
        for turma in sorted(df['Turma'].unique()):
            turma_data = self._generate_turma_data(df, turma)
            dados_por_turma.append(turma_data)
        
        insights_principais = [
            f"{fatores_criticos['pretos_pardos_indigenas']} alunos são pretos/pardos/indígenas ({round(fatores_criticos['pretos_pardos_indigenas']/len(df)*100, 1)}%)",
            f"{fatores_criticos['inseg_alimentar']} alunos em insegurança alimentar",
            f"{fatores_criticos['trabalho']} alunos trabalham fora da escola",
            f"{fatores_criticos['deslocamento_longo']} alunos com deslocamento > 60min",
            f"{fatores_criticos['sem_internet']} alunos sem acesso à internet"
        ]
        
        dashboard_data = {
            'metadata': metadata,
            'resumo_geral': {
                'por_faixa': resumo_faixas,
                'fatores_criticos': fatores_criticos,
                'alunos_risco_alto': int((df['Media_Geral'] < 3).sum())
            },
            'clusters_globais': clusters_globais,
            'dados_por_turma': dados_por_turma,
            'insights_principais': insights_principais
        }
        
        return dashboard_data
    
    def _generate_features_relevantes(self, cluster_df: pd.DataFrame) -> List[str]:
        features = []
        
        media = cluster_df['Media_Geral'].mean()
        pct_trabalha = (cluster_df['Trabalha_Fora'] == 'Sim').sum() / len(cluster_df) * 100
        renda = cluster_df['Renda_Familiar'].mean()
        
        if media < 3:
            features.append(f"Desempenho crítico (média {round(media, 2)})")
        elif media < 5:
            features.append(f"Desempenho abaixo da média (média {round(media, 2)})")
        else:
            features.append(f"Bom desempenho (média {round(media, 2)})")
        
        if pct_trabalha > 70:
            features.append(f"{round(pct_trabalha)}% trabalha fora")
        
        if renda < 1500:
            features.append(f"Renda média baixa (R${int(renda)})")
        
        return features[:3]
    
    def _convert_alunos_to_dict(self, alunos_df: pd.DataFrame) -> List[Dict[str, Any]]:
        alunos_list = []
        
        for _, aluno in alunos_df.iterrows():
            aluno_dict = {
                'id': int(aluno['ID']),
                'escola': aluno['Escola'],
                'endereco_escola': aluno.get('Endereco_Escola', ''),
                'serie': aluno['Serie'],
                'turma': aluno['Turma'],
                'nome_aluno': aluno['Nome_Aluno'],
                'genero': aluno['Genero'],
                'idade_aluno': int(aluno['Idade_Aluno']),
                'cpf_aluno': aluno.get('CPF_Aluno', ''),
                'telefone_aluno': aluno.get('Telefone_Aluno', ''),
                'endereco_completo': aluno.get('Endereco_Completo', ''),
                'municipio': aluno.get('Municipio', ''),
                'uf': aluno.get('UF', ''),
                'cep': aluno.get('CEP', ''),
                'deficiencia': aluno.get('Deficiencia', ''),
                'nome_responsavel': aluno.get('Nome_Responsavel', ''),
                'parentesco': aluno.get('Parentesco', ''),
                'cpf_responsavel': aluno.get('CPF_Responsavel', ''),
                'telefone_responsavel': aluno.get('Telefone_Responsavel', ''),
                'protocolo': aluno.get('Protocolo', ''),
                'status_matricula': aluno.get('Status_Matricula', ''),
                'renda_familiar': int(aluno['Renda_Familiar']),
                'tem_irmaos': aluno.get('Tem_Irmaos', ''),
                'numero_irmaos': int(aluno['Numero_Irmaos']) if pd.notna(aluno.get('Numero_Irmaos')) else 0,
                'idades_irmaos': aluno.get('Idades_Irmaos', '') if pd.notna(aluno.get('Idades_Irmaos')) else '',
                'trabalha_fora': aluno['Trabalha_Fora'],
                'horas_trabalho_semana': int(aluno['Horas_Trabalho_Semana']) if pd.notna(aluno.get('Horas_Trabalho_Semana')) else 0,
                'tipo_trabalho': aluno.get('Tipo_Trabalho', '') if pd.notna(aluno.get('Tipo_Trabalho')) else '',
                'tempo_deslocamento_min': int(aluno['Tempo_Deslocamento_Min']),
                'meio_transporte': aluno.get('Meio_Transporte', ''),
                'acesso_internet': aluno['Acesso_Internet'],
                'tem_computador': aluno.get('Tem_Computador', ''),
                'apoio_familiar_estudos': aluno.get('Apoio_Familiar_Estudos', ''),
                'faz_refeicao_escola': aluno.get('Faz_Refeicao_Escola', ''),
                'matematica_1bim': round(float(aluno.get('Matematica_1Bim', 0)), 2),
                'matematica_2bim': round(float(aluno.get('Matematica_2Bim', 0)), 2),
                'matematica_3bim': round(float(aluno.get('Matematica_3Bim', 0)), 2),
                'matematica_4bim': round(float(aluno.get('Matematica_4Bim', 0)), 2),
                'media_matematica': round(float(aluno.get('Media_Matematica', 0)), 2),
                'portugues_1bim': round(float(aluno.get('Portugues_1Bim', 0)), 2),
                'portugues_2bim': round(float(aluno.get('Portugues_2Bim', 0)), 2),
                'portugues_3bim': round(float(aluno.get('Portugues_3Bim', 0)), 2),
                'portugues_4bim': round(float(aluno.get('Portugues_4Bim', 0)), 2),
                'media_portugues': round(float(aluno.get('Media_Portugues', 0)), 2),
                'media_geral': round(float(aluno['Media_Geral']), 2),
                'frequencia_percentual': int(aluno.get('Frequencia_Percentual', 0)),
                'cor_raca': aluno['Cor_Raca'],
                'area_climatica': aluno.get('Area_Climatica', ''),
                'impacto_seca': aluno.get('Impacto_Seca', ''),
                'area_risco_ambiental': aluno.get('Area_Risco_Ambiental', 'Não') if pd.notna(aluno.get('Area_Risco_Ambiental')) else 'Não',
                'seguranca_trajeto': aluno.get('Seguranca_Trajeto', ''),
                'refeicoes_diarias': int(aluno.get('Refeicoes_Diarias', 0)),
                'seguranca_alimentar': aluno['Seguranca_Alimentar'],
                'ambiente_familiar': aluno.get('Ambiente_Familiar', ''),
                'responsabilidades_casa': aluno.get('Responsabilidades_Casa', '')
            }
            alunos_list.append(aluno_dict)
        
        return alunos_list
    
    def _generate_turma_data(self, df: pd.DataFrame, turma: str) -> Dict[str, Any]:
        df_turma = df[df['Turma'] == turma].copy()
        
        turma_data = {
            'turma': turma,
            'total_alunos': len(df_turma),
            'estatisticas_gerais': {
                'media_turma': round(float(df_turma['Media_Geral'].mean()), 2),
                'desvio_padrao': round(float(df_turma['Media_Geral'].std()), 2),
                'nota_minima': round(float(df_turma['Media_Geral'].min()), 2),
                'nota_maxima': round(float(df_turma['Media_Geral'].max()), 2),
                'pct_trabalha': round((df_turma['Trabalha_Fora'] == 'Sim').sum() / len(df_turma) * 100, 1),
                'renda_media': round(float(df_turma['Renda_Familiar'].mean()), 0),
                'pct_pretos_pardos': round((df_turma['Cor_Raca'].isin(['Preta', 'Parda', 'Indígena'])).sum() / len(df_turma) * 100, 1)
            },
            'distribuicao_faixas': {},
            'clusters_turma': []
        }
        
        for faixa in ['Baixo (0-4)', 'Médio (4-7)', 'Alto (7-10)']:
            count = (df_turma['Faixa_Desempenho'] == faixa).sum()
            turma_data['distribuicao_faixas'][faixa] = {
                'total': int(count),
                'percentual': round(count / len(df_turma) * 100, 1)
            }
        
        kmeans_turma, scaler_turma = self.train_turma_clusters(df, turma)
        
        if kmeans_turma is not None:
            df_turma = self._prepare_features(df_turma)
            X_turma = df_turma[self.feature_names].fillna(0)
            X_scaled = scaler_turma.transform(X_turma)
            clusters = kmeans_turma.predict(X_scaled)
            
            for cluster_id in range(kmeans_turma.n_clusters):
                cluster_alunos = df_turma.iloc[clusters == cluster_id]
                
                if len(cluster_alunos) == 0:
                    continue
                
                cluster_info = {
                    'cluster_id': int(cluster_id),
                    'total_alunos': len(cluster_alunos),
                    'intervalo_notas': {
                        'min': round(float(cluster_alunos['Media_Geral'].min()), 2),
                        'max': round(float(cluster_alunos['Media_Geral'].max()), 2),
                        'media': round(float(cluster_alunos['Media_Geral'].mean()), 2)
                    },
                    'caracteristicas': {
                        'renda_media': round(float(cluster_alunos['Renda_Familiar'].mean()), 0),
                        'pct_trabalha': round((cluster_alunos['Trabalha_Fora'] == 'Sim').sum() / len(cluster_alunos) * 100, 1),
                        'tempo_desl_medio': round(float(cluster_alunos['Tempo_Deslocamento_Min'].mean()), 0),
                    },
                    'features_relevantes': self._generate_features_relevantes(cluster_alunos),
                    'alunos': self._convert_alunos_to_dict(cluster_alunos)
                }
                
                turma_data['clusters_turma'].append(cluster_info)
        
        return turma_data
    
    def save(self, filepath: str = "models/student_clustering_model.pkl"):
        if self.kmeans_global is None or self.scaler_global is None:
            raise ValueError("Modelo não foi treinado. Execute train() primeiro.")
        
        model_data = {
            'kmeans_global': self.kmeans_global,
            'scaler_global': self.scaler_global,
            'feature_names': self.feature_names,
            'n_clusters_global': self.n_clusters_global,
            'n_clusters_turma': self.n_clusters_turma,
            'saved_at': datetime.now().isoformat()
        }
        
        Path(filepath).parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(model_data, filepath)
    
    @classmethod
    def load(cls, filepath: str = "models/student_clustering_model.pkl") -> 'StudentClusteringModel':
        model_data = joblib.load(filepath)
        
        model = cls(
            n_clusters_global=model_data['n_clusters_global'],
            n_clusters_turma=model_data['n_clusters_turma']
        )
        
        model.kmeans_global = model_data['kmeans_global']
        model.scaler_global = model_data['scaler_global']
        model.feature_names = model_data['feature_names']
        
        return model

