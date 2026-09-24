const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      erro: 'Token de autenticação não fornecido',
      mensagem: 'Envie o token no formato Bearer <token>',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'super_secret_topsis_cimatec_key_2026', (err, usuario) => {
    if (err) {
      return res.status(403).json({
        erro: 'Token inválido ou expirado',
      });
    }

    req.usuario = usuario;
    next();
  });
}

function autorizarPerfil(...perfisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Não autenticado' });
    }
    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({
        erro: 'Acesso negado para este perfil de usuário',
      });
    }
    next();
  };
}

module.exports = {
  autenticarToken,
  autorizarPerfil,
};
