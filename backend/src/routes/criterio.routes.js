const express = require('express');
const router = express.Router();
const CriterioController = require('../controllers/criterio.controller');
const { autenticarToken } = require('../middlewares/auth.middleware');

router.get('/', CriterioController.listar);
router.put('/pesos', autenticarToken, CriterioController.atualizarPesos);

module.exports = router;
