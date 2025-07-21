import React, { useRef } from 'react';
import CallForm from './components/CallForm';
import PriceCalculator from './components/PriceCalculator';
import ExportButtons from './components/ExportButtons';

const App = () => {
  const callFormRef = useRef();
  const priceCalculatorRef = useRef();

  const handleClearAll = () => {
    if (callFormRef.current) callFormRef.current.clearForm();
    if (priceCalculatorRef.current) priceCalculatorRef.current.clearCalculator();
  };

  return (
    <div className="container">
      <div className="print-wrapper">
        <CallForm ref={callFormRef} />
        <PriceCalculator ref={priceCalculatorRef} />
        <ExportButtons onClearAll={handleClearAll} />
      </div>
    </div>
  );
};

export default App;
