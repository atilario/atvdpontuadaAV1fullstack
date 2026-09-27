const API_BASE_URL = 'http://localhost:3001/api';

function getAuthHeader() {
  const token = localStorage.getItem('topsis_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  async healthCheck() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
  },

  async login(email, senha) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.erro || 'Falha na autenticação');
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Não autenticado');
    return res.json();
  },

  async getMunicipios() {
    const res = await fetch(`${API_BASE_URL}/municipios`);
    if (!res.ok) throw new Error('Erro ao listar municípios');
    return res.json();
  },

  async criarMunicipio(dados) {
    const res = await fetch(`${API_BASE_URL}/municipios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(dados),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.erro || 'Erro ao cadastrar município');
    }
    return res.json();
  },

  async getCriterios() {
    const res = await fetch(`${API_BASE_URL}/criterios`);
    if (!res.ok) throw new Error('Erro ao listar critérios');
    return res.json();
  },

  async atualizarPesos(pesos) {
    const res = await fetch(`${API_BASE_URL}/criterios/pesos`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ pesos }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.erro || 'Erro ao atualizar pesos');
    }
    return res.json();
  },

  async executarTOPSIS(pesosCustomizados = null, descricao = null) {
    const res = await fetch(`${API_BASE_URL}/topsis/executar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        pesosCustomizados,
        salvarNoHistorico: true,
        descricao: descricao || 'Simulação via Painel Web',
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detalhe || err.erro || 'Falha ao executar cálculo TOPSIS');
    }
    return res.json();
  },

  async getHistorico() {
    const res = await fetch(`${API_BASE_URL}/topsis/simulacoes`);
    if (!res.ok) throw new Error('Erro ao buscar histórico');
    return res.json();
  },

  getDownloadCsvUrl(simulacaoId) {
    return `${API_BASE_URL}/relatorios/simulacoes/${simulacaoId}/csv`;
  },
};
