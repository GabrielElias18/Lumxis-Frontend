import { useState, useEffect } from "react";
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import TablaIngresos from "./vistas/TablaIngresos";
import TablaEgresos from "./vistas/TablaEgresos";
import { getVentas } from "../../../../services/ventaService";
import { getEgresos } from "../../../../services/egresoService";
import "./balance.css";

function Balance({ token }) {
  const navigate = useNavigate();
  const [mostrarTabla, setMostrarTabla] = useState(() => {
    return localStorage.getItem("activeBalanceTab") || "ingresos";
  });
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [egresosTotales, setEgresosTotales] = useState(0);

  const fetchDatos = async () => {
    try {
      const token = localStorage.getItem("token");
      const ventas = await getVentas(token);
      const egresos = await getEgresos(token);
      const totalIngresos = ventas.reduce((sum, v) => sum + (parseFloat(v.total) || 0), 0);
      const totalEgresos = egresos.reduce((sum, e) => sum + (parseFloat(e.total) || 0), 0);
      setIngresosTotales(totalIngresos);
      setEgresosTotales(totalEgresos);
    } catch (error) {
      console.error("Error al obtener los datos", error);
    }
  };

  useEffect(() => { fetchDatos(); }, [token]);

  const formatoMoneda = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);

  const balanceGeneral = ingresosTotales - egresosTotales;

  const handleCambiarTab = (tab) => {
    setMostrarTabla(tab);
    localStorage.setItem("activeBalanceTab", tab);
  };

  return (
    <div className="balance-container">
      <div className="top-actions">
        <button className="action-button action-button-income" onClick={() => navigate("/dashboard/nueva-venta")}>
          <Plus className="button-icon" />
          <span>Registrar Venta</span>
        </button>
        <button className="action-button action-button-expense" onClick={() => navigate("/dashboard/nuevo-egreso")}>
          <Plus className="button-icon" />
          <span>Registrar Egreso</span>
        </button>
      </div>

      <div className="metrics-grid">
        {/* Balance General — card destacada, primera */}
        <div className="metric-card total-balance metric-featured">
          <div className="metric-icon">
            <DollarSign size={22} />
          </div>
          <div className="metric-content">
            <h3>Balance General</h3>
            <p className={`metric-value ${balanceGeneral < 0 ? 'metric-negative' : ''}`}>
              {formatoMoneda(balanceGeneral)}
            </p>
          </div>
        </div>

        <div className="metric-card income">
          <div className="metric-icon">
            <TrendingUp size={20} />
          </div>
          <div className="metric-content">
            <h3>Ingresos Totales</h3>
            <p className="metric-value">{formatoMoneda(ingresosTotales)}</p>
          </div>
        </div>

        <div className="metric-card expense">
          <div className="metric-icon">
            <TrendingDown size={20} />
          </div>
          <div className="metric-content">
            <h3>Egresos Totales</h3>
            <p className="metric-value">{formatoMoneda(egresosTotales)}</p>
          </div>
        </div>
      </div>

      <div className="tab-controls">
        <button
          className={`tab-button ${mostrarTabla === "ingresos" ? "active" : ""}`}
          onClick={() => handleCambiarTab("ingresos")}
        >
          <TrendingUp size={14} />
          <span>Ingresos</span>
        </button>
        <button
          className={`tab-button ${mostrarTabla === "egresos" ? "active" : ""}`}
          onClick={() => handleCambiarTab("egresos")}
        >
          <TrendingDown size={14} />
          <span>Egresos</span>
        </button>
      </div>

      <div className="table-container">
        {mostrarTabla === "ingresos" ? (
          <TablaIngresos />
        ) : (
          <TablaEgresos />
        )}
      </div>
    </div>
  );
}

export default Balance;

