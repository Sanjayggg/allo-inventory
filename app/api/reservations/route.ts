import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { productId, warehouseId, quantity } =
      await req.json();

    const result = await prisma.$transaction(
      async (tx) => {
        const inventory =
          await tx.inventory.findFirst({
            where: {
              productId,
              warehouseId,
            },
          });

        if (!inventory) {
          throw new Error(
            "Inventory not found"
          );
        }

        const availableUnits =
          inventory.totalUnits -
          inventory.reservedUnits;

        if (availableUnits < quantity) {
          return NextResponse.json(
            {
              error:
                "Insufficient stock",
            },
            {
              status: 409,
            }
          );
        }

        await tx.inventory.update({
          where: {
            id: inventory.id,
          },
          data: {
            reservedUnits: {
              increment: quantity,
            },
          },
        });

        const reservation =
          await tx.reservation.create({
            data: {
              id: crypto.randomUUID(),
              productId,
              warehouseId,
              quantity,
              status: "PENDING",
              expiresAt: new Date(
                Date.now() +
                  10 * 60 * 1000
              ),
              createdAt: new Date(),
            },
          });

        return reservation;
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to create reservation",
      },
      {
        status: 500,
      }
    );
  }
}