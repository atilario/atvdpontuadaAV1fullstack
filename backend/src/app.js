const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const swaggerDocument = require('./docs/swagger.json');

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de documentação Swagger UI (RNF06)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Roteador central da API
app.use('/api', routes);

// Middleware de tratamento global de erros (ISO 25010 - Confiabilidade)
app.use((err, req, res, next) => {
  console.error('Erro não tratado na aplicação:', err);
  res.status(500).json({
    erro: 'Erro interno no servidor',
    mensagem: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

module.exports = app;
