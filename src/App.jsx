import React from 'react';
import CallForm from './components/CallForm';
import PriceCalculator from './components/PriceCalculator';

function App() {
  return (
    <div className="App">
      <CallForm />
      <hr />
      <PriceCalculator />
    </div>
  );
}

export default App;
