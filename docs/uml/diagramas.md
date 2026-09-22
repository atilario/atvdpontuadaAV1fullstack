# Modelagem UML Completa do Sistema

**Projeto:** Plataforma de Vulnerabilidade Social Energética com TOPSIS  
**Engenharia da Computação — Disciplina de Desenvolvimento Web**  

---

## 1. Diagrama de Casos de Uso

```mermaid
flowchart LR
    Admin((Administrador))
    Pesquisador((Pesquisador))
    Gestor((Gestor Público))

    subgraph Plataforma TOPSIS
        UC01[UC01 - Cadastrar / Manter Municípios]
        UC02[UC02 - Configurar Critérios e Pesos TOPSIS]
        UC03[UC03 - Executar Cálculo TOPSIS e Gerar Ranking]
        UC04[UC04 - Exportar Relatório PDF / CSV]
        UC05[UC05 - Autenticar Usuário via JWT]
        UC06[UC06 - Consultar Dashboard e Mapa Interativo]
    end

    Admin --> UC01
    Admin --> UC05
    Pesquisador --> UC02
    Pesquisador --> UC03
    Pesquisador --> UC05
    Pesquisador --> UC06
    Gestor --> UC03
    Gestor --> UC04
    Gestor --> UC06
    Gestor --> UC05

    UC03 ..> UC02 : <<include>>
```

### Especificação Textual dos Principais Casos de Uso:
- **UC01 - Cadastrar Município:**
  - *Ator:* Administrador
  - *Pré-condição:* Usuário autenticado
  - *Fluxo principal:*
    1. Ator seleciona "Novo Município";
    2. Sistema exibe formulário de entrada;
    3. Ator insere nome, UF, população, IDH e coordenadas geográficas;
    4. Sistema valida unicidade e consistência dos tipos;
    5. Sistema persiste na base de dados relacional e retorna código 201 com confirmação.
- **UC02 - Configurar Critérios TOPSIS:**
  - *Ator:* Pesquisador / Administrador
  - *Fluxo principal:*
    1. Ator ajusta sliders de pesos e tipos (`beneficio` ou `custo`);
    2. Sistema valida soma normalizada ($\sum w_j = 1,0$);
    3. Sistema atualiza parametrização da sessão de cálculo.
- **UC03 - Executar TOPSIS:**
  - *Ator:* Pesquisador / Gestor Público
  - *Fluxo principal:*
    1. Usuário clica em "Executar Simulação";
    2. Backend monta a matriz de decisão com os valores normalizados dos municípios;
    3. Motor calcula soluções ideais e coeficiente $C_i$;
    4. Backend persiste a simulação e os resultados no banco;
    5. Ranking ordenado decrescente é retornado para exibição.
- **UC04 - Exportar Relatório:**
  - *Ator:* Gestor Público
  - *Fluxo principal:* Usuário seleciona exportação em CSV ou impressão para relatório formal de apoio a políticas energéticas.

---

## 2. Diagrama de Classes

```mermaid
classDiagram
    class Usuario {
        +int id
        +string nome
        +string email
        +string senha_hash
        +string perfil
        +datetime created_at
        +validarSenha(senha) bool
        +gerarToken() string
    }

    class Municipio {
        +int id
        +string nome
        +string uf
        +int populacao
        +float idh
        +float latitude
        +float longitude
        +datetime created_at
    }

    class Criterio {
        +int id
        +string nome
        +string descricao
        +string tipo
        +float peso
        +string unidade
    }

    class MatrizDecisao {
        +int id
        +int municipio_id
        +int criterio_id
        +float valor
        +int ano_referencia
    }

    class SimulacaoTOPSIS {
        +int id
        +int usuario_id
        +datetime data_execucao
        +json parametros
        +string status
    }

    class ResultadoRanking {
        +int id
        +int simulacao_id
        +int municipio_id
        +float coeficiente_ci
        +float distancia_positiva
        +float distancia_negativa
        +int posicao
    }

    Usuario "1" --> "0..*" SimulacaoTOPSIS : executa
    Municipio "1" --> "1..*" MatrizDecisao : compõe
    Criterio "1" --> "1..*" MatrizDecisao : parametrizado por
    SimulacaoTOPSIS "1" --> "1..*" ResultadoRanking : gera
    Municipio "1" --> "0..*" ResultadoRanking : classificado em
```

---

## 3. Diagrama de Sequência — Execução do Algoritmo TOPSIS

