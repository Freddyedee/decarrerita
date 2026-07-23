"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";

// ============================================================================
// 1. FÓRMULA DE HAVERSINE (Nuestro "Plan B" Offline)
// ============================================================================
function calcularHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// ============================================================================
// 2. ÍCONOS PERSONALIZADOS CON TAILWIND (Verde = Origen, Rojo = Destino)
// ============================================================================
const iconoOrigen = L.divIcon({
  className: "custom-pin",
  html: `<div class="w-6 h-6 bg-[#0E7C86] border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white text-[10px] font-bold">A</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const iconoDestino = L.divIcon({
  className: "custom-pin",
  html: `<div class="w-6 h-6 bg-[#C0392B] border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white text-[10px] font-bold">B</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Interfaz para notificar al formulario padre las coordenadas y la distancia
export interface DatosRuta {
  origen: [number, number] | null;
  destino: [number, number] | null;
  distanciaKm: number;
}

interface MapaTrasladoProps {
  onRutaCalculada: (datos: DatosRuta) => void;
}

// ============================================================================
// 3. COMPONENTE PRINCIPAL DEL MAPA
// ============================================================================
export default function MapaTraslado({ onRutaCalculada }: MapaTrasladoProps) {
  // Coordenadas por defecto (Puerto Ordaz / Guayana City)
  const centroPorDefecto: [number, number] = [8.2968, -62.7116];

  const [origen, setOrigen] = useState<[number, number] | null>(null);
  const [destino, setDestino] = useState<[number, number] | null>(null);
  const [rutaCoords, setRutaCoords] = useState<[number, number][]>([]);
  const [calculando, setCalculando] = useState(false);

  // Componente interno para capturar los clics del usuario sobre el mapa
  function ManejadorClics() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (!origen) {
          setOrigen([lat, lng]);
        } else if (!destino) {
          setDestino([lat, lng]);
        } else {
          // Si ya están ambos, un tercer clic reinicia el mapa y pone el origen nuevo
          setOrigen([lat, lng]);
          setDestino(null);
          setRutaCoords([]);
          onRutaCalculada({ origen: [lat, lng], destino: null, distanciaKm: 0 });
        }
      },
    });
    return null;
  }

  // Efecto: Cuando cambian Origen y Destino, calculamos la ruta
  useEffect(() => {
    async function procesarRuta() {
      if (!origen || !destino) return;
      setCalculando(true);

      try {
        // --------------------------------------------------------------------
        // PLAN A: CONSULTA A API OSRM (Online con timeout de seguridad)
        // --------------------------------------------------------------------
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos máximo

        // OSRM espera longitud,latitud separadas por punto y coma
        const url = `https://router.project-osrm.org/route/v1/driving/${origen[1]},${origen[0]};${destino[1]},${destino[0]}?overview=full&geometries=geojson`;
        
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error("Fallo en API de rutas");
        const data = await res.json();

        // Extraemos distancia real por calle y convertimos metros a km
        const distanciaKm = Number((data.routes[0].distance / 1000).toFixed(2));
        
        // Mapeamos la geometría de la calle (OSRM da [lng, lat], Leaflet usa [lat, lng])
        const calles: [number, number][] = data.routes[0].geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]]
        );

        setRutaCoords(calles);
        onRutaCalculada({ origen, destino, distanciaKm });
        console.log("🟢 [Modo Online]: Ruta calculada con OSRM:", distanciaKm, "km");

      } catch (error) {
        // --------------------------------------------------------------------
        // PLAN B (MODO OFFLINE SILENCIOSO): FÓRMULA DE HAVERSINE
        // --------------------------------------------------------------------
        console.warn("⚠️ [Modo Offline Silencioso Activado]: No hay internet o red lenta. Usando Haversine.");
        
        const distanciaKm = calcularHaversine(origen[0], origen[1], destino[0], destino[1]);
        
        // En modo offline trazamos una línea recta entre Origen y Destino
        setRutaCoords([origen, destino]);
        onRutaCalculada({ origen, destino, distanciaKm });
      } finally {
        setCalculando(false);
      }
    }

    procesarRuta();
  }, [origen, destino]);

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-xl overflow-hidden border border-[#E2E4E9] shadow-sm">
      
      {/* Banner flotante de instrucciones / estado */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-md px-4 py-2 rounded-lg shadow border border-[#E2E4E9] text-xs font-medium text-slate-700 flex items-center gap-2">
        {!origen && <span>📍 Haz clic en el mapa para marcar tu <b>Punto de Partida (A)</b></span>}
        {origen && !destino && <span>📍 Ahora haz clic para marcar tu <b>Destino (B)</b></span>}
        {origen && destino && !calculando && (
          <span className="text-[#0E7C86] font-semibold">✨ ¡Ruta trazada! Haz clic en cualquier parte para reiniciar.</span>
        )}
        {calculando && <span>⏳ Calculando mejor ruta...</span>}
      </div>

      {/* Botón flotante para limpiar */}
      {(origen || destino) && (
        <button
          type="button"
          onClick={() => {
            setOrigen(null);
            setDestino(null);
            setRutaCoords([]);
            onRutaCalculada({ origen: null, destino: null, distanciaKm: 0 });
          }}
          className="absolute top-4 right-4 z-[1000] bg-[#C0392B] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow hover:bg-red-700 transition-colors"
        >
          Limpiar Puntos
        </button>
      )}

      {/* Contenedor del Mapa */}
      <MapContainer
        center={centroPorDefecto}
        zoom={13}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <ManejadorClics />

        {origen && <Marker position={origen} icon={iconoOrigen} />}
        {destino && <Marker position={destino} icon={iconoDestino} />}
        
        {/* Línea azul del recorrido */}
        {rutaCoords.length > 0 && (
          <Polyline
            positions={rutaCoords}
            color="#0E7C86"
            weight={5}
            opacity={0.8}
          />
        )}
      </MapContainer>
    </div>
  );
}