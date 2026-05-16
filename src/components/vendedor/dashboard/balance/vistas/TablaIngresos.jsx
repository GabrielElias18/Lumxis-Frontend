import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileDown, TrendingUp } from "lucide-react";
import "../vistas/styles/TablaVentas.css";
import { getVentas } from "../../../../../services/ventaService";
import { getClientes } from "../../../../../services/clienteService";
import { exportarVentas } from "../exportarBalance";

const TablaIngresos = () => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 15;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState("");

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const token = localStorage.getItem("token");
      const [ventasData, clientesData] = await Promise.all([
        getVentas(token),
        getClientes(token)
      ]);
      setVentas(ventasData);
      setClientes(clientesData);
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

  const ventasFiltradas = ventas.filter((venta) => {
    const nombresProductos = venta.detalles?.map(d => d.productoNombre).join(" ").toLowerCase() || "";
    const coincideBusqueda =
      nombresProductos.includes(searchTerm.toLowerCase()) ||
      venta.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.cliente?.nombreCliente?.toLowerCase().includes(searchTerm.toLowerCase());

    const fechaVentaLocal = new Date(venta.createdAt);
    const fechaFormateada = `${fechaVentaLocal.getFullYear()}-${String(fechaVentaLocal.getMonth() + 1).padStart(2, '0')}-${String(fechaVentaLocal.getDate()).padStart(2, '0')}`;

    return coincideBusqueda &&
      (selectedDate ? fechaFormateada === selectedDate : true) &&
      (selectedCliente ? (selectedCliente === "null" ? !venta.clienteid : String(venta.clienteid) === String(selectedCliente)) : true);
  });

  const ventasPaginadas = ventasFiltradas.slice((paginaActual - 1) * registrosPorPagina, paginaActual * registrosPorPagina);
  const totalPaginas = Math.ceil(ventasFiltradas.length / registrosPorPagina);

  return (
    <div className="tabla-container">
      <div className="tabla-top-bar">
        <h3>Ingresos (Ventas)</h3>
        <button
          className="tabla-export-btn"
          onClick={() => exportarVentas(ventasFiltradas)}
          disabled={ventasFiltradas.length === 0}
          title="Exportar a Excel"
        >
          <FileDown size={14} />
          <span>Exportar</span>
        </button>
      </div>

      <div className="filters-container">
        <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPaginaActual(1); }} className="filter-input" />
        <input type="date" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setPaginaActual(1); }} className="filter-input" />
        <select className="filter-input" value={selectedCliente} onChange={(e) => { setSelectedCliente(e.target.value); setPaginaActual(1); }}>
          <option value="">Todos los clientes</option>
          <option value="null">Sin cliente</option>
          {clientes.map(c => <option key={c.clienteid} value={c.clienteid}>{c.nombreCliente}</option>)}
        </select>
      </div>

      <table className="tabla-productos">
        <thead>
          <tr>
            <th className="text-left">Fecha</th>
            <th className="text-left">Productos</th>
            <th className="text-left">Cliente</th>
            <th className="text-right">Items</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {ventasPaginadas.length > 0 ? (
            ventasPaginadas.map((venta) => {
              const totalItems = venta.detalles?.reduce((acc, d) => acc + d.cantidad, 0) || 0;
              const resumen = venta.detalles?.length > 1
                ? `${venta.detalles[0].productoNombre} (+${venta.detalles.length - 1})`
                : venta.detalles?.[0]?.productoNombre || "-";
              return (
                <tr key={venta.ventaid} style={{ cursor: 'pointer' }} onClick={() => navigate(`/dashboard/venta/${venta.ventaid}`, { state: { venta } })}>
                  <td className="text-left">{formatearFecha(venta.createdAt)}</td>
                  <td className="text-left"><strong>{resumen}</strong></td>
                  <td className="text-left">{venta.cliente?.nombreCliente || <span style={{ opacity: 0.5 }}>General</span>}</td>
                  <td className="text-right">{totalItems}</td>
                  <td className="text-right total-cell">${Number(venta.total).toLocaleString("es-CO")}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="tabla-empty">
                <TrendingUp size={28} style={{ opacity: 0.25, marginBottom: '0.5rem' }} />
                <p>{searchTerm || selectedDate || selectedCliente ? 'Sin resultados para los filtros aplicados' : 'Aún no hay ventas registradas'}</p>
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

export default TablaIngresos;
