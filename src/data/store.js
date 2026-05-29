export const initialPacientes = [
  { id: 1, name: 'Carlos Mendoza', age: 45, gender: 'Masculino', diag: 'Diabetes Tipo 2', doc: 'Dr. Carlos Herrera', status: 'Activo', date: '2026-04-15', phone: '+503 7111-2233', blood: 'O+' },
  { id: 2, name: 'Ana Sofía Rivas', age: 32, gender: 'Femenino', diag: 'Asma bronquial', doc: 'Dra. Patricia Torres', status: 'Activo', date: '2026-04-10', phone: '+503 7222-3344', blood: 'A+' },
  { id: 3, name: 'Roberto Campos', age: 67, gender: 'Masculino', diag: 'Hipertensión arterial', doc: 'Dr. Carlos Herrera', status: 'En observación', date: '2026-04-17', phone: '+503 7333-4455', blood: 'B-' },
  { id: 4, name: 'Lucía Martínez', age: 28, gender: 'Femenino', diag: 'Anemia ferropénica', doc: 'Dra. Carmen Vásquez', status: 'Alta', date: '2026-03-20', phone: '+503 7444-5566', blood: 'AB+' },
  { id: 5, name: 'Miguel Flores', age: 55, gender: 'Masculino', diag: 'Artritis reumatoide', doc: 'Dr. Rodrigo López', status: 'Activo', date: '2026-04-12', phone: '+503 7555-6677', blood: 'O-' },
];

export const initialDoctores = [
  { id: 1, name: 'Dr. Carlos Herrera', spec: 'Medicina General', shift: 'Mañana', patients: 18, contact: 'ext. 101', email: 'cherrera@medicare.sv', status: 'Disponible' },
  { id: 2, name: 'Dra. Patricia Torres', spec: 'Neumología', shift: 'Tarde', patients: 12, contact: 'ext. 102', email: 'ptorres@medicare.sv', status: 'En consulta' },
  { id: 3, name: 'Dr. Rodrigo López', spec: 'Reumatología', shift: 'Mañana', patients: 9, contact: 'ext. 103', email: 'rlopez@medicare.sv', status: 'Disponible' },
  { id: 4, name: 'Dra. Carmen Vásquez', spec: 'Hematología', shift: 'Completo', patients: 15, contact: 'ext. 104', email: 'cvasquez@medicare.sv', status: 'En consulta' },
  { id: 5, name: 'Dr. Ernesto Núñez', spec: 'Cardiología', shift: 'Tarde', patients: 11, contact: 'ext. 105', email: 'enunez@medicare.sv', status: 'Disponible' },
];

export const initialMedicamentos = [
  { id: 1, name: 'Metformina 500mg', cat: 'Antidiabético', stock: 320, min: 50, exp: '2027-06-30', unit: 'comprimidos', price: 0.25 },
  { id: 2, name: 'Salbutamol inhalador', cat: 'Broncodilatador', stock: 40, min: 30, exp: '2026-11-15', unit: 'frascos', price: 8.50 },
  { id: 3, name: 'Losartán 50mg', cat: 'Antihipertensivo', stock: 0, min: 40, exp: '2027-01-20', unit: 'comprimidos', price: 0.30 },
  { id: 4, name: 'Ácido fólico 5mg', cat: 'Vitamina', stock: 180, min: 60, exp: '2027-08-10', unit: 'comprimidos', price: 0.10 },
  { id: 5, name: 'Ibuprofeno 400mg', cat: 'Analgésico', stock: 25, min: 80, exp: '2026-09-05', unit: 'comprimidos', price: 0.15 },
  { id: 6, name: 'Amoxicilina 500mg', cat: 'Antibiótico', stock: 150, min: 50, exp: '2026-12-31', unit: 'cápsulas', price: 0.40 },
];

export const initialCitas = [
  { id: 1, pac: 'Carlos Mendoza', doc: 'Dr. Carlos Herrera', date: '2026-04-18', time: '08:00', reason: 'Control glucosa', status: 'Pendiente' },
  { id: 2, pac: 'Ana Sofía Rivas', doc: 'Dra. Patricia Torres', date: '2026-04-18', time: '09:30', reason: 'Revisión asma', status: 'Completada' },
  { id: 3, pac: 'Roberto Campos', doc: 'Dr. Carlos Herrera', date: '2026-04-18', time: '11:00', reason: 'Presión arterial', status: 'Pendiente' },
  { id: 4, pac: 'Lucía Martínez', doc: 'Dra. Carmen Vásquez', date: '2026-04-19', time: '10:00', reason: 'Seguimiento anemia', status: 'Pendiente' },
  { id: 5, pac: 'Miguel Flores', doc: 'Dr. Rodrigo López', date: '2026-04-20', time: '14:00', reason: 'Dolor articular', status: 'Cancelada' },
];
