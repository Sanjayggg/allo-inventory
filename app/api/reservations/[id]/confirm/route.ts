import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const reservation = await prisma.reservation.findUnique({
      where: {
        id,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    if (reservation.status !== "PENDING") {
      return NextResponse.json(
        { error: "Reservation already processed" },
        { status: 400 }
      );
    }

    if (reservation.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Reservation expired" },
        { status: 410 }
      );
    }

    const updatedReservation =
      await prisma.reservation.update({
        where: {
          id,
        },
        data: {
          status: "CONFIRMED",
        },
      });

    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to confirm reservation" },
      { status: 500 }
    );
  }
}