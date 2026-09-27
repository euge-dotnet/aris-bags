import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, type CartQuote } from "../lib/api";
import type { BagColorId } from "../lib/bagColors";
import { lineKey, readCart, writeCart, type CartLine } from "../lib/cartStorage";

type CartContextValue = {
  lines: CartLine[];
  quote: CartQuote | null;
  error: string | null;
  loading: boolean;
  add: (productId: string, drawingPublicId: string, bagColor: BagColorId, quantity?: number) => void;
  setQuantity: (
    productId: string,
    drawingPublicId: string,
    bagColor: BagColorId,
    quantity: number,
  ) => void;
  remove: (productId: string, drawingPublicId: string, bagColor: BagColorId) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => readCart());
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    writeCart(lines);
  }, [lines]);

  useEffect(() => {
    if (lines.length === 0) {
      setQuote(null);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    api<CartQuote>("/api/cart/quote", {
      method: "POST",
      body: JSON.stringify({ items: lines }),
    })
      .then((data) => {
        if (!active) return;
        setQuote(data);
        setError(null);
      })
      .catch((err: Error) => {
        if (!active) return;
        setQuote(null);
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [lines]);

  const value = useMemo(
    () => ({
      lines,
      quote,
      error,
      loading,
      add(productId: string, drawingPublicId: string, bagColor: BagColorId, quantity = 1) {
        setLines((current) => {
          const next = { productId, drawingPublicId, bagColor };
          const match = current.find((item) => lineKey(item) === lineKey(next));
          if (!match) return [...current, { ...next, quantity }];
          return current.map((item) =>
            lineKey(item) === lineKey(next)
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        });
      },
      setQuantity(
        productId: string,
        drawingPublicId: string,
        bagColor: BagColorId,
        quantity: number,
      ) {
        const next = { productId, drawingPublicId, bagColor };
        setLines((current) =>
          current
            .map((item) => (lineKey(item) === lineKey(next) ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        );
      },
      remove(productId: string, drawingPublicId: string, bagColor: BagColorId) {
        const next = { productId, drawingPublicId, bagColor };
        setLines((current) => current.filter((item) => lineKey(item) !== lineKey(next)));
      },
      clear() {
        setLines([]);
      },
    }),
    [error, lines, loading, quote],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}
