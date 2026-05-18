export type Product = {
  id: string;
  supabaseId?: string | null;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  materials: string[];
  frameMaterial: string | null;
  upholsteryMaterial: string | null;
  widthCm: number;
  depthCm: number;
  heightCm: number;
  color: string;
  isNew: boolean;
  isBestseller: boolean;
};
