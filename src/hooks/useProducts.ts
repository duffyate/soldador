"use client";

import { useEffect, useState } from "react";
import { fallbackProducts } from "@/data/fallbackProducts";
import { getProducts } from "@/data/products";
import type { Product } from "@/types/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    let isMounted = true;

    getProducts().then((loadedProducts) => {
      if (isMounted) {
        setProducts(loadedProducts);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return products;
}
