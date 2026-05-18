# Soldador Project Instructions

## Project overview

Soldador is a diploma web project: a corporate furniture website with catalog, product pages, cart and checkout.

The project represents a modern furniture brand in a soft industrial / modern loft style.

The website should feel like a real contemporary furniture brand website, not like a generic ecommerce marketplace.

## Tech stack

Use:
- Next.js
- TypeScript
- CSS Modules
- Supabase
- Supabase Storage
- Vercel
- plain CSS
- semantic HTML

Do not use:
- Tailwind CSS
- Material UI
- Bootstrap
- Redux
- Zustand
- Supabase Auth
- user login
- user profile
- complex custom backend
- real online payment integration

The project should stay simple, clear and diploma-friendly.

## Before doing any task

Before editing files, inspect the project structure.

Check:
- package.json
- next.config.js or next.config.mjs
- app/ or src/app/
- pages/ if present
- tsconfig.json
- global CSS file
- existing components
- existing file structure

If this is not a Next.js project:
1. Stop.
2. Explain what is missing.
3. Suggest how to initialize a new Next.js project.
4. Do not create random files before user confirmation.

If this is a Next.js project:
1. Identify whether it uses App Router or Pages Router.
2. Prefer App Router if app/ or src/app/ exists.
3. Do not migrate the routing architecture unless explicitly asked.

## General behavior

Before making changes:
- explain the plan briefly
- mention which files will be created or edited
- do not change unrelated files
- do not install dependencies unless necessary
- do not redesign the project without user request

After making changes:
- list changed files
- briefly explain what was implemented
- mention if lint/build was run
- mention errors honestly if any

## Visual style

The website style is:
- minimal
- typographic
- modern
- interior-focused
- soft industrial
- modern loft

Visual rules:
- lots of whitespace
- thin borders
- large typography
- clean product cards
- neutral colors
- no colorful marketplace UI
- no generic ecommerce template style
- no heavy rounded cards
- no unnecessary shadows
- no decorative clutter

Main colors:
- background: #ffffff
- text: #111111
- muted text: #8a8a8a
- border: #cfcfcf
- accent: #111111

Hover behavior:
- buttons may turn black
- text becomes white
- transition around 0.2s ease

## Layout grids

Use these responsive grids.

### Desktop 1920px and 1440px

Desktop uses one fluid layout for both 1920px and 1440px.

Grid:
- 12 columns
- stretch
- margin: 24px
- gutter: 24px

CSS:
- page horizontal padding: 24px
- use width: 100%
- do not hardcode 1872px or 1392px as fixed section widths
- use CSS Grid, Flexbox, fr units, minmax(0, 1fr), clamp()

Desktop spacing:
- component spacing: 24px
- block spacing: 48px
- section spacing: 96px
- large section spacing: 192px

### Tablet 768px

Grid:
- 8 columns
- stretch
- margin: 24px
- gutter: 24px

Tablet spacing:
- page horizontal padding: 24px
- component spacing: 24px
- block spacing: 48px
- section spacing: 96px
- large section spacing: 128px or 96px if layout is tight

Tablet is closer to desktop than mobile. Do not automatically treat tablet as a large mobile.

### Mobile 390px

Grid:
- 4 columns
- stretch
- margin: 16px
- gutter: 16px

Mobile spacing:
- page horizontal padding: 16px
- component spacing: 16px
- block spacing: 32px
- section spacing: 48px
- large section spacing: 96px

## Responsive strategy

Use mobile-first CSS.

Breakpoints:
- base: mobile
- 768px: tablet
- 1024px: desktop
- 1440px: wide desktop only if needed

Important:
- 1920px and 1440px are the same desktop layout
- do not create a separate 1440 layout unless something breaks
- 1440 should work by fluid resizing of the 12-column grid
- tablet keeps 24px side padding
- mobile uses 16px side padding
- horizontal scroll is allowed only for intentional rows like category tabs or product rows
- avoid accidental horizontal overflow

Typical behavior:
- desktop: full layout
- tablet: simplified layout, usually still spacious
- mobile: one column or horizontal product scroll where specified

Use clamp() for large typography and large wordmarks.

Avoid:
- absolute positioning for core layout
- fixed pixel widths for full sections
- layout based only on 1920px
- horizontal overflow

## CSS variables

Use or create CSS variables in the global CSS file.

Recommended variables:

