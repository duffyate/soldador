"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CART_UPDATED_EVENT, getCartQuantity } from "@/lib/cart";
import styles from "./Header.module.css";

const navLinks = [
  { href: "/#about", label: "О НАС", anchor: true },
  { href: "/catalog", label: "КАТАЛОГ" },
  { href: "/#contacts", label: "КОНТАКТЫ", anchor: true },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);

  const cartLabel = `КОРЗИНА (${cartQuantity})`;
  const menuLinks = [...navLinks, { href: "/cart", label: cartLabel }];

  useEffect(() => {
    const updateCartQuantity = () => setCartQuantity(getCartQuantity());

    updateCartQuantity();
    window.addEventListener(CART_UPDATED_EVENT, updateCartQuantity);
    window.addEventListener("storage", updateCartQuantity);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, updateCartQuantity);
      window.removeEventListener("storage", updateCartQuantity);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className={styles.header}>
        <button
          className={styles.menuButton}
          type="button"
          aria-label="Открыть меню"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
        >
          <img src="/ui/burger.svg" width="24" height="24" alt="" />
        </button>

        <Link className={styles.logoLink} href="/" aria-label="Soldador">
          <img
            className={styles.logo}
            src="/brand/soldador-logo.svg"
            width="95"
            height="24"
            alt="Soldador"
          />
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          {navLinks.map((link) =>
            link.anchor ? (
              <a className={styles.link} href={link.href} key={link.href}>
                {link.label}
              </a>
            ) : (
              <Link className={styles.link} href={link.href} key={link.href}>
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <Link className={styles.cartLink} href="/cart">
          {cartLabel}
        </Link>
      </header>

      <div
        className={`${styles.overlay} ${isMenuOpen ? styles.overlayOpen : ""}`}
        onClick={closeMenu}
      />

      <aside
        className={`${styles.drawer} ${isMenuOpen ? styles.drawerOpen : ""}`}
        aria-hidden={!isMenuOpen}
      >
        <button
          className={styles.closeButton}
          type="button"
          aria-label="Закрыть меню"
          onClick={closeMenu}
        >
          <img src="/ui/close.svg" width="24" height="24" alt="" />
        </button>

        <Link className={styles.drawerLogo} href="/" onClick={closeMenu}>
          <img src="/brand/soldador-logo.svg" width="95" height="24" alt="Soldador" />
        </Link>

        <nav className={styles.drawerNav} aria-label="Мобильная навигация">
          {menuLinks.map((link) =>
            "anchor" in link && link.anchor ? (
              <a href={link.href} key={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            ) : (
              <Link href={link.href} key={link.href} onClick={closeMenu}>
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </aside>
    </>
  );
}
