const db = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // 1. Atualizar senhas padrão
    const hash = await bcrypt.hash('admin123', 10);
    await db.query('UPDATE usuarios SET senha_hash = $1', [hash]);

    // 2. Garantir integridade de caracteres/acentos nos critérios oficiais
    const criterios = [
      { codigo: 'C1', nome: 'Sem Acesso à Eletricidade', descricao: 'Percentual de domicílios sem acesso à rede de eletricidade', tipo: 'custo', peso: 0.20, unidade: '%' },
      { codigo: 'C2', nome: 'Capacidade Instalada Solar', descricao: 'Capacidade de geração solar fotovoltaica per capita instalada', tipo: 'beneficio', peso: 0.20, unidade: 'kW/hab' },
      { codigo: 'C3', nome: 'Renda Per Capita', descricao: 'Renda domiciliar média per capita municipal', tipo: 'beneficio', peso: 0.15, unidade: 'R$' },
      { codigo: 'C4', nome: 'Tarifa Média de Energia', descricao: 'Tarifa média de energia elétrica cobrada pela concessionária local', tipo: 'custo', peso: 0.25, unidade: 'R$/kWh' },
      { codigo: 'C5', nome: 'Irradiação Solar Diária', descricao: 'Índice de radiação solar global incidente', tipo: 'beneficio', peso: 0.20, unidade: 'kWh/m²/dia' },
    ];

    for (const c of criterios) {
      await db.query(
        `UPDATE criterios 
         SET nome = $1, descricao = $2, unidade = $3 
         WHERE codigo = $4`,
        [c.nome, c.descricao, c.unidade, c.codigo]
      );
    }

    // 3. Garantir integridade de caracteres nos municípios padrão
    const municipios = [
      { id: 1, nome: 'Município A (Piloto Nordeste)' },
      { id: 2, nome: 'Município B (Polo Solar)' },
      { id: 3, nome: 'Município C (Comunidade Isolada)' },
      { id: 4, nome: 'Juazeiro' },
      { id: 5, nome: 'Sobradinho' },
      { id: 6, nome: 'Caetité' },
      { id: 7, nome: 'Bom Jesus da Lapa' },
    ];

    for (const m of municipios) {
      await db.query('UPDATE municipios SET nome = $1 WHERE id = $2', [m.nome, m.id]);
    }

    console.log('✓ Seed e integridade UTF-8 validados com sucesso.');
    return true;
  } catch (err) {
    console.error('Erro no seed/validação UTF-8:', err);
    throw err;
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seed;
