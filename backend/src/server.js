require('dotenv').config();
const app = require('./app');
const seed = require('./config/seed');

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(` Servidor TOPSIS iniciado com sucesso na porta ${PORT}`);
  console.log(` Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(` Healthcheck:  http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);

  try {
    await seed();
  } catch (err) {
    console.warn('Aviso ao inicializar seed/reparo UTF-8:', err.message);
  }
});
