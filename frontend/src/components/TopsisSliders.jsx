import React, { useState, useEffect } from 'react';
import { Sliders, Play, RotateCcw, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function TopsisSliders({ criterios, onExecutar, carregando }) {
  const [pesos, setPesos] = useState([]);

  useEffect(() => {
    if (criterios && criterios.length > 0) {
      setPesos(criterios.map((c) => parseFloat(c.peso) || 0.20));
    }
  }, [criterios]);

  if (!criterios || criterios.length === 0) return null;

  const somaPesos = pesos.reduce((acc, p) => acc + p, 0);
  const somaPorcento = Math.round(somaPesos * 100);
  const somaValida = Math.abs(somaPesos - 1.0) < 0.01;

  function handleChange(index, valorInt) {
    const novoValor = valorInt / 100;
    const novosPesos = [...pesos];
    novosPesos[index] = novoValor;
    setPesos(novosPesos);
  }

  function redefinirIguais() {
    const igual = 1 / criterios.length;
    setPesos(criterios.map(() => Number(igual.toFixed(4))));
  }

  function normalizarAutomatico() {
    if (somaPesos === 0) return redefinirIguais();
    const normalizados = pesos.map((p) => Number((p / somaPesos).toFixed(4)));
    setPesos(normalizados);
  }

  function handleExecutar() {
    onExecutar(pesos);
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-950/60 border border-emerald-800/40 rounded-xl text-emerald-400">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Parametrização Multicritério dos Pesos (w)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Ajuste a relevância de cada indicador. A soma total deve totalizar 100% (1,0).
            </p>
          </div>
        </div>

        {/* Status da Soma */}
        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              somaValida
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                : 'bg-amber-950/60 border-amber-700/60 text-amber-300'
            }`}
          >
            {somaValida ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4" />}
            <span>Soma: {somaPorcento}%</span>
          </div>

          <button
            onClick={normalizarAutomatico}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 hover:text-white transition flex items-center space-x-1"
            title="Ajustar automaticamente os pesos para somar 100%"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            <span className="hidden md:inline">Auto-Ajustar</span>
          </button>

          <button
            onClick={redefinirIguais}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition"
            title="Distribuir pesos iguais"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid de Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {criterios.map((c, idx) => {
          const valorPercentual = Math.round((pesos[idx] || 0) * 100);
          const isBeneficio = c.tipo === 'beneficio';

          return (
            <div
              key={c.id}
              className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-white truncate max-w-[190px]" title={c.nome}>
                  <span className="text-brand-400 font-bold mr-1">{c.codigo}:</span>
                  {c.nome}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    isBeneficio
                      ? 'bg-blue-950 text-blue-300 border border-blue-800/50'
                      : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                  }`}
                >
                  {c.tipo}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mb-2 truncate" title={c.descricao}>
                {c.descricao} ({c.unidade})
              </p>

              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={valorPercentual}
                  onChange={(e) => handleChange(idx, parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <span className="text-xs font-mono font-bold text-emerald-400 w-10 text-right">
                  {valorPercentual}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botão de Execução do TOPSIS */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleExecutar}
          disabled={carregando}
          className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-950/50 transition disabled:opacity-50 text-sm"
        >
          <Play className="h-4 w-4 fill-slate-950" />
          <span>{carregando ? 'Calculando Matriz TOPSIS...' : 'Executar Simulação TOPSIS'}</span>
        </button>
      </div>
    </div>
  );
}
