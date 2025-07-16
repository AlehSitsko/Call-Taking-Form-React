import React from "react";

const CallForm = () => {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    pickUpAddress: "",
    dropOffAddress: "",
    additionalInfo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: save to localStorage or IndexedDB

    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      pickUpAddress: "",
      dropOffAddress: "",
      additionalInfo: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Call Taking Form</h2>

      <div>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>
      </div>

      <div>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>
      </div>

      <div>
        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </label>
      </div>

      <div>
        <label>
          Pick-Up Address:
          <input
            type="text"
            name="pickUpAddress"
            value={formData.pickUpAddress}
            onChange={handleChange}
          />
        </label>
      </div>

      <div>
        <label>
          Drop-Off Address:
          <input
            type="text"
            name="dropOffAddress"
            value={formData.dropOffAddress}
            onChange={handleChange}
          />
        </label>
      </div>

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
