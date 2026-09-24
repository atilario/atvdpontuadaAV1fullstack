const db = require('../config/db');

class MunicipioModel {
  static async listarTodos() {
    const query = `
      SELECT id, nome, uf, populacao, idh, latitude, longitude, created_at
      FROM municipios
      ORDER BY nome ASC
    `;
    const res = await db.query(query);
    return res.rows;
  }

  static async buscarPorId(id) {
    const res = await db.query('SELECT * FROM municipios WHERE id = $1', [id]);
    return res.rows[0];
  }

  static async criar({ nome, uf, populacao, idh, latitude, longitude }) {
    const res = await db.query(
      `INSERT INTO municipios (nome, uf, populacao, idh, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nome, uf.toUpperCase(), populacao, idh, latitude, longitude]
    );
    return res.rows[0];
  }

  static async atualizar(id, { nome, uf, populacao, idh, latitude, longitude }) {
    const res = await db.query(
      `UPDATE municipios
       SET nome = $1, uf = $2, populacao = $3, idh = $4, latitude = $5, longitude = $6
       WHERE id = $7
       RETURNING *`,
      [nome, uf.toUpperCase(), populacao, idh, latitude, longitude, id]
    );
    return res.rows[0];
  }

  static async deletar(id) {
    const res = await db.query('DELETE FROM municipios WHERE id = $1 RETURNING id', [id]);
    return res.rows[0];
  }

  static async obterMatrizDecisao(anoReferencia = 2024) {
    // Retorna todos os municípios com os valores de cada critério para o TOPSIS
    const resMunicipios = await db.query('SELECT id, nome, uf, latitude, longitude FROM municipios ORDER BY id ASC');
    const resCriterios = await db.query('SELECT id, codigo, nome, tipo, peso, unidade FROM criterios ORDER BY id ASC');
    const resValores = await db.query('SELECT municipio_id, criterio_id, valor FROM matriz_decisao WHERE ano_referencia = $1', [anoReferencia]);

    const mapaValores = {};
    resValores.rows.forEach((r) => {
      const chave = `${r.municipio_id}_${r.criterio_id}`;
      mapaValores[chave] = parseFloat(r.valor);
    });

    const alternativas = resMunicipios.rows.map((m) => {
      const dados = resCriterios.rows.map((c) => {
        const val = mapaValores[`${m.id}_${c.id}`];
        return val !== undefined ? val : 0;
      });
      return {
        id: m.id,
        nome: m.nome,
        uf: m.uf,
        latitude: parseFloat(m.latitude),
        longitude: parseFloat(m.longitude),
        dados,
      };
    });

    return {
      municipios: resMunicipios.rows,
      criterios: resCriterios.rows,
      alternativas,
    };
  }
}

module.exports = MunicipioModel;
