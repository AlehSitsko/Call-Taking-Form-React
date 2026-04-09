import React, { useRef } from 'react';
import CallForm from '../components/CallForm';
import PriceCalculator from '../components/PriceCalculator';
import ExportButtons from '../components/ExportButtons';

function CallFormPage() {
  const callFormRef = useRef();
  const priceCalculatorRef = useRef();

  const handleClearAll = () => {
    if (callFormRef.current) callFormRef.current.clearForm();
    if (priceCalculatorRef.current) priceCalculatorRef.current.clearCalculator();
  };

  return (
    <div className="container mt-4">
      <div className="alert alert-info mb-4">
        <h5 className="mb-2">Welcome to the Call Taking Form</h5>
        <p className="mb-2">
          This page is the main entry point for the application. Use the navigation
          buttons at the top of the page to move between sections such as Call Form,
          Patients, User Manual, Employees, and Crew Planner.
        </p>
        <p className="mb-2">
          Future updates and new modules will also be added through the top navigation,
          so please use the menu above to access all available tools.
        </p>
        <ul className="mb-0">
          <li>Select <strong>Caller Type</strong> first.</li>
          <li>Enter <strong>Patient Information</strong> clearly and completely.</li>
          <li>Fill in <strong>Pickup and Drop-off Addresses</strong>.</li>
          <li>Set the <strong>Date of Call</strong>, <strong>Date of Trip</strong>, and <strong>Pickup Time</strong>.</li>
          <li>Choose the correct <strong>Service Level</strong>.</li>
          <li>Use <strong>Return Ride</strong> when needed.</li>
          <li>Review the information before printing or exporting.</li>
        </ul>
      </div>

      <div className="print-wrapper">
        <CallForm ref={callFormRef} />
        <PriceCalculator ref={priceCalculatorRef} />
        <ExportButtons onClearAll={handleClearAll} />
      </div>
    </div>
  );
}

export default CallFormPage;