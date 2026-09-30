-- Script de Inicialização da Base de Dados PostgreSQL
-- Plataforma de Energia Renovável e Vulnerabilidade Social com TOPSIS
-- Universidade SENAI CIMATEC - Engenharia da Computação


-- 1. Tabela de Usuários (RNF04 - Autenticação JWT)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) DEFAULT 'pesquisador' CHECK (perfil IN ('admin', 'pesquisador', 'gestor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Municípios (RF01)
CREATE TABLE IF NOT EXISTS municipios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    uf CHAR(2) NOT NULL,
    populacao INTEGER NOT NULL DEFAULT 0,
    idh DECIMAL(4,3) DEFAULT 0.700,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Critérios de Vulnerabilidade (RF02, RF03)
CREATE TABLE IF NOT EXISTS criterios (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('beneficio', 'custo')),
    peso DECIMAL(5,4) NOT NULL DEFAULT 0.2000,
    unidade VARCHAR(50) NOT NULL
);

-- 4. Tabela da Matriz de Decisão (Valores dos Indicadores por Município)
CREATE TABLE IF NOT EXISTS matriz_decisao (
    id SERIAL PRIMARY KEY,
    municipio_id INTEGER NOT NULL REFERENCES municipios(id) ON DELETE CASCADE,
    criterio_id INTEGER NOT NULL REFERENCES criterios(id) ON DELETE CASCADE,
    valor DECIMAL(15,4) NOT NULL,
    ano_referencia INTEGER DEFAULT 2024,
    UNIQUE(municipio_id, criterio_id, ano_referencia)
);

-- 5. Tabela de Simulações TOPSIS (RF04, RF10)
CREATE TABLE IF NOT EXISTS simulacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    descricao VARCHAR(255) DEFAULT 'Simulação de Vulnerabilidade Social Energética',
    data_execucao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    parametros JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'concluida'
);

-- 6. Tabela de Resultados do Ranking TOPSIS (RF04, RF05)
CREATE TABLE IF NOT EXISTS resultados_ranking (
    id SERIAL PRIMARY KEY,
    simulacao_id INTEGER NOT NULL REFERENCES simulacoes(id) ON DELETE CASCADE,
    municipio_id INTEGER NOT NULL REFERENCES municipios(id) ON DELETE CASCADE,
    coeficiente_ci DECIMAL(10,8) NOT NULL,
    distancia_positiva DECIMAL(10,8) NOT NULL,
    distancia_negativa DECIMAL(10,8) NOT NULL,
    posicao INTEGER NOT NULL
);

-- ==========================================================
-- CARGA DE DADOS INICIAIS (SEEDS)
-- ==========================================================

-- Usuário Admin (Senha padrão: admin123)
-- Hash bcrypt 10 rounds para 'admin123'
INSERT INTO usuarios (nome, email, senha_hash, perfil)
VALUES 
('Administrador CIMATEC', 'admin@cimatec.br', '$2a$10$xu6XlMFBdpJpv3Kfo/0AlePRXSDWucyWhxFq5OffHUYBZlX5pI57u', 'admin'),
('Pesquisador de Energia', 'pesquisador@cimatec.br', '$2a$10$xu6XlMFBdpJpv3Kfo/0AlePRXSDWucyWhxFq5OffHUYBZlX5pI57u', 'pesquisador')
ON CONFLICT (email) DO NOTHING;

-- Critérios Oficiais (Capítulo 7.1 do Roteiro TOPSIS)
INSERT INTO criterios (codigo, nome, descricao, tipo, peso, unidade) VALUES
('C1', 'Sem Acesso à Eletricidade', 'Percentual de domicílios sem acesso à rede de eletricidade', 'custo', 0.2000, '%'),
('C2', 'Capacidade Instalada Solar', 'Capacidade de geração solar fotovoltaica per capita instalada', 'beneficio', 0.2000, 'kW/hab'),
('C3', 'Renda Per Capita', 'Renda domiciliar média per capita municipal', 'beneficio', 0.1500, 'R$'),
('C4', 'Tarifa Média de Energia', 'Tarifa média de energia elétrica cobrada pela concessionária local', 'custo', 0.2500, 'R$/kWh'),
('C5', 'Irradiação Solar Diária', 'Índice de radiação solar global incidente', 'beneficio', 0.2000, 'kWh/m²/dia')
ON CONFLICT (codigo) DO NOTHING;

