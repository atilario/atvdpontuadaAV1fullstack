import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BarChart3 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RankingChart({ ranking }) {
  if (!ranking || ranking.length === 0) return null;

  const labels = ranking.map((r) => r.nome);
  const dataCi = ranking.map((r) => r.ci);

  const data = {
    labels,
    datasets: [
      {
        label: 'Coeficiente de Proximidade (Ci)',
        data: dataCi,
        backgroundColor: dataCi.map((ci) => {
          if (ci >= 0.65) return 'rgba(34, 197, 94, 0.8)';
          if (ci >= 0.40) return 'rgba(234, 179, 8, 0.8)';
          return 'rgba(239, 68, 68, 0.8)';
        }),
        borderColor: dataCi.map((ci) => {
          if (ci >= 0.65) return '#22c55e';
          if (ci >= 0.40) return '#eab308';
          return '#ef4444';
        }),
        borderWidth: 1.5,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#4ade80',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => `Ci: ${context.parsed.y.toFixed(4)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        min: 0,
        max: 1.0,
        grid: {
          color: 'rgba(51, 65, 85, 0.4)',
        },
        ticks: {
          color: '#94a3b8',
          stepSize: 0.2,
        },
      },
    },
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl mb-8">
      <div className="flex items-center space-x-2.5 mb-4">
        <div className="p-2 bg-brand-950/60 border border-brand-800/40 rounded-xl text-brand-400">
          <BarChart3 className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Visualização Comparativa do Ranking TOPSIS</h3>
          <p className="text-xs text-slate-400">Dispersão dos coeficientes de proximidade relativa (0 = crítico, 1 = ideal)</p>
        </div>
      </div>
      <div className="h-72 w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
