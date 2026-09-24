const db = require('../config/db');

class SimulacaoModel {
  static async salvarSimulacao({ usuarioId, descricao, parametros, ranking }) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const resSimulacao = await client.query(
        `INSERT INTO simulacoes (usuario_id, descricao, parametros, status)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [usuarioId || null, descricao || 'Simulação TOPSIS', JSON.stringify(parametros), 'concluida']
      );

      const simulacaoId = resSimulacao.rows[0].id;

      for (const item of ranking) {
        await client.query(
          `INSERT INTO resultados_ranking 
           (simulacao_id, municipio_id, coeficiente_ci, distancia_positiva, distancia_negativa, posicao)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            simulacaoId,
            item.id,
            item.ci,
            item.distanciaPositiva,
            item.distanciaNegativa,
            item.posicao,
          ]
        );
      }

      await client.query('COMMIT');
      return resSimulacao.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async listarHistorico(limite = 20) {
    const query = `
      SELECT s.id, s.descricao, s.data_execucao, s.parametros, s.status, u.nome as usuario_nome
      FROM simulacoes s
      LEFT JOIN usuarios u ON u.id = s.usuario_id
      ORDER BY s.data_execucao DESC
      LIMIT $1
    `;
    const res = await db.query(query, [limite]);
    return res.rows;
  }

  static async buscarPorId(id) {
    const resSim = await db.query('SELECT * FROM simulacoes WHERE id = $1', [id]);
    if (!resSim.rows[0]) return null;

    const resResultados = await db.query(
      `SELECT r.*, m.nome as municipio_nome, m.uf, m.latitude, m.longitude
       FROM resultados_ranking r
       JOIN municipios m ON m.id = r.municipio_id
       WHERE r.simulacao_id = $1
       ORDER BY r.posicao ASC`,
      [id]
    );

    return {
      simulacao: resSim.rows[0],
      ranking: resResultados.rows,
    };
  }
}

module.exports = SimulacaoModel;
