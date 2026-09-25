const { calcularTOPSIS } = require('../services/topsis.service');
const MunicipioModel = require('../models/municipio.model');
const CriterioModel = require('../models/criterio.model');
const SimulacaoModel = require('../models/simulacao.model');

class TopsisController {
  static async executar(req, res) {
    const inicio = Date.now();
    try {
      const { pesosCustomizados, salvarNoHistorico = true, descricao } = req.body;

      // 1. Obtém a matriz de decisão montada a partir do banco
      const matrizDados = await MunicipioModel.obterMatrizDecisao();
      const criterios = await CriterioModel.listarTodos();

      if (!matrizDados.alternativas || matrizDados.alternativas.length === 0) {
        return res.status(400).json({ erro: 'Não há dados de municípios para calcular o TOPSIS' });
      }

      // 2. Define os pesos e tipos
      let pesos = criterios.map((c) => parseFloat(c.peso));
      if (pesosCustomizados && Array.isArray(pesosCustomizados)) {
        pesos = pesosCustomizados.map((p) => parseFloat(p));
      }
      const tipos = criterios.map((c) => c.tipo);

      // 3. Executa o algoritmo TOPSIS puro
      const resultado = calcularTOPSIS({
        alternativas: matrizDados.alternativas,
        pesos,
        tipos,
      });

      // Inclui coordenadas nos itens do ranking para renderização no mapa
      const mapaCoords = {};
      matrizDados.municipios.forEach((m) => {
        mapaCoords[m.id] = {
          latitude: parseFloat(m.latitude),
          longitude: parseFloat(m.longitude),
          populacao: m.populacao,
          idh: m.idh,
        };
      });

      resultado.ranking.forEach((item) => {
        if (mapaCoords[item.id]) {
          item.latitude = mapaCoords[item.id].latitude;
          item.longitude = mapaCoords[item.id].longitude;
          item.populacao = mapaCoords[item.id].populacao;
          item.idh = mapaCoords[item.id].idh;
        }
      });

      const tempoExecucaoMs = Date.now() - inicio;

      // 4. Salva no histórico se solicitado
      let simulacaoSalva = null;
      if (salvarNoHistorico) {
        const usuarioId = req.usuario ? req.usuario.id : null;
        simulacaoSalva = await SimulacaoModel.salvarSimulacao({
          usuarioId,
          descricao: descricao || 'Simulação de Vulnerabilidade Social Energética',
          parametros: {
            criterios: criterios.map((c) => ({ id: c.id, codigo: c.codigo, tipo: c.tipo })),
            pesosUtilizados: resultado.pesosUtilizados,
            tempoExecucaoMs,
          },
          ranking: resultado.ranking,
        });
      }

      return res.json({
        sucesso: true,
        tempoExecucaoMs,
        simulacaoId: simulacaoSalva ? simulacaoSalva.id : null,
        criterios: criterios.map((c, i) => ({
          id: c.id,
          codigo: c.codigo,
          nome: c.nome,
          tipo: c.tipo,
          peso: resultado.pesosUtilizados[i],
          unidade: c.unidade,
        })),
        solucaoIdealPositiva: resultado.solucaoIdealPositiva,
        solucaoIdealNegativa: resultado.solucaoIdealNegativa,
        ranking: resultado.ranking,
      });
    } catch (err) {
      console.error('Erro na execução TOPSIS:', err);
      return res.status(500).json({
        erro: 'Erro no processamento do cálculo TOPSIS',
        detalhe: err.message,
      });
    }
  }

  static async listarHistorico(req, res) {
    try {
      const historico = await SimulacaoModel.listarHistorico();
      return res.json(historico);
    } catch (err) {
      return res.status(500).json({ erro: 'Falha ao buscar histórico de simulações' });
    }
  }

  static async obterSimulacaoPorId(req, res) {
    try {
      const { id } = req.params;
      const simulacao = await SimulacaoModel.buscarPorId(id);
      if (!simulacao) {
        return res.status(404).json({ erro: 'Simulação não encontrada' });
      }
      return res.json(simulacao);
    } catch (err) {
      return res.status(500).json({ erro: 'Falha ao obter dados da simulação' });
    }
  }
}

module.exports = TopsisController;
