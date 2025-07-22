import React, { useState } from "react";

const PatientsPage = () => {
  const [searchName, setSearchName] = useState('');
  const [searchDob, setSearchDob] = useState('');
  const [patients, setPatients] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const params = new URLSearchParams();
      if (searchName) params.append('name', searchName);
      if (searchDob) params.append('dob', searchDob);

      const res = await fetch(`http://localhost:5000/api/patients?${params}`);
      const data = await res.json();
      setPatients(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Search Patients</h2>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="mb-2">
          <label className="form-label">Name</label>
          <input
            type="text"
            placeholder="Enter patient name"
            className="form-control"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            value={searchDob}
            onChange={(e) => setSearchDob(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>DOB</th>
            <th>Phone Nr.</th>
            <th>Insurance</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.first_name} {p.last_name}</td>
              <td>{p.dob}</td>
              <td>{p.phone}</td>
              <td>{p.insurance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientsPage;
