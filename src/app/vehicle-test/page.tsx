"use client";

import { useState, useEffect } from "react";

// ============ Tipos ============

interface Vehicle {
  id: number; brandId: number; driverId: number; plate: string;
  model: string; color: string; year: number; passengerCapacity: number;
  status: string; createdAt: string;
}

interface Marca {
  id: number; nombre: string; descripcion: string | null;
}

interface Tarifa {
  id: number; precioKm: number; tarifaBase: number; tarifaCancelacion: number;
  porcentajeComision: number; fechaInicioVigencia: string; fechaFinVigencia: string | null;
}

interface ConfigItem {
  nombre: string; valor: string; descripcion: string;
}

export default function VehiclesTestPage() {

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------- Vehículos (ya existente) ----------
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleForm, setVehicleForm] = useState({
    brandId: "1", driverId: "1", plate: "", model: "",
    color: "", year: "2024", passengerCapacity: "4"
  });

  async function loadVehicles() {
    const res = await fetch("/api/vehicles");
    const json = await res.json();
    setVehicles(json.data ?? []);
  }

  async function handleCreateVehicle(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandId: Number(vehicleForm.brandId),
        driverId: Number(vehicleForm.driverId),
        plate: vehicleForm.plate,
        model: vehicleForm.model,
        color: vehicleForm.color,
        year: Number(vehicleForm.year),
        passengerCapacity: Number(vehicleForm.passengerCapacity)
      })
    });
    const json = await res.json();
    setMessage(json.message + (json.error ? `: ${json.error}` : ""));
    await loadVehicles();
    setLoading(false);
  }

  // ---------- Marca ----------
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [marcaForm, setMarcaForm] = useState({ nombre: "", descripcion: "" });

  async function loadMarcas() {
    const res = await fetch("/api/marcas");
    const json = await res.json();
    setMarcas(json.data ?? []);
  }

  async function handleCreateMarca(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/marcas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(marcaForm)
    });
    const json = await res.json();
    setMessage(json.message + (json.error ? `: ${json.error}` : ""));
    await loadMarcas();
    setLoading(false);
  }

  // ---------- Tarifa ----------
  const [tarifaVigente, setTarifaVigente] = useState<Tarifa | null>(null);
  const [tarifaForm, setTarifaForm] = useState({
    precioKm: "0.5", tarifaBase: "2", tarifaCancelacion: "1", porcentajeComision: "30"
  });

  async function loadTarifa() {
    const res = await fetch("/api/tarifas");
    const json = await res.json();
    setTarifaVigente(json.data ?? null);
  }

  async function handleCreateTarifa(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/tarifas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        precioKm: Number(tarifaForm.precioKm),
        tarifaBase: Number(tarifaForm.tarifaBase),
        tarifaCancelacion: Number(tarifaForm.tarifaCancelacion),
        porcentajeComision: Number(tarifaForm.porcentajeComision)
      })
    });
    const json = await res.json();
    setMessage(json.message + (json.error ? `: ${json.error}` : ""));
    await loadTarifa();
    setLoading(false);
  }

  // ---------- Configuración ----------
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [configForm, setConfigForm] = useState({ nombre: "", valor: "", descripcion: "" });

  async function loadConfigs() {
    const res = await fetch("/api/configuracion");
    const json = await res.json();
    setConfigs(json.data ?? []);
  }

  async function handleSetConfig(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/configuracion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(configForm)
    });
    const json = await res.json();
    setMessage(json.message + (json.error ? `: ${json.error}` : ""));
    await loadConfigs();
    setLoading(false);
  }

  useEffect(() => {
    loadVehicles();
    loadMarcas();
    loadTarifa();
    loadConfigs();
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>

      <h1>Panel de pruebas — Decarrerita</h1>
      <p style={{ color: "#666" }}>Página temporal para validar Vehículos, Marca, Tarifa y Configuración.</p>

      {message && (
        <div style={{ padding: 12, background: "#f0f0f0", marginBottom: 24, borderRadius: 6 }}>
          {message}
        </div>
      )}

      {/* ===================== MARCA ===================== */}
      <section style={{ marginBottom: 40, borderTop: "2px solid #ddd", paddingTop: 16 }}>
        <h2>Marca (catálogo)</h2>
        <form onSubmit={handleCreateMarca} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input placeholder="Nombre" value={marcaForm.nombre}
            onChange={e => setMarcaForm({ ...marcaForm, nombre: e.target.value })} />
          <input placeholder="Descripción" value={marcaForm.descripcion}
            onChange={e => setMarcaForm({ ...marcaForm, descripcion: e.target.value })} />
          <button type="submit" disabled={loading}>Crear marca</button>
        </form>
        <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th></tr></thead>
          <tbody>
            {marcas.map(m => (
              <tr key={m.id}><td>{m.id}</td><td>{m.nombre}</td><td>{m.descripcion}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ===================== TARIFA ===================== */}
      <section style={{ marginBottom: 40, borderTop: "2px solid #ddd", paddingTop: 16 }}>
        <h2>Tarifa vigente</h2>
        <form onSubmit={handleCreateTarifa} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          <input placeholder="Precio por km" value={tarifaForm.precioKm}
            onChange={e => setTarifaForm({ ...tarifaForm, precioKm: e.target.value })} />
          <input placeholder="Tarifa base" value={tarifaForm.tarifaBase}
            onChange={e => setTarifaForm({ ...tarifaForm, tarifaBase: e.target.value })} />
          <input placeholder="Tarifa cancelación" value={tarifaForm.tarifaCancelacion}
            onChange={e => setTarifaForm({ ...tarifaForm, tarifaCancelacion: e.target.value })} />
          <input placeholder="% Comisión" value={tarifaForm.porcentajeComision}
            onChange={e => setTarifaForm({ ...tarifaForm, porcentajeComision: e.target.value })} />
          <button type="submit" disabled={loading} style={{ gridColumn: "span 2" }}>
            Crear nueva tarifa (cierra la anterior automáticamente)
          </button>
        </form>

        {tarifaVigente ? (
          <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              <tr><td><strong>ID</strong></td><td>{tarifaVigente.id}</td></tr>
              <tr><td><strong>Precio/km</strong></td><td>{tarifaVigente.precioKm}</td></tr>
              <tr><td><strong>Tarifa base</strong></td><td>{tarifaVigente.tarifaBase}</td></tr>
              <tr><td><strong>Penalización cancelación</strong></td><td>{tarifaVigente.tarifaCancelacion}</td></tr>
              <tr><td><strong>% Comisión</strong></td><td>{tarifaVigente.porcentajeComision}</td></tr>
              <tr><td><strong>Vigente desde</strong></td><td>{tarifaVigente.fechaInicioVigencia}</td></tr>
            </tbody>
          </table>
        ) : <p>No hay tarifa vigente.</p>}
      </section>

      {/* ===================== CONFIGURACIÓN ===================== */}
      <section style={{ marginBottom: 40, borderTop: "2px solid #ddd", paddingTop: 16 }}>
        <h2>Configuración del sistema</h2>
        <form onSubmit={handleSetConfig} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input placeholder="nombre (ej: recargo_nocturno_porcentaje)" value={configForm.nombre}
            onChange={e => setConfigForm({ ...configForm, nombre: e.target.value })} />
          <input placeholder="valor" value={configForm.valor}
            onChange={e => setConfigForm({ ...configForm, valor: e.target.value })} />
          <input placeholder="descripción" value={configForm.descripcion}
            onChange={e => setConfigForm({ ...configForm, descripcion: e.target.value })} />
          <button type="submit" disabled={loading}>Guardar (crea o actualiza)</button>
        </form>
        <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead><tr><th>Nombre</th><th>Valor</th><th>Descripción</th></tr></thead>
          <tbody>
            {configs.map(c => (
              <tr key={c.nombre}><td>{c.nombre}</td><td>{c.valor}</td><td>{c.descripcion}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ===================== VEHÍCULOS ===================== */}
      <section style={{ marginBottom: 40, borderTop: "2px solid #ddd", paddingTop: 16 }}>
        <h2>Vehículos</h2>
        <form onSubmit={handleCreateVehicle} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          <input placeholder="Brand ID" value={vehicleForm.brandId}
            onChange={e => setVehicleForm({ ...vehicleForm, brandId: e.target.value })} />
          <input placeholder="Driver ID" value={vehicleForm.driverId}
            onChange={e => setVehicleForm({ ...vehicleForm, driverId: e.target.value })} />
          <input placeholder="Placa" value={vehicleForm.plate}
            onChange={e => setVehicleForm({ ...vehicleForm, plate: e.target.value })} />
          <input placeholder="Modelo" value={vehicleForm.model}
            onChange={e => setVehicleForm({ ...vehicleForm, model: e.target.value })} />
          <input placeholder="Color" value={vehicleForm.color}
            onChange={e => setVehicleForm({ ...vehicleForm, color: e.target.value })} />
          <input placeholder="Año" value={vehicleForm.year}
            onChange={e => setVehicleForm({ ...vehicleForm, year: e.target.value })} />
          <input placeholder="Capacidad" value={vehicleForm.passengerCapacity}
            onChange={e => setVehicleForm({ ...vehicleForm, passengerCapacity: e.target.value })} />
          <button type="submit" disabled={loading}>Crear vehículo</button>
        </form>
        <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead><tr><th>ID</th><th>Placa</th><th>Modelo</th><th>Marca</th><th>Chofer</th><th>Estado</th></tr></thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.id}>
                <td>{v.id}</td><td>{v.plate}</td><td>{v.model}</td>
                <td>{v.brandId}</td><td>{v.driverId}</td><td>{v.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}