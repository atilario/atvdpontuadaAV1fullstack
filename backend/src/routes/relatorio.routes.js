const express = require('express');
const router = express.Router();
const RelatorioController = require('../controllers/relatorio.controller');

router.get('/simulacoes/:id/csv', RelatorioController.exportarCSV);

module.exports = router;
