import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from 'react';

const CallForm = forwardRef((props, ref) => {
  const formRef = useRef();

  const [pickupTime, setPickupTime] = useState('');
  const [returnRideOption, setReturnRideOption] = useState('none');
  const [returnPickUp, setReturnPickUp] = useState('');
  const [returnDestination, setReturnDestination] = useState('');
  const [returnTime, setReturnTime] = useState('');

  useImperativeHandle(ref, () => ({
    clearForm() {
      const form = formRef.current;
      if (!form) return;
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach((input) => (input.value = ''));

      setPickupTime('');
      setReturnRideOption('none');
      setReturnPickUp('');
      setReturnDestination('');
      setReturnTime('');
    },
  }));

  useEffect(() => {
    const pickup = document.getElementById('pickupAddress')?.value || '';
    const dropoff = document.getElementById('dropoffAddress')?.value || '';

    if (returnRideOption !== 'none') {
      setReturnPickUp(dropoff);
      setReturnDestination(pickup);
    } else {
      setReturnPickUp('');
      setReturnDestination('');
      setReturnTime('');
    }
  }, [returnRideOption]);

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Call Taking Form</h5>
        </div>
        <div className="card-body">
          <form ref={formRef}>
            <div className="row">
              {/* Basic Fields */}
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
                <label htmlFor="pickupTime" className="form-label">Pickup Time</label>
                <input type="time" className="form-control" id="pickupTime" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="dropoffAddress" className="form-label">Drop Off Address</label>
                <input type="text" className="form-control" id="dropoffAddress" placeholder="456 Oak Ave" />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="additionalInfo" className="form-label">Additional Information</label>
                <textarea className="form-control" id="additionalInfo" rows="2" placeholder="Any notes or instructions..." />
              </div>

              {/* Return Ride Option */}
              <div className="col-md-6 mb-3">
                <label htmlFor="returnRideOption" className="form-label">Return Ride</label>
                <select className="form-select" id="returnRideOption" value={returnRideOption} onChange={(e) => setReturnRideOption(e.target.value)}>
                  <option value="none">No Return</option>
                  <option value="return">Return Ride</option>
                  <option value="will_call">Will Call</option>
                </select>
              </div>

              {/* Return Ride Section */}
              {(returnRideOption === 'return' || returnRideOption === 'will_call') && (
                <div className="return-ride-section row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="returnPickup" className="form-label">Return Pick Up Address</label>
                    <input type="text" className="form-control" id="returnPickup" value={returnPickUp} onChange={(e) => setReturnPickUp(e.target.value)} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="returnDestination" className="form-label">Return Destination Address</label>
                    <input type="text" className="form-control" id="returnDestination" value={returnDestination} onChange={(e) => setReturnDestination(e.target.value)} />
                  </div>
                  {returnRideOption === 'return' && (
                    <div className="col-md-6 mb-3">
                      <label htmlFor="returnTime" className="form-label">Return Pick Up Time</label>
                      <input type="time" className="form-control" id="returnTime" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} />
                    </div>
                  )}
                </div>
              )}
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
