const ResultadoPrediccion = ({ resultado }) => {
    if (resultado.error) {
      return <p className="error">{resultado.error}</p>;
    }
  
    return (
      <>
        <h3 className="resultTitle">Resultado:</h3>
        <p className="resultItem">
          <span className="resultLabel">Clase Predicha:</span> {resultado.clasePredicha}
        </p>
        <p className="resultItem">
          <span className="resultLabel">Probabilidad:</span> {resultado.porcentaje.toFixed()}%
        </p>
        <h4 className="resultTitle">Distribución de Probabilidades:</h4>
        <ul className="probabilityList">
          {Object.entries(resultado.probabilidades).map(([clase, prob]) => (
            <li key={clase} className="probabilityItem">
              {clase}: {prob.toFixed()}%
            </li>
          ))}
        </ul>
      </>
    );
  };
  
  export default ResultadoPrediccion;
  