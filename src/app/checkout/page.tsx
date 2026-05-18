"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { russianCities } from "@/data/russianCities";
import { russianStreetsByCity } from "@/data/russianStreetsByCity";
import { useProducts } from "@/hooks/useProducts";
import { clearStoredCart, readStoredCart, writeStoredCart } from "@/lib/cart";
import { saveOrder } from "@/lib/orders";
import type { Product } from "@/types/product";
import styles from "./checkout.module.css";

type CartItem = {
  product: Product;
  quantity: number;
};

type CheckoutForm = {
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

type CheckoutErrors = Partial<Record<keyof CheckoutForm | "deliveryMethod" | "paymentMethod", string>>;

const DELIVERY_PRICE = 4000;
const requiredError = "Обязательное поле";
const ORDER_NUMBER_KEY = "soldador-last-order-number";
const ORDER_DRAFT_KEY = "soldador-checkout-order-draft";
const ORDER_SAVED_KEY = "soldador-checkout-order-saved";
const legacyOrderKeys = [
  ORDER_NUMBER_KEY,
  ORDER_DRAFT_KEY,
  ORDER_SAVED_KEY,
  "processedOrder",
  "checkoutOrder",
];

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

function getProductDetails(product: Product) {
  const dimensions = `${product.widthCm} × ${product.depthCm} × ${product.heightCm} см`;
  const material = product.upholsteryMaterial ?? product.materials[0]?.toLowerCase();
  const frame = product.frameMaterial;

  return [dimensions, material, frame].filter(Boolean).join(" · ");
}

function getProductWord(count: number) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return "товар";
  }

  if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
    return "товара";
  }

  return "товаров";
}

