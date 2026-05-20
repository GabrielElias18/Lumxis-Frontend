import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Edit3, Trash2, Package, Info, TrendingUp } from 'lucide-react';
import { deleteProduct, getProductById } from '../../../../../services/productServices';
import { getCategoriesByUser } from '../../../../../services/categoryServices';
import EditarProductoForm from './EditarProductoForm';
import './styles/DetalleProducto.css';

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productoRes, categoriasRes] = await Promise.allSettled([
          getProductById(id),
          getCategoriesByUser(),
        ]);

        const productoData = productoRes.status === 'fulfilled' ? productoRes.value : null;
        const categoriasData = categoriasRes.status === 'fulfilled' ? categoriasRes.value : [];

        if (productoRes.status === 'rejected' || !productoData) {
          toast.error('No se pudo cargar el producto.');
          navigate('/dashboard/inventario');
          return;
        }

        setCategorias(categoriasData);
        if (productoData.categoriaid && categoriasData.length > 0) {
          const cat = categoriasData.find((c) => String(c.categoriaid) === String(productoData.categoriaid));
          if (cat) productoData.categoriaNombre = cat.nombre;
        }
        setProducto(productoData);
      } catch {
        toast.error('Ocurrió un error inesperado.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleDelete = () => {
    toast('¿Eliminar este producto?', {
      description: 'Esta acción borrará el registro permanentemente.',
      action: {
        label: 'Eliminar',
        onClick: async () => {
          try {
            await deleteProduct(id);
            navigate('/dashboard/inventario');
          } catch {
            toast.error('No se pudo eliminar.');
          }
        },
      },
      cancel: { label: 'Cancelar', onClick: () => {} },
    });
  };

  const handleUpdate = (updatedProduct) => {
    if (updatedProduct.categoriaid && categorias.length > 0) {
      const cat = categorias.find((c) => String(c.categoriaid) === String(updatedProduct.categoriaid));
      if (cat) updatedProduct.categoriaNombre = cat.nombre;
    }
    setProducto(updatedProduct);
    setIsEditing(false);
    toast.success('Producto actualizado.');
  };

  if (loading) return <div className="view-loading"><div className="loader-spinner" /></div>;
  if (!producto) return null;

  return (
    <div className="product-detail-view">
      <div className="view-header">
        <button className="btn-circle-back" onClick={() => navigate('/dashboard/inventario')}>
          <ArrowLeft size={22} />
        </button>
        <div className="header-text">
          <h1>Detalles del Producto</h1>
          <div className="detail-breadcrumb">
            <span>Inventario</span> / <span className="active">{producto.nombre}</span>
          </div>
        </div>
        {!isEditing && (
          <div className="header-actions">
            <button className="btn-edit-minimal" onClick={() => setIsEditing(true)}>
              <Edit3 size={18} />
              <span>Editar</span>
            </button>
            <button className="btn-delete-minimal" onClick={handleDelete}>
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="detail-main-container">
        {isEditing ? (
          <div className="inline-editor">
            <EditarProductoForm
              producto={producto}
              onClose={() => setIsEditing(false)}
              onUpdate={handleUpdate}
              isInline={true}
            />
          </div>
        ) : (
          <div className="detail-split-grid">
            <div className="detail-image-card">
              <div className="detail-image-box">
                {producto.imagenes?.length > 0 ? (
                  <img
                    src={producto.imagenes[0].startsWith('http') ? producto.imagenes[0] : `http://localhost:3000/uploads/${producto.imagenes[0]}`}
                    alt={producto.nombre}
                    onError={(e) => (e.target.src = '/images/default-product.png')}
                  />
                ) : (
                  <img src="/images/default-product.png" alt="default" />
                )}
              </div>
              <div className={`detail-status ${producto.cantidadDisponible > 0 ? 'in-stock' : 'no-stock'}`}>
                {producto.cantidadDisponible > 0 ? 'Disponible' : 'Agotado'}
              </div>
            </div>

            <div className="detail-info-card">
              <div className="info-section-minimal">
                <div className="info-title-group">
                  <span className="info-label"><Package size={14} /> Producto</span>
                  <h2>{producto.nombre}</h2>
                  <span className="info-category-tag">{producto.categoriaNombre || 'Sin categoría'}</span>
                </div>

                <div className="info-description-minimal">
                  <span className="info-label"><Info size={14} /> Descripción</span>
                  <p>{producto.descripcion || 'Sin descripción proporcionada.'}</p>
                </div>

                <div className="detail-stats-minimal">
                  <div className="stat-card-minimal">
                    <span className="stat-label">Stock Actual</span>
                    <span className="stat-val">{producto.cantidadDisponible} <small>unds.</small></span>
                  </div>
                  <div className="stat-card-minimal">
                    <span className="stat-label">Precio Compra</span>
                    <span className="stat-val">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(producto.precioCompra)}</span>
                  </div>
                  <div className="stat-card-minimal primary">
                    <span className="stat-label">Precio Venta</span>
                    <span className="stat-val">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(producto.precioVenta)}</span>
                  </div>
                </div>

                <div className="profit-analysis-minimal">
                  <div className="profit-header">
                    <span><TrendingUp size={14} /> Análisis de Rentabilidad</span>
                    <strong>{(((producto.precioVenta - producto.precioCompra) / producto.precioCompra) * 100).toFixed(1)}%</strong>
                  </div>
                  <div className="profit-bar-minimal">
                    <div className="profit-bar-inner" style={{ width: `${Math.min((((producto.precioVenta - producto.precioCompra) / producto.precioCompra) * 100), 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetalleProducto;
