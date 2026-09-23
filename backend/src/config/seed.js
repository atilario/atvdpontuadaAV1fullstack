const db = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    const res = await db.query('UPDATE usuarios SET senha_hash = $1', [hash]);
    console.log(`Hash de admin123 atualizado para ${res.rowCount} usuários.`);
    process.exit(0);
  } catch (err) {
    console.error('Erro no seed:', err);
    process.exit(1);
  }
}

seed();
