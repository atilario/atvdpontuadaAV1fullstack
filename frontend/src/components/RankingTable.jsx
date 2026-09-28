import React from 'react';
import { Download, Award, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

export default function RankingTable({ ranking, simulacaoId }) {
  if (!ranking || ranking.length === 0) return null;

  function baixarCsv() {
    if (!simulacaoId) return;
    window.open(api.getDownloadCsvUrl(simulacaoId), '_blank');
  }

  function getFaixaVulnerabilidade(ci) {
    if (ci >= 0.65) {
      return {
        label: 'Baixa Vulnerabilidade',
        classe: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
      };
    }
    if (ci >= 0.40) {
      return {
        label: 'Média Vulnerabilidade',
        classe: 'bg-yellow-950/80 text-yellow-300 border-yellow-800/60',
      };
    }
    return {
      label: 'Alta Vulnerabilidade (Crítico)',
      classe: 'bg-red-950/80 text-red-300 border-red-800/60 font-semibold',
    };
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden mb-8">
      {/* Header da Tabela */}
      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Resultados do Ranking TOPSIS</span>
            <span className="text-xs bg-brand-900/40 text-brand-300 border border-brand-700/40 px-2 py-0.5 rounded-full">
              Ordenado por Proximidade Relativa (Ci)
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Maior valor de Ci indica melhor desempenho relativo e menor vulnerabilidade energética.
          </p>
        </div>

        {simulacaoId && (
          <button
            onClick={baixarCsv}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Exportar CSV</span>
          </button>
        )}
      </div>

      {/* Tabela Responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
              <th className="py-3 px-4 text-center w-16">Posição</th>
              <th className="py-3 px-4">Município / Comunidade</th>
              <th className="py-3 px-4 text-center">UF</th>
              <th className="py-3 px-4 text-center">Distância D+</th>
              <th className="py-3 px-4 text-center">Distância D-</th>
              <th className="py-3 px-4 text-center">Coeficiente (Ci)</th>
              <th className="py-3 px-4 text-center">Classificação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {ranking.map((item) => {
              const faixa = getFaixaVulnerabilidade(item.ci);
              const isTop1 = item.posicao === 1;

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-800/40 transition ${
                    isTop1 ? 'bg-brand-950/20' : ''
                  }`}
                >
                  {/* Posição */}
                  <td className="py-3.5 px-4 text-center font-bold">
                    <span
                      className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs ${
                        isTop1
                          ? 'bg-amber-400 text-slate-950 font-black shadow-sm shadow-amber-400/30'
                          : item.posicao === 2
                          ? 'bg-slate-300 text-slate-950 font-bold'
                          : item.posicao === 3
                          ? 'bg-amber-700 text-white font-bold'
                          : 'text-slate-400 font-medium'
                      }`}
                    >
                      {item.posicao}
                    </span>
                  </td>

                  {/* Nome */}
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div className="flex items-center space-x-2">
                      <span>{item.nome}</span>
                      {isTop1 && (
                        <Award className="h-4 w-4 text-amber-400 inline" title="1º Lugar TOPSIS" />
                      )}
                    </div>
                  </td>

                  {/* UF */}
                  <td className="py-3.5 px-4 text-center text-slate-400 font-mono">
                    {item.uf}
                  </td>

                  {/* D+ */}
                  <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                    {item.distanciaPositiva.toFixed(4)}
                  </td>

                  {/* D- */}
                  <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                    {item.distanciaNegativa.toFixed(4)}
                  </td>

                  {/* Barra e Coeficiente Ci */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-brand-400 h-2 rounded-full"
                          style={{ width: `${Math.round(item.ci * 100)}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 text-xs">
                        {item.ci.toFixed(4)}
                      </span>
                    </div>
                  </td>

                  {/* Classificação */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 text-[11px] rounded-lg border ${faixa.classe}`}
                    >
                      {faixa.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
