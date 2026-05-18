import { fallbackProducts } from "@/data/fallbackProducts";
import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/types/product";

type SupabaseProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  image_path: string;
  materials: string[];
  frame_material: string | null;
  upholstery_material: string | null;
  width_cm: number | null;
  depth_cm: number | null;
  height_cm: number | null;
  color: string | null;
  is_new: boolean | null;
  is_bestseller: boolean | null;
};

const PRODUCT_IMAGES_BUCKET = "product-images";

function getProductImageUrl(imagePath: string) {
  if (!supabase) {
    return `/images/products/${imagePath}`;
  }

  return supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(imagePath).data.publicUrl;
}

function mapProduct(product: SupabaseProduct): Product {
  return {
    id: product.slug,
    supabaseId: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    image: getProductImageUrl(product.image_path),
    materials: product.materials,
    frameMaterial: product.frame_material,
    upholsteryMaterial: product.upholstery_material,
    widthCm: product.width_cm ?? 0,
    depthCm: product.depth_cm ?? 0,
    heightCm: product.height_cm ?? 0,
    color: product.color ?? "",
    isNew: Boolean(product.is_new),
    isBestseller: Boolean(product.is_bestseller),
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!supabase) {
    return fallbackProducts;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, slug, name, category, price, image_path, materials, frame_material, upholstery_material, width_cm, depth_cm, height_cm, color, is_new, is_bestseller",
      )
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackProducts;
    }

    return data.map(mapProduct);
  } catch {
    return fallbackProducts;
  }
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}
