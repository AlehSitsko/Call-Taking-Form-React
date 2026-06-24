// ── Storage keys ──────────────────────────────────────────────────────────────

export const KEYS = {
  employees: 'ems_employees',
  patients:  'ems_patients',
  calls:     'ems_calls',
  units:     'ems_units',
};

// ── Getters / setters ─────────────────────────────────────────────────────────

export const getEmployees = () => JSON.parse(localStorage.getItem(KEYS.employees) || '[]');
export const setEmployees = (v) => localStorage.setItem(KEYS.employees, JSON.stringify(v));

export const getPatients = () => JSON.parse(localStorage.getItem(KEYS.patients) || '[]');
export const setPatients = (v) => localStorage.setItem(KEYS.patients, JSON.stringify(v));

export const getCalls = () => JSON.parse(localStorage.getItem(KEYS.calls) || '[]');
export const setCalls = (v) => localStorage.setItem(KEYS.calls, JSON.stringify(v));

export const getUnits = () => JSON.parse(localStorage.getItem(KEYS.units) || '[]');
export const setUnits = (v) => localStorage.setItem(KEYS.units, JSON.stringify(v));

export const isDemoLoaded = () =>
  Object.values(KEYS).some(k => localStorage.getItem(k) !== null);

// ── Duplicate check ───────────────────────────────────────────────────────────

export const normalizeName = (s) => (s || '').trim().toLowerCase();

export const isDuplicatePatient = (firstName, lastName, dob, excludeId = null) => {
  const patients = getPatients();
  return patients.some(p =>
    p.id !== excludeId &&
    normalizeName(p.firstName) === normalizeName(firstName) &&
    normalizeName(p.lastName)  === normalizeName(lastName) &&
    p.dob === dob
  );
};

// ── ID generator ──────────────────────────────────────────────────────────────

export const newId = () => Date.now() + Math.floor(Math.random() * 1000);

// ── Seed data ─────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().slice(0, 10);
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const TOMORROW  = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

const DEMO_EMPLOYEES = [
  {
    id: 1001,
    firstName: 'John', lastName: 'Carter',
    phone: '215-555-0101', employeeNumber: 'EMP-001',
    status: 'active', role: 'EMT',
    isDriver: true, isMedical: true, isAssist: true,
    notes: 'Lead dispatcher / BLS driver',
    cpr:      { hasLicense: true,  expirationDate: '2027-12-31' },
    evoc:     { hasLicense: true,  expirationDate: '2027-11-30' },
    emt:      { hasLicense: true,  expirationDate: '2027-10-31' },
    paramedic:{ hasLicense: false, expirationDate: '' },
  },
  {
    id: 1002,
    firstName: 'Sarah', lastName: 'Collins',
    phone: '215-555-0102', employeeNumber: 'EMP-002',
    status: 'active', role: 'Paramedic',
    isDriver: false, isMedical: true, isAssist: false,
    notes: 'ALS certified paramedic',
    cpr:      { hasLicense: true,  expirationDate: '2027-12-31' },
    evoc:     { hasLicense: false, expirationDate: '' },
    emt:      { hasLicense: false, expirationDate: '' },
    paramedic:{ hasLicense: true,  expirationDate: '2027-07-31' },
  },
  {
    id: 1003,
    firstName: 'Victor', lastName: 'Hayes',
    phone: '215-555-0103', employeeNumber: 'EMP-003',
    status: 'active', role: 'Paramedic',
    isDriver: true, isMedical: true, isAssist: false,
    notes: 'ALS driver and medic',
    cpr:      { hasLicense: true,  expirationDate: '2027-12-31' },
    evoc:     { hasLicense: true,  expirationDate: '2027-06-30' },
    emt:      { hasLicense: false, expirationDate: '' },
    paramedic:{ hasLicense: true,  expirationDate: '2027-05-31' },
  },
  {
    id: 1004,
    firstName: 'Nina', lastName: 'Brooks',
    phone: '215-555-0104', employeeNumber: 'EMP-004',
    status: 'active', role: 'EMT',
    isDriver: false, isMedical: true, isAssist: true,
    notes: 'BLS EMT',
    cpr:      { hasLicense: true,  expirationDate: '2026-09-30' },
    evoc:     { hasLicense: false, expirationDate: '' },
    emt:      { hasLicense: true,  expirationDate: '2026-08-31' },
    paramedic:{ hasLicense: false, expirationDate: '' },
  },
  {
    id: 1005,
    firstName: 'Marcus', lastName: 'Reid',
    phone: '215-555-0105', employeeNumber: 'EMP-005',
    status: 'active', role: 'Driver',
    isDriver: true, isMedical: false, isAssist: true,
    notes: 'Driver / assist',
    cpr:      { hasLicense: true,  expirationDate: '2025-03-31' }, // expiring soon
    evoc:     { hasLicense: true,  expirationDate: '2026-12-31' },
    emt:      { hasLicense: false, expirationDate: '' },
    paramedic:{ hasLicense: false, expirationDate: '' },
  },
  {
    id: 1006,
    firstName: 'Tanya', lastName: 'Osei',
    phone: '215-555-0106', employeeNumber: 'EMP-006',
    status: 'inactive', role: 'EMT',
    isDriver: false, isMedical: true, isAssist: true,
    notes: 'On leave',
    cpr:      { hasLicense: true,  expirationDate: '2027-05-31' },
    evoc:     { hasLicense: false, expirationDate: '' },
    emt:      { hasLicense: true,  expirationDate: '2027-04-30' },
    paramedic:{ hasLicense: false, expirationDate: '' },
  },
];

