import React, { useState } from "react";
import '../styles/print.css'; // Ensure this is loaded globally or from App.jsx

const PriceCalculator = () => {
  const [basePrice, setBasePrice] = useState('');
  const [crewSize, setCrewSize] = useState('2');
  const [mileage, setMileage] = useState('');
  const [ratePerMile, setRatePerMile] = useState('');
  const [totalPrice, setTotalPrice] = useState(null);

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
      <h3>Price Calculator</h3>

      <div>
        <label>
          Base Price ($):
          <input
            type="number"
            min="0"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Crew Size:
          <select value={crewSize} onChange={(e) => setCrewSize(e.target.value)}>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="6">6</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Mileage (miles):
          <input
            type="number"
            min="0"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Rate per Mile ($):
          <input
            type="number"
            min="0"
            value={ratePerMile}
            onChange={(e) => setRatePerMile(e.target.value)}
          />
        </label>
      </div>

      <button type="button" onClick={calculatePrice}>Calculate Price</button>

      {totalPrice !== null && (
        <div>
          <h4>Total Price: ${totalPrice}</h4>
        </div>
      )}
    </div>
  );
};

export default PriceCalculator;
