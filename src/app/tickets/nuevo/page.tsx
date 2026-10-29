import TicketForm from "@/components/tickets/TicketForm";
import { getCatalogs } from "@/app/actions/ticket-actions";

export default async function NuevoTicketPage() {
  const demoUserId = "00000000-0000-0000-0000-000000000001";

  const { categories, locations } = await getCatalogs();

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear Nuevo Ticket</h1>
      <TicketForm categories={categories} locations={locations} userId={demoUserId} />
    </main>
  );
}
