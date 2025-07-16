// App.jsx
import React, { useState } from 'react';
import CallForm from './components/CallForm';
import PriceCalculator from './components/PriceCalculator';

function App() {
  const [clearTrigger, setClearTrigger] = useState(false);

  const handleClearAll = () => {
    // Trigger the form reset by toggling the state
    setClearTrigger((prev) => !prev);
  };

  return (
    <div className="App">
      <CallForm onClearSignal={clearTrigger} />
      <hr />
      <PriceCalculator onClearSignal={clearTrigger} />
      <hr />
      <button onClick={handleClearAll}>Clear All Fields</button>
    </div>
  );
}

export default App;