-- Municípios do Exemplo de Validação Numérica do Roteiro (Capítulo 7.3)
INSERT INTO municipios (id, nome, uf, populacao, idh, latitude, longitude) VALUES
(1, 'Município A (Piloto Nordeste)', 'BA', 45000, 0.655, -12.9714, -38.5014),
(2, 'Município B (Polo Solar)', 'BA', 82000, 0.742, -9.4167, -40.5000),
(3, 'Município C (Comunidade Isolada)', 'BA', 18500, 0.589, -11.8500, -42.2000),
(4, 'Juazeiro', 'BA', 218162, 0.677, -9.4116, -40.5033),
(5, 'Sobradinho', 'BA', 23233, 0.631, -9.4533, -40.8267),
(6, 'Caetité', 'BA', 52306, 0.665, -14.0694, -42.4861),
(7, 'Bom Jesus da Lapa', 'BA', 70618, 0.666, -13.2550, -43.4231)
ON CONFLICT (id) DO NOTHING;

SELECT setval('municipios_id_seq', (SELECT MAX(id) FROM municipios));

-- Matriz de Decisão dos Municípios A, B, C (Dados numéricos do Capítulo 7.3 do roteiro)
-- Critérios: C1 (custo), C2 (benefício), C3 (benefício), C4 (custo), C5 (benefício)
INSERT INTO matriz_decisao (municipio_id, criterio_id, valor, ano_referencia) VALUES
-- Município A: C1=15, C2=0.8, C3=980, C4=0.75, C5=5.2
(1, 1, 15.0000, 2024),
(1, 2, 0.8000, 2024),
(1, 3, 980.0000, 2024),
(1, 4, 0.7500, 2024),
(1, 5, 5.2000, 2024),

-- Município B: C1=5, C2=2.1, C3=1850, C4=0.62, C5=5.8
(2, 1, 5.0000, 2024),
(2, 2, 2.1000, 2024),
(2, 3, 1850.0000, 2024),
(2, 4, 0.6200, 2024),
(2, 5, 5.8000, 2024),

-- Município C: C1=22, C2=0.3, C3=650, C4=0.89, C5=4.9
(3, 1, 22.0000, 2024),
(3, 2, 0.3000, 2024),
(3, 3, 650.0000, 2024),
(3, 4, 0.8900, 2024),
(3, 5, 4.9000, 2024),

-- Juazeiro (polo do Vale do São Francisco)
(4, 1, 6.5000, 2024),
(4, 2, 1.8500, 2024),
(4, 3, 1420.0000, 2024),
(4, 4, 0.6800, 2024),
(4, 5, 5.7500, 2024),

-- Sobradinho (polo hidrelétrico/solar)
(5, 1, 9.2000, 2024),
(5, 2, 1.4000, 2024),
(5, 3, 1150.0000, 2024),
(5, 4, 0.7100, 2024),
(5, 5, 5.6000, 2024),

-- Caetité (complexo eólico e solar do semiárido)
(6, 1, 8.0000, 2024),
(6, 2, 2.3000, 2024),
(6, 3, 1280.0000, 2024),
(6, 4, 0.6500, 2024),
(6, 5, 5.8500, 2024),

-- Bom Jesus da Lapa (um dos maiores parques fotovoltaicos do Brasil)
(7, 1, 11.4000, 2024),
(7, 2, 3.1000, 2024),
(7, 3, 1120.0000, 2024),
(7, 4, 0.6700, 2024),
(7, 5, 6.1000, 2024)
ON CONFLICT (municipio_id, criterio_id, ano_referencia) DO UPDATE SET valor = EXCLUDED.valor;
