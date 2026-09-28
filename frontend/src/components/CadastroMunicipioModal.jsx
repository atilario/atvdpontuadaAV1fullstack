import React, { useState } from 'react';
import { X, Building2, Plus, AlertCircle, Check } from 'lucide-react';
import { api } from '../services/api';

export default function CadastroMunicipioModal({ isOpen, onClose, onMunicipioCriado, usuario }) {
  const [nome, setNome] = useState('');
  const [uf, setUf] = useState('BA');
  const [populacao, setPopulacao] = useState('');
  const [idh, setIdh] = useState('0.700');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!usuario) {
      setErro('É necessário estar autenticado para cadastrar novos municípios.');
      return;
    }
    setErro('');
    setCarregando(true);

    try {
      await api.criarMunicipio({
        nome,
        uf,
        populacao: parseInt(populacao, 10) || 0,
        idh: parseFloat(idh) || 0.7,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      onMunicipioCriado();
      onClose();
    } catch (err) {
      setErro(err.message || 'Erro ao cadastrar');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-brand-900/40 border border-brand-700/50 rounded-xl text-brand-400">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Cadastrar Novo Município</h2>
            <p className="text-xs text-slate-400">Adicione uma nova alternativa geográfica ao banco</p>
          </div>
        </div>

        {erro && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800/60 rounded-xl flex items-center space-x-2 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Nome do Município</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Irecê"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">UF</label>
              <input
                type="text"
                maxLength="2"
                required
                value={uf}
                onChange={(e) => setUf(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono uppercase text-center focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">População Estimada</label>
              <input
                type="number"
                value={populacao}
                onChange={(e) => setPopulacao(e.target.value)}
                placeholder="Ex: 75000"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">IDH Municipal (0 a 1)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                max="1"
                value={idh}
                onChange={(e) => setIdh(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                required
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Ex: -11.3000"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-brand-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                required
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Ex: -41.8500"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          {!usuario && (
            <p className="text-[11px] text-amber-400 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/40">
              * Você precisa entrar como Administrador ou Pesquisador para salvar na base PostgreSQL.
            </p>
          )}

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-brand-500 hover:bg-brand-400 rounded-xl shadow-lg transition disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>{carregando ? 'Salvando...' : 'Cadastrar Município'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
