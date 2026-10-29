"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UrgencyLevel, ImpactLevel, ServiceType } from "@prisma/client";

export async function getCatalogs() {
  const [categories, locations, priorities] = await Promise.all([
    prisma.serviceCategory.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
    }),
    prisma.location.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
    }),
    prisma.slaPriority.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    }),
  ]);

  return { categories, locations, priorities };
}

export async function getUserTickets(userId: string) {
  const tickets = await prisma.ticket.findMany({
    where: { solicitanteId: userId },
    include: {
      category: true,
      location: true,
      slaPriority: true,
      solicitante: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return tickets;
}

export async function createTicket(formData: FormData) {
  const solicitanteId = formData.get("solicitanteId") as string;
  const titulo = formData.get("titulo") as string;
  const descripcion = formData.get("descripcion") as string;
  const categoryId = formData.get("categoryId") as string;
  const locationId = formData.get("locationId") as string;
  const serviceType = (formData.get("serviceType") as ServiceType) || "INCIDENTE";
  const urgencia = formData.get("urgencia") as UrgencyLevel;
  const impacto = formData.get("impacto") as ImpactLevel;

  if (!solicitanteId || !titulo || !descripcion || !categoryId || !locationId || !urgencia || !impacto) {
    throw new Error("Faltan campos obligatorios para crear el ticket");
  }

  const ticket = await prisma.ticket.create({
    data: {
      titulo,
      descripcion,
      serviceType,
      urgencia,
      impacto,
      solicitanteId,
      locationId,
      categoryId,
    },
  });

  revalidatePath("/tickets");
  revalidatePath("/tickets/nuevo");

  return ticket;
}
