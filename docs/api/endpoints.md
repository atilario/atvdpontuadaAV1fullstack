# Documentação de Endpoints da API RESTful

**Especificação Técnica OpenAPI 3.0 / Swagger**  
Servidor Local: `http://localhost:3001`  
Documentação Interativa: `http://localhost:3001/api-docs`  

---

## 1. Endpoints de Saúde e Autenticação

### `GET /api/health`
- **Descrição:** Verifica a disponibilidade e integridade da API.
- **Resposta 200 OK:**
  ```json
  {
    "status": "UP",
    "servico": "Plataforma TOPSIS de Vulnerabilidade Energética",
    "timestamp": "2026-09-25T14:46:12.646Z"
  }
  ```

### `POST /api/auth/login`
- **Descrição:** Autentica o usuário com hash bcrypt e emite token JWT.
- **Payload:**
  ```json
  {
    "email": "admin@cimatec.br",
    "senha": "admin123"
  }
  ```
- **Resposta 200 OK:**
  ```json
  {
    "mensagem": "Autenticado com sucesso",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "nome": "Administrador CIMATEC",
      "email": "admin@cimatec.br",
      "perfil": "admin"
    }
  }
  ```

---

## 2. Endpoints de Municípios e Alternativas

### `GET /api/municipios`
- **Descrição:** Lista todos os municípios cadastrados com dados geográficos e demográficos.

### `POST /api/municipios`
- **Header:** `Authorization: Bearer <token>`
- **Payload:**
  ```json
  {
    "nome": "Irecê",
    "uf": "BA",
    "populacao": 74500,
    "idh": 0.689,
    "latitude": -11.3000,
    "longitude": -41.8500
  }
  ```

---

## 3. Endpoints do Algoritmo TOPSIS

### `GET /api/criterios`
- **Descrição:** Retorna os critérios oficiais cadastrados, seus tipos (`beneficio` ou `custo`) e unidades.

### `PUT /api/criterios/pesos`
- **Header:** `Authorization: Bearer <token>`
- **Descrição:** Atualiza os pesos dos critérios (soma deve ser igual a 1,0).

### `POST /api/topsis/executar`
- **Descrição:** Executa a normalização vetorial, soluções ideais $A^+$ e $A^-$, distâncias Euclidianas e ranking final ordenado por $C_i$.
- **Payload (Opcional):**
  ```json
  {
    "pesosCustomizados": [0.20, 0.20, 0.15, 0.25, 0.20],
    "salvarNoHistorico": true,
    "descricao": "Simulação de Avaliação Regional"
  }
  ```
- **Resposta 200 OK:**
  ```json
  {
    "sucesso": true,
    "tempoExecucaoMs": 14,
    "simulacaoId": 1,
    "solucaoIdealPositiva": [...],
    "solucaoIdealNegativa": [...],
    "ranking": [
      {
        "id": 2,
        "nome": "Município B (Polo Solar)",
        "uf": "BA",
        "ci": 0.748215,
        "distanciaPositiva": 0.034521,
        "distanciaNegativa": 0.102654,
        "posicao": 1,
        "latitude": -9.4167,
        "longitude": -40.5000
      }
    ]
  }
  ```

### `GET /api/relatorios/simulacoes/:id/csv`
- **Descrição:** Gera e faz download do arquivo CSV estruturado correspondente à simulação selecionada.
