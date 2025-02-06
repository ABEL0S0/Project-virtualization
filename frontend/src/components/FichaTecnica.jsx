import { useState, useEffect } from 'react';
import Navbar from "./Navbar";

const API_URL = import.meta.env.VITE_API_URL;
const FichaTecnica = () => {
  const [fichas, setFichas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({ id: null, pacienteId: '', diagnostico: '', fecha_pago: '', observaciones:'', presupuesto:'', pago:'', tratamientos:'' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedPacienteId, setExpandedPacienteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFichas();
    fetchPacientes();
  }, []);

  useEffect(() => {
    setPacientesConFichas(
      pacientes.filter(paciente => 
        fichas.some(ficha => ficha.pacienteId === paciente.id) &&
        (paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
         paciente.apellido.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, fichas, pacientes]);

  const fetchFichas = async () => {
    try {
      const response = await fetch(`${API_URL}/ficha/lista`);
      const data = await response.json();
      setFichas(data);
    } catch (error) {
      console.error('Error fetching fichas', error);
    }
  };

  const fetchPacientes = async () => {
    try {
      const response = await fetch(`${API_URL}/pacientes/list`);
      const data = await response.json();
      setPacientes(data);
      setPacientesConFichas(data.filter(paciente => 
        fichas.some(ficha => ficha.pacienteId === paciente.id)
      ));
    } catch (error) {
      console.error('Error fetching pacientes', error);
    }
  };

  const getPacienteNombre = (pacienteId) => {
    const paciente = pacientes.find(p => p.id === pacienteId);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Desconocido';
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const options = {
        method: form.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      };
      const url = form.id
        ? `${API_URL}/ficha/update/${form.id}`
        : `${API_URL}/ficha/save`;
      
      await fetch(url, options);
      fetchFichas();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving ficha', error);
    }
  };

  const handleEdit = (ficha) => {
    setForm(ficha);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/ficha/del/${id}`, { method: 'DELETE' });
      fetchFichas();
    } catch (error) {
      console.error('Error deleting ficha', error);
    }
  };

  const toggleExpandPaciente = (pacienteId) => {
    setExpandedPacienteId(expandedPacienteId === pacienteId ? null : pacienteId);
  };

  const [pacientesConFichas, setPacientesConFichas] = useState([]);

  return (
    <div>
      <Navbar/>
      <div className="container mt-5">
        <h1>Fichas Técnicas</h1>
        <button className="btn btn-primary mb-3" onClick={() => setIsModalOpen(true)}>Agregar Ficha</button>

        <input
          type="text"
          placeholder="Buscar Fichas..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-control mb-3"
        />

        <div className="accordion" id="accordionExample">
          {pacientesConFichas.map(paciente => (
            <div key={paciente.id} className="accordion-item">
              <h2 className="accordion-header" id={`heading${paciente.id}`}>
                <button 
                  className="accordion-button" 
                  type="button" 
                  onClick={() => toggleExpandPaciente(paciente.id)}
                  aria-expanded={expandedPacienteId === paciente.id}
                >
                  {paciente.nombre} {paciente.apellido}
                </button>
              </h2>
              <div 
                id={`collapse${paciente.id}`} 
                className={`accordion-collapse collapse ${expandedPacienteId === paciente.id ? 'show' : ''}`} 
                aria-labelledby={`heading${paciente.id}`}
              >
                <div className="accordion-body">
                  {fichas.filter(ficha => ficha.pacienteId === paciente.id).map(ficha => (
                    <div key={ficha.id} className="list-group-item">
                      <p><strong>Diagnóstico:</strong> {ficha.diagnostico}</p>
                      <p><strong>Observaciones:</strong> {ficha.observaciones}</p>
                      <p><strong>Presupuesto:</strong> {ficha.presupuesto}</p>
                      <p><strong>Tratamientos:</strong> {ficha.tratamientos}</p>
                      <p><strong>Pago:</strong> {ficha.pago}</p>
                      <p><strong>Fecha de Pago:</strong> {ficha.fecha_pago}</p>
                      <div className="d-flex justify-content-end">
                        <button className="btn btn-warning me-2" onClick={() => handleEdit(ficha)}>Editar</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(ficha.id)}>Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{form.id ? 'Editar Ficha' : 'Agregar Ficha'}</h5>
                  <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="pacienteId" className="form-label">ID del Paciente</label>
                      <input type="number" id="pacienteId" name="pacienteId" className="form-control" value={form.pacienteId} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="diagnostico" className="form-label">Diagnóstico</label>
                      <input type="text" id="diagnostico" name="diagnostico" className="form-control" value={form.diagnostico} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="observaciones" className="form-label">Observaciones</label>
                      <input type="text" id="observaciones" name="observaciones" className="form-control" value={form.observaciones} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="tratamientos" className="form-label">Tratamientos</label>
                      <input type="text" id="tratamientos" name="tratamientos" className="form-control" value={form.tratamientos} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="presupuesto" className="form-label">Presupuesto</label>
                      <input type="number" id="presupuesto" name="presupuesto" className="form-control" value={form.presupuesto} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="pago" className="form-label">Pago</label>
                      <input type="number" id="pago" name="pago" className="form-control" value={form.pago} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="fecha_pago" className="form-label">Fecha de Pago</label>
                      <input type="date" id="fecha_pago" name="fecha_pago" className="form-control" value={form.fecha_pago} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cerrar</button>
                    <button type="submit" className="btn btn-primary">Guardar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FichaTecnica;