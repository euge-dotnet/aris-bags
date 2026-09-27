import { Decimal } from "@prisma/client/runtime/library";

export function money(value: Decimal | number | string) {
  return Number(new Decimal(value).toFixed(2));
}

export function multiply(price: Decimal | number | string, quantity: number) {
  return money(new Decimal(price).mul(quantity));
}
