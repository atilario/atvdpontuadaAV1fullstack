import React from 'react';
import { Building2, Award, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

export default function KpiCards({ ranking, tempoExecucaoMs }) {
  if (!ranking || ranking.length === 0) return null;

  const totalMunicipios = ranking.length;
  const mediaCi = (
    ranking.reduce((acc, curr) => acc + curr.ci, 0) / totalMunicipios
  ).toFixed(4);

  const melhorDesempenho = ranking[0]; // Maior Ci (Menos vulnerável)
  const maiorVulnerabilidade = ranking[ranking.length - 1]; // Menor Ci (Mais vulnerável)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Municípios */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg relative overflow-hidden group hover:border-brand-500/40 transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Alternativas Avaliadas</p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalMunicipios}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Municípios / Comunidades</p>
          </div>
          <div className="p-3 bg-brand-950/60 border border-brand-800/40 rounded-xl text-brand-400">
            <Building2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Média Ci */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Média Coeficiente (Ci)</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{mediaCi}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Proximidade à Solução Ideal</p>
          </div>
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/40 rounded-xl text-emerald-400">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Menos Vulnerável (Top 1) */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Menor Vulnerabilidade (Top 1)</p>
            <h3 className="text-lg font-bold text-blue-400 mt-1 truncate max-w-[170px]" title={melhorDesempenho.nome}>
              {melhorDesempenho.nome}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Ci = <span className="font-semibold text-slate-200">{melhorDesempenho.ci}</span>
            </p>
          </div>
          <div className="p-3 bg-blue-950/60 border border-blue-800/40 rounded-xl text-blue-400">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Mais Crítico / Prioritário */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-amber-400/90">Maior Vulnerabilidade Social</p>
            <h3 className="text-lg font-bold text-amber-300 mt-1 truncate max-w-[170px]" title={maiorVulnerabilidade.nome}>
              {maiorVulnerabilidade.nome}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Prioridade 1 em Políticas Públicas
            </p>
          </div>
          <div className="p-3 bg-amber-950/60 border border-amber-800/40 rounded-xl text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
