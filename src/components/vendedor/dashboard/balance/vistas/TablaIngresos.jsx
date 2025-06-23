import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../vistas/styles/TablaVentas.css";
import { getVentas, deleteVenta, updateVenta } from "../../../../../services/ventaService";

const TablaIngresos = ({ actualizarBalance }) => {
  const [ventas, setVentas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 15;
  const [editingVenta, setEditingVenta] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await getVentas(token);
      setVentas(data);
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
    }
  };

  const formatearFecha = (fecha) => {
    const d = new Date(fecha);
    const mes = (d.getMonth() + 1).toString().padStart(2, '0');
    const dia = d.getDate().toString().padStart(2, '0');
    const anio = d.getFullYear();
    return `${mes}/${dia}/${anio}`;
  };

  const handleEditar = (venta) => {
    setEditingVenta(venta);
    Swal.fire({
      title: 'Editar Venta',
      html: `
        <div class="swal2-input-container">
          <label for="cantidad">Cantidad:</label>
          <input 
            type="number" 
            id="cantidad" 
            class="swal2-input" 
            value="${venta.cantidad}"
            min="1"
          >
          <label for="descripcion">Descripción:</label>
          <textarea 
            id="descripcion" 
            class="swal2-textarea"
          >${venta.descripcion}</textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const cantidad = document.getElementById('cantidad').value;
        const descripcion = document.getElementById('descripcion').value;

        if (!cantidad || cantidad < 1) {
          Swal.showValidationMessage('La cantidad debe ser mayor a 0');
          return false;
        }

        return { cantidad: parseInt(cantidad), descripcion };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const precioUnitario = venta.total / venta.cantidad;
          const updatedData = {
            cantidad: result.value.cantidad,
            descripcion: result.value.descripcion,
            total: precioUnitario * result.value.cantidad
          };

          await updateVenta(venta.ventaid, updatedData, token);

          setVentas(ventas.map(v => 
            v.ventaid === venta.ventaid
              ? { ...v, ...updatedData }
              : v
          ));

          actualizarBalance();

          Swal.fire({
            title: 'Actualizado',
            text: 'La venta ha sido actualizada con éxito',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar la venta',
            icon: 'error'
          });
          console.error("Error al actualizar la venta:", error);
        }
      }
    });
  };

  const handleEliminar = async (ventaid) => {
    if (!ventaid) {
      console.error("Error: ID de la venta es undefined.");
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await deleteVenta(ventaid, token);
          setVentas(ventas.filter((venta) => venta.ventaid !== ventaid));

          actualizarBalance();

          Swal.fire({
            title: "Eliminado",
            text: "La venta ha sido eliminada con éxito.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar la venta.",
            icon: "error"
          });
          console.error("Error al eliminar la venta:", error);
        }
      }
    });
  };

  const ventasFiltradas = ventas.filter((venta) => {
    const coincideBusqueda = 
      venta.productoNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
  
    // Obtener la fecha local en formato YYYY-MM-DD (para comparar con el input date)
    const fechaVentaLocal = new Date(venta.createdAt);
    const yyyy = fechaVentaLocal.getFullYear();
    const mm = String(fechaVentaLocal.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaVentaLocal.getDate()).padStart(2, '0');
    const fechaFormateada = `${yyyy}-${mm}-${dd}`;
  
    const coincideFecha = selectedDate 
      ? fechaFormateada === selectedDate
      : true;
  
    return coincideBusqueda && coincideFecha;
  });
  
  
  const indiceInicial = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = indiceInicial + registrosPorPagina;
  const ventasPaginadas = ventasFiltradas.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(ventasFiltradas.length / registrosPorPagina);

  return (
    <div className="tabla-container">
      <h3>Ingresos</h3>
      <div className="filters-container">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="filter-input"
        />
      </div>
      <table className="tabla-productos">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto Vendido</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventasPaginadas.length > 0 ? (
            ventasPaginadas.map((venta) => (
              <tr key={venta.ventaid}>
                <td>{formatearFecha(venta.createdAt)}</td>
                <td>{venta.productoNombre}</td>
                <td>{venta.descripcion}</td>
                <td>{venta.cantidad}</td>
                <td>
                  ${Number(venta.total).toLocaleString("es-CO", {})}
                </td>
                <td>
                  <button 
                    className="editar-venta"
                    onClick={() => handleEditar(venta)}
                  >
                    ✏️
                  </button>
                  <button
                    className="eliminar-venta"
                    onClick={() => handleEliminar(venta.ventaid)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay ventas registradas</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="paginacion">
        <button
          onClick={() => setPaginaActual(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          Anterior
        </button>
        <span>Página {paginaActual} de {totalPaginas}</span>
        <button
          onClick={() => setPaginaActual(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TablaIngresos;
