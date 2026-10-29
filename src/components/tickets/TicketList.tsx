import Link from "next/link";

type Ticket = {
  id: string;
  folio: string;
  titulo: string;
  status: string;
  createdAt: Date;
  fechaLimite: Date | null;
  slaPriority?: { nombre: string; color: string | null } | null;
  category?: { nombre: string } | null;
};

function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    REGISTRADO: "bg-gray-200 text-gray-800",
    TRABAJO_EN_CURSO: "bg-blue-200 text-blue-800",
    SUSPENDIDO: "bg-yellow-200 text-yellow-800",
    RESUELTO: "bg-green-200 text-green-800",
    CERRADO: "bg-black text-white",
  };
  return map[status] || "bg-gray-200 text-gray-800";
}

export default function TicketList({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mis Solicitudes</h1>
        <Link href="/tickets/nuevo" className="bg-blue-600 text-white px-4 py-2 rounded">
          Nuevo Ticket
        </Link>
      </div>
      <div className="overflow-x-auto border rounded">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Folio</th>
              <th className="text-left p-2">Título</th>
              <th className="text-left p-2">Categoría</th>
              <th className="text-left p-2">Prioridad</th>
              <th className="text-left p-2">Estado</th>
              <th className="text-left p-2">Creado</th>
              <th className="text-left p-2">Fecha Límite SLA</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-2 font-mono">{t.folio}</td>
                <td className="p-2">{t.titulo}</td>
                <td className="p-2">{t.category?.nombre}</td>
                <td className="p-2">{t.slaPriority?.nombre || "-"}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(t.status)}`}>
                    {t.status}
                  </span>
                </td>
                <td className="p-2">{new Date(t.createdAt).toLocaleString()}</td>
                <td className="p-2">{t.fechaLimite ? new Date(t.fechaLimite).toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
