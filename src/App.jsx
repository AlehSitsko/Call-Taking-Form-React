import React, { useRef, useState } from 'react';
import CallForm from './components/CallForm';
import PriceCalculator from './components/PriceCalculator';
import ExportButtons from './components/ExportButtons';
import PatientsPage from './components/PatientsPage';

const App = () => {
  const [showPatients, setShowPatients] = useState(false);
  const callFormRef = useRef();
  const priceCalculatorRef = useRef();

  const handleClearAll = () => {
    if (callFormRef.current) callFormRef.current.clearForm();
    if (priceCalculatorRef.current) priceCalculatorRef.current.clearCalculator();
  };

  return (
    <div className="container">
      <button
        className="btn btn-outline-secondary my-3"
        onClick={() => setShowPatients(!showPatients)}
      >
        {showPatients ? 'Back to Call Form' : 'View Patients'}
      </button>

      {showPatients ? (
        <PatientsPage />
      ) : (
        <div className="print-wrapper">
          <CallForm ref={callFormRef} />
          <PriceCalculator ref={priceCalculatorRef} />
          <ExportButtons onClearAll={handleClearAll} />
        </div>
      )}
    </div>
  );
};

export default App;
