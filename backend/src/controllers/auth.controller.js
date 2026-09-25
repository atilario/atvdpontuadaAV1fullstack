const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuario.model');

class AuthController {
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      }

      const usuario = await UsuarioModel.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil,
        },
        process.env.JWT_SECRET || 'super_secret_topsis_cimatec_key_2026',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      return res.json({
        mensagem: 'Autenticado com sucesso',
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil,
        },
      });
    } catch (err) {
      console.error('Erro no login:', err);
      return res.status(500).json({ erro: 'Erro interno ao realizar autenticação' });
    }
  }

  static async me(req, res) {
    try {
      const usuario = await UsuarioModel.buscarPorId(req.usuario.id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }
      return res.json(usuario);
    } catch (err) {
      return res.status(500).json({ erro: 'Erro ao buscar dados do usuário autenticado' });
    }
  }
}

module.exports = AuthController;
