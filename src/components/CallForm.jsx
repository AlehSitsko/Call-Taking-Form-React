// CallForm.jsx
import React, { useState, useEffect } from "react";

const CallForm = ({ onClearSignal }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    pickUpAddress: "",
    dropOffAddress: "",
    additionalInfo: "",
  });

  useEffect(() => {
    if (onClearSignal) {
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        pickUpAddress: "",
        dropOffAddress: "",
        additionalInfo: "",
      });
    }
  }, [onClearSignal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Call Taking Form</h2>
      {["firstName", "lastName", "phoneNumber", "pickUpAddress", "dropOffAddress"].map((field) => (
        <div key={field}>
          <label>
            {field.replace(/([A-Z])/g, " $1")}: 
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
          </label>
        </div>
      ))}
      <div>
        <label>
          Additional Information:
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
          />
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CallForm;
