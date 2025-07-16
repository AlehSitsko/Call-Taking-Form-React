import React, { useState } from 'react';
import '../styles/print.css'; // Import print styles

const CallForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    pickup: '',
    dropoff: '',
    additional: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <h2>Call Taking Form</h2>
      <form>
        <label>
          First Name:
          <input name="firstName" value={formData.firstName} onChange={handleChange} />
        </label>
        <br />
        <label>
          Last Name:
          <input name="lastName" value={formData.lastName} onChange={handleChange} />
        </label>
        <br />
        <label>
          Phone Number:
          <input name="phone" value={formData.phone} onChange={handleChange} />
        </label>
        <br />
        <label>
          Pick-Up Address:
          <input name="pickup" value={formData.pickup} onChange={handleChange} />
        </label>
        <br />
        <label>
          Drop-Off Address:
          <input name="dropoff" value={formData.dropoff} onChange={handleChange} />
        </label>
        <br />
        <label>
          Additional Information:
          <textarea name="additional" value={formData.additional} onChange={handleChange} />
        </label>
        <br />
        <button type="button">Submit</button>
        <button type="button" onClick={handlePrint}>Print Form</button>
      </form>
    </div>
  );
};

export default CallForm;