:root {
  --color-bg: #ffffff;
  --color-text: #111111;
  --color-muted: #8a8a8a;
  --color-border: #cfcfcf;

  --page-x: 16px;

  --space-8: 8px;
  --space-12: 12px;
  --space-16: 16px;
  --space-24: 24px;
  --space-32: 32px;
  --space-48: 48px;
  --space-64: 64px;
  --space-96: 96px;
  --space-128: 128px;
  --space-192: 192px;

  --section-gap: 48px;
  --large-section-gap: 96px;
  --footer-gap: 96px;
}

@media (min-width: 768px) {
  :root {
    --page-x: 24px;
    --section-gap: 96px;
    --large-section-gap: 192px;
    --footer-gap: 192px;
  }
}

Use these variables instead of random hardcoded values.

## Typography

Use the existing font setup if present.

Preferred UI font:
- Mulish or similar clean sans-serif

Typical typography:
- body: 16px
- body line-height: 24px
- small: 12px or 14px
- product names: 14px to 16px
- price: 16px, medium/semi-bold
- page titles desktop: 48px to 64px
- page titles mobile: 32px to 40px

Use clamp() for large wordmarks and hero typography.

Do not create many random font sizes.

## Pages

Expected pages/routes:
- / — home
- /catalog — catalog
- /catalog/[slug] — product page
- /cart — cart
- /checkout — checkout
- /collections — collections page or temporary placeholder
- /privacy — privacy page
- /delivery-payment — delivery and payment page

Do not create unnecessary pages.

## Header

Desktop header:
- logo on the left
- navigation centered
- cart on the right
- white background
- no boxed cells
- no visible header background block
- no heavy borders
- small typography
- page padding: 24px

Desktop links:
- soldador -> /
- О НАС -> /#about
- КАТАЛОГ -> /catalog
- КОЛЛЕКЦИИ -> /collections
- КОНТАКТЫ -> /#contacts
- КОРЗИНА (0) -> /cart

Tablet and mobile header:
- burger icon on the left
- soldador logo centered
- cart link on the right
- no full navigation row
- page padding:
  - tablet: 24px
  - mobile: 16px

Burger menu:
- used on tablet and mobile
- opens from the left
- side drawer width: 281px
- side drawer height: 100dvh
- drawer background: #ffffff
- page overlay background: rgba(17, 17, 17, 0.9) or similar dark overlay
- close icon "×" at the top left of the drawer
- soldador logo inside the drawer
- menu links stacked vertically:
  - О НАС
  - КАТАЛОГ
  - КОЛЛЕКЦИИ
  - КОНТАКТЫ
  - КОРЗИНА (0)
- no full-screen mobile menu
- no complex animation required
- simple slide/fade transition is enough
- clicking overlay or close icon closes the menu
- clicking a menu link closes the menu
- body scroll should be blocked while menu is open

Because burger menu uses state, Header must be a client component.

## Footer

Footer is a major visual element.

Footer should include:
- contact block
- central brand phrase
- copyright under the phrase
- small navigation
- huge soldador wordmark at the bottom
- service links below or near the wordmark

Footer content:

Contacts:
+7 (999) 123-45-67
soldador@gmail.com
г. Калининград, Советский пр-т, д. 126

Central phrase:
SOLDADOR ЭТО НЕ ПРОСТО МЕБЕЛЬ.
ЭТО ТО, КАК ОЩУЩАЕТСЯ ПРОСТРАНСТВО.

Copyright:
© 2026 Soldador. Все права защищены.

Navigation:
О нас
Каталог
Коллекции

Bottom:
Designed by duffyyq © 2026
Политика конфиденциальности
Доставка и оплата

Footer wordmark:
- very large
- black
- use clamp() for responsive scaling
- should feel like a brand typographic ending

Footer should have id="contacts".

Do not replace footer with generic multi-column ecommerce footer.

Footer responsive behavior:
- desktop: contacts left, brand phrase centered, navigation right, huge wordmark at bottom
- tablet/mobile: footer content becomes centered
- brand phrase first
- copyright below
- contacts below
- navigation below contacts
- huge soldador wordmark near bottom
- service links below wordmark
- no horizontal overflow

## Product imagery style

Product images should use a consistent studio style:
- square product photos
- light gray / white studio background
- soft floor-to-wall gradient
- soft realistic shadows
- object centered
- furniture fully visible
- no interior props
- no noise or grain
- no strong contrast background

Product card images:
- square ratio
- image should fill the card area visually
- furniture should not be stretched
- object-fit should preserve proportions
- product cards should not have borders or heavy shadows

## Buttons

Button style:
- rectangular
- no rounded corners
- thin border for secondary buttons
- black background for primary buttons
- uppercase text
- centered text
- minimal hover

Primary button:
- background #111111
- color #ffffff
- border 1px solid #111111

Secondary button:
- background transparent or white
- color #111111
- border 1px solid #111111

