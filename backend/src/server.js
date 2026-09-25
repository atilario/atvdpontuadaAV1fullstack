require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Servidor TOPSIS iniciado com sucesso na porta ${PORT}`);
  console.log(` Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(` Healthcheck:  http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
