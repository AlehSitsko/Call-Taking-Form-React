// PriceCalculator.jsx
import React, { useState, useEffect } from "react";

const PriceCalculator = ({ onClearSignal }) => {
  const [basePrice, setBasePrice] = useState('');
  const [crewSize, setCrewSize] = useState('2');
  const [mileage, setMileage] = useState('');
  const [ratePerMile, setRatePerMile] = useState('');
  const [totalPrice, setTotalPrice] = useState(null);

  useEffect(() => {
    if (onClearSignal) {
      setBasePrice('');
      setCrewSize('2');
      setMileage('');
      setRatePerMile('');
      setTotalPrice(null);
    }
  }, [onClearSignal]);

  const calculatePrice = () => {
    const multiplier = { '2': 1, '4': 2, '6': 3 }[crewSize] || 1;
    const base = parseFloat(basePrice) || 0;
    const miles = parseFloat(mileage) || 0;
    const rate = parseFloat(ratePerMile) || 0;
    const totalCost = base * multiplier + miles * rate;
    setTotalPrice(totalCost.toFixed(2));
  };

  return (
    <div>
      <h2>Price Calculator</h2>
      <div>
        <label>Base Price ($): </label>
        <input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
      </div>
      <div>
        <label>Crew Size: </label>
        <select value={crewSize} onChange={(e) => setCrewSize(e.target.value)}>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="6">6</option>
        </select>
      </div>
      <div>
        <label>Mileage (miles): </label>
        <input type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} />
      </div>
      <div>
        <label>Rate per Mile ($): </label>
        <input type="number" value={ratePerMile} onChange={(e) => setRatePerMile(e.target.value)} />
      </div>
      <button onClick={calculatePrice}>Calculate Price</button>
      {totalPrice !== null && <div><h4>Total Price: ${totalPrice}</h4></div>}
    </div>
  );
};

export default PriceCalculator;
