import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { getVentas } from '../../../../services/ventaService';
import { getEgresos } from '../../../../services/egresoService';
import './Estadisticas.css';

function Estadisticas() {
  const [ventas, setVentas] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [topProductSalesData, setTopProductSalesData] = useState(null);
  const [monthlyBalanceData, setMonthlyBalanceData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);

  // 🔹 Cargar datos de ventas y egresos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No hay token disponible.');
          return;
        }

        const [ventasData, egresosData] = await Promise.all([
          getVentas(token),
          getEgresos(token),
        ]);

        if (!Array.isArray(ventasData) || !Array.isArray(egresosData)) {
          console.error('Datos no válidos recibidos.');
          return;
        }

        setVentas(ventasData);
        setEgresos(egresosData);

        // 🔹 Extraer años disponibles desde los datos
        const yearsSet = new Set([
          ...ventasData.map(v => new Date(v.createdAt).getFullYear()),
          ...egresosData.map(e => new Date(e.createdAt).getFullYear()),
        ]);

        const years = [...yearsSet].sort();
        setAvailableYears(years);
        setSelectedYear(years.length > 0 ? years[years.length - 1] : null);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  // 🔹 Calcular balance mensual cuando cambie `selectedYear`
  useEffect(() => {
    if (!selectedYear) return;

    const ingresosPorMes = {};
    const egresosPorMes = {};

    // Procesar ventas
    ventas.forEach(venta => {
      if (!venta.createdAt) return;
      const fecha = new Date(venta.createdAt);
      const year = fecha.getFullYear();
      const mes = `${year}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;

      if (year === parseInt(selectedYear)) {
        ingresosPorMes[mes] = (ingresosPorMes[mes] || 0) + Number(venta.total || 0);
      }
    });

    // Procesar egresos
    egresos.forEach(egreso => {
      if (!egreso.createdAt) return;
      const fecha = new Date(egreso.createdAt);
      const year = fecha.getFullYear();
      const mes = `${year}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;

      if (year === parseInt(selectedYear)) {
        egresosPorMes[mes] = (egresosPorMes[mes] || 0) + Number(egreso.total || 0);
      }
    });

    // Generar meses del año completo
    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const mes = String(i + 1).padStart(2, '0');
      return `${selectedYear}-${mes}`;
    });

    // Calcular balance mensual
    const balanceMensual = allMonths.map(mes =>
      (Number(ingresosPorMes[mes]) || 0) - (Number(egresosPorMes[mes]) || 0)
    );

    setMonthlyBalanceData({
      labels: allMonths,
      datasets: [
        {
          label: `Balance Mensual (${selectedYear})`,
          data: balanceMensual,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: false,
          tension: 0.3,
        },
      ],
    });
  }, [selectedYear, ventas, egresos]);

  // 🔹 Procesar TOP 15 productos más vendidos filtrados por año
  useEffect(() => {
    if (ventas.length === 0 || !selectedYear) return;

    const ventasFiltradas = ventas.filter(venta => {
      const fecha = new Date(venta.createdAt);
      return fecha.getFullYear() === parseInt(selectedYear);
    });

    const unidadesVendidasPorProducto = ventasFiltradas.reduce((acc, venta) => {
      acc[venta.productoNombre] = (acc[venta.productoNombre] || 0) + venta.cantidad;
      return acc;
    }, {});

    const sortedProducts = Object.entries(unidadesVendidasPorProducto)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15);

    setTopProductSalesData({
      labels: sortedProducts.map(([nombre]) => nombre),
      datasets: [
        {
          label: `Cantidad de Unidades Vendidas en ${selectedYear}`,
          data: sortedProducts.map(([, cantidad]) => cantidad),
          backgroundColor: sortedProducts.map(() =>
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
          ),
          borderWidth: 1,
        },
      ],
    });
  }, [ventas, selectedYear]);

  if (!topProductSalesData || !monthlyBalanceData) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="stats-content">
      <div className="chartContainer">
        <h2>BALANCE MENSUAL</h2>
        <select onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <Line
          data={monthlyBalanceData}
          options={{
            scales: {
              y: {
                beginAtZero: false,
                suggestedMin: Math.min(...monthlyBalanceData.datasets[0].data) - 1000,
                suggestedMax: Math.max(...monthlyBalanceData.datasets[0].data) + 1000,
              },
            },
            plugins: {
              tooltip: {
                position: 'nearest',
                callbacks: {
                  label: (context) =>
                    `Balance: ${new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                    }).format(context.raw)}`,
                },
              },
            },
          }}
        />
      </div>

      <div className="chartContainer">
        <h2>TOP 15 PRODUCTOS MÁS VENDIDOS</h2>
        <Bar
          data={topProductSalesData}
          options={{
            indexAxis: 'y',
            plugins: {
              tooltip: {
                position: 'nearest',
                callbacks: {
                  label: (context) => `Unidades: ${context.raw}`,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Estadisticas;
