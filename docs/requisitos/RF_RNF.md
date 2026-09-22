# Documento de Requisitos de Software

## Plataforma de Mensuração Multicritério de Vulnerabilidade Social Energética com TOPSIS
**Universidade SENAI CIMATEC**  
**Curso:** Engenharia da Computação  
**Disciplina:** Desenvolvimento Web  
**Norma de Referência:** ISO/IEC 12207 e ISO/IEC 25010  

---

## 1. Requisitos Funcionais (RF)

| ID | Nome do Requisito | Descrição Detalhada | Prioridade |
|:---|:---|:---|:---:|
| **RF01** | Cadastrar Municípios / Comunidades | Permitir o cadastro, consulta, edição e exclusão de municípios e comunidades com atributos socioeconômicos (nome, UF, população, IDH, coordenadas geográficas de latitude e longitude). | **Alta** |
| **RF02** | Cadastrar Indicadores e Critérios | Manter catálogo de indicadores de vulnerabilidade energética (ex: acesso elétrico, capacidade solar, renda, tarifas, irradiação), definindo sua direção de otimização (`beneficio` ou `custo`) e unidade de medida. | **Alta** |
| **RF03** | Configurar Pesos TOPSIS | Permitir ao analista/pesquisador ajustar os pesos $w_j$ de cada critério na matriz de decisão com validação de soma ($\sum w_j = 1,0$). | **Alta** |
| **RF04** | Executar Cálculo TOPSIS e Gerar Ranking | Executar o motor algorítmico multicritério TOPSIS (normalização vetorial, ponderação, identificação do ideal positivo $A^+$ e ideal negativo $A^-$, distâncias euclidianas $D^+$ e $D^-$, coeficiente de proximidade $C_i$) gerando ordenação decrescente de prioridade/vulnerabilidade. | **Alta** |
| **RF05** | Visualizar Resultados em Dashboard | Apresentar os resultados em painel analítico com cartões de KPIs consolidados (total de municípios, média de $C_i$, município de maior vulnerabilidade) e gráficos de barras/radar. | **Média** |
| **RF06** | Exportar Relatórios | Fornecer funcionalidade de exportação de dados ranqueados e metadados da simulação em formatos CSV estruturado e impressão/PDF para subsidiar tomadas de decisão e formulação de políticas públicas. | **Média** |
| **RF07** | Visualização Georreferenciada (Mapa) | Renderizar mapa interativo (via biblioteca Leaflet) exibindo a localização dos municípios com marcadores e faixas de cores proporcionais ao nível de vulnerabilidade energética apurado. | **Média** |
| **RF08** | Gerenciamento de Usuários e Perfis | Autenticar usuários com controle de acesso baseado em papéis (Administrador, Pesquisador, Gestor Público) com emissão de token de sessão seguro. | **Alta** |
| **RF09** | Importação de Dados | Suportar a carga em lote e importação de datasets socioeconômicos e energéticos aderentes aos padrões de fontes públicas oficiais (IBGE, ANEEL, INPE). | **Baixa** |
| **RF10** | Histórico de Simulações TOPSIS | Persistir e consultar o histórico de simulações executadas, contendo parâmetros, pesos utilizados, data de execução e ranking resultante para auditoria e reprodutibilidade científica. | **Baixa** |

---

## 2. Requisitos Não Funcionais (RNF)

| ID | Requisito | Categoria (ISO/IEC 25010) | Especificação e Métrica |
|:---|:---|:---|:---|
| **RNF01** | Eficiência de Desempenho | Eficiência de Desempenho (Comportamento Temporal) | O tempo de execução do cálculo TOPSIS no backend deve ser inferior a 3 segundos ($t < 3\text{ s}$) para matrizes com até 500 alternativas. |
| **RNF02** | Usabilidade e Responsividade | Usabilidade (Adequação e Acessibilidade) | Interface gráfica com layout totalmente responsivo, adaptando-se sem quebra de componentes em resoluções Mobile ($<768\text{px}$), Tablet ($768\text{px}-1024\text{px}$) e Desktop ($>1024\text{px}$). |
| **RNF03** | Confiabilidade e Disponibilidade | Confiabilidade (Disponibilidade e Tolerância a Falhas) | A aplicação e o serviço de persistência devem atingir taxa de disponibilidade $\ge 99,5\%$, com isolamento de contêineres e reinicialização automática em caso de pane. |
| **RNF04** | Segurança da Informação | Segurança (Confidencialidade e Autenticidade) | Autenticação baseada em JSON Web Tokens (JWT) com assinatura HMAC-SHA256, expiração controlada e armazenamento de senhas com hash criptográfico irreversível via bcrypt (salt rounds $\ge 10$). |
| **RNF05** | Manutenibilidade e Testabilidade | Manutenibilidade (Modularidade e Testabilidade) | Arquitetura modular em camadas (MVC/Services/Repositories) com cobertura de testes automatizados unitários e de integração igual ou superior a 80% ($\ge 80\%$) nas regras de negócio críticas. |
| **RNF06** | Portabilidade e Documentação de API | Portabilidade e Interoperabilidade | API RESTful com contratos e esquemas integralmente documentados no padrão OpenAPI 3.0 / Swagger UI interativo. |
