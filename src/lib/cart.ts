export type StoredCartItem = {
  slug: string;
  quantity: number;
};

export const CART_STORAGE_KEY = "soldador-cart";
export const CART_UPDATED_EVENT = "soldador-cart-updated";

function dispatchCartUpdated() {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function readStoredCart(): StoredCartItem[] {
  try {
    const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!rawCart) {
      return [];
    }

    const parsedCart = JSON.parse(rawCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart
      .map((item) => ({
        slug: String(item.slug),
        quantity: Math.max(1, Number(item.quantity) || 1),
      }))
      .filter((item) => item.slug);
  } catch {
    return [];
  }
}

export function writeStoredCart(items: StoredCartItem[]) {
  if (items.length === 0) {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    dispatchCartUpdated();
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  dispatchCartUpdated();
}

export function clearStoredCart() {
  window.localStorage.removeItem(CART_STORAGE_KEY);
  dispatchCartUpdated();
}

export function getCartQuantity() {
  return readStoredCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function isProductInCart(slug: string) {
  return readStoredCart().some((item) => item.slug === slug);
}

export function addProductToCart(slug: string) {
  const items = readStoredCart();
  const existingItem = items.find((item) => item.slug === slug);

  if (existingItem) {
    writeStoredCart(
      items.map((item) =>
        item.slug === slug ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
    return;
  }

  writeStoredCart([...items, { slug, quantity: 1 }]);
}
