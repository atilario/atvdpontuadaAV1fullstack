import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import { MapPin, RotateCcw, Satellite, Map as MapIcon, Moon, Sparkles, AlertTriangle, TrendingUp } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Corrige problema dos ícones padrão do Leaflet no bundler Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [-12.5, -41.0];
const DEFAULT_ZOOM = 6;

// Componente para redimensionamento e centralização estável
function MapController({ center, zoom, resetTrigger }) {
  const map = useMap();

  useEffect(() => {
    // Força o Leaflet a recalcular as dimensões do container após montagem do layout
    const timer1 = setTimeout(() => map.invalidateSize(), 150);
    const timer2 = setTimeout(() => map.invalidateSize(), 400);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [map]);

  useEffect(() => {
    if (resetTrigger > 0) {
      map.flyTo(center, zoom, { duration: 1.2 });
      map.invalidateSize();
    }
  }, [resetTrigger, center, zoom, map]);

  return null;
}

export default function VulnerabilidadeMap({ ranking }) {
  // 'satellite' como padrão para imagem orbital rica e colorida, com 'osm' e 'dark' como opções
  const [camadaTile, setCamadaTile] = useState('satellite');
  const [resetCount, setResetCount] = useState(0);

  if (!ranking || ranking.length === 0) return null;

  function getColorByCi(ci) {
    if (ci >= 0.65) return '#10b981'; // Esmeralda vivo (Baixa vulnerabilidade / resiliente)
    if (ci >= 0.40) return '#f59e0b'; // Âmbar dourado (Moderado)
    return '#ef4444'; // Vermelho vibrante (Alta vulnerabilidade / prioritário)
  }

  function getHaloColorByCi(ci) {
    if (ci >= 0.65) return 'rgba(16, 185, 129, 0.25)';
    if (ci >= 0.40) return 'rgba(245, 158, 11, 0.25)';
    return 'rgba(239, 68, 68, 0.35)';
  }

  const melhorMunicipio = ranking[0];
  const piorMunicipio = ranking[ranking.length - 1];

  return (
    <div className="bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl mb-8 flex flex-col transition-all">
      {/* Cabeçalho do Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-xl text-slate-950 shadow-md shadow-emerald-950/40">
            <MapPin className="h-5 w-5 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white tracking-tight">Mapeamento Georreferenciado</h3>
              <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {ranking.length} Municípios
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Distribuição espacial com raios e auras proporcionais ao índice TOPSIS
            </p>
          </div>
        </div>

        {/* Alternador de Estilos de Mapa */}
        <div className="flex items-center flex-wrap gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setCamadaTile('satellite')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              camadaTile === 'satellite'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Satélite de alta resolução com relevo e cidades"
          >
            <Satellite className="h-3.5 w-3.5" />
            <span>Satélite</span>
          </button>

          <button
            onClick={() => setCamadaTile('osm')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              camadaTile === 'osm'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Mapa tradicional colorido com ruas e municípios"
          >
            <MapIcon className="h-3.5 w-3.5" />
            <span>Colorido</span>
          </button>

          <button
            onClick={() => setCamadaTile('dark')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              camadaTile === 'dark'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Modo escuro minimalista para visualização noturna"
          >
            <Moon className="h-3.5 w-3.5" />
            <span>Noturno</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          {/* Botão de Recentralizar */}
          <button
            onClick={() => setResetCount((c) => c + 1)}
            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 rounded-lg transition"
            title="Recentralizar no Estado da Bahia"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Faixas e Destaques Rápidos */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2 text-[11px] bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <span className="text-slate-300">Resiliente (Ci ≥ 0.65)</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
            <span className="text-slate-300">Moderado</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
            <span className="text-slate-300">Crítico (Ci &lt; 0.40)</span>
          </div>
        </div>

        {/* Mini Destaque */}
        <div className="hidden md:flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-800/50">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>Top Resiliente: <strong className="text-emerald-300 font-semibold">{melhorMunicipio?.nome}</strong></span>
        </div>
      </div>

      {/* Container Leaflet com altura expandida e bordas suaves */}
      <div className="h-[430px] w-full rounded-xl overflow-hidden border border-slate-800 relative z-10 shadow-inner min-h-[430px]">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', minHeight: '430px', background: '#070b12' }}
        >
          <MapController
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            resetTrigger={resetCount}
          />

          {/* Camada Satélite Híbrido (Imagens orbitais + Rótulos de cidades) */}
          {camadaTile === 'satellite' && (
            <>
              <TileLayer
                key="esri-sat"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a>, Earthstar Geographics'
                maxZoom={18}
              />
              <TileLayer
                key="esri-labels"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; Esri &mdash; Boundaries & Places'
                maxZoom={18}
              />
            </>
          )}

          {/* Camada OpenStreetMap Colorida */}
          {camadaTile === 'osm' && (
            <TileLayer
              key="osm-tile"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
              subdomains={['a', 'b', 'c']}
              maxZoom={19}
            />
          )}

          {/* Camada Esri Dark Gray (Modo Noturno) */}
          {camadaTile === 'dark' && (
            <TileLayer
              key="esri-dark"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a> &mdash; Canvas Dark'
              maxZoom={16}
            />
          )}

          {/* Marcadores Estilizados com Anéis Luminosos (Auras) e Tooltips */}
          {ranking.map((m) => {
            const lat = parseFloat(m.latitude);
            const lng = parseFloat(m.longitude);
            if (isNaN(lat) || isNaN(lng)) return null;

            const ciVal = parseFloat(m.ci) || 0;
            const cor = getColorByCi(ciVal);
            const corHalo = getHaloColorByCi(ciVal);
            const raioPrincipal = 8 + Math.round(ciVal * 8);
            const raioHalo = raioPrincipal + 9;

            return (
              <React.Fragment key={m.id}>
                {/* 1. Anel externo difuso (Efeito de brilho/aura proporcional ao Ci) */}
                <CircleMarker
                  center={[lat, lng]}
                  radius={raioHalo}
                  pathOptions={{
                    fillColor: corHalo,
                    fillOpacity: 0.6,
                    stroke: false,
                  }}
                />

                {/* 2. Marcador principal com borda branca e tooltip ao passar o mouse */}
                <CircleMarker
                  center={[lat, lng]}
                  radius={raioPrincipal}
                  pathOptions={{
                    fillColor: cor,
                    fillOpacity: 0.95,
                    color: '#ffffff',
                    weight: 2.5,
                  }}
                >
                  {/* Tooltip flutuante rápido ao passar o mouse */}
                  <Tooltip direction="top" offset={[0, -raioPrincipal - 2]} opacity={1} className="custom-map-tooltip">
                    <div className="flex items-center space-x-1.5 font-sans">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: cor }}
                      ></span>
                      <strong className="text-white">#{m.posicao} {m.nome}</strong>
                      <span className="text-emerald-400 font-mono font-bold">({ciVal.toFixed(3)})</span>
                    </div>
                  </Tooltip>

                  {/* Popup com card completo ao clicar */}
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2 text-slate-100 min-w-[200px]">
                      {/* Topo do Popup com badge de posição */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/80">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          Posição #{m.posicao}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${cor}25`,
                            color: cor,
                            border: `1px solid ${cor}50`,
                          }}
                        >
                          {ciVal >= 0.65 ? 'Resiliente' : ciVal >= 0.40 ? 'Moderado' : 'Crítico'}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-white mb-1.5 leading-snug">
                        {m.nome} ({m.uf})
                      </h4>

                      {/* Coeficiente Ci com barra de progresso visual */}
                      <div className="mb-2">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-400">Coeficiente Ci:</span>
                          <span className="font-mono text-emerald-400 font-bold">{ciVal.toFixed(4)}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.round(ciVal * 100)}%`, backgroundColor: cor }}
                          ></div>
                        </div>
                      </div>

                      {/* Metadados */}
                      <div className="space-y-1 text-[11px] text-slate-300 pt-1 border-t border-slate-800/80">
                        {m.populacao && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">População:</span>
                            <span className="font-medium text-slate-200">{Number(m.populacao).toLocaleString('pt-BR')} hab.</span>
                          </div>
                        )}
                        <div className="flex justify-between font-mono text-[10px] text-slate-400">
                          <span>Latitude:</span>
                          <span>{lat.toFixed(4)}°</span>
                        </div>
                        <div className="flex justify-between font-mono text-[10px] text-slate-400">
                          <span>Longitude:</span>
                          <span>{lng.toFixed(4)}°</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
