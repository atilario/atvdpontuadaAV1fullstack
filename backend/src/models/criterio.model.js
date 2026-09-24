const db = require('../config/db');

class CriterioModel {
  static async listarTodos() {
    const res = await db.query('SELECT * FROM criterios ORDER BY id ASC');
    return res.rows;
  }

  static async buscarPorId(id) {
    const res = await db.query('SELECT * FROM criterios WHERE id = $1', [id]);
    return res.rows[0];
  }

  static async atualizarPeso(id, peso) {
    const res = await db.query(
      'UPDATE criterios SET peso = $1 WHERE id = $2 RETURNING *',
      [peso, id]
    );
    return res.rows[0];
  }

  static async atualizarMultiplosPesos(pesosMap) {
    // pesosMap: { [criterioId]: novoPeso }
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      for (const [id, peso] of Object.entries(pesosMap)) {
        await client.query('UPDATE criterios SET peso = $1 WHERE id = $2', [peso, id]);
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}

module.exports = CriterioModel;
