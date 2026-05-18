import Link from "next/link";
import styles from "./Footer.module.css";

const navLinks = [
  { href: "/#about", label: "О нас", anchor: true },
  { href: "/catalog", label: "Каталог" },
  { href: "/#contacts", label: "Контакты", anchor: true },
];

export function Footer() {
  return (
    <footer className={styles.footer} id="contacts">
      <div className={styles.top}>
        <address className={styles.contacts}>
          <a className={styles.phone} href="tel:+79991234567">
            +7 (999) 123-45-67
          </a>
          <a href="mailto:soldador@gmail.com">soldador@gmail.com</a>
          <span>г. Калининград, Советский пр-т, 126</span>
        </address>

        <div className={styles.center}>
          <p className={styles.phrase}>
            SOLDADOR ЭТО НЕ ПРОСТО МЕБЕЛЬ.
            <br />
            ЭТО ТО, КАК ОЩУЩАЕТСЯ ПРОСТРАНСТВО.
          </p>
          <p className={styles.phraseMobile}>
            SOLDADOR
            <br />
            ЭТО НЕ ПРОСТО МЕБЕЛЬ.
            <br />
            ЭТО ТО, КАК ОЩУЩАЕТСЯ
            <br />
            ПРОСТРАНСТВО.
          </p>
          <span>© 2026 SOLDADOR. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</span>
        </div>

        <nav className={styles.nav} aria-label="Навигация в футере">
          {navLinks.map((link) =>
            link.anchor ? (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ) : (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>

      <img
        className={styles.wordmark}
        src="/brand/soldador-wordmark.svg"
        width="1872"
        height="312"
        alt="Soldador"
      />

      <div className={styles.bottom}>
        <span>Designed by duffyyq</span>
        <Link href="/privacy">Политика конфиденциальности</Link>
        <Link href="/delivery-payment">Доставка и оплата</Link>
      </div>
    </footer>
  );
}
