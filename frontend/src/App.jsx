import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas Públicas
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";
import NotFound from "./pages/NotFound";

// Páginas de Administrador
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminUsers from "./pages/admin/AdminUsers";

// O Router mostra uma página dependendo do URL sem fazer reload do navegador.
export default function App() {
  return (
    <BrowserRouter basename="/craig-david-shop/app">
      <Routes>
        {/* Área pública */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/loja" element={<Catalog />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registo" element={<Register />} />

          {/* So para usuarios logados */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/encomenda-confirmada/:id"
              element={<OrderSuccess />}
            />
            <Route path="/conta" element={<Profile />} />
            <Route path="/conta/encomendas" element={<OrderHistory />} />
            <Route path="/conta/encomendas/:id" element={<OrderDetail />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Área administrativa: so para admins */}
        <Route path="/admin" element={<ProtectedRoute adminOnly />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="produtos" element={<AdminProducts />} />
            <Route path="produtos/novo" element={<AdminProductForm />} />
            <Route path="produtos/:id/editar" element={<AdminProductForm />} />
            <Route path="categorias" element={<AdminCategories />} />
            <Route path="encomendas" element={<AdminOrders />} />
            <Route path="encomendas/:id" element={<AdminOrderDetail />} />
            <Route path="utilizadores" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
