"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const labels = [
  "ФОРМА И КОМФОРТ",
  "МАТЕРИАЛ И ФАКТУРА",
  "СОВРЕМЕННЫЙ ЛОФТ",
  "ДЕТАЛИ И ХАРАКТЕР",
];

export function HeroIntro() {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    setShouldAnimate(true);
    document.body.classList.add("soldador-home-intro");

    const timeout = window.setTimeout(() => {
      document.body.classList.remove("soldador-home-intro");
    }, 2300);

    return () => {
      window.clearTimeout(timeout);
      document.body.classList.remove("soldador-home-intro");
    };
  }, []);

  return (
    <section
      className={`${styles.hero} ${shouldAnimate ? styles.heroIntro : ""}`}
    >
      <div className={styles.heroBrand}>
        <img
          className={styles.wordmark}
          src="/brand/soldador-wordmark.svg"
          width="1872"
          height="312"
          alt="Soldador"
        />

        <div className={styles.labels} aria-label="Ценности Soldador">
          {labels.map((label, index) => (
            <span style={{ "--label-index": index } as CSSProperties} key={label}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <img
        className={styles.chairs}
        src="/images/hero/hero-chairs.png"
        width="924"
        height="674"
        alt=""
      />

      <div className={styles.textBlock}>
        <h1>Мебель для современных пространств</h1>
        <p>
          <span className={styles.heroTextWide}>
            Лаконичные формы, выразительные материалы
            <br />
            и индустриальный характер
          </span>
          <span className={styles.heroTextTablet}>
            Лаконичные формы, выразительные
            <br />
            материалы и индустриальный характер.
          </span>
        </p>
      </div>

      <Link className={styles.catalogLink} href="/catalog">
        ПЕРЕЙТИ В КАТАЛОГ
      </Link>
    </section>
  );
}
