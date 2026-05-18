"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";
import styles from "./ProductSection.module.css";

type ProductSectionProps = {
  title: ReactNode;
  titleId: string;
  products: Product[];
};

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

export function ProductSection({
  title,
  titleId,
  products,
}: ProductSectionProps) {
  const sectionProducts = products.slice(0, 8);
  const [startIndex, setStartIndex] = useState(0);
  const maxStartIndex = Math.max(0, sectionProducts.length - 4);
  const visibleProducts = sectionProducts.slice(startIndex, startIndex + 4);

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <div className={styles.sectionHeader}>
        <h2 id={titleId}>{title}</h2>

        <div className={styles.arrows}>
          <button
            type="button"
            disabled={startIndex === 0}
            onClick={() => setStartIndex((index) => Math.max(0, index - 1))}
            aria-label="Предыдущие товары"
          >
            <img src="/ui/arrow-left.svg" width="24" height="24" alt="" />
          </button>
          <button
            type="button"
            disabled={startIndex >= maxStartIndex}
            onClick={() =>
              setStartIndex((index) => Math.min(maxStartIndex, index + 1))
            }
            aria-label="Следующие товары"
          >
            <img src="/ui/arrow-right.svg" width="24" height="24" alt="" />
          </button>
        </div>
      </div>

      <div className={`${styles.productGrid} ${styles.desktopGrid}`}>
        {visibleProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>

      <div className={`${styles.productGrid} ${styles.mobileGrid}`}>
        {sectionProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link className={styles.productCard} href={`/catalog/${product.slug}`}>
      <img src={product.image} alt={product.name} />
      <span className={styles.productInfo}>
        <span className={styles.productName}>{product.name}</span>
        <span className={styles.productPrice}>{formatPrice(product.price)}</span>
      </span>
    </Link>
  );
}
