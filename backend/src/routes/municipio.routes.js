const express = require('express');
const router = express.Router();
const MunicipioController = require('../controllers/municipio.controller');
const { autenticarToken } = require('../middlewares/auth.middleware');

router.get('/', MunicipioController.listar);
router.get('/:id', MunicipioController.buscarPorId);
router.post('/', autenticarToken, MunicipioController.criar);
router.put('/:id', autenticarToken, MunicipioController.atualizar);
router.delete('/:id', autenticarToken, MunicipioController.deletar);

module.exports = router;
