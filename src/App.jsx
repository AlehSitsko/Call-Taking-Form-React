import React, { useRef, useState } from 'react';
import CallForm from './components/CallForm';
import PriceCalculator from './components/PriceCalculator';
import ExportButtons from './components/ExportButtons';
import PatientsPage from './components/PatientsPage';
import UserManual from './components/UserManual';

const App = () => {
  const [currentPage, setCurrentPage] = useState('form');

  const callFormRef = useRef();
  const priceCalculatorRef = useRef();

  const handleClearAll = () => {
    if (callFormRef.current) callFormRef.current.clearForm();
    if (priceCalculatorRef.current) priceCalculatorRef.current.clearCalculator();
  };

  return (
    <div className="container">
      <div className="my-3">
        <button
          className="btn btn-outline-primary me-2"
          onClick={() => setCurrentPage('form')}
        >
          Call Form
        </button>

        <button
          className="btn btn-outline-secondary me-2"
          onClick={() => setCurrentPage('patients')}
        >
          View Patients
        </button>

        <button
          className="btn btn-outline-info"
          onClick={() => setCurrentPage('manual')}
        >
          User Manual
        </button>
      </div>

      {currentPage === 'form' && (
        <div className="print-wrapper">
          <CallForm ref={callFormRef} />
          <PriceCalculator ref={priceCalculatorRef} />
          <ExportButtons onClearAll={handleClearAll} />
        </div>
      )}

      {currentPage === 'patients' && <PatientsPage />}

      {currentPage === 'manual' && <UserManual />}
    </div>
  );
};

export default App;