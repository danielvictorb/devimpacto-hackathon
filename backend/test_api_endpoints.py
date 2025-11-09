"""
Script de Teste Rápido - API Endpoints
Testa os principais endpoints da API
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")

def test_statistics_overview():
    """Testar estatísticas gerais"""
    print_section(" TESTANDO: Estatísticas Gerais")
    
    response = requests.get(f"{BASE_URL}/statistics/overview")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f" Total de Professores: {data['total_teachers']}")
        print(f" Total de Turmas: {data['total_classes']}")
        print(f" Total de Alunos: {data['total_students']}")
        print(f" Total de Provas: {data['total_exams']}")
    else:
        print(f" Erro: {response.text}")

def test_create_teacher():
    """Testar criação de professor"""
    print_section("‍ TESTANDO: Criar Professor")
    
    teacher_data = {
        "name": "Professor Teste",
        "email": f"teste_{datetime.now().timestamp()}@escola.com",
        "access_code": f"PROF{int(datetime.now().timestamp())}"
    }
    
    response = requests.post(f"{BASE_URL}/teachers/", json=teacher_data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 201:
        data = response.json()
        print(f" Professor criado: {data['name']}")
        print(f"   ID: {data['id']}")
        print(f"   Email: {data['email']}")
        return data['id']
    else:
        print(f" Erro: {response.text}")
        return None

def test_list_teachers():
    """Testar listagem de professores"""
    print_section(" TESTANDO: Listar Professores")
    
    response = requests.get(f"{BASE_URL}/teachers/")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f" Total de professores encontrados: {len(data)}")
        if data:
            print(f"   Primeiro professor: {data[0]['name']}")
    else:
        print(f" Erro: {response.text}")

def test_create_class(teacher_id):
    """Testar criação de turma"""
    print_section(" TESTANDO: Criar Turma")
    
    if not teacher_id:
        print(" Pulando teste - sem ID de professor")
        return None
    
    class_data = {
        "teacher_id": teacher_id,
        "name": f"Turma Teste {int(datetime.now().timestamp())}",
        "school_year": 2024
    }
    
    response = requests.post(f"{BASE_URL}/classes/", json=class_data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 201:
        data = response.json()
        print(f" Turma criada: {data['name']}")
        print(f"   ID: {data['id']}")
        return data['id']
    else:
        print(f" Erro: {response.text}")
        return None

def test_create_student(class_id):
    """Testar criação de aluno"""
    print_section("‍ TESTANDO: Criar Aluno")
    
    if not class_id:
        print(" Pulando teste - sem ID de turma")
        return None
    
    student_data = {
        "class_id": class_id,
        "name": "Aluno Teste",
        "access_code": f"AL{int(datetime.now().timestamp())}",
        "gender": "Masculino",
        "has_disability": False,
        "works_outside": False,
        "has_internet": True,
        "has_computer": True,
        "overall_average": 8.5,
        "attendance_percentage": 95.0,
        "enrollment_status": "active"
    }
    
    response = requests.post(f"{BASE_URL}/students/", json=student_data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 201:
        data = response.json()
        print(f" Aluno criado: {data['name']}")
        print(f"   ID: {data['id']}")
        print(f"   Média: {data['overall_average']}")
        return data['id']
    else:
        print(f" Erro: {response.text}")
        return None

def test_search_students():
    """Testar busca de alunos"""
    print_section(" TESTANDO: Buscar Alunos")
    
    response = requests.get(f"{BASE_URL}/search/students?limit=5")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f" Total de alunos encontrados: {len(data)}")
        if data:
            print(f"   Primeiro aluno: {data[0]['name']}")
    else:
        print(f" Erro: {response.text}")

def test_student_statistics(student_id):
    """Testar estatísticas de aluno"""
    print_section(" TESTANDO: Estatísticas do Aluno")
    
    if not student_id:
        print(" Pulando teste - sem ID de aluno")
        return
    
    response = requests.get(f"{BASE_URL}/statistics/students/{student_id}")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f" Estatísticas de: {data['student_name']}")
        print(f"   Provas feitas: {data['exams_taken']}")
        print(f"   Média geral: {data['overall_average']}")
        print(f"   Frequência: {data['attendance_percentage']}%")
    else:
        print(f" Erro: {response.text}")

def test_class_statistics(class_id):
    """Testar estatísticas de turma"""
    print_section(" TESTANDO: Estatísticas da Turma")
    
    if not class_id:
        print(" Pulando teste - sem ID de turma")
        return
    
    response = requests.get(f"{BASE_URL}/statistics/classes/{class_id}")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f" Estatísticas de: {data['class_name']}")
        print(f"   Total de alunos: {data['student_count']}")
        print(f"   Média da turma: {data['class_average']}")
        print(f"   Frequência média: {data['attendance_average']}%")
        print(f"   Distribuição de gênero: {data['gender_distribution']}")
    else:
        print(f" Erro: {response.text}")

def main():
    """Executar todos os testes"""
    print("\n" + "="*60)
    print("   INICIANDO TESTES DA API")
    print("="*60)
    
    try:
        # Testes básicos
        test_statistics_overview()
        test_list_teachers()
        
        # Criar dados de teste
        teacher_id = test_create_teacher()
        class_id = test_create_class(teacher_id)
        student_id = test_create_student(class_id)
        
        # Testes de busca e estatísticas
        test_search_students()
        test_student_statistics(student_id)
        test_class_statistics(class_id)
        
        print("\n" + "="*60)
        print("   TESTES CONCLUÍDOS!")
        print("="*60 + "\n")
        
    except requests.exceptions.ConnectionError:
        print("\n ERRO: Não foi possível conectar ao servidor.")
        print("   Certifique-se de que o servidor está rodando em http://localhost:8000")
        print("   Execute: uvicorn src.main:app --reload\n")
    except Exception as e:
        print(f"\n ERRO INESPERADO: {str(e)}\n")

if __name__ == "__main__":
    main()
