import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./Navbar";

const API_URL = import.meta.env.VITE_API_URL;
const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [form, setForm] = useState({ id: null, nombre: '', apellido: '', fecha_nacimiento: '', genero: '', telefono: '', correo: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPacientes();
  }, []);

  useEffect(() => {
    setFilteredPacientes(
      pacientes.filter(paciente =>
        paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.fecha_nacimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.genero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.telefono.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.correo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, pacientes]);

  const fetchPacientes = async () => {
    try {
      const response = await axios.get(`${API_URL}/pacientes/list`);
      setPacientes(response.data);
      setFilteredPacientes(response.data);
    } catch (error) {
      console.error('Error fetching pacientes', error);
    }
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
      if (form.id) {
        await axios.put(`${API_URL}/pacientes/update/${form.id}`, form);
      } else {
        await axios.post(`${API_URL}/pacientes/save`, form);
      }
      fetchPacientes();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving paciente', error);
    }
  };

  const handleEdit = (paciente) => {
    setForm(paciente);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/pacientes/delete/${id}`);
      fetchPacientes();
    } catch (error) {
      console.error('Error deleting paciente', error);
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="container mt-5">
        <h1>Pacientes</h1>
        <button className="btn btn-primary mb-3" onClick={() => setIsModalOpen(true)}>Agregar Paciente</button>

        <input
          type="text"
          placeholder="Buscar pacientes..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-control mb-3"
        />

        <div className="list-group">
          {filteredPacientes.map(paciente => (
            <div key={paciente.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{paciente.nombre} {paciente.apellido}</h5>
                <p>Paciente ID: {paciente.id}</p>
                <p>{paciente.fecha_nacimiento} | {paciente.genero} | {paciente.telefono} | {paciente.correo}</p>
              </div>
              <div>
                <button className="btn btn-warning me-2" onClick={() => handleEdit(paciente)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleDelete(paciente.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{form.id ? 'Editar Paciente' : 'Agregar Paciente'}</h5>
                  <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="nombre" className="form-label">Nombre</label>
                      <input type="text" id="nombre" name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="apellido" className="form-label">Apellido</label>
                      <input type="text" id="apellido" name="apellido" className="form-control" value={form.apellido} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="fecha_nacimiento" className="form-label">Fecha de Nacimiento</label>
                      <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" className="form-control" value={form.fecha_nacimiento} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="genero" className="form-label">Género</label>
                      <input type="text" id="genero" name="genero" className="form-control" value={form.genero} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="telefono" className="form-label">Teléfono</label>
                      <input type="text" id="telefono" name="telefono" className="form-control" value={form.telefono} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="correo" className="form-label">Correo</label>
                      <input type="email" id="correo" name="correo" className="form-control" value={form.correo} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cerrar</button>
                    <button type="submit" className="btn btn-primary" >Guardar</button>
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

export default Pacientes;