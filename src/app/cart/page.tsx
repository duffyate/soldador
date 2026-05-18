"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { readStoredCart, writeStoredCart } from "@/lib/cart";
import type { Product } from "@/types/product";
import styles from "./cart.module.css";

type CartItem = {
  product: Product;
  quantity: number;
};

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

function getProductDetails(product: Product) {
  const dimensions = `${product.widthCm} × ${product.depthCm} × ${product.heightCm} см`;
  const material = product.upholsteryMaterial ?? product.materials[0]?.toLowerCase();
  const frame = product.frameMaterial;

  return [dimensions, material, frame].filter(Boolean).join(" · ");
}

function getProductWord(count: number) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return "товар";
  }

  if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
    return "товара";
  }

  return "товаров";
}

function readCartFromStorage(products: Product[]): CartItem[] {
  return readStoredCart()
    .map((item) => {
      const product = products.find(
        (fallbackProduct) => fallbackProduct.slug === item.slug,
      );

      if (!product) {
        return null;
      }

      return {
        product,
        quantity: Math.max(1, item.quantity),
      };
    })
    .filter((item): item is CartItem => Boolean(item));
}

export default function CartPage() {
  const router = useRouter();
  const products = useProducts();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);

  useEffect(() => {
    setItems(readCartFromStorage(products));
    setHasLoadedCart(true);
  }, [products]);

  useEffect(() => {
    if (!hasLoadedCart) {
      return;
    }

    const storedItems = items.map((item) => ({
      slug: item.product.slug,
      quantity: item.quantity,
    }));

    writeStoredCart(storedItems);
  }, [hasLoadedCart, items]);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );

  function updateQuantity(slug: string, nextQuantity: number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.slug === slug
          ? { ...item, quantity: Math.max(1, nextQuantity) }
          : item,
      ),
    );
  }

  function removeItem(slug: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.slug !== slug),
    );
  }

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/catalog">
        <img src="/ui/arrow-back.svg" width="24" height="24" alt="" />
        НАЗАД
      </Link>

      <h1>
        К<span>О</span>РЗИН<span>А</span> /{" "}
        <strong>
          {totalQuantity} {getProductWord(totalQuantity)}
        </strong>
      </h1>

      <section className={styles.cart} aria-label="Корзина">
        {items.length === 0 ? (
          <p className={styles.empty}>Корзина пока что пуста</p>
        ) : (
          <>
            <div className={styles.items}>
              {items.map((item) => (
                <article
                  className={styles.item}
                  key={item.product.slug}
                  onClick={() => router.push(`/catalog/${item.product.slug}`)}
                >
                  <img
                    className={styles.itemImage}
                    src={item.product.image}
                    alt={item.product.name}
                  />

                  <div className={styles.itemInfo}>
                    <h2>{item.product.name}</h2>
                    <p>{getProductDetails(item.product)}</p>

                    <div className={styles.quantity}>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          updateQuantity(item.product.slug, item.quantity - 1);
                        }}
                        aria-label="Уменьшить количество"
                      >
                        –
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          updateQuantity(item.product.slug, item.quantity + 1);
                        }}
                        aria-label="Увеличить количество"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className={styles.remove}
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      removeItem(item.product.slug);
                    }}
                    aria-label="Удалить товар"
                  >
                    <img src="/ui/close.svg" width="24" height="24" alt="" />
                  </button>

                  <span className={styles.price}>
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </article>
              ))}
            </div>

            <div className={styles.summary}>
              <div className={styles.total}>
                <span>Итого</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <p>Без учета возможной стоимости доставки</p>
              <Link className={styles.checkout} href="/checkout">
                ОФОРМИТЬ ЗАКАЗ
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
