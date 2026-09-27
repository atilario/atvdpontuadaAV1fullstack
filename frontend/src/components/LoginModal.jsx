import React, { useState } from 'react';
import { X, Lock, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const data = await api.login(email, senha);
      localStorage.setItem('topsis_token', data.token);
      onLoginSuccess(data.usuario);
      onClose();
    } catch (err) {
      setErro(err.message || 'Falha na autenticação');
    } finally {
      setCarregando(false);
    }
  }

  function preencherDemoAdmin() {
    setEmail('admin@cimatec.br');
    setSenha('admin123');
  }

  function preencherDemoPesquisador() {
    setEmail('pesquisador@cimatec.br');
    setSenha('admin123');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-brand-900/40 border border-brand-700/50 rounded-xl text-brand-400">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Autenticação de Usuário</h2>
            <p className="text-xs text-slate-400">Acesse com JWT para editar critérios e dados</p>
          </div>
        </div>

        {erro && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800/60 rounded-xl flex items-center space-x-2 text-xs text-red-300">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@cimatec.br"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Senha</label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-2.5 rounded-xl text-sm transition shadow-lg shadow-brand-900/40 disabled:opacity-50"
          >
            {carregando ? 'Validando token...' : 'Entrar no Sistema'}
          </button>
        </form>

        {/* Atalhos para Demo rápida */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Contas de Teste (Clique para preencher):
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={preencherDemoAdmin}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-750 border border-slate-700 rounded-lg text-slate-300 text-left transition"
            >
              <div className="font-semibold text-emerald-400">Admin</div>
              <div className="text-[10px] text-slate-400 truncate">admin@cimatec.br</div>
            </button>
            <button
              type="button"
              onClick={preencherDemoPesquisador}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-750 border border-slate-700 rounded-lg text-slate-300 text-left transition"
            >
              <div className="font-semibold text-blue-400">Pesquisador</div>
              <div className="text-[10px] text-slate-400 truncate">pesquisador@cimatec.br</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
