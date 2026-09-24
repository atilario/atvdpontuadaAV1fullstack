/**
 * Serviço de Cálculo Multicritério TOPSIS
 * Implementação rigorosa conforme Capítulo 7 do Roteiro Acadêmico
 * (Technique for Order Preference by Similarity to Ideal Solution)
 */

/**
 * Normalização Vetorial Euclidiana por coluna (critério)
 * r_ij = x_ij / sqrt(sum(x_kj^2))
 * @param {number[][]} matriz - Matriz m x n (m alternativas, n critérios)
 * @returns {number[][]} Matriz normalizada
 */
function normalizar(matriz) {
  if (!matriz || matriz.length === 0 || !matriz[0] || matriz[0].length === 0) {
    throw new Error('Matriz de decisão vazia ou inválida');
  }

  const numLinhas = matriz.length;
  const numColunas = matriz[0].length;
  const normas = new Array(numColunas).fill(0);

  // Calcula a norma de cada coluna
  for (let j = 0; j < numColunas; j++) {
    let somaQuadrados = 0;
    for (let i = 0; i < numLinhas; i++) {
      const val = Number(matriz[i][j]) || 0;
      somaQuadrados += val * val;
    }
    normas[j] = Math.sqrt(somaQuadrados);
  }

  // Normaliza cada elemento r_ij
  const normalizada = [];
  for (let i = 0; i < numLinhas; i++) {
    const linha = [];
    for (let j = 0; j < numColunas; j++) {
      const val = Number(matriz[i][j]) || 0;
      linha.push(normas[j] === 0 ? 0 : val / normas[j]);
    }
    normalizada.push(linha);
  }

  return normalizada;
}

/**
 * Algoritmo TOPSIS Completo
 * @param {Object} params
 * @param {Array<{id: number|string, nome: string, dados: number[]}>} params.alternativas - Lista de alternativas
 * @param {number[]} params.pesos - Pesos dos critérios (soma deve ser aprox 1.0)
 * @param {string[]} params.tipos - Tipo de cada critério ('beneficio' ou 'custo')
 * @returns {Object} Detalhes do cálculo e ranking final ordenado
 */
function calcularTOPSIS({ alternativas, pesos, tipos }) {
  if (!alternativas || alternativas.length === 0) {
    throw new Error('Pelo menos uma alternativa deve ser informada');
  }
  if (!pesos || pesos.length === 0) {
    throw new Error('Os pesos dos critérios são obrigatórios');
  }
  if (!tipos || tipos.length !== pesos.length) {
    throw new Error('A quantidade de tipos deve coincidir com a quantidade de critérios');
  }

  const m = alternativas.length;
  const n = pesos.length;

  // Monta a matriz bruta
  const matriz = alternativas.map((alt) => {
    if (!alt.dados || alt.dados.length !== n) {
      throw new Error(`Alternativa "${alt.nome}" não possui a quantidade correta de critérios (${n})`);
    }
    return alt.dados.map((v) => Number(v));
  });

  // Normaliza os pesos (garante soma = 1)
  const somaPesos = pesos.reduce((acc, p) => acc + (Number(p) || 0), 0);
  if (somaPesos <= 0) {
    throw new Error('A soma dos pesos deve ser maior que zero');
  }
  const pesosNormalizados = pesos.map((p) => (Number(p) || 0) / somaPesos);

  // Passo 1: Normalização Vetorial
  const normalizada = normalizar(matriz);

  // Passo 2: Matriz Ponderada v_ij = w_j * r_ij
  const ponderada = normalizada.map((linha) =>
    linha.map((val, j) => val * pesosNormalizados[j])
  );

  // Passo 3: Solução Ideal Positiva (A+)
  // Para benefício: max; Para custo: min
  const Aplus = new Array(n);
  // Passo 4: Solução Ideal Negativa (A-)
  // Para benefício: min; Para custo: max
  const Aminus = new Array(n);

  for (let j = 0; j < n; j++) {
    const coluna = ponderada.map((linha) => linha[j]);
    const maxVal = Math.max(...coluna);
    const minVal = Math.min(...coluna);
    const tipo = (tipos[j] || 'beneficio').toLowerCase();

    if (tipo === 'beneficio') {
      Aplus[j] = maxVal;
      Aminus[j] = minVal;
    } else {
      // custo
      Aplus[j] = minVal;
      Aminus[j] = maxVal;
    }
  }

  // Passo 5: Distâncias Euclidianas D+ e D-
  const Dplus = new Array(m);
  const Dminus = new Array(m);

  for (let i = 0; i < m; i++) {
    let somaDplus = 0;
    let somaDminus = 0;
    for (let j = 0; j < n; j++) {
      const v = ponderada[i][j];
      somaDplus += Math.pow(v - Aplus[j], 2);
      somaDminus += Math.pow(v - Aminus[j], 2);
    }
    Dplus[i] = Math.sqrt(somaDplus);
    Dminus[i] = Math.sqrt(somaDminus);
  }

  // Passo 6: Coeficiente de Proximidade Relativa Ci = D- / (D+ + D-)
  // Ci varia de 0 (pior) a 1 (melhor).
  const Ci = new Array(m);
  for (let i = 0; i < m; i++) {
    const divisor = Dplus[i] + Dminus[i];
    Ci[i] = divisor === 0 ? 0.5 : Dminus[i] / divisor;
  }

  // Passo 7: Ordenação do Ranking (Maior Ci = Menos Vulnerável / Melhor Desempenho)
  const ranking = alternativas.map((alt, i) => ({
    id: alt.id,
    nome: alt.nome,
    uf: alt.uf,
    ci: Number(Ci[i].toFixed(6)),
    distanciaPositiva: Number(Dplus[i].toFixed(6)),
    distanciaNegativa: Number(Dminus[i].toFixed(6)),
    dadosOriginais: alt.dados,
  }));

  // Ordena decrescente por Ci
  ranking.sort((a, b) => b.ci - a.ci);

  // Atribui posições (1º, 2º, ...)
  ranking.forEach((item, index) => {
    item.posicao = index + 1;
  });

  return {
    matrizNormalizada: normalizada,
    matrizPonderada: ponderada,
    solucaoIdealPositiva: Aplus,
    solucaoIdealNegativa: Aminus,
    pesosUtilizados: pesosNormalizados,
    ranking,
  };
}

module.exports = {
  normalizar,
  calcularTOPSIS,
};
