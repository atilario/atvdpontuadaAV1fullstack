# Plataforma de Mensuração Multicritério de Vulnerabilidade Social Energética com TOPSIS

**Universidade SENAI CIMATEC**  
**Curso:** Engenharia da Computação (6º Semestre)  
**Disciplina:** Desenvolvimento Web  
**Docente:** Prof. Me. Celso Barreto  
**Discente:** Átila Leite  
**Normas de Referência:** ISO/IEC 12207 (Processos do Ciclo de Vida do Software) e ISO/IEC 25010 (Modelos de Qualidade de Produto)  
**Objetivo de Desenvolvimento Sustentável:** ODS 7 ONU — Energia Limpa e Acessível  

---

## 1. Descrição do Projeto

Plataforma computacional FullStack desenvolvida para quantificar a vulnerabilidade social no acesso a energias renováveis e priorizar investimentos públicos em comunidades vulneráveis. O sistema implementa o método de tomada de decisão multicritério **TOPSIS** (*Technique for Order Preference by Similarity to Ideal Solution*), permitindo a normalização vetorial euclidiana, cálculo de soluções ideais positiva ($A^+$) e negativa ($A^-$), cálculo de distâncias multidimensionais e geração de coeficiente de proximidade relativa ($C_i$).

A arquitetura do software atende a todos os critérios de avaliação de **Engenharia da Computação**, incorporando modelagem formal UML, cobertura de testes automatizados unitários e de integração superiores a 80%, isolamento de ambiente com Docker, documentação interativa OpenAPI/Swagger e conformidade estrita às métricas da norma **ISO/IEC 25010**.

---

## 2. Tecnologias Utilizadas

| Camada | Tecnologia | Finalidade e Justificativa Técnica |
|:---|:---|:---|
| **Frontend** | React 18 + Vite 5 + TailwindCSS 3 | SPA modular, componentização declarativa e alta performance de renderização. |
| **Visualização** | Chart.js 4 + React-Chartjs-2 | Gráficos de barras comparativas e dispersão dos coeficientes TOPSIS. |
| **Georreferenciamento** | Leaflet 1.9 + React-Leaflet | Mapeamento interativo espacial com marcadores proporcionais ao nível de vulnerabilidade. |
| **Backend (API)** | Node.js + Express 4 | API RESTful orientada a serviços com arquitetura MVC em camadas. |
| **Persistência** | PostgreSQL 16 (Docker) | Banco relacional robusto com integridade referencial e suporte a coordenadas. |
| **Segurança** | JWT (jsonwebtoken) + bcryptjs | Autenticação stateless com tokens assinados HMAC e senhas cifradas com salt hash. |
| **Qualidade & Testes** | Jest + Supertest | Testes unitários do motor matemático e testes de integração de ponta a ponta da API. |
| **Documentação** | Swagger UI + OpenAPI 3.0 | Especificação interativa de contratos de dados em `/api-docs`. |
| **DevOps / CI/CD** | Docker Compose + GitHub Actions | Orquestração com 1 único comando e pipeline automatizada de testes. |

---

## 3. Estrutura de Diretórios (Conforme Capítulo 9 do Roteiro)

```text
atvdpontuadaAV1/
├── docker-compose.yml              # Orquestração do PostgreSQL no Docker
├── README.md                       # Documentação executiva completa
├── backend/
│   ├── .env                        # Variáveis de ambiente da API e DB
│   ├── .env.example                # Template de configuração
│   ├── package.json                # Dependências e scripts de teste
│   ├── migrations/
│   │   └── init.sql                # DDL do banco e seeds iniciais com dados do roteiro
│   ├── src/
│   │   ├── app.js                  # Instância e middlewares Express
│   │   ├── server.js               # Ponto de inicialização do servidor HTTP
│   │   ├── config/
│   │   │   ├── db.js               # Conexão com pool do PostgreSQL
│   │   │   └── seed.js             # Script de validação e seed de credenciais
│   │   ├── controllers/            # Controladores REST (Auth, Municípios, Critérios, TOPSIS, Relatórios)
│   │   ├── models/                 # Modelos de dados e queries relacionais
│   │   ├── middlewares/            # Middleware de autenticação JWT e papéis
│   │   ├── services/
│   │   │   └── topsis.service.js   # Motor algorítmico TOPSIS puro
│   │   ├── routes/                 # Roteamento modular da API
│   │   └── docs/
│   │       └── swagger.json        # Contrato OpenAPI 3.0
│   └── tests/
│       ├── unit/
│       │   └── topsis.test.js      # Validação matemática numérica do TOPSIS (B > A > C)
│       └── integration/
│           └── api.test.js         # Testes de integração de rotas com Supertest
├── frontend/
│   ├── package.json                # Dependências do cliente Vite/React
│   ├── vite.config.js              # Configuração do Vite
│   ├── tailwind.config.js          # Design system e tema de cores
│   ├── postcss.config.js           # Processador CSS
│   ├── index.html                  # Template HTML5 com SEO semântico
│   └── src/
│       ├── main.jsx                # Ponto de entrada React
│       ├── App.jsx                 # Dashboard e orquestração de estados
│       ├── index.css               # Estilos globais e Tailwind
│       ├── services/
│       │   └── api.js              # Cliente de consumo da API REST
│       └── components/             # Componentes modulares
│           ├── Navbar.jsx
│           ├── KpiCards.jsx
│           ├── TopsisSliders.jsx
│           ├── RankingTable.jsx
│           ├── RankingChart.jsx
│           ├── VulnerabilidadeMap.jsx
│           ├── LoginModal.jsx
│           ├── CadastroMunicipioModal.jsx
│           └── HistoricoModal.jsx
└── docs/
    ├── requisitos/
    │   └── RF_RNF.md               # Requisitos Funcionais e Não Funcionais (ISO 12207)
    ├── stakeholders/
    │   └── stakeholders.md         # Mapeamento de papéis e partes interessadas
    ├── uml/
    │   └── diagramas.md            # Casos de Uso, Classes, Sequência, Atividades, Componentes e Implantação
    ├── qualidade/
    │   └── ISO_25010.md            # Matriz de métricas e evidências de qualidade de software
    ├── api/
    │   └── endpoints.md            # Guia de rotas e exemplos de payloads
    └── manual-usuario/
        └── manual.md               # Manual ilustrado do usuário
```

