const db = require('../config/db');

class UsuarioModel {
  static async buscarPorEmail(email) {
    const res = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return res.rows[0];
  }

  static async buscarPorId(id) {
    const res = await db.query('SELECT id, nome, email, perfil, created_at FROM usuarios WHERE id = $1', [id]);
    return res.rows[0];
  }

  static async criar({ nome, email, senhaHash, perfil = 'pesquisador' }) {
    const res = await db.query(
      `INSERT INTO usuarios (nome, email, senha_hash, perfil)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, perfil, created_at`,
      [nome, email, senhaHash, perfil]
    );
    return res.rows[0];
  }
}

module.exports = UsuarioModel;
