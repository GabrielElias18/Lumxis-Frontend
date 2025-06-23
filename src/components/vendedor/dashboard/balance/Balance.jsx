import React, { useState, useEffect } from "react";
import { Plus, TrendingUp, TrendingDown, DollarSign, Edit2, Trash2 } from 'lucide-react';
import RegistrarIngresoForm from "./vistas/RegistrarIngresoForm";
import RegistrarEgresoForm from "./vistas/RegistrarEgresoForm";
import TablaIngresos from "./vistas/TablaIngresos";
import TablaEgresos from "./vistas/TablaEgresos";
import { getVentas } from "../../../../services/ventaService";
import { getEgresos } from "../../../../services/egresoService";
import "./Balance.css";

function Balance({ token }) {
  const [mostrarTabla, setMostrarTabla] = useState("ingresos");
  const [mostrarIngreso, setMostrarIngreso] = useState(false);
  const [mostrarEgreso, setMostrarEgreso] = useState(false);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [egresosTotales, setEgresosTotales] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const fetchDatos = async () => {
    try {
      const token = localStorage.getItem("token");
      const ventas = await getVentas(token);
      const egresos = await getEgresos(token);
      const totalIngresos = ventas.reduce(
        (sum, venta) => sum + (parseFloat(venta.total) || 0),
        0
      );
      const totalEgresos = egresos.reduce(
        (sum, egreso) => sum + (parseFloat(egreso.total) || 0),
        0
      );
      setIngresosTotales(totalIngresos);
      setEgresosTotales(totalEgresos);
    } catch (error) {
      console.error("Error al obtener los datos", error);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, [token]);

  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <div className="balance-container">
      <div className="top-actions">
        <button
          className="action-button action-button-income"
          onClick={() => setMostrarIngreso(true)}
          title="Registrar nueva venta"
        >
          <Plus className="button-icon" />
          <span>Registrar Venta</span>
        </button>
        <button
          className="action-button action-button-expense"
          onClick={() => setMostrarEgreso(true)}
          title="Registrar nuevo egreso"
        >
          <Plus className="button-icon" />
          <span>Registrar Egreso</span>
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card income">
          <div className="metric-icon">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <h3>Ingresos Totales</h3>
            <p className="metric-value">{formatoMoneda(ingresosTotales)}</p>
          </div>
        </div>

        <div className="metric-card expense">
          <div className="metric-icon">
            <TrendingDown size={24} />
          </div>
          <div className="metric-content">
            <h3>Egresos Totales</h3>
            <p className="metric-value">{formatoMoneda(egresosTotales)}</p>
          </div>
        </div>

        <div className="metric-card total-balance">
          <div className="metric-icon">
            <DollarSign size={24} />
          </div>
          <div className="metric-content">
            <h3>Balance General</h3>
            <p className="metric-value">{formatoMoneda(ingresosTotales - egresosTotales)}</p>
          </div>
        </div>
      </div>


      <div className="tab-controls">
        <button
          className={`tab-button ${mostrarTabla === "ingresos" ? "active" : ""}`}
          onClick={() => setMostrarTabla("ingresos")}
        >
          <TrendingUp size={18} />
          <span>Ingresos</span>
        </button>
        <button
          className={`tab-button ${mostrarTabla === "egresos" ? "active" : ""}`}
          onClick={() => setMostrarTabla("egresos")}
        >
          <TrendingDown size={18} />
          <span>Egresos</span>
        </button>
      </div>

      <div className="table-container">
        {mostrarTabla === "ingresos" ? (
          <TablaIngresos
            actualizarBalance={fetchDatos}
            searchTerm={searchTerm}
            selectedDate={selectedDate}
          />
        ) : (
          <TablaEgresos
            actualizarBalance={fetchDatos}
            searchTerm={searchTerm}
            selectedDate={selectedDate}
          />
        )}
      </div>

      {mostrarIngreso && (
        <RegistrarIngresoForm
          cerrarFormulario={() => setMostrarIngreso(false)}
          actualizarBalance={fetchDatos}
        />
      )}
      {mostrarEgreso && (
        <RegistrarEgresoForm
          cerrarFormulario={() => setMostrarEgreso(false)}
          actualizarBalance={fetchDatos}
        />
      )}
    </div>
  );
}

export default Balance;
