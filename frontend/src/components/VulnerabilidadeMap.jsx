import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { MapPin, Info } from 'lucide-react';
import L from 'leaflet';

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function VulnerabilidadeMap({ ranking }) {
  if (!ranking || ranking.length === 0) return null;

  // Centro aproximado do Estado da Bahia / Nordeste
  const defaultCenter = [-12.5, -41.0];
  const zoom = 6;

  function getColorByCi(ci) {
    if (ci >= 0.65) return '#22c55e'; // Verde (Baixa vulnerabilidade / bom)
    if (ci >= 0.40) return '#eab308'; // Amarelo (Médio)
    return '#ef4444'; // Vermelho (Alta vulnerabilidade / crítico)
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-950/60 border border-emerald-800/40 rounded-xl text-emerald-400">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Mapeamento Georreferenciado de Vulnerabilidade</h3>
            <p className="text-xs text-slate-400">Distribuição espacial dos municípios avaliados</p>
          </div>
        </div>

        {/* Legenda de Cores */}
        <div className="flex items-center space-x-3 text-[11px] bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Resiliente (Ci ≥ 0.65)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
            <span className="text-slate-300">Moderado</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
            <span className="text-slate-300">Crítico (Ci &lt; 0.40)</span>
          </div>
        </div>
      </div>

      <div className="h-80 w-full rounded-xl overflow-hidden border border-slate-800 relative z-10">
        <MapContainer
          center={defaultCenter}
          zoom={zoom}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', background: '#090d16' }}
        >
          <ChangeView center={defaultCenter} zoom={zoom} />
          {/* Cartografia CartoDB Dark Matter para harmonia visual */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {ranking.map((m) => {
            if (!m.latitude || !m.longitude) return null;
            const cor = getColorByCi(m.ci);

            return (
              <CircleMarker
                key={m.id}
                center={[parseFloat(m.latitude), parseFloat(m.longitude)]}
                radius={8 + Math.round(m.ci * 8)}
                pathOptions={{
                  fillColor: cor,
                  fillOpacity: 0.8,
                  color: '#ffffff',
                  weight: 1.5,
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-1 text-slate-900 text-xs">
                    <h4 className="font-bold text-sm text-slate-950 mb-0.5">
                      {m.posicao}º - {m.nome} ({m.uf})
                    </h4>
                    <p className="text-slate-700">
                      <strong>Coeficiente Ci:</strong> {m.ci.toFixed(4)}
                    </p>
                    {m.populacao && (
                      <p className="text-slate-600 text-[11px]">
                        População: {Number(m.populacao).toLocaleString('pt-BR')} hab.
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 mt-1 font-mono">
                      Coord: {m.latitude.toFixed(2)}, {m.longitude.toFixed(2)}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