```mermaid
sequenceDiagram
    autonumber
    actor User as Pesquisador / Gestor
    participant Front as Frontend (React SPA)
    participant API as API Express (Controller)
    participant Service as TOPSIS Service (Engine)
    participant DB as PostgreSQL (Database)

    User->>Front: Clica em "Executar Simulação TOPSIS"
    Front->>API: POST /api/topsis/executar {criterios, pesos} (Bearer Token)
    API->>API: Valida autorização JWT
    API->>DB: SELECT municípios, critérios e matriz de decisão
    DB-->>API: Retorna matriz de dados cadastrados
    API->>Service: calcularTOPSIS(matriz, pesos, tipos)
    Note over Service: 1. Normalização Vetorial Euclidiana<br/>2. Ponderação com pesos w_j<br/>3. Determinação de A+ e A-<br/>4. Cálculo das distâncias Euclidianas D+ e D-<br/>5. Coeficiente de proximidade C_i = D- / (D+ + D-)
    Service-->>API: Retorna ranking estruturado ordenado por C_i
    API->>DB: INSERT INTO simulacoes + INSERT INTO resultados_ranking
    DB-->>API: Confirmação de persistência transacional
    API-->>Front: HTTP 200 OK { simulacao_id, ranking: [...] }
    Front-->>User: Atualiza Dashboard, Gráficos (Chart.js) e Mapa (Leaflet)
```

---

## 4. Diagrama de Atividades — Ciclo de Decisão Multicritério

```mermaid
stateDiagram-v2
    [*] --> CarregarDados: Início
    CarregarDados --> SelecionarCriterios: Recuperar alternativas (municípios)
    SelecionarCriterios --> ValidarPesos: Configurar pesos w_j e tipos
    ValidarPesos --> NormalizarMatriz: Soma dos pesos = 1.0
    ValidarPesos --> ErroValidacao: Soma != 1.0
    ErroValidacao --> SelecionarCriterios: Notificar usuário
    NormalizarMatriz --> PonderarMatriz: r_ij = x_ij / sqrt(sum x_ij^2)
    PonderarMatriz --> DeterminarIdeais: v_ij = w_j * r_ij
    DeterminarIdeais --> CalcularDistancias: Identificar A+ (Ideal) e A- (Anti-ideal)
    CalcularDistancias --> CalcularCi: Distâncias Euclidianas D+ e D-
    CalcularCi --> OrdenarRanking: C_i = D- / (D+ + D-)
    OrdenarRanking --> SalvarResultados: Ordenar decrescente por C_i
    SalvarResultados --> ExibirInterface: Persistir simulação
    ExibirInterface --> [*]: Concluído
```

---

## 5. Diagrama de Componentes

```mermaid
flowchart TB
    subgraph FrontendSPA ["Frontend SPA (React + Vite)"]
        UI_Dash["Dashboard & KPIs"]
        UI_Map["Mapa Interativo (Leaflet)"]
        UI_Charts["Visualizador Gráfico (Chart.js)"]
        UI_Forms["Formulários & Sliders TOPSIS"]
        API_Client["API Client / Axios Service"]
    end

    subgraph BackendAPI ["Backend REST API (Node.js + Express)"]
        Auth_MW["Auth Middleware (JWT/bcrypt)"]
        Routers["Rotas REST (Municípios, Critérios, Simulações)"]
        Controllers["Controllers (MVC)"]
        Engine["TOPSIS Engine (Service puro)"]
        Repo["Data Access Layer (pg pool)"]
        Swagger["OpenAPI / Swagger UI"]
    end

    subgraph Persistence ["Camada de Persistência (Docker)"]
        Postgres[("PostgreSQL 16 + PostGIS")]
    end

    UI_Forms --> API_Client
    UI_Dash --> API_Client
    UI_Map --> API_Client
    UI_Charts --> API_Client

    API_Client -->|HTTP / JSON (REST)| Auth_MW
    Auth_MW --> Routers
    Routers --> Controllers
    Controllers --> Engine
    Controllers --> Repo
    Repo -->|TCP / SQL Connection Pool| Postgres
    Routers --> Swagger
```

---

## 6. Diagrama de Implantação

```mermaid
flowchart LR
    subgraph HostCliente ["Máquina Cliente (Browser)"]
        Browser["Navegador Web (Chrome / Firefox / Edge)"]
    end

    subgraph HostDocker ["Ambiente de Execução Local / Servidor (Docker Engine)"]
        subgraph NetApp ["Rede Docker Interna (app-network)"]
            NodeSrv["Container Backend (Node.js API - Porta 3001)"]
            PostgresSrv["Container DB (PostgreSQL 16 - Porta 5432)"]
            VolumeData[("Volume Docker: pgdata")]
        end
    end

    Browser -->|HTTP: 5173| ViteDev["Frontend Vite Dev Server (React)"]
    Browser -->|HTTP: 3001| NodeSrv
    NodeSrv -->|TCP 5432| PostgresSrv
    PostgresSrv --- VolumeData
```
