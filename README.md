# Soldador

Soldador — дипломный веб-проект для современного мебельного бренда в стиле soft industrial / modern loft.

Проект включает главную страницу, каталог товаров, страницы товаров, корзину и оформление заказа с демо-оплатой.

## Стек

- Next.js
- TypeScript
- CSS Modules
- Supabase
- Supabase Storage
- plain CSS

## Возможности

- Главная страница с hero, категориями, новинками, бестселлерами и футером
- Каталог с категориями, фильтрами, сортировкой и кнопкой “Показать еще”
- Страница товара с характеристиками и блоком других товаров
- Корзина на `localStorage`
- Checkout с валидацией формы
- Демо-processing заказа и popup успешного оформления
- Сохранение заказов в Supabase
- Загрузка товаров из Supabase с локальным fallback
- Изображения товаров через Supabase Storage

## Установка и запуск

```bash
npm install
npm run dev
```

После запуска открой:

```text
http://localhost:3000
```

## Сборка

```bash
npm run build
```

## Supabase

Проект использует Supabase для:

- хранения товаров;
- сохранения заказов;
- хранения изображений товаров в Storage.

Ожидаемый public bucket:

```text
product-images
```

Если Supabase недоступен или переменные окружения не заданы, сайт использует локальные fallback-товары.

## Основные маршруты

```text
/                    главная
/catalog             каталог
/catalog/[slug]      страница товара
/cart                корзина
/checkout            оформление заказа
/checkout/processing демо-обработка заказа
```

## Структура проекта

```text
src/
  app/
    page.tsx
    catalog/
    cart/
    checkout/
  components/
    Header/
    Footer/
    ProductSection/
  data/
    fallbackProducts.ts
    products.ts
  hooks/
    useProducts.ts
  lib/
    cart.ts
    orders.ts
    supabaseClient.ts
  types/
    product.ts
```

## Примечания

- Авторизация пользователей не используется.
- Реальная онлайн-оплата не подключена.
- Service role key не нужен и не должен использоваться на клиенте.
