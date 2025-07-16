import React from "react";

const ExportButtons = () => {
  const handlePrint = () => {
    window.print();
  }

  return (
    <div style={{ marginTop: '1rem' }}>
        <button onClick={handlePrint}>🖨 Print Form</button>
    </div>
  );
};

export default ExportButtons;