const DEMO_PATIENTS = [
  {
    id: 2001,
    firstName: 'Eleanor', lastName: 'Voss',
    dob: '1948-05-12', phone: '215-555-1201',
    address: '1842 Chestnut St, Philadelphia, PA 19103',
    insurance: 'Medicare', memberId: 'MCR-10241',
    defaultServiceLevel: 'BLS',
    notes: 'Uses wheelchair. Needs assistance with stairs.',
  },
  {
    id: 2002,
    firstName: 'Robert', lastName: 'Torres',
    dob: '1955-11-28', phone: '215-555-1202',
    address: '308 Walnut Ave, Camden, NJ 08102',
    insurance: 'Medicaid', memberId: 'MCD-88712',
    defaultServiceLevel: 'ALS',
    notes: 'Cardiac patient. Requires oxygen during transport.',
  },
  {
    id: 2003,
    firstName: 'Helen', lastName: 'Park',
    dob: '1962-03-07', phone: '215-555-1203',
    address: '55 Liberty Blvd, Trenton, NJ 08608',
    insurance: 'Blue Cross', memberId: 'BC-44203',
    defaultServiceLevel: 'Stretcher',
    notes: 'Hip replacement recovery.',
  },
  {
    id: 2004,
    firstName: 'James', lastName: 'Whitmore',
    dob: '1940-09-15', phone: '215-555-1204',
    address: '720 Market St, Philadelphia, PA 19106',
    insurance: 'Aetna', memberId: 'AET-99103',
    defaultServiceLevel: 'BLS',
    notes: '',
  },
  {
    id: 2005,
    firstName: 'Dorothy', lastName: 'Chang',
    dob: '1958-07-23', phone: '215-555-1205',
    address: '191 Ridge Ave, Philadelphia, PA 19128',
    insurance: 'UnitedHealth', memberId: 'UH-77821',
    defaultServiceLevel: 'BLS',
    notes: 'Dialysis patient, Mon/Wed/Fri appointments.',
  },
];

const DEMO_CALLS = [
  {
    id: 3001,
    receivedAt: `${TODAY}T08:12:00`,
    dateOfCall: TODAY,
    tripDate: TODAY,
    pickupTime: '09:00',
    appointmentTime: '09:30',
    dispatcher: 'J. Carter',
    callerType: 'Facility',
    callerPhone: '215-555-8000',
    patientId: 2001,
    patientName: 'Eleanor Voss',
    pickupAddress: '1842 Chestnut St, Philadelphia, PA 19103',
    dropoffAddress: 'Jefferson Hospital, 111 S 11th St, Philadelphia, PA 19107',
    serviceLevel: 'BLS',
    callType: 'Appointment',
    returnRide: false,
    qualityScore: 92,
    missingCritical: [],
    missingOptional: ['appointment_time'],
    notes: '',
    status: 'completed',
  },
  {
    id: 3002,
    receivedAt: `${TODAY}T09:44:00`,
    dateOfCall: TODAY,
    tripDate: TODAY,
    pickupTime: '11:00',
    appointmentTime: '11:30',
    dispatcher: 'J. Carter',
    callerType: 'Family',
    callerPhone: '215-555-9100',
    patientId: 2002,
    patientName: 'Robert Torres',
    pickupAddress: '308 Walnut Ave, Camden, NJ 08102',
    dropoffAddress: 'Cooper Hospital, 1 Cooper Plaza, Camden, NJ 08103',
    serviceLevel: 'ALS',
    callType: 'Appointment',
    returnRide: true,
    returnPickupTime: '14:00',
    qualityScore: 88,
    missingCritical: [],
    missingOptional: [],
    notes: 'Patient requires oxygen during transport.',
    status: 'assigned',
  },
  {
    id: 3003,
    receivedAt: `${YESTERDAY}T14:22:00`,
    dateOfCall: YESTERDAY,
    tripDate: YESTERDAY,
    pickupTime: '15:00',
    appointmentTime: '15:30',
    dispatcher: 'J. Carter',
    callerType: 'Facility',
    callerPhone: '215-555-7700',
    patientId: 2003,
    patientName: 'Helen Park',
    pickupAddress: '55 Liberty Blvd, Trenton, NJ 08608',
    dropoffAddress: 'St. Francis Medical Center, 601 Hamilton Ave, Trenton, NJ 08629',
    serviceLevel: 'Stretcher',
    callType: 'Discharge',
    returnRide: false,
    qualityScore: 100,
    missingCritical: [],
    missingOptional: [],
    notes: '',
    status: 'completed',
  },
  {
    id: 3004,
    receivedAt: `${TODAY}T11:05:00`,
    dateOfCall: TODAY,
    tripDate: TOMORROW,
    pickupTime: '08:00',
    appointmentTime: '08:30',
    dispatcher: 'J. Carter',
    callerType: 'Other',
    callerPhone: '',
    patientId: 2005,
    patientName: 'Dorothy Chang',
    pickupAddress: '191 Ridge Ave, Philadelphia, PA 19128',
    dropoffAddress: 'Fresenius Kidney Care, 4200 Monument Rd, Philadelphia, PA 19131',
    serviceLevel: 'BLS',
    callType: 'Dialysis',
    returnRide: true,
    returnPickupTime: '12:00',
    qualityScore: 74,
    missingCritical: ['caller_phone'],
    missingOptional: ['caller_name'],
    notes: 'Caller did not provide callback number.',
    status: 'new',
  },
];

const DEMO_UNITS = [
  {
    id: 4001,
    shiftDate: TODAY,
    unitType: 'BLS',
    truckNumber: 'M-12',
    startTime: '07:00',
    driverId: 1001,
    medicalId: 1004,
    assist1Id: null,
    assist2Id: null,
    status: 'available',
    assignedCallIds: [3002],
  },
  {
    id: 4002,
    shiftDate: TODAY,
    unitType: 'ALS',
    truckNumber: 'M-5',
    startTime: '08:00',
    driverId: 1003,
    medicalId: 1002,
    assist1Id: 1005,
    assist2Id: null,
    status: 'en_route',
    assignedCallIds: [],
  },
];

// ── Public API ────────────────────────────────────────────────────────────────

export function loadDemoData() {
  localStorage.setItem(KEYS.employees, JSON.stringify(DEMO_EMPLOYEES));
  localStorage.setItem(KEYS.patients,  JSON.stringify(DEMO_PATIENTS));
  localStorage.setItem(KEYS.calls,     JSON.stringify(DEMO_CALLS));
  localStorage.setItem(KEYS.units,     JSON.stringify(DEMO_UNITS));
}

export function resetDemoData() {
  loadDemoData();
}

export function clearDemoData() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}

// ── Quality score helpers ─────────────────────────────────────────────────────

const CRITICAL_FIELDS = [
  { key: 'patientName',    label: 'Patient name' },
  { key: 'pickupAddress',  label: 'Pickup address' },
  { key: 'dropoffAddress', label: 'Dropoff address' },
  { key: 'tripDate',       label: 'Trip date' },
  { key: 'pickupTime',     label: 'Pickup time' },
  { key: 'serviceLevel',   label: 'Service level' },
  { key: 'callerType',     label: 'Caller type' },
];

const OPTIONAL_FIELDS = [
  { key: 'callerPhone',      label: 'Caller phone' },
  { key: 'appointmentTime',  label: 'Appointment time' },
  { key: 'notes',            label: 'Notes' },
];

export function calcQualityScore(formData) {
  const missing_critical = CRITICAL_FIELDS.filter(f => !formData[f.key]?.toString().trim()).map(f => f.label);
  const missing_optional = OPTIONAL_FIELDS.filter(f => !formData[f.key]?.toString().trim()).map(f => f.label);
  const score = Math.max(0, 100 - missing_critical.length * 12 - missing_optional.length * 4);
  return { score, missing_critical, missing_optional };
}

// ── Cert expiry helpers ───────────────────────────────────────────────────────

export function certStatus(expirationDate) {
  if (!expirationDate) return 'none';
  const days = Math.floor((new Date(expirationDate) - new Date()) / 86400000);
  if (days < 0)   return 'expired';
  if (days <= 30) return 'expiring';
  return 'ok';
}

export function certBadgeClass(status) {
  return { ok: 'badge-success', expiring: 'badge-warning', expired: 'badge-danger', none: 'badge-neutral' }[status] || 'badge-neutral';
}

// ── Unit status display ───────────────────────────────────────────────────────

export const UNIT_STATUS_LABELS = {
  available:    'Available',
  en_route:     'En Route',
  on_scene:     'On Scene',
  transporting: 'Transporting',
  at_destination:'At Destination',
  out_of_service:'Out of Service',
};

export const UNIT_STATUS_BADGE = {
  available:     'badge-success',
  en_route:      'badge-primary',
  on_scene:      'badge-warning',
  transporting:  'badge-primary',
  at_destination:'badge-success',
  out_of_service:'badge-danger',
};

export const SERVICE_LEVEL_BADGE = {
  BLS: 'badge-bls', ALS: 'badge-als', Stretcher: 'badge-neutral', Wheelchair: 'badge-neutral',
};
