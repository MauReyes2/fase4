import TicketList from "@/components/tickets/TicketList";
import { getUserTickets } from "@/app/actions/ticket-actions";

export default async function TicketsPage() {
  const demoUserId = "00000000-0000-0000-0000-000000000001";

  const tickets = await getUserTickets(demoUserId);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <TicketList tickets={tickets} />
    </main>
  );
}