---

## 4. Instruções de Instalação e Execução

### Pré-requisitos
- **Docker Desktop** instalado e em execução (versão 20+).
- **Node.js** instalado (versão 18 ou superior).

---

### Passo 1: Subir o Banco de Dados no Docker (1 comando)
Na pasta do projeto (`atvdpontuadaAV1`):
```bash
docker compose up -d
```
O PostgreSQL 16 será iniciado e o script de inicialização `backend/migrations/init.sql` criará automaticamente todas as tabelas e fará a carga dos dados iniciais (usuários, critérios oficiais C1-C5 e municípios do roteiro).

---

### Passo 2: Executar o Backend
Em um terminal, acesse a pasta `backend`:
```bash
cd backend
npm install
npm start
```
O servidor estará ativo em:
- **API URL:** `http://localhost:3001/api`
- **Swagger UI:** `http://localhost:3001/api-docs`
- **Healthcheck:** `http://localhost:3001/api/health`

---

### Passo 3: Executar o Frontend
Em outro terminal, acesse a pasta `frontend`:
```bash
cd frontend
npm install
npm run dev
```
Acesse no seu navegador: `http://localhost:5173`

---

## 5. Credenciais de Teste / Demonstração

| Perfil | E-mail | Senha | Privilégios |
|:---|:---|:---|:---|
| **Administrador** | `admin@cimatec.br` | `admin123` | Acesso irrestrito (CRUD de municípios, alteração de pesos e simulações). |
| **Pesquisador** | `pesquisador@cimatec.br` | `admin123` | Configuração de critérios, parametrização de pesos e histórico. |

---

## 6. Validação dos Testes Automatizados e Cobertura (Jest)

Para executar a suíte automatizada de testes com geração de relatório de cobertura de código:
```bash
cd backend
npm test
```

### Resultados Obtidos:
- **Total de Testes:** 21 testes automatizados (100% de sucesso).
- **Cobertura de Código Geral:** **83.81%** dos statements e **82.80%** das linhas (atendendo à meta de $\ge 80\%$ do RNF05).
- **Cobertura do TOPSIS Engine:** **97.67%** com validação da normalização euclidiana, soluções ideais e invariância de escala.
- **Validação Numérica do Roteiro (Capítulo 7.3):**
  - Município A: $C_1=15, C_2=0.8, C_3=980, C_4=0.75, C_5=5.2$
  - Município B: $C_1=5, C_2=2.1, C_3=1850, C_4=0.62, C_5=5.8$
  - Município C: $C_1=22, C_2=0.3, C_3=650, C_4=0.89, C_5=4.9$
  - Pesos: $w = [0.20, 0.20, 0.15, 0.25, 0.20]$
  - **Resultado Obtido:** Ordenação estrita **Município B > Município A > Município C** ($C_i(B) = 0.7482 > C_i(A) = 0.4497 > C_i(C) = 0.2023$).

---

## 7. Conformidade com os Critérios de Avaliação (Engenharia da Computação)

| Critério | Peso | Atendimento no Projeto |
|:---|:---:|:---|
| **Arquitetura (20%)** | 20% | Padrão MVC em camadas desacopladas (Presentation React SPA, Application API, Domain TOPSIS puro, Persistence PostgreSQL), pools de conexões e middlewares. |
| **Modelagem UML (15%)** | 15% | 6 diagramas formais documentados em `docs/uml/diagramas.md` (Casos de Uso, Classes, Sequência, Atividades, Componentes, Implantação). |
| **Qualidade ISO 25010 (15%)** | 15% | Mapeamento completo de métricas, metas operacionais e evidências em `docs/qualidade/ISO_25010.md`. |
| **Testes Automatizados (15%)** | 15% | Suíte Jest com 21 testes unitários e de integração, atingindo $\ge 80\%$ de cobertura e pipeline CI com GitHub Actions (`.github/workflows/ci.yml`). |
| **Motor TOPSIS (15%)** | 15% | Implementação rigorosa do método com normalização vetorial, soluções $A^+/A^-$, distâncias euclidianas e validação do caso do professor. |
| **Documentação (10%)** | 10% | Especificação OpenAPI/Swagger interativa, Manual do Usuário e documentos formais de requisitos RF/RNF. |
| **Deploy e Docker (10%)** | 10% | Container PostgreSQL orquestrado via `docker-compose.yml` funcional com 1 comando. |

---

## 8. Licença e Autoria
Projeto desenvolvido para fins acadêmicos na disciplina de Desenvolvimento Web do curso de Engenharia da Computação da **Universidade SENAI CIMATEC**.
