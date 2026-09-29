# Manual do Usuário — Plataforma TOPSIS de Energia Renovável

**Universidade SENAI CIMATEC — Engenharia da Computação**  
**Projeto:** Plataforma de Mensuração Multicritério de Vulnerabilidade Social Energética  

---

## 1. Visão Geral
A **Plataforma TOPSIS** é uma aplicação computacional projetada para apoiar gestores públicos e pesquisadores na priorização assertiva de investimentos em energia renovável (solar, eólica, biomassa) em municípios e comunidades com diferentes níveis de vulnerabilidade socioeconômica.

---

## 2. Acesso e Autenticação

1. Ao abrir o painel em seu navegador (`http://localhost:5173`), o usuário tem acesso imediato à visualização do **Dashboard**, **Mapeamento Georreferenciado** e **Ranking TOPSIS** com as configurações de pesos padrão.
2. Para operações com privilégios de escrita (alteração de pesos dos critérios ou cadastro de novas localidades), clique no botão **"Entrar"** no canto superior direito da barra de navegação.
3. Utilize uma das credenciais padrão já pré-configuradas no banco de dados:
   - **Administrador:** `admin@cimatec.br` | Senha: `admin123`
   - **Pesquisador:** `pesquisador@cimatec.br` | Senha: `admin123`
4. Na tela de login, você pode clicar nos botões rápidos de preenchimento ("Admin" ou "Pesquisador") para testar imediatamente.

---

## 3. Parametrização dos Pesos dos Critérios ($w_j$)

1. Na seção **"Parametrização Multicritério dos Pesos"**, utilize os controles deslizantes (*sliders*) para regular a importância de cada indicador:
   - **C1 (% sem acesso à eletricidade):** Critério de Custo (menor é melhor).
   - **C2 (Capacidade solar instalada):** Critério de Benefício (maior é melhor).
   - **C3 (Renda per capita):** Critério de Benefício.
   - **C4 (Tarifa média de energia):** Critério de Custo.
   - **C5 (Irradiação solar diária):** Critério de Benefício.
2. A barra de status indicará se a soma totaliza **100%**.
3. Caso queira balancear automaticamente os pesos, clique no botão **"Auto-Ajustar"** (distribui proporcionalmente para totalizar exatamente 100%).
4. Clique em **"Executar Simulação TOPSIS"** para recalcular a matriz e ordenar instantaneamente o ranking.

---

## 4. Interpretação dos Resultados do Ranking

A tabela analítica apresenta os seguintes campos fundamentais:
- **Posição (1º, 2º, ...):** Posição relativa no ranking.
- **Distância $D^+$:** Distância Euclidiana em relação à Solução Ideal Positiva ($A^+$).
- **Distância $D^-$:** Distância Euclidiana em relação à Solução Ideal Negativa / Anti-Ideal ($A^-$).
- **Coeficiente $C_i$:** Varia de 0 a 1. Quanto mais próximo de 1, mais próxima a alternativa está da solução ideal (menos vulnerável e com melhor infraestrutura energética).
- **Faixas de Vulnerabilidade:**
  - **Verde (Ci $\ge$ 0,65):** Baixa vulnerabilidade energética / Alta resiliência.
  - **Amarelo (0,40 $\le$ Ci $<$ 0,65):** Moderada vulnerabilidade energética.
  - **Vermelho (Ci $<$ 0,40):** Alta vulnerabilidade social energética (prioridade em políticas públicas).

---

## 5. Visualização em Gráficos e Mapa Georreferenciado

- **Gráfico Comparativo:** Exibe a dispersão dos coeficientes $C_i$ com barras coloridas por faixa de severidade.
- **Mapa Georreferenciado (Leaflet):** Apresenta círculos proporcionais e coloridos na localização geográfica exata de cada município. Clique em qualquer marcador para abrir o balão informativo com nome, UF, população e valor do coeficiente.

---

## 6. Exportação de Relatórios e Auditoria

1. **Exportar CSV:** Clique no botão **"Exportar CSV"** no cabeçalho da tabela de resultados. Um arquivo no formato `.csv` com codificação UTF-8 será baixado contendo todos os dados, posições, coordenadas e distâncias calculadas.
2. **Histórico:** Clique no botão **"Histórico"** no menu superior para consultar simulações passadas, visualizar tempo de execução em milissegundos e baixar relatórios de auditoria anteriores.

---

## 7. Cadastrar Novo Município

1. Estando autenticado como administrador ou pesquisador, clique no botão **"Novo Município"** no topo.
2. Preencha os dados: Nome, UF, População estimada, IDH (0 a 1), Latitude e Longitude.
3. Clique em **"Cadastrar Município"**. A base PostgreSQL será atualizada e a interface recarregará o novo ponto geográfico automaticamente.
