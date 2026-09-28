import React, { useEffect, useState } from 'react';
import { X, History, Calendar, Clock, Download, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

export default function HistoricoModal({ isOpen, onClose, onCarregarSimulacao }) {
  const [simulacoes, setSimulacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      carregarHistorico();
    }
  }, [isOpen]);

  async function carregarHistorico() {
    setCarregando(true);
    try {
      const data = await api.getHistorico();
      setSimulacoes(data);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setCarregando(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-brand-900/40 border border-brand-700/50 rounded-xl text-brand-400">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Histórico de Simulações TOPSIS</h2>
            <p className="text-xs text-slate-400">Auditoria e rastreabilidade científica de simulações</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {carregando ? (
            <p className="text-xs text-slate-400 text-center py-8">Carregando histórico do banco...</p>
          ) : simulacoes.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">Nenhuma simulação registrada até o momento.</p>
          ) : (
            simulacoes.map((sim) => {
              const dataFormatada = new Date(sim.data_execucao).toLocaleString('pt-BR');
              const tempoMs = sim.parametros?.tempoExecucaoMs || 0;

              return (
                <div
                  key={sim.id}
                  className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-emerald-400">
                        Simulação #{sim.id}
                      </span>
                      <span className="text-[11px] text-slate-300 font-medium truncate max-w-xs">
                        {sim.descricao}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 mt-1.5 text-[11px] text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{dataFormatada}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{tempoMs} ms</span>
                      </span>
                      {sim.usuario_nome && (
                        <span>Por: <strong className="text-slate-300">{sim.usuario_nome}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      href={api.getDownloadCsvUrl(sim.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition"
                      title="Exportar CSV desta simulação"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
