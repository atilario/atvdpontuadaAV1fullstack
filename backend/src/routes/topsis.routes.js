const express = require('express');
const router = express.Router();
const TopsisController = require('../controllers/topsis.controller');
const { autenticarToken } = require('../middlewares/auth.middleware');

// Executar TOPSIS pode ser executado por usuário autenticado ou público para demonstração
router.post('/executar', (req, res, next) => {
  // Se houver token opcional, valida, senão prossegue como anônimo
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    return autenticarToken(req, res, next);
  }
  next();
}, TopsisController.executar);

router.get('/simulacoes', TopsisController.listarHistorico);
router.get('/simulacoes/:id', TopsisController.obterSimulacaoPorId);

module.exports = router;
