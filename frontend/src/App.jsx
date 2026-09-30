import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KpiCards from './components/KpiCards';
import TopsisSliders from './components/TopsisSliders';
import RankingTable from './components/RankingTable';
import RankingChart from './components/RankingChart';
import VulnerabilidadeMap from './components/VulnerabilidadeMap';
import LoginModal from './components/LoginModal';
import CadastroMunicipioModal from './components/CadastroMunicipioModal';
import HistoricoModal from './components/HistoricoModal';
import { api } from './services/api';
import { AlertCircle, RefreshCw, Zap } from 'lucide-react';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [criterios, setCriterios] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [simulacaoId, setSimulacaoId] = useState(null);
  const [tempoExecucaoMs, setTempoExecucaoMs] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [apiOnline, setApiOnline] = useState(false);

  // Modais
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);

  useEffect(() => {
    inicializar();
  }, []);

  async function inicializar() {
    setCarregando(true);
    setErro('');

    // 1. Testa conectividade
    try {
      await api.healthCheck();
      setApiOnline(true);
    } catch {
      setApiOnline(false);
      setErro('API backend offline. Verifique se o container PostgreSQL e o servidor Node.js estão em execução.');
      setCarregando(false);
      return;
    }

    // 2. Verifica usuário autenticado prévio
    const token = localStorage.getItem('topsis_token');
    if (token) {
      try {
        const u = await api.getMe();
        setUsuario(u);
      } catch {
        localStorage.removeItem('topsis_token');
      }
    }

    // 3. Carrega critérios e executa TOPSIS inicial
    try {
      const crit = await api.getCriterios();
      setCriterios(crit);

      // Simulação inicial padrão
      const resTopsis = await api.executarTOPSIS();
      setRanking(resTopsis.ranking);
      setSimulacaoId(resTopsis.simulacaoId);
      setTempoExecucaoMs(resTopsis.tempoExecucaoMs);
    } catch (err) {
      setErro(err.message || 'Erro ao carregar dados iniciais');
    } finally {
      setCarregando(false);
    }
  }

  async function handleExecutarTopsis(pesosCustomizados) {
    setCarregando(true);
    setErro('');
    try {
      const res = await api.executarTOPSIS(pesosCustomizados, 'Simulação interativa com pesos ajustados');
      setRanking(res.ranking);
      setSimulacaoId(res.simulacaoId);
      setTempoExecucaoMs(res.tempoExecucaoMs);
    } catch (err) {
      setErro(err.message || 'Falha ao processar TOPSIS');
    } finally {
      setCarregando(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('topsis_token');
    setUsuario(null);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      <Navbar
        usuario={usuario}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenCadastro={() => setIsCadastroOpen(true)}
        onOpenHistorico={() => setIsHistoricoOpen(true)}
        apiOnline={apiOnline}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner de Apresentação e Contexto Acadêmico */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-brand-900/40 border border-brand-700/50 text-[11px] font-semibold text-emerald-400 mb-2">
                <Zap className="h-3.5 w-3.5" />
                <span>Normas ISO/IEC 12207 & 25010 • ODS 7 ONU</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Plataforma de Avaliação Multicritério TOPSIS
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Mensuração da vulnerabilidade social e priorização de investimentos em energia renovável.
                Algoritmo de proximidade com soluções ideais positiva (<i>A</i><sup>+</sup>) e negativa (<i>A</i><sup>-</sup>).
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={inicializar}
                disabled={carregando}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 hover:text-white transition"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${carregando ? 'animate-spin' : ''}`} />
                <span>Recarregar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mensagem de Erro (se houver) */}
        {erro && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-800/80 rounded-2xl flex items-center space-x-3 text-xs text-red-200">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* 1. Cards de Indicadores Executivos (KPIs) */}
        <KpiCards ranking={ranking} tempoExecucaoMs={tempoExecucaoMs} />

        {/* 2. Sliders de Ajuste dos Critérios TOPSIS */}
        <TopsisSliders
          criterios={criterios}
          onExecutar={handleExecutarTopsis}
          carregando={carregando}
        />

        {/* 3. Tabela do Ranking com Detalhes e Exportação */}
        <RankingTable ranking={ranking} simulacaoId={simulacaoId} />

        {/* 4. Gráfico Comparativo e Mapa Georreferenciado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RankingChart ranking={ranking} />
          <VulnerabilidadeMap ranking={ranking} />
        </div>
      </main>

      {/* Rodapé Acadêmico Institucional */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          Universidade SENAI CIMATEC • Engenharia da Computação • Disciplina: Desenvolvimento Web
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Roteiro Técnico elaborado por Prof. Me. Celso Barreto com base nas normas ISO/IEC 12207 e 25010.
        </p>
      </footer>

      {/* Modais do Sistema */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(u) => setUsuario(u)}
      />

      <CadastroMunicipioModal
        isOpen={isCadastroOpen}
        onClose={() => setIsCadastroOpen(false)}
        onMunicipioCriado={inicializar}
        usuario={usuario}
      />

      <HistoricoModal
        isOpen={isHistoricoOpen}
        onClose={() => setIsHistoricoOpen(false)}
      />
    </div>
  );
}
