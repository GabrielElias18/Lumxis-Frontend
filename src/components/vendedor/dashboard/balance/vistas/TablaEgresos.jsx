import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileDown, TrendingDown } from "lucide-react";
import "../vistas/styles/TablaVentas.css";
import { getEgresos } from "../../../../../services/egresoService";
import { getProveedores } from "../../../../../services/proveedorService";
import { exportarEgresos } from "../exportarBalance";

const TablaEgresos = () => {
  const navigate = useNavigate();
  const [egresos, setEgresos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 15;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState("");

  useEffect(() => {
    fetchEgresos();
  }, []);

  const fetchEgresos = async () => {
    try {
      const token = localStorage.getItem("token");
      const [egresosData, proveedoresData] = await Promise.all([
        getEgresos(token),
        getProveedores(token)
      ]);
      setEgresos(egresosData);
      setProveedores(proveedoresData);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const formatearFecha = (fecha) => {
    const d = new Date(fecha);
    const mes = (d.getMonth() + 1).toString().padStart(2, '0');
    const dia = d.getDate().toString().padStart(2, '0');
    return `${mes}/${dia}/${d.getFullYear()}`;
  };

  const egresosFiltrados = egresos.filter((egreso) => {
    const nombresProductos = egreso.detalles?.map(d => d.productoNombre).join(" ").toLowerCase() || "";
    const coincideBusqueda =
      nombresProductos.includes(searchTerm.toLowerCase()) ||
      egreso.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      egreso.proveedor?.nombreProveedor?.toLowerCase().includes(searchTerm.toLowerCase());

    const fechaEgresoLocal = new Date(egreso.createdAt);
    const fechaFormateada = `${fechaEgresoLocal.getFullYear()}-${String(fechaEgresoLocal.getMonth() + 1).padStart(2, '0')}-${String(fechaEgresoLocal.getDate()).padStart(2, '0')}`;

    return coincideBusqueda &&
      (selectedDate ? fechaFormateada === selectedDate : true) &&
      (selectedProveedor ? (selectedProveedor === "null" ? !egreso.proveedorid : String(egreso.proveedorid) === String(selectedProveedor)) : true);
  });

  const egresosPaginados = egresosFiltrados.slice((paginaActual - 1) * registrosPorPagina, paginaActual * registrosPorPagina);
  const totalPaginas = Math.ceil(egresosFiltrados.length / registrosPorPagina);

  return (
    <div className="tabla-container">
      <div className="tabla-top-bar">
        <h3>Egresos (Compras)</h3>
        <button
          className="tabla-export-btn"
          onClick={() => exportarEgresos(egresosFiltrados)}
          disabled={egresosFiltrados.length === 0}
          title="Exportar a Excel"
        >
          <FileDown size={14} />
          <span>Exportar</span>
        </button>
      </div>

      <div className="filters-container">
        <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPaginaActual(1); }} className="filter-input" />
        <input type="date" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setPaginaActual(1); }} className="filter-input" />
        <select className="filter-input" value={selectedProveedor} onChange={(e) => { setSelectedProveedor(e.target.value); setPaginaActual(1); }}>
          <option value="">Todos los proveedores</option>
          <option value="null">Sin proveedor</option>
          {proveedores.map(p => <option key={p.proveedorid} value={p.proveedorid}>{p.nombreProveedor}</option>)}
        </select>
      </div>

      <table className="tabla-productos">
        <thead>
          <tr>
            <th className="text-left">Fecha</th>
            <th className="text-left">Productos</th>
            <th className="text-left">Proveedor</th>
            <th className="text-right">Items</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {egresosPaginados.length > 0 ? (
            egresosPaginados.map((egreso) => {
              const totalItems = egreso.detalles?.reduce((acc, d) => acc + d.cantidad, 0) || 0;
              const resumen = egreso.detalles?.length > 1
                ? `${egreso.detalles[0].productoNombre} (+${egreso.detalles.length - 1})`
                : egreso.detalles?.[0]?.productoNombre || "-";
              return (
                <tr key={egreso.egresoid} style={{ cursor: 'pointer' }} onClick={() => navigate(`/dashboard/egreso/${egreso.egresoid}`, { state: { egreso } })}>
                  <td className="text-left">{formatearFecha(egreso.createdAt)}</td>
                  <td className="text-left"><strong>{resumen}</strong></td>
                  <td className="text-left">{egreso.proveedor?.nombreProveedor || <span style={{ opacity: 0.5 }}>General</span>}</td>
                  <td className="text-right">{totalItems}</td>
                  <td className="text-right total-cell egreso-text">${Number(egreso.total).toLocaleString("es-CO")}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="tabla-empty">
                <TrendingDown size={28} style={{ opacity: 0.25, marginBottom: '0.5rem' }} />
                <p>{searchTerm || selectedDate || selectedProveedor ? 'Sin resultados para los filtros aplicados' : 'Aún no hay egresos registrados'}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPaginas > 1 && (
        <div className="paginacion">
          <button onClick={() => setPaginaActual(p => p - 1)} disabled={paginaActual === 1}>Anterior</button>
          <span>Página {paginaActual} de {totalPaginas}</span>
          <button onClick={() => setPaginaActual(p => p + 1)} disabled={paginaActual === totalPaginas}>Siguiente</button>
        </div>
      )}
    </div>
  );
};

export default TablaEgresos;
