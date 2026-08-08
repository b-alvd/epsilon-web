"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./NavDropdown.module.css";

const ITEMS = [
  { href: "/#features", label: "Le serveur" },
  { href: "/#team", label: "Équipe" },
  { href: "/#faq", label: "FAQ" },
];

export default function NavDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Découvrir
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="m6 9 6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div className={styles.menu}>
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.item}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
