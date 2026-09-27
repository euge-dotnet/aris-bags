import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { AboutPage } from "./pages/AboutPage";
import { AdminCategoriesPage } from "./pages/admin/AdminCategoriesPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminDrawingsPage } from "./pages/admin/AdminDrawingsPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminOrderDetailPage } from "./pages/admin/AdminOrderDetailPage";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";
import { AdminProductFormPage } from "./pages/admin/AdminProductFormPage";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { DrawingPage } from "./pages/DrawingPage";
import { DrawingsPage } from "./pages/DrawingsPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { OrderPage } from "./pages/OrderPage";
import { ProductPage } from "./pages/ProductPage";

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/dibujos" element={<DrawingsPage />} />
              <Route path="/dibujos/:key" element={<DrawingPage />} />
              <Route path="/producto/:slug" element={<ProductPage />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/pedido/:id" element={<OrderPage />} />
              <Route path="/nosotros" element={<AboutPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="productos" element={<AdminProductsPage />} />
              <Route path="productos/:id" element={<AdminProductFormPage />} />
              <Route path="categorias" element={<AdminCategoriesPage />} />
              <Route path="pedidos" element={<AdminOrdersPage />} />
              <Route path="pedidos/:id" element={<AdminOrderDetailPage />} />
              <Route path="dibujos" element={<AdminDrawingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
