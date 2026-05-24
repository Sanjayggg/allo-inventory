"use client";

import { useEffect, useState } from "react";

export default function CheckoutClient({
  reservation,
}: {
  reservation: any;
}) {
  const [status, setStatus] = useState(
    reservation.status
  );

  const [timeLeft, setTimeLeft] =
    useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const expiry = new Date(
        reservation.expiresAt
      ).getTime();

      const diff =
        expiry - Date.now();

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(
        diff / 60000
      );

      const seconds = Math.floor(
        (diff % 60000) / 1000
      );

      setTimeLeft(
        `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);

    return () =>
      clearInterval(interval);
  }, [reservation.expiresAt]);

  async function confirmPurchase() {
    const res = await fetch(
      `/api/reservations/${reservation.id}/confirm`,
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (res.ok) {
      setStatus(data.status);
    } else {
      alert(data.error);
    }
  }

  async function cancelReservation() {
    const res = await fetch(
      `/api/reservations/${reservation.id}/release`,
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (res.ok) {
      setStatus(data.status);
    } else {
      alert(data.error);
    }
  }

  return (
    <>
      <h2>Status: {status}</h2>

      <p>
        Time Remaining:
        {" "}
        {timeLeft}
      </p>

      <button
        onClick={confirmPurchase}
      >
        Confirm Purchase
      </button>

      <button
        onClick={cancelReservation}
        style={{ marginLeft: "10px" }}
      >
        Cancel
      </button>
    </>
  );
}