function readCartItems(products: Product[]): CartItem[] {
  return readStoredCart()
    .map((item) => {
      const product = products.find(
        (fallbackProduct) => fallbackProduct.slug === item.slug,
      );

      if (!product) {
        return null;
      }

      return {
        product,
        quantity: Math.max(1, item.quantity),
      };
    })
    .filter((item): item is CartItem => Boolean(item));
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return /^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/.test(phone) ||
    (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8")));
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getFieldError(
  field: keyof CheckoutForm,
  value: string,
  deliveryMethod: string,
) {
  if (field === "fullName") {
    const words = value.trim().split(/\s+/).filter(Boolean);

    if (!value.trim()) {
      return requiredError;
    }

    if (words.length < 2) {
      return "Введите минимум 2 слова";
    }
  }

  if (field === "phone") {
    if (!value.trim()) {
      return requiredError;
    }

    if (!isValidPhone(value.trim())) {
      return "Введите корректный номер телефона";
    }
  }

  if (field === "email") {
    if (!value.trim()) {
      return requiredError;
    }

    if (!isValidEmail(value.trim())) {
      return "Введите корректную электронную почту";
    }
  }

  if (
    deliveryMethod === "courier" &&
    ["city", "street", "house", "apartment", "floor"].includes(field) &&
    !value.trim()
  ) {
    return requiredError;
  }

  return "";
}

export default function CheckoutPage() {
  const router = useRouter();
  const products = useProducts();
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState("courier");
  const [paymentMethod, setPaymentMethod] = useState("card_online");
  const [form, setForm] = useState<CheckoutForm>({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    street: "",
    house: "",
    apartment: "",
    floor: "",
    comment: "",
  });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isStreetDropdownOpen, setIsStreetDropdownOpen] = useState(false);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const isSavingOrderRef = useRef(false);

  useEffect(() => {
    setItems(readCartItems(products));
    setHasLoadedCart(true);
  }, [products]);

  useEffect(() => {
    const savedOrderCode = window.sessionStorage.getItem(ORDER_SAVED_KEY);
    const draftRaw = window.sessionStorage.getItem(ORDER_DRAFT_KEY);

    if (!savedOrderCode || !draftRaw || products.length === 0 || isSavingOrderRef.current) {
      return;
    }

    isSavingOrderRef.current = true;

    async function saveProcessedOrder() {
      let draft: {
        orderCode: string;
        form: CheckoutForm;
        deliveryMethod: string;
        paymentMethod: string;
        cart: { slug: string; quantity: number }[];
      } | null = null;

      try {
        draft = JSON.parse(draftRaw) as {
          orderCode: string;
          form: CheckoutForm;
          deliveryMethod: string;
          paymentMethod: string;
          cart: { slug: string; quantity: number }[];
        };

        if (savedOrderCode !== draft.orderCode) {
          isSavingOrderRef.current = false;
          return;
        }
        const draftItems = draft.cart
          .map((item) => {
            const product = products.find(
              (productItem) => productItem.slug === item.slug,
            );

            if (!product) {
              return null;
            }

            return {
              product,
              quantity: Math.max(1, item.quantity),
            };
          })
          .filter((item): item is CartItem => Boolean(item));
        const draftSubtotal = draftItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );

        console.info("[checkout] cart items before save", draft.cart);
        console.info(
          "[checkout] order items draft",
          draftItems.map((item) => ({
            slug: item.product.slug,
            name: item.product.name,
            quantity: item.quantity,
          })),
        );
        console.info("[checkout] saving order draft", draft);
        const savedOrder = await saveOrder({
          orderCode: draft.orderCode,
          form: draft.form,
          deliveryMethod: draft.deliveryMethod,
          paymentMethod: draft.paymentMethod,
          items: draftItems,
          subtotal: draftSubtotal,
          deliveryPrice: DELIVERY_PRICE,
          totalPrice: draftSubtotal + DELIVERY_PRICE,
        });

        console.info("[checkout] order saved", savedOrder);
        console.info("[checkout] order items saved", draftItems.length);
        clearStoredCart();
        legacyOrderKeys.forEach((key) => {
          window.sessionStorage.removeItem(key);
          window.localStorage.removeItem(key);
        });
        setItems([]);
        setOrderNumber(savedOrder.order_code);
      } catch (error) {
        isSavingOrderRef.current = false;
        const supabaseError = error as {
          message?: string;
          details?: string;
          hint?: string;
          code?: string;
        };

        console.groupCollapsed("[checkout] order save failed");
        console.warn("draft:", draft);
        console.warn("message:", supabaseError.message);
        console.warn("details:", supabaseError.details);
        console.warn("hint:", supabaseError.hint);
        console.warn("code:", supabaseError.code);
        console.warn("json:", JSON.stringify(error, null, 2));
        console.groupEnd();
      }
    }

    saveProcessedOrder();
  }, [products]);

  useEffect(() => {
    if (!hasLoadedCart) {
      return;
    }

    writeStoredCart(
      items.map((item) => ({
        slug: item.product.slug,
        quantity: item.quantity,
      })),
    );
  }, [hasLoadedCart, items]);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const productsTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );
  const totalPrice = productsTotal + DELIVERY_PRICE;
  const citySuggestions = russianCities
    .filter((cityName) => cityName.toLowerCase().includes(form.city.toLowerCase()))
    .slice(0, 8);
  const streetSuggestions = (russianStreetsByCity[form.city] ?? [])
    .filter((streetName) => streetName.toLowerCase().includes(form.street.toLowerCase()))
    .slice(0, 8);

  function updateField(field: keyof CheckoutForm, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      const fieldError = getFieldError(field, value, deliveryMethod);

      if (fieldError) {
        nextErrors[field] = fieldError;
      } else {
        delete nextErrors[field];
      }

      return nextErrors;
    });
  }

  function validateField(field: keyof CheckoutForm) {
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      const fieldError = getFieldError(field, form[field], deliveryMethod);

      if (fieldError) {
        nextErrors[field] = fieldError;
      } else {
        delete nextErrors[field];
      }

      return nextErrors;
    });
  }

  function validateForm() {
    const nextErrors: CheckoutErrors = {};
    const fullNameWords = form.fullName.trim().split(/\s+/).filter(Boolean);

    const fullNameError = getFieldError("fullName", form.fullName, deliveryMethod);
    const phoneError = getFieldError("phone", form.phone, deliveryMethod);
    const emailError = getFieldError("email", form.email, deliveryMethod);

    if (fullNameError) {
      nextErrors.fullName = fullNameError;
    } else if (fullNameWords.length < 2) {
      nextErrors.fullName = "Введите минимум 2 слова";
    }

    if (phoneError) {
      nextErrors.phone = phoneError;
    }

    if (emailError) {
      nextErrors.email = emailError;
    }

    if (!deliveryMethod) {
      nextErrors.deliveryMethod = requiredError;
    }

    if (!paymentMethod) {
      nextErrors.paymentMethod = requiredError;
    }

    if (deliveryMethod === "courier") {
      (["city", "street", "house", "apartment", "floor"] as const).forEach(
        (field) => {
          const fieldError = getFieldError(field, form[field], deliveryMethod);

          if (fieldError) {
            nextErrors[field] = fieldError;
          }
        },
      );
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    const cartItems = readCartItems(products);
    const orderItems = cartItems.map((item) => ({
      slug: item.product.slug,
      name: item.product.name,
      quantity: item.quantity,
    }));

    console.info("[checkout] cart items before save", cartItems);
    console.info("[checkout] order items draft", orderItems);
    legacyOrderKeys.forEach((key) => {
      window.sessionStorage.removeItem(key);
      window.localStorage.removeItem(key);
    });
    window.sessionStorage.setItem(
      ORDER_DRAFT_KEY,
      JSON.stringify({
        orderCode: createOrderCode(),
        form,
        deliveryMethod,
        paymentMethod,
        cart: cartItems.map((item) => ({
          slug: item.product.slug,
          quantity: item.quantity,
        })),
      }),
    );
    router.push("/checkout/processing");
  }

  function returnToShopping() {
    clearStoredCart();
    legacyOrderKeys.forEach((key) => {
      window.sessionStorage.removeItem(key);
      window.localStorage.removeItem(key);
    });
    setItems([]);
    setOrderNumber("");
    router.push("/catalog");
  }

  function updateQuantity(slug: string, nextQuantity: number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.slug === slug
          ? { ...item, quantity: Math.max(1, nextQuantity) }
          : item,
      ),
    );
  }

  function removeItem(slug: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.slug !== slug),
    );
  }

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/cart">
        <img src="/ui/arrow-back.svg" width="24" height="24" alt="" />
        НАЗАД
      </Link>

      <h1>
        <span>О</span>Ф<span>О</span>РМЛЕНИЕ З<span>А</span>К<span>А</span>З<span>А</span>
      </h1>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>Корзина пока что пуста</p>
          <Link href="/catalog">ПЕРЕЙТИ В КАТАЛОГ</Link>
        </div>
      ) : (
        <div className={styles.content}>
          <form className={styles.form}>
            <section className={styles.formSection}>
              <h2>ДАННЫЕ ПОЛУЧАТЕЛЯ</h2>
              <div className={styles.fields}>
                <div className={styles.fieldControl}>
                  <input
                    className={errors.fullName ? styles.inputError : undefined}
                    type="text"
                      placeholder="ФИО"
                      value={form.fullName}
                      onChange={(event) => updateField("fullName", event.target.value)}
                      onBlur={() => validateField("fullName")}
                    />
                  {errors.fullName ? (
                    <span className={styles.errorText}>{errors.fullName}</span>
                  ) : null}
                </div>
                <div className={styles.twoColumns}>
                  <div className={styles.fieldControl}>
                    <input
                      className={errors.phone ? styles.inputError : undefined}
                      type="tel"
                      placeholder="НОМЕР ТЕЛЕФОНА"
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      onBlur={() => validateField("phone")}
                    />
                    {errors.phone ? (
                      <span className={styles.errorText}>{errors.phone}</span>
                    ) : null}
                  </div>
                  <div className={styles.fieldControl}>
                    <input
                      className={errors.email ? styles.inputError : undefined}
                      type="email"
                      placeholder="ЭЛЕКТРОННАЯ ПОЧТА"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      onBlur={() => validateField("email")}
                    />
                    {errors.email ? (
                      <span className={styles.errorText}>{errors.email}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.formSection}>
              <h2>СПОСОБ ДОСТАВКИ</h2>
              <RadioGroup
                name="delivery"
                value={deliveryMethod}
                onChange={(value) => {
                  setDeliveryMethod(value);
                  setErrors((currentErrors) => {
                    const nextErrors = { ...currentErrors };
                    delete nextErrors.deliveryMethod;

                    if (value === "pickup") {
                      delete nextErrors.city;
                      delete nextErrors.street;
                      delete nextErrors.house;
                      delete nextErrors.apartment;
                      delete nextErrors.floor;
                    }

                    if (value === "courier") {
                      (["city", "street", "house", "apartment", "floor"] as const).forEach(
                        (field) => {
                          const fieldError = getFieldError(field, form[field], value);

                          if (fieldError) {
                            nextErrors[field] = fieldError;
                          }
                        },
                      );
                    }

                    return nextErrors;
                  });
                }}
                options={[
                  { value: "courier", label: "КУРЬЕР" },
                  { value: "pickup", label: "САМОВЫВОЗ" },
                ]}
              />
              {errors.deliveryMethod ? (
                <span className={styles.errorText}>{errors.deliveryMethod}</span>
              ) : null}
            </section>

            <section className={styles.formSection}>
              <h2>АДРЕС ДОСТАВКИ</h2>
              <div className={styles.fields}>
                <div
                  className={styles.cityField}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setIsCityDropdownOpen(false);
                      validateField("city");
                    }
                  }}
                >
                  <input
                    className={errors.city ? styles.inputError : undefined}
                    type="text"
                    placeholder="ГОРОД"
                    value={form.city}
                    autoComplete="off"
                    onChange={(event) => {
                      updateField("city", event.target.value);
                      setIsCityDropdownOpen(true);
                    }}
                    onFocus={() => setIsCityDropdownOpen(true)}
                    onBlur={() => validateField("city")}
                  />

                  {isCityDropdownOpen && form.city && citySuggestions.length > 0 ? (
                    <div className={styles.cityDropdown}>
                      {citySuggestions.map((cityName) => (
                        <button
                          type="button"
                          key={cityName}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            updateField("city", cityName);
                            updateField("street", "");
                            setIsCityDropdownOpen(false);
                          }}
                        >
                          {cityName}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  {errors.city ? (
                    <span className={styles.errorText}>{errors.city}</span>
                  ) : null}
                </div>
                <div
                  className={styles.cityField}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setIsStreetDropdownOpen(false);
                      validateField("street");
                    }
                  }}
                >
                  <input
                    className={errors.street ? styles.inputError : undefined}
                    type="text"
                    placeholder="УЛИЦА"
                    value={form.street}
                    autoComplete="off"
                    onChange={(event) => {
                      updateField("street", event.target.value);
                      setIsStreetDropdownOpen(true);
                    }}
                    onFocus={() => setIsStreetDropdownOpen(Boolean(form.city))}
                    onBlur={() => validateField("street")}
                  />

                  {isStreetDropdownOpen && form.city && streetSuggestions.length > 0 ? (
                    <div className={styles.cityDropdown}>
                      {streetSuggestions.map((streetName) => (
                        <button
                          type="button"
                          key={streetName}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            updateField("street", streetName);
                            setIsStreetDropdownOpen(false);
                          }}
                        >
                          {streetName}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  {errors.street ? (
                    <span className={styles.errorText}>{errors.street}</span>
                  ) : null}
                </div>
                <div className={styles.threeColumns}>
                  <div className={styles.fieldControl}>
                    <input
                      className={errors.house ? styles.inputError : undefined}
                      type="text"
                      placeholder="ДОМ"
                      value={form.house}
                      onChange={(event) => updateField("house", event.target.value)}
                      onBlur={() => validateField("house")}
                    />
                    {errors.house ? (
                      <span className={styles.errorText}>{errors.house}</span>
                    ) : null}
                  </div>
                  <div className={styles.fieldControl}>
                    <input
                      className={errors.apartment ? styles.inputError : undefined}
                      type="text"
                      placeholder="КВАРТИРА"
                      value={form.apartment}
                      onChange={(event) => updateField("apartment", event.target.value)}
                      onBlur={() => validateField("apartment")}
                    />
                    {errors.apartment ? (
                      <span className={styles.errorText}>{errors.apartment}</span>
                    ) : null}
                  </div>
                  <div className={styles.fieldControl}>
                    <input
                      className={errors.floor ? styles.inputError : undefined}
                      type="text"
                      placeholder="ЭТАЖ"
                      value={form.floor}
                      onChange={(event) => updateField("floor", event.target.value)}
                      onBlur={() => validateField("floor")}
                    />
                    {errors.floor ? (
                      <span className={styles.errorText}>{errors.floor}</span>
                    ) : null}
                  </div>
                </div>
                <textarea
                  placeholder="КОММЕНТАРИЙ"
                  value={form.comment}
                  onChange={(event) => updateField("comment", event.target.value)}
                />
              </div>
            </section>

            <section className={styles.formSection}>
              <h2>СПОСОБ ОПЛАТЫ</h2>
              <RadioGroup
                name="payment"
                value={paymentMethod}
                onChange={(value) => {
                  setPaymentMethod(value);
                  setErrors((currentErrors) => {
                    const nextErrors = { ...currentErrors };
                    delete nextErrors.paymentMethod;
                    return nextErrors;
                  });
                }}
                options={[
                  { value: "card_online", label: "КАРТОЙ ОНЛАЙН" },
                  { value: "card_on_delivery", label: "КАРТОЙ ПРИ ПОЛУЧЕНИИ" },
                  { value: "cash_on_delivery", label: "НАЛИЧНЫМИ ПРИ ПОЛУЧЕНИИ" },
                ]}
              />
              {errors.paymentMethod ? (
                <span className={styles.errorText}>{errors.paymentMethod}</span>
              ) : null}
            </section>

            <div className={styles.mobileTotals}>
              <div>
                <span>Стоимость товаров</span>
                <span>{formatPrice(productsTotal)}</span>
              </div>
              <div>
                <span>Стоимость доставки</span>
                <span>{formatPrice(DELIVERY_PRICE)}</span>
              </div>
              <div className={styles.grandTotal}>
                <span>Итого</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button className={styles.submitButton} type="button" onClick={handleSubmit}>
              ПЕРЕЙТИ К ОПЛАТЕ
            </button>
            <p className={styles.consent}>
              Нажимая на кнопку “Перейти к оплате”, я даю согласие на обработку
              своих персональных данных в соответствии с{" "}
              <Link href="/privacy">политикой обработки персональных данных</Link>
            </p>
          </form>

          <aside className={styles.summary}>
            <h2>
              ВАШ ЗАКАЗ / {totalQuantity} {getProductWord(totalQuantity)}
            </h2>

            <div className={styles.orderItems}>
              {items.map((item) => (
                <article className={styles.orderItem} key={item.product.slug}>
                  <img
                    className={styles.itemImage}
                    src={item.product.image}
                    alt={item.product.name}
                  />

                  <div className={styles.itemInfo}>
                    <h3>{item.product.name}</h3>
                    <p>{getProductDetails(item.product)}</p>

                    <div className={styles.quantity}>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.slug, item.quantity - 1)
                        }
                        aria-label="Уменьшить количество"
                      >
                        –
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.slug, item.quantity + 1)
                        }
                        aria-label="Увеличить количество"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className={styles.remove}
                    type="button"
                    onClick={() => removeItem(item.product.slug)}
                    aria-label="Удалить товар"
                  >
                    <img src="/ui/close.svg" width="24" height="24" alt="" />
                  </button>

                  <span className={styles.itemPrice}>
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </article>
              ))}
            </div>

            <div className={styles.totals}>
              <div>
                <span>Стоимость товаров</span>
                <span>{formatPrice(productsTotal)}</span>
              </div>
              <div>
                <span>Стоимость доставки</span>
                <span>{formatPrice(DELIVERY_PRICE)}</span>
              </div>
              <div className={styles.grandTotal}>
                <span>Итого</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {orderNumber ? (
        <div className={styles.successOverlay} role="presentation">
          <div className={styles.successPopup} role="dialog" aria-modal="true">
            <h2>СПАСИБО ЗА ЗАКАЗ</h2>
            <div className={styles.successText}>
              <p>Ваш заказ принят в обработку.</p>
              <p>Мы свяжемся с вами в ближайшее время</p>
            </div>
            <p className={styles.successOrder}>Номер заказа: {orderNumber}</p>
            <button type="button" onClick={returnToShopping}>
              ВЕРНУТЬСЯ К ПОКУПКАМ
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function createOrderCode() {
  const number = Math.floor(10000 + Math.random() * 90000);
  return `SDL-2026-${number}`;
}

type RadioOption = {
  value: string;
  label: string;
};

function RadioGroup({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
}) {
  return (
    <div className={styles.radioGroup}>
      {options.map((option) => (
        <label className={styles.radioLabel} key={option.value}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span className={styles.radio} />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
