const UserManual = () => {
  return (
    <div className="card shadow-sm my-3">
      <div className="card-body">
        <h2 className="h4 mb-3">Call Taking Form – User Guide (Standard Operating Procedure)</h2>

        <p>
          <strong>Purpose:</strong> This form is designed to ensure that every call is handled
          in a structured, consistent, and complete way, reducing missing information and
          operational errors.
        </p>

        <h3 className="h5 mt-4">1. Core Principle</h3>
        <p>
          Every call should follow this order:
          <br />
          <strong>Caller → Patient → Trip Type → Pickup → Destination → Time → Transport Needs → Return Ride → Confirmation</strong>
        </p>

        <h3 className="h5 mt-4">2. How to Start the Call</h3>
        <p>
          Use a simple and professional opening:
          <br />
          <strong>“Welcome Ambulance, this is [your name]. How can I help you?”</strong>
        </p>

        <h3 className="h5 mt-4">3. Step 1 – Identify the Caller</h3>
        <p><strong>Information to collect:</strong></p>
        <ul>
          <li>Caller name</li>
          <li>Callback number</li>
          <li>Caller type (Facility / Family / Patient / Other)</li>
        </ul>
        <p><strong>Questions to ask:</strong></p>
        <ul>
          <li>“Who am I speaking with?”</li>
          <li>“What is your callback number?”</li>
          <li>“Are you calling from a facility, or are you a family member?”</li>
        </ul>

        <h3 className="h5 mt-4">4. Step 2 – Patient Information</h3>
        <p><strong>Information to collect:</strong></p>
        <ul>
          <li>First name</li>
          <li>Last name</li>
        </ul>
        <p><strong>Questions to ask:</strong></p>
        <ul>
          <li>“What is the patient’s first and last name?”</li>
          <li>“Can you spell the last name?”</li>
        </ul>

        <h3 className="h5 mt-4">5. Step 3 – Trip Type</h3>
        <p><strong>Questions to ask:</strong></p>
        <ul>
          <li>“Is this a one-way trip or a round trip?”</li>
          <li>“What kind of transport is this for?”</li>
          <li>“Is this for an appointment, discharge, transfer, or something else?”</li>
          <li>“Will the patient need a return ride?”</li>
          <li>“Will this be a will call return?”</li>
        </ul>

        <h3 className="h5 mt-4">6. Step 4 – Pickup Location</h3>
        <p><strong>Questions to ask:</strong></p>
        <ul>
          <li>“What is the pickup address?”</li>
          <li>“What is the name of the facility?”</li>
          <li>“What room or unit is the patient in?”</li>
          <li>“Which entrance should the crew use?”</li>
          <li>“Will someone be there to release the patient?”</li>
        </ul>

        <h3 className="h5 mt-4">7. Step 5 – Destination</h3>
        <p><strong>Questions to ask:</strong></p>
        <ul>
          <li>“What is the destination address?”</li>
          <li>“What is the name of the facility or doctor’s office?”</li>
          <li>“Do you have a suite number or department?”</li>
          <li>“Where exactly should the patient be taken?”</li>
        </ul>

        <h3 className="h5 mt-4">8. Step 6 – Date and Time</h3>
        <p><strong>Questions to ask:</strong></p>
        <ul>
          <li>“What date is the transport for?”</li>
          <li>“What time is the pickup?”</li>
          <li>“What time is the appointment?”</li>
          <li>“Do you know the return time?”</li>
        </ul>

        <h3 className="h5 mt-4">9. Step 7 – Transport Needs</h3>
        <p><strong>Questions to ask:</strong></p>
        <ul>
          <li>“Will the patient be traveling by wheelchair, stretcher, or ambulatory?”</li>
          <li>“Does the patient require oxygen?”</li>
          <li>“Will the patient need assistance getting in or out?”</li>
          <li>“Any stairs at pickup or drop-off?”</li>
          <li>“Any special instructions?”</li>
        </ul>

        <h3 className="h5 mt-4">10. Step 8 – Additional Details</h3>
        <ul>
          <li>“Any infection control precautions?”</li>
          <li>“Will a family member ride along?”</li>
          <li>“Will paperwork be ready at pickup?”</li>
          <li>“Any safety concerns for the crew?”</li>
        </ul>

        <h3 className="h5 mt-4">11. Step 9 – Pricing (If Required)</h3>
        <ul>
          <li>“Is this private pay?”</li>
          <li>“Do you need a price quote?”</li>
          <li>“Is there a fixed agreed price?”</li>
        </ul>

        <h3 className="h5 mt-4">12. Step 10 – Return Ride</h3>
        <ul>
          <li>“Will the patient need a return trip?”</li>
          <li>“Do you know the return time?”</li>
          <li>“Should we mark it as will call?”</li>
          <li>“Will the patient return to the same address?”</li>
        </ul>

        <h3 className="h5 mt-4">13. How to Fill the Form</h3>
        <ol>
          <li>Caller Type</li>
          <li>Caller Name / Callback</li>
          <li>Patient Name</li>
          <li>Pickup Address</li>
          <li>Destination Address</li>
          <li>Date / Time</li>
          <li>Transport Type</li>
          <li>Return Ride</li>
          <li>Notes</li>
          <li>Price (if needed)</li>
        </ol>

        <h3 className="h5 mt-4">14. Call Confirmation (Mandatory)</h3>
        <p>
          Before ending the call, repeat all key details back to the caller and ask:
          <br />
          <strong>“Is everything correct?”</strong>
        </p>

        <h3 className="h5 mt-4">15. Final Instruction to Caller</h3>
        <p>
          <strong>
            “If anything changes — time, address, or patient condition — please call us back immediately.”
          </strong>
        </p>

        <h3 className="h5 mt-4">16. Common Mistakes to Avoid</h3>
        <ul>
          <li>Not collecting callback number</li>
          <li>Not confirming spelling of names</li>
          <li>Confusing pickup time with appointment time</li>
          <li>Missing room / unit / entrance</li>
          <li>Not clarifying transport type</li>
          <li>Forgetting return ride</li>
          <li>Skipping confirmation</li>
        </ul>

        <h3 className="h5 mt-4">17. Simple Mental Model</h3>
        <p>
          <strong>Who → Patient → From → To → When → How → Special → Confirm</strong>
        </p>
      </div>
    </div>
  );
};

export default UserManual;