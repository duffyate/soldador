"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { addProductToCart, isProductInCart } from "@/lib/cart";
import type { Product } from "@/types/product";
import styles from "./product.module.css";

const OTHER_PRODUCTS_STEP = 4;

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

export function ProductClient({
  products,
  slug,
}: {
  products: Product[];
  slug: string;
}) {
  const product = products.find((item) => item.slug === slug);
  const [visibleOtherCount, setVisibleOtherCount] = useState(OTHER_PRODUCTS_STEP);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    if (product) {
      setIsInCart(isProductInCart(product.slug));
    }
  }, [product]);

  if (!product) {
    return (
      <main className={styles.page}>
        <Link className={styles.backLink} href="/catalog">
          <img src="/ui/arrow-back.svg" width="24" height="24" alt="" />
          НАЗАД
        </Link>
        <p className={styles.notFound}>Товар не найден</p>
      </main>
    );
  }

  const otherProducts = products.filter((item) => item.id !== product.id);
  const visibleOtherProducts = otherProducts.slice(0, visibleOtherCount);
  const hasMoreOtherProducts = visibleOtherCount < otherProducts.length;

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/catalog">
        <img src="/ui/arrow-back.svg" width="24" height="24" alt="" />
        НАЗАД
      </Link>

      <section className={styles.product}>
        <img className={styles.productImage} src={product.image} alt={product.name} />

        <div className={styles.productInfo}>
          <div>
            <h1>{product.name}</h1>

            <div className={styles.infoBlock}>
              <h2>Материалы</h2>
              <dl>
                {product.frameMaterial ? (
                  <div>
                    <dt>Каркас:</dt>
                    <dd>{product.frameMaterial}</dd>
                  </div>
                ) : null}
                {product.upholsteryMaterial ? (
                  <div>
                    <dt>Обивка:</dt>
                    <dd>{product.upholsteryMaterial}</dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <div className={styles.infoBlock}>
              <h2>Размеры</h2>
              <dl>
                <div>
                  <dt>Ширина:</dt>
                  <dd>{product.widthCm}см</dd>
                </div>
                <div>
                  <dt>Глубина:</dt>
                  <dd>{product.depthCm}см</dd>
                </div>
                <div>
                  <dt>Высота:</dt>
                  <dd>{product.heightCm}см</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className={styles.purchase}>
            <p>{formatPrice(product.price)}</p>
            {isInCart ? (
              <Link className={styles.activePurchaseButton} href="/cart">
                ОФОРМИТЬ ЗАКАЗ
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  addProductToCart(product.slug);
                  setIsInCart(true);
                }}
              >
                ДОБАВИТЬ В КОРЗИНУ
              </button>
            )}
          </div>
        </div>
      </section>

      <section className={styles.other} aria-labelledby="other-products-title">
        <h2 id="other-products-title">
          ДРУГИЕ Т<span>О</span>В<span>А</span>РЫ
        </h2>

        <div className={styles.productGrid}>
          {visibleOtherProducts.map((item) => (
            <ProductCard product={item} key={item.id} />
          ))}
        </div>

        {hasMoreOtherProducts ? (
          <button
            className={styles.moreButton}
            type="button"
            onClick={() =>
              setVisibleOtherCount((count) =>
                Math.min(count + OTHER_PRODUCTS_STEP, otherProducts.length),
              )
            }
          >
            ПОКАЗАТЬ ЕЩЕ
          </button>
        ) : null}
      </section>
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link className={styles.productCard} href={`/catalog/${product.slug}`}>
      <img src={product.image} alt={product.name} />
      <span className={styles.cardInfo}>
        <span className={styles.cardName}>{product.name}</span>
        <span className={styles.cardPrice}>{formatPrice(product.price)}</span>
      </span>
    </Link>
  );
}
