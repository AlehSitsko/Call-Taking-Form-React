import React, { useRef } from 'react';

// Import the main call intake form component
import CallForm from '../components/CallForm';

// Import the price calculator component
import PriceCalculator from '../components/PriceCalculator';

// Import the export/print action buttons component
import ExportButtons from '../components/ExportButtons';

function CallFormPage() {
  // Create a ref to access methods exposed by the CallForm component
  const callFormRef = useRef();

  // Create a ref to access methods exposed by the PriceCalculator component
  const priceCalculatorRef = useRef();

  // Clear both the form and the calculator at the same time
  const handleClearAll = () => {
    // Clear the main call form if the ref is available
    if (callFormRef.current) {
      callFormRef.current.clearForm();
    }

    // Clear the price calculator if the ref is available
    if (priceCalculatorRef.current) {
      priceCalculatorRef.current.clearCalculator();
    }
  };

  return (
    // Main page container with top margin
    <div className="container mt-4">
      {/* Informational block shown at the top of the page */}
      <div className="alert alert-info mb-4" role="alert">
        {/* Section title */}
        <h5 className="mb-2">Welcome to the Call Taking Form</h5>

        {/* Project explanation */}
        <p className="mb-2">
          This application is a frontend demo version of a structured EMS call
          intake tool. It was created to improve dispatcher workflow, reduce
          manual entry mistakes, and provide a cleaner way to collect call
          information.
        </p>

        {/* Expansion note */}
        <p className="mb-2">
          This project later evolved into a larger full-stack EMS operations
          system with backend support, patient management, employee management,
          crew planning, and modular workflow tools.
        </p>

        {/* Main project link */}
        <p className="mb-0">
          Main project:{' '}
          <a
            href="https://github.com/AlehSitsko/ems-workflow-system"
            target="_blank"
            rel="noopener noreferrer"
            className="fw-semibold"
          >
            EMS Workflow System
          </a>
        </p>
      </div>

      {/* Wrapper used for printable page content */}
      <div className="print-wrapper">
        {/* Main call form with ref for external clear/reset access */}
        <CallForm ref={callFormRef} />

        {/* Price calculator with ref for external clear/reset access */}
        <PriceCalculator ref={priceCalculatorRef} />

        {/* Export/print buttons that also receive the shared clear-all handler */}
        <ExportButtons onClearAll={handleClearAll} />
      </div>
    </div>
  );
}

export default CallFormPage;