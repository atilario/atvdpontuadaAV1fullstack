const { normalizar, calcularTOPSIS } = require('../../src/services/topsis.service');

describe('TOPSIS Service - Testes Unitários e Validação Numérica', () => {
  describe('Função normalizar()', () => {
    test('deve normalizar matriz 2x2 preservando proporções Euclidianas', () => {
      // Vetor [3, 4] tem norma sqrt(3^2 + 4^2) = 5
      const matriz = [
        [3, 1],
        [4, 1],
      ];
      const norm = normalizar(matriz);
      expect(norm[0][0]).toBeCloseTo(0.6, 4);
      expect(norm[1][0]).toBeCloseTo(0.8, 4);
      expect(norm[0][1]).toBeCloseTo(Math.SQRT1_2, 4);
      expect(norm[1][1]).toBeCloseTo(Math.SQRT1_2, 4);
    });

    test('deve lançar erro quando a matriz for vazia ou inválida', () => {
      expect(() => normalizar([])).toThrow('Matriz de decisão vazia ou inválida');
      expect(() => normalizar([[]])).toThrow('Matriz de decisão vazia ou inválida');
    });

    test('deve tratar colunas com zeros sem gerar divisão por zero', () => {
      const matriz = [
        [0, 5],
        [0, 5],
      ];
      const norm = normalizar(matriz);
      expect(norm[0][0]).toBe(0);
      expect(norm[1][0]).toBe(0);
    });
  });

  describe('Função calcularTOPSIS() - Caso de Referência do Roteiro (Capítulo 7.3)', () => {
    // Dados numéricos oficiais do roteiro:
    // Critérios:
    // C1: % domicílios sem acesso (custo)
    // C2: Capacidade instalada solar kW/hab (benefício)
    // C3: Renda per capita R$ (benefício)
    // C4: Tarifa média R$/kWh (custo)
    // C5: Irradiação solar (benefício)
    const tipos = ['custo', 'beneficio', 'beneficio', 'custo', 'beneficio'];
    const pesos = [0.20, 0.20, 0.15, 0.25, 0.20];

    const alternativas = [
      { id: 1, nome: 'Município A', dados: [15, 0.8, 980, 0.75, 5.2] },
      { id: 2, nome: 'Município B', dados: [5, 2.1, 1850, 0.62, 5.8] },
      { id: 3, nome: 'Município C', dados: [22, 0.3, 650, 0.89, 4.9] },
    ];

    test('deve calcular o ranking conferindo exatamente a ordem esperada B > A > C', () => {
      const resultado = calcularTOPSIS({ alternativas, pesos, tipos });

      expect(resultado).toBeDefined();
      expect(resultado.ranking).toHaveLength(3);

      const [primeiro, segundo, terceiro] = resultado.ranking;

      // Validação do resultado esperado no Capítulo 7.3: B > A > C (B menos vulnerável)
      expect(primeiro.nome).toBe('Município B');
      expect(segundo.nome).toBe('Município A');
      expect(terceiro.nome).toBe('Município C');

      expect(primeiro.posicao).toBe(1);
      expect(segundo.posicao).toBe(2);
      expect(terceiro.posicao).toBe(3);

      expect(primeiro.ci).toBeGreaterThan(segundo.ci);
      expect(segundo.ci).toBeGreaterThan(terceiro.ci);
    });

    test('todos os coeficientes Ci devem estar estritamente no intervalo [0, 1]', () => {
      const resultado = calcularTOPSIS({ alternativas, pesos, tipos });
      resultado.ranking.forEach((item) => {
        expect(item.ci).toBeGreaterThanOrEqual(0);
        expect(item.ci).toBeLessThanOrEqual(1);
        expect(item.distanciaPositiva).toBeGreaterThanOrEqual(0);
        expect(item.distanciaNegativa).toBeGreaterThanOrEqual(0);
      });
    });

    test('deve rejeitar alternativas com dados incompletos ou pesos vazios', () => {
      expect(() =>
        calcularTOPSIS({ alternativas: [], pesos, tipos })
      ).toThrow('Pelo menos uma alternativa deve ser informada');

      expect(() =>
        calcularTOPSIS({ alternativas, pesos: [], tipos })
      ).toThrow('Os pesos dos critérios são obrigatórios');

      expect(() =>
        calcularTOPSIS({
          alternativas,
          pesos,
          tipos: ['beneficio'], // tamanho incompatível
        })
      ).toThrow('A quantidade de tipos deve coincidir');
    });
  });
});
