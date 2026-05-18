import { getProducts } from "@/data/products";
import { ProductClient } from "./ProductClient";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const products = await getProducts();

  return <ProductClient products={products} slug={slug} />;
}
