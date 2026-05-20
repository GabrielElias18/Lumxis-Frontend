import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/NotFound';

const Dashboard = lazy(() => import('./components/vendedor/dashboard/Dashboard'));
const Inventario = lazy(() => import('./components/vendedor/dashboard/inventario/Inventario'));
const Productos = lazy(() => import('./components/vendedor/dashboard/productos/Productos'));
const Balance = lazy(() => import('./components/vendedor/dashboard/balance/Balance'));
const Estadisticas = lazy(() => import('./components/vendedor/dashboard/estadisticas/Estadisticas'));
const Clientes = lazy(() => import('./components/vendedor/dashboard/clientes/Clientes'));
const Proveedores = lazy(() => import('./components/vendedor/dashboard/proveedores/Proveedores'));
const Login = lazy(() => import('./components/vendedor/login/Login'));
const Home = lazy(() => import('./components/inicio/landing'));
const Inicio = lazy(() => import('./components/vendedor/dashboard/inicio/Inicio'));
const Registro = lazy(() => import('./components/vendedor/login/Registro'));
const RegistrarIngresoForm = lazy(() => import('./components/vendedor/dashboard/balance/vistas/RegistrarIngresoForm'));
const RegistrarEgresoForm = lazy(() => import('./components/vendedor/dashboard/balance/vistas/RegistrarEgresoForm'));
const DetalleVenta = lazy(() => import('./components/vendedor/dashboard/balance/vistas/DetalleVenta'));
const DetalleEgreso = lazy(() => import('./components/vendedor/dashboard/balance/vistas/DetalleEgreso'));
const DetalleProducto = lazy(() => import('./components/vendedor/dashboard/inventario/vistas/DetalleProducto'));
const NuevoProducto = lazy(() => import('./components/vendedor/dashboard/inventario/vistas/NuevoProducto'));
const Categorias = lazy(() => import('./components/vendedor/dashboard/categorias/Categorias'));
const Usuarios = lazy(() => import('./components/vendedor/dashboard/usuarios/Usuario'));
const Configuracion = lazy(() => import('./components/vendedor/dashboard/configuracion/Configuracion'));
const ChatPage = lazy(() => import('./components/chat/ChatPage'));

const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
    <div style={{ width: 36, height: 36, border: '3px solid #E2E8F0', borderTop: '3px solid #1565C0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors closeButton />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="inicio" replace />} />
                <Route path="inicio" element={<Inicio />} />

                <Route path="inventario" element={<Inventario />} />
                <Route path="productos" element={<Productos />} />
                <Route path="categorias" element={<Categorias />} />
                <Route path="producto/:id" element={<DetalleProducto />} />
                <Route path="nuevo-producto" element={<NuevoProducto />} />

                <Route path="balance" element={<Balance />} />
                <Route path="estadisticas" element={<Estadisticas />} />
                <Route path="nueva-venta" element={<RegistrarIngresoForm />} />
                <Route path="nuevo-egreso" element={<RegistrarEgresoForm />} />
                <Route path="venta/:id" element={<DetalleVenta />} />
                <Route path="egreso/:id" element={<DetalleEgreso />} />

                <Route path="clientes" element={<Clientes />} />
                <Route path="proveedores" element={<Proveedores />} />

                <Route path="asistente" element={<ChatPage />} />

                <Route path="usuarios" element={<Usuarios />} />
                <Route path="configuracion" element={<Configuracion />} />
              </Route>

              <Route path="/admin/*" element={<Navigate to="/dashboard/inicio" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
