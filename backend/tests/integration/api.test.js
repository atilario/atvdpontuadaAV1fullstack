const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/db');

describe('API RESTful - Testes de Integração e Rastreabilidade ISO 25010', () => {
  let authToken = '';

  afterAll(async () => {
    // Limpeza de registros de teste e encerramento do pool
    await db.query("DELETE FROM municipios WHERE nome LIKE 'Teste Automatizado%'");
    await db.pool.end();
  });

  describe('1. Healthcheck e Rastreabilidade', () => {
    test('GET /api/health deve responder status 200 com status UP', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('UP');
    });
  });

  describe('2. Autenticação JWT e Segurança (RNF04)', () => {
    test('POST /api/auth/login deve autenticar com sucesso o usuário demo admin', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@cimatec.br', senha: 'admin123' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.usuario.email).toBe('admin@cimatec.br');
      authToken = res.body.token;
    });

    test('GET /api/auth/me deve retornar os dados do usuário autenticado', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('admin@cimatec.br');
    });

    test('POST /api/auth/login deve rejeitar autenticação com senha inválida', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@cimatec.br', senha: 'senha_errada' });

      expect(res.status).toBe(401);
      expect(res.body.erro).toBe('Credenciais inválidas');
    });
  });

  describe('3. Gestão de Municípios (RF01)', () => {
    let municipioCriadoId = null;

    test('GET /api/municipios deve listar municípios', async () => {
      const res = await request(app).get('/api/municipios');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });

    test('POST /api/municipios deve cadastrar novo município com token JWT', async () => {
      const res = await request(app)
        .post('/api/municipios')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Teste Automatizado Semiárido',
          uf: 'BA',
          populacao: 35000,
          idh: 0.690,
          latitude: -11.5000,
          longitude: -41.2000,
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      municipioCriadoId = res.body.id;
    });

    test('GET /api/municipios/:id deve retornar o município criado', async () => {
      const res = await request(app).get(`/api/municipios/${municipioCriadoId}`);
      expect(res.status).toBe(200);
      expect(res.body.nome).toBe('Teste Automatizado Semiárido');
    });

    test('PUT /api/municipios/:id deve atualizar o município', async () => {
      const res = await request(app)
        .put(`/api/municipios/${municipioCriadoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Teste Automatizado Semiárido Atualizado',
          uf: 'BA',
          populacao: 36000,
          idh: 0.705,
          latitude: -11.5000,
          longitude: -41.2000,
        });

      expect(res.status).toBe(200);
      expect(res.body.populacao).toBe(36000);
    });

    test('DELETE /api/municipios/:id deve deletar o município de teste', async () => {
      const res = await request(app)
        .delete(`/api/municipios/${municipioCriadoId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.mensagem).toBe('Município removido com sucesso');
    });
  });

  describe('4. Critérios e Validação de Pesos (RF02, RF03)', () => {
    test('GET /api/criterios deve listar os critérios oficiais', async () => {
      const res = await request(app).get('/api/criterios');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(5);
    });

    test('PUT /api/criterios/pesos deve atualizar pesos com validação de soma = 1.0', async () => {
      const res = await request(app)
        .put('/api/criterios/pesos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          pesos: [
            { id: 1, peso: 0.20 },
            { id: 2, peso: 0.20 },
            { id: 3, peso: 0.15 },
            { id: 4, peso: 0.25 },
            { id: 5, peso: 0.20 },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.mensagem).toBe('Pesos atualizados com sucesso');
    });
  });

  describe('5. Execução do TOPSIS e Relatórios (RF04, RF05, RF06, RF10, RNF01)', () => {
    let simulacaoId = null;

    test('POST /api/topsis/executar deve processar algoritmo e retornar ranking ordenado', async () => {
      const res = await request(app)
        .post('/api/topsis/executar')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          salvarNoHistorico: true,
          descricao: 'Simulação de Teste Automatizado',
        });

      expect(res.status).toBe(200);
      expect(res.body.sucesso).toBe(true);
      expect(res.body.ranking.length).toBeGreaterThanOrEqual(3);
      expect(res.body.tempoExecucaoMs).toBeLessThan(3000); // RNF01
      simulacaoId = res.body.simulacaoId;
    });

    test('GET /api/topsis/simulacoes deve listar histórico de simulações', async () => {
      const res = await request(app).get('/api/topsis/simulacoes');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    test('GET /api/topsis/simulacoes/:id deve buscar simulação detalhada', async () => {
      const res = await request(app).get(`/api/topsis/simulacoes/${simulacaoId}`);
      expect(res.status).toBe(200);
      expect(res.body.simulacao).toBeDefined();
      expect(res.body.ranking).toBeDefined();
    });

    test('GET /api/relatorios/simulacoes/:id/csv deve exportar CSV estruturado', async () => {
      const res = await request(app).get(`/api/relatorios/simulacoes/${simulacaoId}/csv`);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.text).toContain('Posicao,Municipio,UF,Coeficiente_Ci');
    });
  });
});
