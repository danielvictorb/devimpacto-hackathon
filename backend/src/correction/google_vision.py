import os
import base64
import requests
from pathlib import Path
from typing import List
from dotenv import load_dotenv

load_dotenv()

GOOGLE_VISION_API_KEY = os.getenv('GOOGLE_VISION_API')
API_URL = f"https://vision.googleapis.com/v1/images:annotate?key={GOOGLE_VISION_API_KEY}"

# Extensões de imagem suportadas
SUPPORTED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.tif'}


def transcrever_imagem(image_path: str) -> str:
    """Envia uma imagem e retorna o texto transcrito."""
    # Lê e converte a imagem para base64
    with open(image_path, 'rb') as f:
        image_base64 = base64.b64encode(f.read()).decode('utf-8')
    
    # Faz a requisição
    payload = {
        "requests": [{
            "image": {"content": image_base64},
            "features": [{"type": "TEXT_DETECTION"}]
        }]
    }
    
    response = requests.post(API_URL, json=payload)
    response.raise_for_status()
    
    result = response.json()
    if 'error' in result:
        raise Exception(f"Erro: {result['error']}")
    
    # Extrai o texto
    if 'responses' in result and result['responses']:
        annotations = result['responses'][0].get('textAnnotations', [])
        if annotations:
            return annotations[0].get('description', '')
    
    return ''


def transcrever_diretorio(directory_path: str) -> str:
    """
    Processa todas as imagens em um diretório e retorna o texto OCR concatenado.
    A função de limpeza (parse_ocr_text) vai lidar com a organização.
    
    Args:
        directory_path: Caminho para o diretório contendo as imagens
        
    Returns:
        String com todo o texto OCR concatenado de todas as imagens
    """
    dir_path = Path(directory_path)
    
    if not dir_path.exists():
        raise FileNotFoundError(f"Diretório não encontrado: {directory_path}")
    
    if not dir_path.is_dir():
        raise NotADirectoryError(f"O caminho não é um diretório: {directory_path}")
    
    # Lista todos os arquivos de imagem no diretório
    image_files: List[Path] = []
    for file in sorted(dir_path.iterdir()):
        if file.is_file() and file.suffix.lower() in SUPPORTED_EXTENSIONS:
            image_files.append(file)
    
    if not image_files:
        print(f"⚠️  Nenhuma imagem encontrada em: {directory_path}")
        return ""
    
    print(f"📁 Encontradas {len(image_files)} imagem(ns) para processar")
    
    # Processa cada imagem e concatena diretamente
    textos = []
    
    for idx, image_file in enumerate(image_files, 1):
        try:
            print(f"📄 Processando [{idx}/{len(image_files)}]: {image_file.name}")
            texto = transcrever_imagem(str(image_file))
            
            if texto:
                textos.append(texto)
                print(f"   ✅ Extraídos {len(texto)} caracteres")
            else:
                print(f"   ⚠️  Nenhum texto encontrado")
                
        except Exception as e:
            print(f"   ❌ Erro ao processar {image_file.name}: {e}")
            continue
    
    resultado = "\n".join(textos)
    print(f"\n✅ OCR completo: {len(resultado)} caracteres totais")
    
    return resultado

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        # Modo diretório
        directory = sys.argv[1]
        print(f"🔍 Processando diretório: {directory}")
        try:
            texto_completo = transcrever_diretorio(directory)
            print("\n" + "="*60)
            print("RESULTADO FINAL:")
            print("="*60)
            print(texto_completo)
        except Exception as e:
            print(f"❌ Erro: {e}")
    else:
        # Modo padrão - teste com uma imagem
        imagem = "redacao.jpg"
        print(f"🔍 Processando imagem única: {imagem}")
        try:
            texto = transcrever_imagem(imagem)
            print(texto)
        except Exception as e:
            print(f"❌ Erro: {e}")
        
        print("\n💡 Dica: Para processar um diretório, use:")
        print(f"   python {__file__} backend/src/temp")
