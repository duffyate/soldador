import { getProducts } from "@/data/products";
import { CatalogClient } from "./CatalogClient";

export default async function CatalogPage() {
  const products = await getProducts();

  return <CatalogClient products={products} />;
}
