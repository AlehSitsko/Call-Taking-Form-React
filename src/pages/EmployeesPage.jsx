import React, { useState } from 'react';

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    isActive: true,
    notes: '',

    evoc: {
      hasLicense: false,
      licenseName: '',
      expirationDate: '',
    },
    emt: {
      hasLicense: false,
      licenseName: '',
      expirationDate: '',
    },
    paramedic: {
      hasLicense: false,
      licenseName: '',
      expirationDate: '',
    },
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLicenseChange = (event, licenseType) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [licenseType]: {
        ...prev[licenseType],
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert('First Name and Last Name are required.');
      return;
    }

    const newEmployee = {
      id: Date.now(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
      isActive: formData.isActive,
      notes: formData.notes.trim(),

      evoc: { ...formData.evoc },
      emt: { ...formData.emt },
      paramedic: { ...formData.paramedic },
    };

    setEmployees((prev) => [...prev, newEmployee]);

    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      isActive: true,
      notes: '',

      evoc: {
        hasLicense: false,
        licenseName: '',
        expirationDate: '',
      },
      emt: {
        hasLicense: false,
        licenseName: '',
        expirationDate: '',
      },
      paramedic: {
        hasLicense: false,
        licenseName: '',
        expirationDate: '',
      },
    });
  };

  const handleDelete = (employeeId) => {
    setEmployees((prev) => prev.filter((employee) => employee.id !== employeeId));
  };

  const renderLicenseSummary = (license) => {
    if (!license.hasLicense) {
      return 'No';
    }

    const parts = [];

    if (license.licenseName.trim()) {
      parts.push(license.licenseName.trim());
    }

    if (license.expirationDate) {
      parts.push(`Exp: ${license.expirationDate}`);
    }

    return parts.length > 0 ? parts.join(' | ') : 'Yes';
  };

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h1 className="mb-2">Employees</h1>
        <p className="text-muted mb-0">
          Add and manage employee records for future scheduling and crew planning.
        </p>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">Add Employee</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. John"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Smith"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 555-123-4567"
                />
              </div>

              <div className="col-md-6 d-flex align-items-end">
                <div className="form-check mb-2">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    className="form-check-input"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <label htmlFor="isActive" className="form-check-label">
                    Active Employee
                  </label>
                </div>
              </div>

              <div className="col-12">
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  className="form-control"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Optional notes about this employee"
                />
              </div>

              <div className="col-12">
                <hr />
                <h5 className="mb-3">Licenses</h5>
              </div>

              <div className="col-12">
                <div className="card border-light-subtle">
                  <div className="card-body">
                    <h6 className="mb-3">EVOC</h6>

                    <div className="row g-3">
                      <div className="col-md-3">
                        <div className="form-check mt-2">
                          <input
                            id="evocHasLicense"
                            name="hasLicense"
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.evoc.hasLicense}
                            onChange={(event) => handleLicenseChange(event, 'evoc')}
                          />
                          <label htmlFor="evocHasLicense" className="form-check-label">
                            Has EVOC
                          </label>
                        </div>
                      </div>

                      <div className="col-md-5">
                        <label htmlFor="evocLicenseName" className="form-label">
                          License Name
                        </label>
                        <input
                          id="evocLicenseName"
                          name="licenseName"
                          type="text"
                          className="form-control"
                          value={formData.evoc.licenseName}
                          onChange={(event) => handleLicenseChange(event, 'evoc')}
                          placeholder="e.g. EVOC Certification"
                          disabled={!formData.evoc.hasLicense}
                        />
                      </div>

                      <div className="col-md-4">
                        <label htmlFor="evocExpirationDate" className="form-label">
                          Expiration Date
                        </label>
                        <input
                          id="evocExpirationDate"
                          name="expirationDate"
                          type="date"
                          className="form-control"
                          value={formData.evoc.expirationDate}
                          onChange={(event) => handleLicenseChange(event, 'evoc')}
                          disabled={!formData.evoc.hasLicense}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card border-light-subtle">
                  <div className="card-body">
                    <h6 className="mb-3">EMT</h6>

                    <div className="row g-3">
                      <div className="col-md-3">
                        <div className="form-check mt-2">
                          <input
                            id="emtHasLicense"
                            name="hasLicense"
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.emt.hasLicense}
                            onChange={(event) => handleLicenseChange(event, 'emt')}
                          />
                          <label htmlFor="emtHasLicense" className="form-check-label">
                            Has EMT
                          </label>
                        </div>
                      </div>

                      <div className="col-md-5">
                        <label htmlFor="emtLicenseName" className="form-label">
                          License Name
                        </label>
                        <input
                          id="emtLicenseName"
                          name="licenseName"
                          type="text"
                          className="form-control"
                          value={formData.emt.licenseName}
                          onChange={(event) => handleLicenseChange(event, 'emt')}
                          placeholder="e.g. State EMT License"
                          disabled={!formData.emt.hasLicense}
                        />
                      </div>

                      <div className="col-md-4">
                        <label htmlFor="emtExpirationDate" className="form-label">
                          Expiration Date
                        </label>
                        <input
                          id="emtExpirationDate"
                          name="expirationDate"
                          type="date"
                          className="form-control"
                          value={formData.emt.expirationDate}
                          onChange={(event) => handleLicenseChange(event, 'emt')}
                          disabled={!formData.emt.hasLicense}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card border-light-subtle">
                  <div className="card-body">
                    <h6 className="mb-3">Paramedic</h6>

                    <div className="row g-3">
                      <div className="col-md-3">
                        <div className="form-check mt-2">
                          <input
                            id="paramedicHasLicense"
                            name="hasLicense"
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.paramedic.hasLicense}
                            onChange={(event) => handleLicenseChange(event, 'paramedic')}
                          />
                          <label htmlFor="paramedicHasLicense" className="form-check-label">
                            Has Paramedic
                          </label>
                        </div>
                      </div>

                      <div className="col-md-5">
                        <label htmlFor="paramedicLicenseName" className="form-label">
                          License Name
                        </label>
                        <input
                          id="paramedicLicenseName"
                          name="licenseName"
                          type="text"
                          className="form-control"
                          value={formData.paramedic.licenseName}
                          onChange={(event) => handleLicenseChange(event, 'paramedic')}
                          placeholder="e.g. State Paramedic License"
                          disabled={!formData.paramedic.hasLicense}
                        />
                      </div>

                      <div className="col-md-4">
                        <label htmlFor="paramedicExpirationDate" className="form-label">
                          Expiration Date
                        </label>
                        <input
                          id="paramedicExpirationDate"
                          name="expirationDate"
                          type="date"
                          className="form-control"
                          value={formData.paramedic.expirationDate}
                          onChange={(event) => handleLicenseChange(event, 'paramedic')}
                          disabled={!formData.paramedic.hasLicense}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Add Employee
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Employee List</h5>
          <span className="badge text-bg-secondary">{employees.length}</span>
        </div>

        <div className="card-body">
          {employees.length === 0 ? (
            <p className="text-muted mb-0">No employees added yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>EVOC</th>
                    <th>EMT</th>
                    <th>Paramedic</th>
                    <th>Notes</th>
                    <th style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        {employee.firstName} {employee.lastName}
                      </td>
                      <td>{employee.phone || '—'}</td>
                      <td>
                        <span
                          className={`badge ${
                            employee.isActive ? 'text-bg-success' : 'text-bg-secondary'
                          }`}
                        >
                          {employee.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{renderLicenseSummary(employee.evoc)}</td>
                      <td>{renderLicenseSummary(employee.emt)}</td>
                      <td>{renderLicenseSummary(employee.paramedic)}</td>
                      <td>{employee.notes || '—'}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(employee.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeesPage;