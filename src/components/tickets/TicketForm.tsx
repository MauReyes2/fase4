"use client";

import { useState } from "react";
import { createTicket } from "@/app/actions/ticket-actions";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  nombre: string;
  parentId: string | null;
};

type Location = {
  id: string;
  nombre: string;
};

export default function TicketForm({
  categories,
  locations,
  userId,
}: {
  categories: Category[];
  locations: Location[];
  userId: string;
}) {
  const router = useRouter();
  const [urgencia, setUrgencia] = useState("MEDIA");
  const [impacto, setImpacto] = useState("MEDIO");
  const [loading, setLoading] = useState(false);

  const padres = categories.filter((c) => c.parentId === null);
  const hijos = (parentId: string) => categories.filter((c) => c.parentId === parentId);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      formData.append("solicitanteId", userId);
      formData.append("urgencia", urgencia);
      formData.append("impacto", impacto);
      await createTicket(formData);
      router.push("/tickets");
    } catch (e) {
      console.error(e);
      alert("Error al crear el ticket");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Título</label>
        <input name="titulo" required className="w-full border rounded p-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea name="descripcion" required className="w-full border rounded p-2" rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Sede / Ubicación</label>
          <select name="locationId" required className="w-full border rounded p-2">
            <option value="">Seleccione</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{l.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Tipo de Servicio</label>
          <select name="serviceType" className="w-full border rounded p-2">
            <option value="INCIDENTE">Incidente</option>
            <option value="PETICION_SERVICIO">Petición de Servicio</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Categoría (jerárquica)</label>
        <select name="categoryId" required className="w-full border rounded p-2">
          <option value="">Seleccione categoría</option>
          {padres.map((p) => (
            <optgroup key={p.id} label={p.nombre}>
              {hijos(p.id).length === 0 && <option value={p.id}>{p.nombre}</option>}
              {hijos(p.id).map((h) => (
                <option key={h.id} value={h.id}> - {h.nombre}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="border rounded p-4">
        <label className="block text-sm font-medium mb-2">Matriz de Urgencia / Impacto</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs">Urgencia</label>
            <select value={urgencia} onChange={(e) => setUrgencia(e.target.value)} className="w-full border rounded p-2">
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
              <option value="CRITICA">Crítica</option>
            </select>
          </div>
          <div>
            <label className="block text-xs">Impacto</label>
            <select value={impacto} onChange={(e) => setImpacto(e.target.value)} className="w-full border rounded p-2">
              <option value="BAJO">Bajo</option>
              <option value="MEDIO">Medio</option>
              <option value="ALTO">Alto</option>
              <option value="CRITICO">Crítico</option>
            </select>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? "Creando..." : "Crear Ticket"}
      </button>
    </form>
  );
}
