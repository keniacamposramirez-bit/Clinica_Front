export const initialPacientes = [
  { id: 1, name: 'Carlos Mendoza', age: 45, gender: 'Masculino', diag: 'Diabetes T2', doc: 'Dr. Herrera', status: 'Activo', date: '2026-04-15', phone: '+503 7111-2233', blood: 'O+' },
  { id: 2, name: 'Ana Sofía Rivas', age: 32, gender: 'Femenino', diag: 'Asma bronquial', doc: 'Dra. Torres', status: 'Activo', date: '2026-04-10', phone: '+503 7222-3344', blood: 'A+' },
  { id: 3, name: 'Roberto Campos', age: 67, gender: 'Masculino', diag: 'Hipertensión', doc: 'Dr. Herrera', status: 'En observación', date: '2026-04-17', phone: '+503 7333-4455', blood: 'B-' },
  { id: 4, name: 'Lucía Martínez', age: 28, gender: 'Femenino', diag: 'Anemia ferropénica', doc: 'Dra. Vásquez', status: 'Alta', date: '2026-03-20', phone: '+503 7444-5566', blood: 'AB+' },
  { id: 5, name: 'Miguel Flores', age: 55, gender: 'Masculino', diag: 'Artritis reumatoide', doc: 'Dr. López', status: 'Activo', date: '2026-04-12', phone: '+503 7555-6677', blood: 'O-' },
  { id: 6, name: 'Patricia Morales', age: 41, gender: 'Femenino', diag: 'Hipotiroidismo', doc: 'Dra. Vásquez', status: 'Activo', date: '2026-04-08', phone: '+503 7666-7788', blood: 'A-' },
];

export const initialDoctores = [
  { id: 1, name: 'Dr. Carlos Herrera', spec: 'Medicina General', shift: 'Mañana', patients: 18, contact: 'ext. 101', email: 'c.herrera@medicare.sv', years: 12 },
  { id: 2, name: 'Dra. Patricia Torres', spec: 'Neumología', shift: 'Tarde', patients: 12, contact: 'ext. 102', email: 'p.torres@medicare.sv', years: 8 },
  { id: 3, name: 'Dr. Rodrigo López', spec: 'Reumatología', shift: 'Mañana', patients: 9, contact: 'ext. 103', email: 'r.lopez@medicare.sv', years: 15 },
  { id: 4, name: 'Dra. Carmen Vásquez', spec: 'Hematología', shift: 'Completo', patients: 15, contact: 'ext. 104', email: 'c.vasquez@medicare.sv', years: 10 },
  { id: 5, name: 'Dr. Ernesto Núñez', spec: 'Cardiología', shift: 'Tarde', patients: 11, contact: 'ext. 105', email: 'e.nunez@medicare.sv', years: 20 },
];

export const initialMedicamentos = [
  { id: 1, name: 'Metformina 500mg', cat: 'Antidiabético', stock: 320, min: 50, exp: '2027-06-30', provider: 'FarmaLab', price: 0.15 },
  { id: 2, name: 'Salbutamol inhalador', cat: 'Broncodilatador', stock: 40, min: 30, exp: '2026-11-15', provider: 'MedSupply', price: 8.50 },
  { id: 3, name: 'Losartán 50mg', cat: 'Antihipertensivo', stock: 0, min: 40, exp: '2027-01-20', provider: 'FarmaLab', price: 0.22 },
  { id: 4, name: 'Ácido fólico 5mg', cat: 'Vitamina', stock: 180, min: 60, exp: '2027-08-10', provider: 'VitaPlus', price: 0.08 },
  { id: 5, name: 'Ibuprofeno 400mg', cat: 'Analgésico', stock: 25, min: 80, exp: '2026-09-05', provider: 'GenFarma', price: 0.12 },
  { id: 6, name: 'Amoxicilina 500mg', cat: 'Antibiótico', stock: 150, min: 50, exp: '2026-12-31', provider: 'MedSupply', price: 0.35 },
  { id: 7, name: 'Omeprazol 20mg', cat: 'Gastroprotector', stock: 200, min: 70, exp: '2027-03-15', provider: 'GenFarma', price: 0.18 },
];

export const initialCitas = [
  { id: 1, pac: 'Carlos Mendoza', doc: 'Dr. Herrera', date: '2026-05-05', time: '08:00', reason: 'Control glucosa', status: 'Pendiente', type: 'Control' },
  { id: 2, pac: 'Ana Sofía Rivas', doc: 'Dra. Torres', date: '2026-05-05', time: '09:30', reason: 'Revisión asma', status: 'Completada', type: 'Revisión' },
  { id: 3, pac: 'Roberto Campos', doc: 'Dr. Herrera', date: '2026-05-05', time: '11:00', reason: 'Presión arterial', status: 'Pendiente', type: 'Urgencia' },
  { id: 4, pac: 'Lucía Martínez', doc: 'Dra. Vásquez', date: '2026-05-06', time: '10:00', reason: 'Seguimiento anemia', status: 'Pendiente', type: 'Control' },
  { id: 5, pac: 'Miguel Flores', doc: 'Dr. López', date: '2026-05-07', time: '14:00', reason: 'Dolor articular', status: 'Pendiente', type: 'Consulta' },
  { id: 6, pac: 'Patricia Morales', doc: 'Dra. Vásquez', date: '2026-05-08', time: '15:30', reason: 'Control tiroides', status: 'Cancelada', type: 'Control' },
];
