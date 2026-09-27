import React from 'react';
import { Sun, Zap, Shield, User, LogIn, LogOut, PlusCircle, History, BookOpen } from 'lucide-react';

export default function Navbar({
  usuario,
  onOpenLogin,
  onLogout,
  onOpenCadastro,
  onOpenHistorico,
  apiOnline,
}) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Identidade Visual */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <Sun className="h-6 w-6 text-slate-950 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight">TOPSIS</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Energia Renovável
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Vulnerabilidade Social & Transição Energética • SENAI CIMATEC
            </p>
          </div>
        </div>

        {/* Ações e Status */}
        <div className="flex items-center space-x-3">
          {/* Status do Backend */}
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${
                apiOnline ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-red-400'
              }`}
            ></span>
            <span className="text-slate-300">
              {apiOnline ? 'PostgreSQL & API Online' : 'Desconectado'}
            </span>
          </div>

          {/* Botão Swagger Docs */}
          <a
            href="http://localhost:3001/api-docs"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
            title="Visualizar documentação Swagger/OpenAPI"
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
            <span>Swagger API</span>
          </a>

          {/* Botão Histórico */}
          <button
            onClick={onOpenHistorico}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
          >
            <History className="h-3.5 w-3.5 text-brand-400" />
            <span className="hidden sm:inline">Histórico</span>
          </button>

          {/* Botão Novo Município */}
          <button
            onClick={onOpenCadastro}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-white bg-brand-700 hover:bg-brand-600 rounded-lg shadow-sm transition"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Novo Município</span>
          </button>

          {/* Autenticação */}
          {usuario ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-slate-200">{usuario.nome.split(' ')[0]}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">({usuario.perfil})</span>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                title="Sair da conta"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-800/50 rounded-lg transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
