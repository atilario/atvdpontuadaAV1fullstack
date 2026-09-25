const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { autenticarToken } = require('../middlewares/auth.middleware');

router.post('/login', AuthController.login);
router.get('/me', autenticarToken, AuthController.me);

module.exports = router;
