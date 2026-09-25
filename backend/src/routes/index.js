const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const municipioRoutes = require('./municipio.routes');
const criterioRoutes = require('./criterio.routes');
const topsisRoutes = require('./topsis.routes');
const relatorioRoutes = require('./relatorio.routes');

router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    servico: 'Plataforma TOPSIS de Vulnerabilidade Energética',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/municipios', municipioRoutes);
router.use('/criterios', criterioRoutes);
router.use('/topsis', topsisRoutes);
router.use('/relatorios', relatorioRoutes);

module.exports = router;
