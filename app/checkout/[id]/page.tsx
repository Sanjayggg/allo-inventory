import CheckoutClient from "./CheckoutClient";

async function getReservation(id: string) {
  const res = await fetch(
   `${process.env.NEXT_PUBLIC_APP_URL}/api/reservations/${id}`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const reservation = await getReservation(id);

  return (
    <main style={{ padding: "20px" }}>
      <h1>Reservation Checkout</h1>

      <p>Reservation ID: {reservation.id}</p>

      <p>Product: {reservation.productId}</p>

      <p>Warehouse: {reservation.warehouseId}</p>

      <p>Quantity: {reservation.quantity}</p>

      <CheckoutClient reservation={reservation} />
    </main>
  );
}