import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/types/product";

type CheckoutFormData = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  floor: string;
  comment: string;
};

export type CheckoutOrderItem = {
  product: Product;
  quantity: number;
};

export type CheckoutOrderPayload = {
  orderCode: string;
  form: CheckoutFormData;
  deliveryMethod: string;
  paymentMethod: string;
  items: CheckoutOrderItem[];
  subtotal: number;
  deliveryPrice: number;
  totalPrice: number;
};

type SupabaseErrorLike = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
};

function isUuid(value: string | null | undefined) {
  return Boolean(
    value &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value,
      ),
  );
}

function getImagePath(image: string) {
  return image.split("/").pop() ?? image;
}

function logSupabaseError(label: string, error: unknown) {
  const supabaseError = error as SupabaseErrorLike;

  console.groupCollapsed(label);
  console.warn("message:", supabaseError.message);
  console.warn("details:", supabaseError.details);
  console.warn("hint:", supabaseError.hint);
  console.warn("code:", supabaseError.code);
  console.warn("json:", JSON.stringify(error, null, 2));
  console.groupEnd();
}

function createClientUuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export async function saveOrder(payload: CheckoutOrderPayload) {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const orderId = createClientUuid();
  const orderPayload = {
    id: orderId,
    order_code: payload.orderCode,
    customer_name: payload.form.fullName,
    phone: payload.form.phone,
    email: payload.form.email,
    delivery_method: payload.deliveryMethod,
    city: payload.deliveryMethod === "courier" ? payload.form.city : null,
    street: payload.deliveryMethod === "courier" ? payload.form.street : null,
    house: payload.deliveryMethod === "courier" ? payload.form.house : null,
    apartment: payload.deliveryMethod === "courier" ? payload.form.apartment : null,
    floor: payload.deliveryMethod === "courier" ? payload.form.floor : null,
    comment: payload.form.comment || null,
    payment_method: payload.paymentMethod,
    subtotal: payload.subtotal,
    delivery_price: payload.deliveryPrice,
    total_price: payload.totalPrice,
    status: "created",
  };

  const { error: orderError } = await supabase
    .from("orders")
    .insert(orderPayload);

  if (orderError) {
    logSupabaseError("[checkout] orders insert failed", orderError);
    throw orderError;
  }

  const slugs = payload.items.map((item) => item.product.slug);
  const { data: productRows, error: productsError } = await supabase
    .from("products")
    .select("id, slug")
    .in("slug", slugs);

  if (productsError) {
    logSupabaseError("[checkout] products lookup failed", productsError);
  }

  const productIdsBySlug = new Map(
    (productRows ?? []).map((product) => [product.slug, product.id]),
  );

  const orderItemsPayload = payload.items.map((item) => ({
    order_id: orderId,
    product_id: isUuid(productIdsBySlug.get(item.product.slug))
      ? productIdsBySlug.get(item.product.slug)
      : null,
    product_slug: item.product.slug,
    product_name: item.product.name,
    product_image_path: getImagePath(item.product.image),
    price: item.product.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsPayload);

  if (itemsError) {
    logSupabaseError("[checkout] order_items insert failed", itemsError);
    throw itemsError;
  }

  return {
    id: orderId,
    order_code: payload.orderCode,
  };
}
