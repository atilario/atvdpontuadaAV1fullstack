const SimulacaoModel = require('../models/simulacao.model');

class RelatorioController {
  static async exportarCSV(req, res) {
    try {
      const { id } = req.params;
      const dados = await SimulacaoModel.buscarPorId(id);

      if (!dados) {
        return res.status(404).json({ erro: 'Simulação não encontrada para exportação' });
      }

      const colunas = [
        'Posicao',
        'Municipio',
        'UF',
        'Coeficiente_Ci',
        'Distancia_Positiva_Dplus',
        'Distancia_Negativa_Dminus',
        'Latitude',
        'Longitude',
      ];

      const linhas = dados.ranking.map((r) => [
        r.posicao,
        `"${r.municipio_nome}"`,
        r.uf,
        r.coeficiente_ci,
        r.distancia_positiva,
        r.distancia_negativa,
        r.latitude,
        r.longitude,
      ]);

      const csvContent = '\uFEFF' + [colunas.join(','), ...linhas.map((l) => l.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="ranking_topsis_simulacao_${id}.csv"`);
      return res.send(csvContent);
    } catch (err) {
      console.error('Erro na exportação CSV:', err);
      return res.status(500).json({ erro: 'Falha na geração do relatório CSV' });
    }
  }
}

module.exports = RelatorioController;
