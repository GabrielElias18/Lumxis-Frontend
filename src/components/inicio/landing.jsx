import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  BarChart as ChartBar,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  Users,
  ShieldCheck,
  Truck,
  Clock,
  HeartHandshake,
} from "lucide-react";
import "./landing.css";
function Landing() {
  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <Package className="logo-icon" />
            <span style={{ color: '#1565C0' }}>OrderEasy</span>
          </div>

          <div className="nav-buttons">
            <Link className="btn-secondary no-underline" to="/login">
              Iniciar Sesión
            </Link>
            <Link className="btn-primary no-underline" to="/registro">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="fade-in">Simplifica tu Gestión de Inventario</h1>
          <p className="subtitle">
            Transforma las operaciones de tu negocio con la solución gratuita de
            OrderEasy. Controla ventas, gestiona gastos y haz crecer tu negocio
            con confianza.
          </p>
          <div className="button-group">
            <Link
              to="/registro"
              className="btn-primary flex items-center no-underline"
            >
              Comenzar Gratis <ArrowUpRight className="icon" />
            </Link>
            <button className="btn-outline">Agendar Demo</button>
            <button className="btn-outline">Ver Video</button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <ShieldCheck className="stat-icon" />
              <span>100% Gratuito</span>
            </div>
            <div className="stat-item">
              <Users className="stat-icon" />
              <span>Sin Tarjeta de Crédito</span>
            </div>
            <div className="stat-item">
              <Clock className="stat-icon" />
              <span>Soporte 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2>Todo lo que necesitas para triunfar</h2>
          <div className="features-grid">
            <div className="feature-card">
              <ChartBar className="feature-icon" />
              <h3>Análisis en Tiempo Real</h3>
              <p>
                Monitorea tus métricas de ventas e inventario en tiempo real con
                paneles intuitivos.
              </p>
              <a href="#" className="learn-more">
                Empezar →
              </a>
            </div>
            <div className="feature-card">
              <DollarSign className="feature-icon" />
              <h3>Gestión de Ventas</h3>
              <p>
                Procesa ventas rápidamente y mantén registros detallados de
                transacciones.
              </p>
              <Link to="/registro" className="learn-more">
                Empezar →
              </Link>
            </div>
            <div className="feature-card">
              <Package className="feature-icon" />
              <h3>Control de Stock</h3>
              <p>
                Mantén el control de tus niveles de inventario y recibe alertas
                automáticas de stock bajo.
              </p>
              <Link to="/registro" className="learn-more">
                Empezar →
              </Link>
            </div>
            <div className="feature-card">
              <TrendingUp className="feature-icon" />
              <h3>Insights de Crecimiento</h3>
              <p>
                Obtén información valiosa para optimizar tu inventario y
                aumentar las ventas.
              </p>
              <Link to="/registro" className="learn-more">
                Empezar →
              </Link>
            </div>
            <div className="feature-card">
              <Truck className="feature-icon" />
              <h3>Gestión de Proveedores</h3>
              <p>
                Administra tus proveedores y automatiza órdenes de compra
                eficientemente.
              </p>
              <Link to="/registro" className="learn-more">
                Empezar →
              </Link>
            </div>
            <div className="feature-card">
              <HeartHandshake className="feature-icon" />
              <h3>Relaciones con Clientes</h3>
              <p>
                Construye relaciones más sólidas con funciones integradas de
                CRM.
              </p>
              <Link to="/registro" className="learn-more">
                Empezar →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits">
        <div className="container">
          <h2>¿Por qué elegir OrderEasy?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <h3>Fácil de Usar</h3>
              <p>
                Interfaz intuitiva que requiere mínima capacitación. Comienza en
                minutos, no en días.
              </p>
            </div>
            <div className="benefit-item">
              <h3>Totalmente Gratis</h3>
              <p>
                Sin costos ocultos. Todas las funciones disponibles sin cargo
                alguno.
              </p>
            </div>
            <div className="benefit-item">
              <h3>Seguro</h3>
              <p>
                Seguridad de nivel empresarial con datos encriptados y respaldos
                regulares.
              </p>
            </div>
            <div className="benefit-item">
              <h3>Escalable</h3>
              <p>
                Desde pequeños negocios hasta empresas, nuestra solución crece
                contigo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">15,000+</div>
              <div className="stat-label">Usuarios Activos</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">2M+</div>
              <div className="stat-label">Pedidos Procesados</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Tiempo Activo</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">50+</div>
              <div className="stat-label">Países Atendidos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2>Lo que Dicen Nuestros Usuarios</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p>
                "OrderEasy ha transformado la forma en que manejamos nuestro
                inventario. El seguimiento en tiempo real y los análisis nos han
                ayudado a optimizar nuestros niveles de stock y aumentar las
                ganancias en un 25%."
              </p>
              <div className="testimonial-author">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=48&h=48&q=80"
                  alt="Usuario"
                />
                <div>
                  <div className="author-name">Juan Pérez</div>
                  <div className="author-title">CEO, TechRetail</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p>
                "Las funciones de gestión de ventas son increíbles. Hemos
                reducido nuestro tiempo de procesamiento en un 50% y mejorado la
                precisión significativamente. El soporte al cliente siempre está
                ahí cuando lo necesitamos."
              </p>
              <div className="testimonial-author">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=48&h=48&q=80"
                  alt="Usuario"
                />
                <div>
                  <div className="author-name">María González</div>
                  <div className="author-title">
                    Gerente de Operaciones, StyleStore
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p>
                "Desde que implementamos OrderEasy, hemos visto una reducción
                del 40% en agotamiento de stock y un aumento del 30% en la
                rotación de inventario. Ha sido un cambio revolucionario para
                nuestro negocio."
              </p>
              <div className="testimonial-author">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=48&h=48&q=80"
                  alt="Usuario"
                />
                <div>
                  <div className="author-name">Carlos Rodríguez</div>
                  <div className="author-title">Fundador, GrowthMart</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>¿Listo para optimizar tu gestión de inventario?</h2>
          <p>Únete a miles de negocios que confían en OrderEasy</p>
          <div className="cta-buttons">
            <Link to="/registro" className="btn-primary no-underline">
              Comenzar Gratis
            </Link>
            <button className="btn-outline">Contactar Ventas</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <Package className="logo-icon" />
                <span style={{ color: '#1565C0' }}>OrderEasy</span>
              </div>
              <p>
                Empoderando negocios con soluciones inteligentes de gestión de
                inventario gratuitas.
              </p>
              <div className="social-links">
                <a href="#" className="social-link">
                  Twitter
                </a>
                <a href="#" className="social-link">
                  LinkedIn
                </a>
                <a href="#" className="social-link">
                  Facebook
                </a>
              </div>
            </div>
            <div className="footer-links">
              <h3>Producto</h3>
              <ul>
                <li>
                  <a href="#">Características</a>
                </li>
                <li>
                  <a href="#">Precios</a>
                </li>
                <li>
                  <a href="#">Documentación</a>
                </li>
                <li>
                  <a href="#">API</a>
                </li>
                <li>
                  <a href="#">Integraciones</a>
                </li>
              </ul>
            </div>
            <div className="footer-links">
              <h3>Empresa</h3>
              <ul>
                <li>
                  <a href="#">Acerca de</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Carreras</a>
                </li>
                <li>
                  <a href="#">Prensa</a>
                </li>
                <li>
                  <a href="#">Socios</a>
                </li>
              </ul>
            </div>
            <div className="footer-links">
              <h3>Soporte</h3>
              <ul>
                <li>
                  <a href="#">Centro de Ayuda</a>
                </li>
                <li>
                  <a href="#">Contacto</a>
                </li>
                <li>
                  <a href="#">Estado</a>
                </li>
                <li>
                  <a href="#">Capacitación</a>
                </li>
                <li>
                  <a href="#">Comunidad</a>
                </li>
              </ul>
            </div>
            <div className="footer-links">
              <h3>Legal</h3>
              <ul>
                <li>
                  <a href="#">Privacidad</a>
                </li>
                <li>
                  <a href="#">Términos</a>
                </li>
                <li>
                  <a href="#">Seguridad</a>
                </li>
                <li>
                  <a href="#">Cumplimiento</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 OrderEasy. Todos los derechos reservados.</p>
            <div className="footer-bottom-links">
              <a href="#">Política de Privacidad</a>
              <a href="#">Términos de Servicio</a>
              <a href="#">Configuración de Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