Hover:
- secondary button can become black with white text
- transition around 0.2s ease

## Product card

Product card style:
- no card border
- no rounded corners
- no shadow
- square image on top
- product name below image
- price below name
- compact typography
- image is the main visual element
- hover should be subtle

Product card content:
- image
- name
- price

Do not add:
- badges unless user asks
- rating
- quick buy button
- favorite icon
- marketplace-style labels

## Home responsive behavior

Home page sections:
- Hero
- Новинки
- Категории
- О нас
- Бестселлеры

Desktop:
- full typographic hero
- large soldador wordmark
- hero furniture image over the wordmark
- product rows show multiple items
- categories image and category list layout
- about section uses large typography and wide image

Tablet 768:
- keep a strong visual hero
- keep 24px side padding
- product rows may show multiple items in a row
- categories can remain image + list if space allows
- about section remains spacious

Mobile 390:
- hero keeps large soldador wordmark and large furniture image
- product rows like Новинки and Бестселлеры should use horizontal scroll, not a long one-column list
- categories can be stacked according to Figma
- about section becomes one column
- large headings use clamp()

## Catalog

Catalog page includes:
- title КАТАЛОГ
- category tabs
- filter trigger
- sort control
- product grid

Categories:
- ВСЕ ТОВАРЫ
- СТОЛЫ
- СТУЛЬЯ
- ДИВАНЫ
- КРЕСЛА
- КОМОДЫ
- ТУМБЫ
- ОСВЕЩЕНИЕ

Filter:
- filter is opened by click
- filter is not a fixed sidebar
- filter may appear as dropdown/floating panel
- filter may overlap product grid in open state
- filter fields: material, color, price
- apply button is allowed

Sort:
- dropdown on the right
- По умолчанию
- Сначала дешевле
- Сначала дороже

Catalog responsive behavior:
- desktop: product grid 3 columns, category tabs under title, filter left, sort right
- tablet 768: product grid 2 columns, category tabs can scroll horizontally if needed, filter and sort stay in top control row
- mobile 390: product grid 1 column, category tabs horizontal scroll, filter and sort in one row

## Product model

Products should support:
- id
- slug
- name
- category
- price
- image_url
- gallery
- description
- width_cm
- depth_cm
- height_cm
- upholstery_material
- frame_material
- color
- is_new
- is_collection
- created_at

Furniture dimensions format:
- Ш × Г × В
- Ш = width
- Г = depth
- В = height

Compact cart characteristic example:
78 × 62 × 72 см · кожа · металл

## Product page layout

Desktop product page:
- back link above content
- large product image on the left
- product information on the right
- product title large
- materials and dimensions as small text blocks
- price near the lower part of the info column
- add to cart button below price
- other products section below

Product page should stay minimal:
- no tabs unless user asks
- no reviews
- no ratings
- no delivery widgets
- no marketplace UI

Product page responsive behavior:
- desktop: image left, information right, other products 4 columns
- tablet 768: one column, large product image first, product information below, other products 2 columns
- mobile 390: one column, large product image first, information below, other products 1 column

## Cart

Cart can use localStorage.

Cart page includes:
- back link
- title КОРЗИНА / N товара
- product rows
- product image
- product name
- compact characteristics
- quantity control
- remove button
- price
- total
- checkout button

Checkout button:
- ОФОРМИТЬ ЗАКАЗ

Cart responsive behavior:
- desktop: cart items are horizontal rows, image left, info near image, remove and price aligned to the right
- tablet 768: cart items remain horizontal rows, image left, info center, price right, page padding 24px
- mobile 390: cart items become stacked product cards, product image full width, name and remove button in one row, characteristics below, quantity left, price right, checkout button full width

Do not overcomplicate cart state management.

## Checkout

Checkout page includes:
- receiver data
- delivery method
- delivery address
- payment method
- order summary
- final total
- submit button

Receiver fields:
- full name
- phone
- email

Delivery:
- courier
- pickup

Address:
- city
- street
- house
- apartment
- floor
- comment

Address is required only for courier delivery.

Payment:
- card_online
- card_on_delivery
- cash_on_delivery

No real payment integration.
If card_online is selected, still submit as a demo order.

Submit button text:
ОФОРМИТЬ ЗАКАЗ

Do not use:
ПЕРЕЙТИ К ОПЛАТЕ

unless real payment integration is implemented.

Checkout responsive behavior:
- desktop: two-column layout, form on the left, order summary on the right
- tablet 768: one-column layout, order summary appears first, form appears below, keep 24px side padding, form fields can still use two columns where there is enough width
- mobile 390: one-column layout, order summary first, form below, fields full width, radio options stack or wrap naturally, total block before submit button, submit button full width

