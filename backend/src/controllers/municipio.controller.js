const MunicipioModel = require('../models/municipio.model');

class MunicipioController {
  static async listar(req, res) {
    try {
      const municipios = await MunicipioModel.listarTodos();
      return res.json(municipios);
    } catch (err) {
      console.error('Erro ao listar municípios:', err);
      return res.status(500).json({ erro: 'Falha ao buscar municípios' });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const municipio = await MunicipioModel.buscarPorId(id);
      if (!municipio) {
        return res.status(404).json({ erro: 'Município não encontrado' });
      }
      return res.json(municipio);
    } catch (err) {
      return res.status(500).json({ erro: 'Falha ao obter município' });
    }
  }

  static async criar(req, res) {
    try {
      const { nome, uf, populacao, idh, latitude, longitude } = req.body;
      if (!nome || !uf || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
          erro: 'Campos obrigatórios: nome, uf, latitude, longitude',
        });
      }

      const novo = await MunicipioModel.criar({
        nome,
        uf,
        populacao: populacao || 0,
        idh: idh || 0.7,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });

      return res.status(201).json(novo);
    } catch (err) {
      console.error('Erro ao criar município:', err);
      return res.status(500).json({ erro: 'Falha ao cadastrar município' });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, uf, populacao, idh, latitude, longitude } = req.body;

      const atualizado = await MunicipioModel.atualizar(id, {
        nome,
        uf,
        populacao: populacao || 0,
        idh: idh || 0.7,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });

      if (!atualizado) {
        return res.status(404).json({ erro: 'Município não encontrado' });
      }

      return res.json(atualizado);
    } catch (err) {
      return res.status(500).json({ erro: 'Falha ao atualizar município' });
    }
  }

  static async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await MunicipioModel.deletar(id);
      if (!deletado) {
        return res.status(404).json({ erro: 'Município não encontrado' });
      }
      return res.json({ mensagem: 'Município removido com sucesso', id });
    } catch (err) {
      return res.status(500).json({ erro: 'Falha ao deletar município' });
    }
  }
}

module.exports = MunicipioController;
