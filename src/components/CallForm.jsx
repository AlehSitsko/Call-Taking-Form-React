import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const CallForm = forwardRef((props, ref) => {
  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    clearForm() {
      const form = formRef.current;
      if (!form) return;
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => input.value = '');
    }
  }));

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Call Taking Form</h5>
        </div>
        <div className="card-body">
          <form ref={formRef}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input type="text" className="form-control" id="firstName" placeholder="e.g. John" autoComplete="given-name" />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input type="text" className="form-control" id="lastName" placeholder="e.g. Doe" autoComplete="family-name" />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                <input type="tel" className="form-control" id="phoneNumber" placeholder="e.g. 555-123-4567" autoComplete="tel" />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="pickupAddress" className="form-label">Pick Up Address</label>
                <input type="text" className="form-control" id="pickupAddress" placeholder="123 Main St" />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="dropoffAddress" className="form-label">Drop Off Address</label>
                <input type="text" className="form-control" id="dropoffAddress" placeholder="456 Oak Ave" />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="additionalInfo" className="form-label">Additional Information</label>
                <textarea className="form-control" id="additionalInfo" rows="2" placeholder="Any notes or instructions..." />
              </div>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button type="submit" className="btn btn-success">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default CallForm;
