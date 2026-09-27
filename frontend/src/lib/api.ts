const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

function getToken() {
  return sessionStorage.getItem("aris_token");
}

export function setToken(token: string | null) {
  if (token) sessionStorage.setItem("aris_token", token);
  else sessionStorage.removeItem("aris_token");
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const body = (await response.json()) as ApiResponse<T>;
  if (!body.success) {
    throw new ApiError(body.error.code, body.error.message);
  }
  return body.data;
}

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
};

export type ProductImage = {
  id: string;
  url: string;
  publicId: string | null;
  alt: string;
  sortOrder: number;
  isPlaceholder: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  available: boolean;
  category: Category;
  images: ProductImage[];
};

export type Drawing = {
  key: string;
  publicId: string;
  url: string;
  width?: number;
  height?: number;
};

export type DrawingsPayload = {
  folder: string;
  count: number;
  images: Drawing[];
};

export type CartQuote = {
  items: Array<{
    productId: string;
    name: string;
    slug: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    stock: number;
    image: { url: string; alt: string } | null;
    drawing: Drawing;
    bagColor: "tilo" | "natural" | "blanco" | "azul";
  }>;
  subtotal: number;
  total: number;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  deliveryMethod: string;
  paymentMethod: string;
  notes: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    drawingPublicId: string | null;
    drawingUrl: string | null;
    bagColor: string | null;
  }>;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN";
};
