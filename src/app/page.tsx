import Link from "next/link";
import { getProducts } from "@/data/products";
import { ProductSection } from "@/components/ProductSection/ProductSection";
import type { Product } from "@/types/product";
import { HeroIntro } from "./HeroIntro";
import styles from "./page.module.css";

const homeNewSlugs = [
  "slope-lounge",
  "sixte",
  "slope-swivel",
  "hughes",
  "trysta",
  "bilbao",
  "marlyne",
  "ava",
];

const homeBestsellerSlugs = [
  "slope-lounge",
  "sixte",
  "salome",
  "paolo",
  "britt",
  "haven",
  "rorie",
  "parsons",
];

function pickProducts(products: Product[], slugs: string[], flag: "isNew" | "isBestseller") {
  return slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product?.[flag]));
}

export default async function Home() {
  const products = await getProducts();
  const newProducts = pickProducts(products, homeNewSlugs, "isNew");
  const bestsellerProducts = pickProducts(
    products,
    homeBestsellerSlugs,
    "isBestseller",
  );
  const categories = [
    {
      name: "ДИВАНЫ И КРЕСЛА",
      count: products.filter((product) =>
        ["sofas", "armchairs"].includes(product.category),
      ).length,
    },
    {
      name: "КОМОДЫ И ТУМБЫ",
      count: products.filter((product) =>
        ["dressers", "nightstands"].includes(product.category),
      ).length,
    },
    {
      name: "СТОЛЫ И СТУЛЬЯ",
      count: products.filter((product) =>
        ["tables", "chairs"].includes(product.category),
      ).length,
    },
    {
      name: "ОСВЕЩЕНИЕ",
      count: products.filter((product) => product.category === "lighting").length,
    },
  ];

  return (
    <main>
      <HeroIntro />

      <ProductSection
        title={
          <>
            Н<span>О</span>ВИНКИ
          </>
        }
        titleId="new-products-title"
        products={newProducts}
      />

      <section className={styles.categories} aria-labelledby="categories-title">
        <h2 id="categories-title">
          К<span>А</span>ТЕГ<span>О</span>РИИ
        </h2>

        <img
          className={styles.categoriesImage}
          src="/images/categories/categories-main.jpg"
          width="450"
          height="450"
          alt=""
        />

        <div className={styles.categoryPanel}>
          <div className={styles.categoryList}>
            {categories.map((category) => (
              <div className={styles.categoryRow} key={category.name}>
                <span>{category.name}</span>
                <span>({category.count})</span>
              </div>
            ))}
          </div>

          <Link className={styles.categoriesLink} href="/catalog">
            ПЕРЕЙТИ В КАТАЛОГ
          </Link>
        </div>
      </section>

      <section className={styles.about} id="about" aria-labelledby="about-title">
        <h2 id="about-title">
          <span>О</span> Н<span>А</span>С
        </h2>

        <div className={styles.aboutContent}>
          <h3 className={styles.aboutTitleWide}>
            ЭСТЕТИКА И ФУНКЦИОНАЛЬНОСТЬ
            <br />
            В КАЖДОМ ПРЕДМЕТЕ — ПРОДУМАННОЕ РЕШЕНИЕ
            <br />
            ДЛЯ СОВРЕМЕННОГО ИНТЕРЬЕРА
          </h3>
          <h3 className={styles.aboutTitleSmallDesktop}>
            ЭСТЕТИКА И ФУНКЦИОНАЛЬНОСТЬ
            <br />
            В КАЖДОМ ПРЕДМЕТЕ
            <br />
            — ПРОДУМАННОЕ РЕШЕНИЕ
            <br />
            ДЛЯ СОВРЕМЕННОГО ИНТЕРЬЕРА
          </h3>
          <h3 className={styles.aboutTitleTablet}>
            ЭСТЕТИКА
            <br />
            И ФУНКЦИОНАЛЬНОСТЬ
            <br />
            В КАЖДОМ ПРЕДМЕТЕ
            <br />
            — ПРОДУМАННОЕ РЕШЕНИЕ
            <br />
            ДЛЯ СОВРЕМЕННОГО
            <br />
            ИНТЕРЬЕРА
          </h3>
          <h3 className={styles.aboutTitleMobile}>
            ЭСТЕТИКА И ФУНКЦИОНАЛЬНОСТЬ
            <br />
            В КАЖДОМ ПРЕДМЕТЕ
            <br />
            — ПРОДУМАННОЕ РЕШЕНИЕ
            <br />
            ДЛЯ СОВРЕМЕННОГО ИНТЕРЬЕРА
          </h3>

          <div className={styles.aboutText}>
            <p className={styles.aboutTextWide}>
              Soldador — это мебель и предметы интерьера, где сочетаются
              лаконичные формы, выразительные материалы и актуальный характер.
              Мы создаём решения для дома 
              <br />
              и других пространств, уделяя внимание
              комфорту, долговечности и цельности.
            </p>
            <p className={styles.aboutTextWide}>
              В основе наших коллекций — внимание к пропорциям, фактурам и
              деталям. 
              <br />
              Каждый предмет задуман так, чтобы естественно вписываться
              в интерьер, 
              <br />
              сохранять лёгкость и оставаться актуальным со
              временем.
            </p>
            <div className={styles.aboutTextSmallDesktop}>
              <p>
                Soldador — это мебель и предметы интерьера, где сочетаются
                <br />
                лаконичные формы, выразительные материалы и актуальный
                <br />
                характер. Мы создаём решения для дома и других пространств,
                <br />
                уделяя внимание комфорту, долговечности и цельности.
              </p>
              <p>
                В основе наших коллекций — внимание к пропорциям,
                <br />
                фактурам и деталям. Каждый предмет задуман так,
                <br />
                чтобы естественно вписываться в интерьер, сохранять
                <br />
                лёгкость и оставаться актуальным со временем.
              </p>
            </div>
            <div className={styles.aboutTextTablet}>
              <p>
                Soldador — это мебель и предметы интерьера, где сочетаются лаконичные формы,
                <br />
                выразительные материалы и актуальный характер. Мы создаём решения для дома
                <br />и других пространств, уделяя внимание комфорту, долговечности и цельности.
              </p>
              <p>
                В основе наших коллекций — внимание к пропорциям, фактурам и деталям.
                <br />
                Каждый предмет задуман так, чтобы естественно вписываться в интерьер,
                <br />
                сохранять лёгкость и оставаться актуальным со временем.
              </p>
            </div>
            <div className={styles.aboutTextMobile}>
              <p>
                Soldador — это мебель и предметы
                <br />
                интерьера, где сочетаются лаконичные
                <br />
                формы, выразительные материалы
                <br />
                и актуальный характер. Мы создаём
                <br />
                решения для дома и других пространств,
                <br />
                уделяя внимание комфорту, долговечности
                <br />и цельности.
              </p>
              <p>
                В основе наших коллекций — внимание
                <br />
                к пропорциям, фактурам и деталям. Каждый
                <br />
                предмет задуман так, чтобы естественно
                <br />
                вписываться в интерьер, сохранять лёгкость
                <br />и оставаться актуальным со временем.
              </p>
            </div>
          </div>
        </div>

        <img
          className={styles.aboutImage}
          src="/images/about/about-chairs.jpg"
          width="1872"
          height="650"
          alt=""
        />
      </section>

      <ProductSection
        title="БЕСТСЕЛЛЕРЫ"
        titleId="bestsellers-title"
        products={bestsellerProducts}
      />
    </main>
  );
}
