import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'employees';

const initialCrew = {
  driver: '',
  emt: '',
  paramedic: '',
  assist: '',
};

function CrewPlannerPage() {
  const [employees, setEmployees] = useState([]);
  const [crew, setCrew] = useState(initialCrew);

  useEffect(() => {
    try {
      const savedEmployees = localStorage.getItem(STORAGE_KEY);

      if (!savedEmployees) {
        setEmployees([]);
        return;
      }

      const parsedEmployees = JSON.parse(savedEmployees);
      setEmployees(Array.isArray(parsedEmployees) ? parsedEmployees : []);
    } catch (error) {
      console.error('Failed to load employees from localStorage:', error);
      setEmployees([]);
    }
  }, []);

  const getLicenseStatus = (license) => {
    if (!license?.hasLicense) {
      return 'No License';
    }

    if (!license.expirationDate) {
      return 'Active';
    }

    const today = new Date();
    const expirationDate = new Date(`${license.expirationDate}T23:59:59`);
    const diffInMs = expirationDate - today;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      return 'Expired';
    }

    if (diffInDays <= 30) {
      return 'Expiring Soon';
    }

    return 'Active';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'text-bg-success';
      case 'Expiring Soon':
        return 'text-bg-warning';
      case 'Expired':
        return 'text-bg-danger';
      default:
        return 'text-bg-secondary';
    }
  };

  const getAllowedPositions = (employee) => {
    const positions = ['Assist'];

    if (employee.evoc?.hasLicense) {
      positions.push('Driver');
    }

    if (employee.emt?.hasLicense) {
      positions.push('EMT');
    }

    if (employee.paramedic?.hasLicense) {
      positions.push('Paramedic');
    }

    return positions;
  };

  const renderAllowedPositions = (employee) => {
    const positions = getAllowedPositions(employee);

    return (
      <div className="d-flex flex-wrap gap-1">
        {positions.map((position) => (
          <span key={position} className="badge text-bg-primary">
            {position}
          </span>
        ))}
      </div>
    );
  };

  const renderLicenseStatus = (licenseLabel, license) => {
    const status = getLicenseStatus(license);

    return (
      <div className="mb-1">
        <strong>{licenseLabel}:</strong>{' '}
        <span className={`badge ${getStatusBadgeClass(status)}`}>
          {status}
        </span>
      </div>
    );
  };

  const getRequiredLicenseStatus = (employee, role) => {
    switch (role) {
      case 'driver':
        return getLicenseStatus(employee.evoc);
      case 'emt':
        return getLicenseStatus(employee.emt);
      case 'paramedic':
        return getLicenseStatus(employee.paramedic);
      case 'assist':
      default:
        return 'Active';
    }
  };

  const isEmployeeEligibleForRole = (employee, role) => {
    switch (role) {
      case 'driver':
        return employee.evoc?.hasLicense;
      case 'emt':
        return employee.emt?.hasLicense;
      case 'paramedic':
        return employee.paramedic?.hasLicense;
      case 'assist':
        return true;
      default:
        return false;
    }
  };

  const getSelectedEmployeeIds = (currentRole) => {
    return Object.entries(crew)
      .filter(([role, employeeId]) => role !== currentRole && employeeId)
      .map(([, employeeId]) => employeeId);
  };

  const getAvailableEmployeesForRole = (role) => {
    const selectedElsewhere = getSelectedEmployeeIds(role);

    return employees.filter((employee) => {
      const employeeId = String(employee.id);
      const isAlreadySelectedElsewhere = selectedElsewhere.includes(employeeId);

      if (isAlreadySelectedElsewhere) {
        return false;
      }

      return isEmployeeEligibleForRole(employee, role);
    });
  };

  const handleCrewChange = (role, employeeId) => {
    setCrew((prev) => ({
      ...prev,
      [role]: employeeId,
    }));
  };

  const handleClearCrew = () => {
    setCrew(initialCrew);
  };

  const getEmployeeById = (employeeId) => {
    return employees.find((employee) => String(employee.id) === String(employeeId));
  };

  const renderAssignmentWarning = (role) => {
    const employeeId = crew[role];

    if (!employeeId) {
      return null;
    }

    const employee = getEmployeeById(employeeId);

    if (!employee) {
      return null;
    }

    const status = getRequiredLicenseStatus(employee, role);

    if (status === 'Expired') {
      return (
        <div className="alert alert-danger py-2 px-3 mt-2 mb-0">
          Warning: required license for this role is expired.
        </div>
      );
    }

    if (status === 'Expiring Soon') {
      return (
        <div className="alert alert-warning py-2 px-3 mt-2 mb-0">
          Warning: required license for this role is expiring soon.
        </div>
      );
    }

    return null;
  };

  const renderSelectedEmployeeInfo = (role) => {
    const employeeId = crew[role];

    if (!employeeId) {
      return (
        <div className="text-muted small mt-2">
          No employee selected.
        </div>
      );
    }

    const employee = getEmployeeById(employeeId);

    if (!employee) {
      return null;
    }

    return (
      <div className="mt-2 small">
        <div>
          <strong>Selected:</strong> {employee.firstName} {employee.lastName}
        </div>
        <div>
          <strong>Allowed:</strong> {getAllowedPositions(employee).join(', ')}
        </div>
      </div>
    );
  };

  const renderRoleSelect = (role, label) => {
    const availableEmployees = getAvailableEmployeesForRole(role);

    return (
      <div className="col-md-6 col-xl-3">
        <label className="form-label fw-semibold">{label}</label>

        <select
          className="form-select"
          value={crew[role]}
          onChange={(event) => handleCrewChange(role, event.target.value)}
        >
          <option value="">Select employee...</option>

          {availableEmployees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.firstName} {employee.lastName}
            </option>
          ))}
        </select>

        {renderSelectedEmployeeInfo(role)}
        {renderAssignmentWarning(role)}
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h1 className="mb-2">Crew Planner</h1>
        <p className="text-muted mb-0">
          This page is used to review available employees and start building a basic crew
          for the next day.
        </p>
      </div>

      <div className="alert alert-info">
        <h5 className="mb-2">Current Stage</h5>
        <p className="mb-0">
          Employee records are shared through local storage. You can now assign employees
          into basic crew roles. Expired licenses will show warnings, but assignment is
          still allowed for review purposes.
        </p>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Next Day Crew</h5>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={handleClearCrew}
          >
            Clear Crew
          </button>
        </div>

        <div className="card-body">
          {employees.length === 0 ? (
            <p className="text-muted mb-0">
              No employees found. Add employees on the Employees page first.
            </p>
          ) : (
            <div className="row g-3">
              {renderRoleSelect('driver', 'Driver')}
              {renderRoleSelect('emt', 'EMT')}
              {renderRoleSelect('paramedic', 'Paramedic')}
              {renderRoleSelect('assist', 'Assist')}
            </div>
          )}
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Available Employees</h5>
          <span className="badge text-bg-secondary">{employees.length}</span>
        </div>

        <div className="card-body">
          {employees.length === 0 ? (
            <p className="text-muted mb-0">
              No employees found. Add employees on the Employees page first.
            </p>
          ) : (
            <div className="row g-3">
              {employees.map((employee) => (
                <div key={employee.id} className="col-lg-6">
                  <div className="card h-100 border-light-subtle">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="mb-1">
                            {employee.firstName} {employee.lastName}
                          </h5>
                          <div className="text-muted">
                            {employee.phone || 'No phone number'}
                          </div>
                        </div>

                        <span
                          className={`badge ${
                            employee.isActive ? 'text-bg-success' : 'text-bg-secondary'
                          }`}
                        >
                          {employee.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="fw-semibold mb-2">Allowed Positions</div>
                        {renderAllowedPositions(employee)}
                      </div>

                      <div className="mb-3">
                        <div className="fw-semibold mb-2">License Status</div>
                        {renderLicenseStatus('EVOC', employee.evoc)}
                        {renderLicenseStatus('EMT', employee.emt)}
                        {renderLicenseStatus('Paramedic', employee.paramedic)}
                      </div>

                      <div>
                        <div className="fw-semibold mb-1">Notes</div>
                        <div className="text-muted">
                          {employee.notes?.trim() ? employee.notes : 'No notes'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CrewPlannerPage;