# Guia de Design - SabiaR

## 📛 Sobre o Nome

**SabiaR** = **Sabiá** (pássaro) + **Saber** (conhecimento) + **R de Reconhecimento** (IA)

O "R" é destacado em laranja para enfatizar nossa tecnologia de Reconhecimento inteligente.

## 🎨 Paleta de Cores

A paleta de cores do Sabiar é baseada no design do passarinho (logo):

### Cores Principais

| Cor                | Hex       | Uso                                          | Classe Tailwind                  |
| ------------------ | --------- | -------------------------------------------- | -------------------------------- |
| **Azul Petróleo**  | `#294f5c` | Cor primária, Área do Aluno, elementos frios | `bg-primary`, `text-primary`     |
| **Laranja Sabiar** | `#d1663d` | Cor secundária, Área do Professor, destaques | `bg-secondary`, `text-secondary` |

### Como Usar

#### Opção 1: Classes Tailwind (Recomendado)

```tsx
// Azul Petróleo (Alunos)
<Button className="bg-primary">Botão Área do Aluno</Button>
<div className="text-primary">Texto azul petróleo</div>

// Laranja (Professores)
<Button variant="secondary">Botão Área do Professor</Button>
<div className="text-secondary">Texto laranja</div>

// Background com opacidade
<div className="bg-primary/10">Background azul sutil (aluno)</div>
<div className="bg-secondary/20">Background laranja sutil (professor)</div>
```

#### Opção 2: Direto do arquivo (quando necessário)

```tsx
import { sabiarColors } from "@/lib/colors";

<div style={{ backgroundColor: sabiarColors.orange }}>Conteúdo</div>;
```

## 🎭 Temas

O projeto suporta **dark mode** automático. As cores se ajustam:

- **Light Mode**: Cores mais escuras e vibrantes
- **Dark Mode**: Cores mais claras e suaves para melhor contraste

## 📊 Gráficos

Os gráficos (Recharts) usam a paleta Sabiar automaticamente:

- `--chart-1`: Laranja (#d1663d)
- `--chart-2`: Azul Petróleo (#294f5c)
- `--chart-3`: Azul médio
- `--chart-4`: Laranja claro
- `--chart-5`: Azul escuro

## 🧩 Componentes com Cor

### Área do Professor

- Cor principal: **Laranja Sabiar** (`secondary`) 🟠
- Ícone: `IconUserCircle`
- Representa o calor e energia do ensino

### Área do Aluno

- Cor principal: **Azul Petróleo** (`primary`) 🔵
- Ícone: `IconSchool`
- Representa o aprendizado e crescimento

## 🖼️ Assets

- **Logo**: `/sabiar_icon.png` (ícone do passarinho)
- Tamanho recomendado no header: 40x40px

## 💡 Dicas

1. Use `bg-secondary` (laranja 🟠) para elementos relacionados ao **professor**
2. Use `bg-primary` (azul 🔵) para elementos relacionados ao **aluno**
3. Para hover states, adicione opacidade: `hover:bg-primary/20` ou `hover:bg-secondary/20`
4. Para borders: `border-primary` (azul) ou `border-secondary` (laranja)
5. No header: botão professor = laranja, botão aluno = azul outline
