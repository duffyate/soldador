"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./processing.module.css";

const ORDER_NUMBER_KEY = "soldador-last-order-number";
const ORDER_DRAFT_KEY = "soldador-checkout-order-draft";
const ORDER_SAVED_KEY = "soldador-checkout-order-saved";

export default function CheckoutProcessingPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const draftRaw = window.sessionStorage.getItem(ORDER_DRAFT_KEY);
      const orderCode = draftRaw
        ? (JSON.parse(draftRaw) as { orderCode: string }).orderCode
        : "";

      window.sessionStorage.setItem(ORDER_NUMBER_KEY, orderCode);
      window.sessionStorage.setItem(ORDER_SAVED_KEY, orderCode);
      router.replace("/checkout");
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [router]);

  return (
    <main className={styles.page}>
      <div className={styles.loader} aria-hidden="true" />
      <p>ОБРАБАТЫВАЕМ ЗАКАЗ...</p>
    </main>
  );
}