After successful checkout:
- generate order number like SDL-2026-10428
- show success modal
- clear cart
- optionally create order in Supabase if configured
- do not generate tracking code at checkout stage

Tracking code:
- do not show tracking code immediately after order creation
- tracking code can be mentioned as something that will be sent later by email after the order is handed to delivery service
- for the demo project, tracking code can be omitted completely

## Order success modal

After successful checkout, show a centered modal overlay.

Modal content:

СПАСИБО ЗА ЗАКАЗ

Ваш заказ принят в обработку.
Мы свяжемся с вами в ближайшее время.

Номер заказа: SDL-2026-10428

ВЕРНУТЬСЯ К ПОКУПКАМ

Modal style:
- white background
- centered on page
- minimal typography
- no rounded corners
- no heavy shadow
- large uppercase title
- muted gray body text
- black full-width primary button
- button text uppercase
- modal should match the clean Soldador visual style

Behavior:
- button "ВЕРНУТЬСЯ К ПОКУПКАМ" navigates to /catalog
- modal appears only after successful order submission
- cart is cleared after successful order submission
- order number should be generated in format SDL-2026-XXXXX
- do not show tracking code in the modal

Email note:
- email confirmation may repeat the order number
- email may say that tracking information will be sent later after delivery processing
- real email sending can be left as TODO or demo placeholder

## Supabase

Use Supabase for:
- categories
- products
- product_images
- orders
- order_items

Use Supabase Storage for product images.

Do not use Supabase Auth.

Environment variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Never expose service role key in client code.

Supabase client location:
- src/lib/supabaseClient.ts

If Supabase env variables are missing:
- site should not crash
- use fallback data where possible

## Supabase database rules

Tables:
- categories
- products
- product_images
- orders
- order_items

RLS:
- public SELECT for categories
- public SELECT for products
- public SELECT for product_images
- anon INSERT for orders
- anon INSERT for order_items
- no public SELECT for orders
- no public SELECT for order_items

Order data should support:
- id
- order_number
- customer_full_name
- customer_phone
- customer_email
- delivery_method
- address fields
- payment_method
- products_total
- delivery_price
- total_price
- status
- created_at

Order status values can be:
- created
- processing
- shipped
- completed
- cancelled

Default status:
created

Tracking code:
- optional
- should not be generated immediately at checkout
- can be added later only if order status becomes shipped

## Images

Product images:
- mostly studio-style
- light background
- consistent framing
- square images for product cards
- use object-fit carefully
- do not stretch furniture
- preserve aspect ratio

Use next/image if already configured and not overcomplicated.
Regular img is acceptable if simpler.

## State management

Keep state simple.

Use:
- React useState
- localStorage for cart
- Supabase for products/orders

Do not add Redux, Zustand, React Query unless explicitly asked.

## File structure preference

Preferred structure:

src/
  app/
    page.tsx
    catalog/
      page.tsx
      [slug]/
        page.tsx
    cart/
      page.tsx
    checkout/
      page.tsx
    collections/
      page.tsx
    privacy/
      page.tsx
    delivery-payment/
      page.tsx
  components/
    Header/
      Header.tsx
      Header.module.css
    Footer/
      Footer.tsx
      Footer.module.css
    ProductCard/
      ProductCard.tsx
      ProductCard.module.css
    CartItem/
      CartItem.tsx
      CartItem.module.css
    CheckoutForm/
      CheckoutForm.tsx
      CheckoutForm.module.css
  lib/
    supabaseClient.ts
    cart.ts
    format.ts
  types/
    product.ts
    order.ts
  data/
    fallbackProducts.ts
  styles/
    globals.css

If existing structure differs, adapt to it.
Do not rewrite structure unnecessarily.

## Figma implementation

When implementing from Figma:
- use screenshots as visual reference
- follow user-provided sizes, columns, spacing, typography
- do not invent new visual ideas
- do not aim for fragile pixel-perfect absolute positioning
- implement robust responsive layout

When user gives column placement:
- desktop grid has 12 columns
- tablet grid has 8 columns
- mobile grid has 4 columns

If user says “image from column 1 to 6”, implement approximately using CSS Grid.

## Testing

After meaningful changes:
- run npm run lint if available
- run npm run build if reasonable
- report errors honestly
- do not claim successful build if it was not run

## Done criteria

A task is done when:
- it matches the requested screen or component closely
- responsive behavior is reasonable
- no unrelated files were changed
- CSS follows spacing system
- no unnecessary dependencies were added
- TypeScript has no obvious errors