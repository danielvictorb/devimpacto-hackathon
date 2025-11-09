import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()

# Substitua pela sua chave de API da OCR.Space
API_KEY = os.getenv('OCR_SPACE_API_KEY')

# Caminho do arquivo da prova (a imagem que você enviou)
filename = "image.png"

# Parâmetros da requisição
payload = {
    'isOverlayRequired': False,     # Se quiser coordenadas, troque para True
    'apikey': API_KEY,
    'language': 'por',              # Idioma do texto esperado (português)
}

# Fazendo a requisição
with open(filename, 'rb') as f:
    response = requests.post(
        'https://api.ocr.space/parse/image',
        files={'filename': f},
        data=payload,
    )

# Decodifica o JSON de resposta
result = response.json()

# Mostra o resultado completo
print(json.dumps(result, indent=4, ensure_ascii=False))

# Texto extraído
if result.get("ParsedResults"):
    text = result["ParsedResults"][0]["ParsedText"]
    print("\n--- TEXTO DETECTADO ---\n")
    print(text)
