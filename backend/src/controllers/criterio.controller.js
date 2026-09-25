const CriterioModel = require('../models/criterio.model');

class CriterioController {
  static async listar(req, res) {
    try {
      const criterios = await CriterioModel.listarTodos();
      return res.json(criterios);
    } catch (err) {
      console.error('Erro ao listar critérios:', err);
      return res.status(500).json({ erro: 'Falha ao buscar critérios' });
    }
  }

  static async atualizarPesos(req, res) {
    try {
      const { pesos } = req.body;
      // pesos: array de { id, peso } ou objeto { id: peso }
      if (!pesos) {
        return res.status(400).json({ erro: 'Estrutura de pesos é obrigatória' });
      }

      const pesosMap = {};
      let soma = 0;

      if (Array.isArray(pesos)) {
        pesos.forEach((p) => {
          pesosMap[p.id] = parseFloat(p.peso);
          soma += parseFloat(p.peso);
        });
      } else {
        Object.entries(pesos).forEach(([id, peso]) => {
          pesosMap[id] = parseFloat(peso);
          soma += parseFloat(peso);
        });
      }

      if (Math.abs(soma - 1.0) > 0.05) {
        return res.status(400).json({
          erro: `A soma dos pesos deve ser 1.0 (soma atual: ${soma.toFixed(2)})`,
        });
      }

      await CriterioModel.atualizarMultiplosPesos(pesosMap);
      const criteriosAtualizados = await CriterioModel.listarTodos();

      return res.json({
        mensagem: 'Pesos atualizados com sucesso',
        criterios: criteriosAtualizados,
      });
    } catch (err) {
      console.error('Erro ao atualizar pesos:', err);
      return res.status(500).json({ erro: 'Falha ao atualizar pesos dos critérios' });
    }
  }
}

module.exports = CriterioController;
