"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";
import styles from "./catalog.module.css";

const PRODUCTS_PER_PAGE = 12;

const categories = [
  { label: "ВСЕ ТОВАРЫ", value: "all" },
  { label: "СТОЛЫ", value: "tables" },
  { label: "СТУЛЬЯ", value: "chairs" },
  { label: "ДИВАНЫ", value: "sofas" },
  { label: "КРЕСЛА", value: "armchairs" },
  { label: "КОМОДЫ", value: "dressers" },
  { label: "ТУМБЫ", value: "nightstands" },
  { label: "ОСВЕЩЕНИЕ", value: "lighting" },
];

const sortOptions = [
  { label: "По умолчанию", value: "default" },
  { label: "Сначала дешевле", value: "price-asc" },
  { label: "Сначала дороже", value: "price-desc" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "ru"));
}

export function CatalogClient({ products }: { products: Product[] }) {
  const prices = products.map((product) => product.price);
  const minCatalogPrice = Math.min(...prices);
  const maxCatalogPrice = Math.max(...prices);

  const [activeCategory, setActiveCategory] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(minCatalogPrice);
  const [maxPrice, setMaxPrice] = useState(maxCatalogPrice);
  const [draftMaterials, setDraftMaterials] = useState<string[]>([]);
  const [draftColors, setDraftColors] = useState<string[]>([]);
  const [draftMinPrice, setDraftMinPrice] = useState(minCatalogPrice);
  const [draftMaxPrice, setDraftMaxPrice] = useState(maxCatalogPrice);
  const [sortValue, setSortValue] = useState<SortValue>("default");
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  const materials = useMemo(
    () => uniqueValues(products.flatMap((product) => product.materials)),
    [products],
  );
  const colors = useMemo(
    () => uniqueValues(products.map((product) => product.color)),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;
      const matchesMaterials =
        selectedMaterials.length === 0 ||
        selectedMaterials.some((material) => product.materials.includes(material));
      const matchesColor =
        selectedColors.length === 0 || selectedColors.includes(product.color);
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

      return matchesCategory && matchesMaterials && matchesColor && matchesPrice;
    });

    if (sortValue === "price-asc") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sortValue === "price-desc") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [
    activeCategory,
    maxPrice,
    minPrice,
    products,
    selectedColors,
    selectedMaterials,
    sortValue,
  ]);

  const hasAppliedFilters =
    selectedMaterials.length > 0 ||
    selectedColors.length > 0 ||
    minPrice !== minCatalogPrice ||
    maxPrice !== maxCatalogPrice;
  const pageProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleCount < filteredProducts.length;

  function toggleValue(value: string, selected: string[], setSelected: (next: string[]) => void) {
    setSelected(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  }

  function setCategory(value: string) {
    setActiveCategory(value);
    setVisibleCount(PRODUCTS_PER_PAGE);
  }

  function updateDraftMinPrice(value: number) {
    setDraftMinPrice(Math.min(value, draftMaxPrice));
  }

  function updateDraftMaxPrice(value: number) {
    setDraftMaxPrice(Math.max(value, draftMinPrice));
  }

  function applyFilters() {
    setSelectedMaterials(draftMaterials);
    setSelectedColors(draftColors);
    setMinPrice(draftMinPrice);
    setMaxPrice(draftMaxPrice);
    setVisibleCount(PRODUCTS_PER_PAGE);
    setFiltersOpen(false);
  }

  function clearFilters() {
    setSelectedMaterials([]);
    setSelectedColors([]);
    setMinPrice(minCatalogPrice);
    setMaxPrice(maxCatalogPrice);
    setDraftMaterials([]);
    setDraftColors([]);
    setDraftMinPrice(minCatalogPrice);
    setDraftMaxPrice(maxCatalogPrice);
    setVisibleCount(PRODUCTS_PER_PAGE);
    setFiltersOpen(false);
  }

  function toggleFiltersMenu() {
    setFiltersOpen((isOpen) => {
      if (!isOpen) {
        setDraftMaterials(selectedMaterials);
        setDraftColors(selectedColors);
        setDraftMinPrice(minPrice);
        setDraftMaxPrice(maxPrice);
      }

      return !isOpen;
    });
  }

  function showMore() {
    setVisibleCount((currentCount) =>
      Math.min(currentCount + PRODUCTS_PER_PAGE, filteredProducts.length),
    );
  }

  return (
    <main
      className={styles.catalog}
      onClick={() => {
        setFiltersOpen(false);
        setSortOpen(false);
      }}
    >
      <h1>
        К<span>А</span>Т<span>А</span>Л<span>О</span>Г
      </h1>

      <nav className={styles.categories} aria-label="Категории каталога">
        {categories.map((category) => (
          <button
            className={category.value === activeCategory ? styles.activeCategory : ""}
            type="button"
            key={category.value}
            onClick={() => setCategory(category.value)}
          >
            {category.label}
          </button>
        ))}
      </nav>

      <div className={styles.controls}>
        <div className={styles.filterArea} onClick={(event) => event.stopPropagation()}>
          <div className={styles.filterTrigger}>
            <button
              className={styles.controlButton}
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => {
                setSortOpen(false);
                toggleFiltersMenu();
              }}
            >
              Фильтры
              <img
                className={filtersOpen ? styles.iconOpen : ""}
                src="/ui/list.svg"
                width="24"
                height="24"
                alt=""
              />
            </button>

            {hasAppliedFilters ? (
              <button
                className={styles.clearButton}
                type="button"
                onClick={clearFilters}
              >
                очистить
              </button>
            ) : null}
          </div>

          {filtersOpen ? (
            <div className={styles.filterMenu}>
              <FilterGroup
                title="Материал"
                options={materials}
                selected={draftMaterials}
                onToggle={(value) =>
                  toggleValue(value, draftMaterials, setDraftMaterials)
                }
              />

              <div className={styles.divider} />

              <FilterGroup
                title="Цвет"
                options={colors}
                selected={draftColors}
                onToggle={(value) => toggleValue(value, draftColors, setDraftColors)}
              />

              <div className={styles.divider} />

              <div className={styles.priceFilter}>
                <h2>Цена ₽</h2>
                <div
                  className={styles.rangeTrack}
                  style={
                    {
                      "--min-percent": `${((draftMinPrice - minCatalogPrice) / (maxCatalogPrice - minCatalogPrice)) * 100}%`,
                      "--max-percent": `${((draftMaxPrice - minCatalogPrice) / (maxCatalogPrice - minCatalogPrice)) * 100}%`,
                    } as CSSProperties
                  }
                >
                  <input
                    type="range"
                    min={minCatalogPrice}
                    max={maxCatalogPrice}
                    value={draftMinPrice}
                    onChange={(event) => updateDraftMinPrice(Number(event.target.value))}
                  />
                  <input
                    type="range"
                    min={minCatalogPrice}
                    max={maxCatalogPrice}
                    value={draftMaxPrice}
                    onChange={(event) => updateDraftMaxPrice(Number(event.target.value))}
                  />
                </div>

                <div className={styles.priceInputs}>
                  <input
                    aria-label="Минимальная цена"
                    value={draftMinPrice}
                    onChange={(event) =>
                      updateDraftMinPrice(Number(event.target.value) || minCatalogPrice)
                    }
                  />
                  <input
                    aria-label="Максимальная цена"
                    value={draftMaxPrice}
                    onChange={(event) =>
                      updateDraftMaxPrice(Number(event.target.value) || maxCatalogPrice)
                    }
                  />
                </div>
              </div>

              <button
                className={styles.applyButton}
                type="button"
                onClick={applyFilters}
              >
                ПРИМЕНИТЬ ФИЛЬТРЫ
              </button>
            </div>
          ) : null}
        </div>

        <div className={styles.sortArea} onClick={(event) => event.stopPropagation()}>
          <button
            className={styles.controlButton}
            type="button"
            aria-expanded={sortOpen}
            onClick={() => {
              setFiltersOpen(false);
              setSortOpen((isOpen) => !isOpen);
            }}
          >
            {sortOptions.find((option) => option.value === sortValue)?.label}
            <img
              className={sortOpen ? styles.iconOpen : ""}
              src="/ui/list.svg"
              width="24"
              height="24"
              alt=""
            />
          </button>

          {sortOpen ? (
            <div className={styles.sortMenu}>
              {sortOptions.map((option) => (
                <button
                  className={option.value === sortValue ? styles.activeSort : ""}
                  type="button"
                  key={option.value}
                  onClick={() => {
                    setSortValue(option.value);
                    setVisibleCount(PRODUCTS_PER_PAGE);
                    setSortOpen(false);
                  }}
                >
                  <span className={styles.radio} />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.productGrid}>
        {pageProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>

      {hasMoreProducts ? (
        <button className={styles.moreButton} type="button" onClick={showMore}>
          ПОКАЗАТЬ ЕЩЕ
        </button>
      ) : null}
    </main>
  );
}

type FilterGroupProps = {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
};

function FilterGroup({ title, options, selected, onToggle }: FilterGroupProps) {
  return (
    <div className={styles.filterGroup}>
      <h2>{title}</h2>
      <div className={styles.checkboxList}>
        {options.map((option) => (
          <button
            className={selected.includes(option) ? styles.activeCheckbox : ""}
            type="button"
            key={option}
            onClick={() => onToggle(option)}
          >
            <span className={styles.checkbox}>
              {selected.includes(option) ? (
                <img src="/ui/check.svg" width="24" height="24" alt="" />
              ) : null}
            </span>
            <span>{option}</span>
          </button>
        ))}
      </div>
    </div>
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
