import { describe, expect, it } from "vitest";
import { money, multiply } from "../lib/money.js";
import { slugify } from "../lib/slug.js";
import { loginSchema } from "../validators/auth.js";
import { cartQuoteSchema } from "../validators/order.js";

describe("helpers y validación", () => {
  it("normaliza slugs", () => {
    expect(slugify("Tote Jardín Secreto")).toBe("tote-jardin-secreto");
  });

  it("redondea dinero", () => {
    expect(money(18500.229)).toBe(18500.23);
    expect(multiply(1000, 3)).toBe(3000);
  });

  it("valida login", () => {
    expect(() => loginSchema.parse({ email: "mal", password: "123" })).toThrow();
    expect(loginSchema.parse({ email: "admin@arisbags.local", password: "AdminDemo123!" }).email).toBe(
      "admin@arisbags.local",
    );
  });

  it("valida cantidades del carrito", () => {
    expect(() => cartQuoteSchema.parse({ items: [{ productId: "p1", quantity: 0 }] })).toThrow();
  });
});
