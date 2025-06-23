import { useState, useEffect } from 'react';

const SelectProducto = ({ productos, onChange }) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtrados, setFiltrados] = useState([]);
  const [mostrarLista, setMostrarLista] = useState(false);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setFiltrados([]);
      setMostrarLista(false);
    } else {
      const resultados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
      setFiltrados(resultados);
      setMostrarLista(true);
    }
  }, [busqueda, productos]);

  const handleInputChange = (e) => {
    setBusqueda(e.target.value);
  };

  const handleSelect = (producto) => {
    setBusqueda(producto.nombre); // Muestra el nombre seleccionado
    setMostrarLista(false);       // Oculta la lista
    onChange({ target: { value: JSON.stringify(producto) } });
  };

  return (
    <div className="autocomplete">
      <input
        className="input"
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={handleInputChange}
      />
      {mostrarLista && filtrados.length > 0 && (
        <ul className="autocomplete-list">
          {filtrados.map((producto) => (
            <li
              key={producto._id}
              className="autocomplete-item"
              onClick={() => handleSelect(producto)}
            >
              {producto.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectProducto;
