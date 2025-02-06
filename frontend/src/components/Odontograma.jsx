import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import Navbar from './Navbar';
import OdontogramaDetail from './OdontogramaDetail';

const API_URL = import.meta.env.VITE_API_URL;
const Odontograma = () => {
  const [odontogramas, setOdontogramas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [pacientesConOdontogramas, setPacientesConOdontogramas] = useState([]);
  const [expandedPacienteId, setExpandedPacienteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [newPacienteId, setNewPacienteId] = useState('');
  const [selectedOdontograma, setSelectedOdontograma] = useState(null);
  const [newDescripcion, setNewDescripcion] = useState('');

  useEffect(() => {
    fetchOdontogramas();
    fetchPacientes();
  }, []);

  useEffect(() => {
    setPacientesConOdontogramas(
      pacientes.filter(paciente =>
        odontogramas.some(odontograma => odontograma.pacienteId === paciente.id) &&
        (paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paciente.apellido.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, odontogramas, pacientes]);

  const fetchOdontogramas = async () => {
    try {
      const response = await axios.get(`${API_URL}/odontograma/lista`);
      setOdontogramas(response.data);
    } catch (error) {
      console.error('Error fetching odontogramas', error);
    }
  };

  const fetchPacientes = async () => {
    try {
      const response = await axios.get(`${API_URL}/pacientes/list`);
      setPacientes(response.data);
      setPacientesConOdontogramas(response.data.filter(paciente =>
        odontogramas.some(odontograma => odontograma.pacienteId === paciente.id)
      ));
    } catch (error) {
      console.error('Error fetching pacientes', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleExpandPaciente = (pacienteId) => {
    setExpandedPacienteId(expandedPacienteId === pacienteId ? null : pacienteId);
  };

  const handleAddOdontograma = async () => {
    try {
      const response = await axios.post(`${API_URL}/odontograma/crear`, {
        id: null,
        img_url: null,
        pacienteId: newPacienteId,
        descripcion: null
      });
      console.log('Odontograma added successfully', response);
      fetchOdontogramas(); // Refresh the list of odontogramas
      setVisible(false);
    } catch (error) {
      console.error('Error adding odontograma', error);
    }
  };

  const openEditDialog = (odontograma) => {
    setSelectedOdontograma(odontograma);
    setNewDescripcion(odontograma.descripcion);
    setEditVisible(true);
  };

  const handleEditDescripcion = async () => {
    try {
      const response = await axios.put(`${API_URL}/odontograma/update/${selectedOdontograma.id}`, {
        ...selectedOdontograma,
        descripcion: newDescripcion
      });
      console.log('Descripcion updated successfully', response);
      fetchOdontogramas(); // Refresh the list of odontogramas
      setEditVisible(false);
    } catch (error) {
      console.error('Error updating descripcion', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1>Odontogramas</h1>
        <Button label="Agregar Odontograma" icon="pi pi-plus" onClick={() => setVisible(true)} className="mb-3" />
        <InputText
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar Pacientes..."
          className="form-control mb-3"
        />
        <div className="accordion" id="accordionExample">
          {pacientesConOdontogramas.map(paciente => (
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
                  {odontogramas.filter(odontograma => odontograma.pacienteId === paciente.id).map(odontograma => (
                    <div key={odontograma.id} className="list-group-item">
                      <OdontogramaDetail id={odontograma.id} />
                      <p><strong>Descripción:</strong> {odontograma.descripcion}</p>
                      <Button label="Editar Descripción" icon="pi pi-pencil" onClick={() => openEditDialog(odontograma)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog header="Agregar Odontograma" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="pacienteId">ID del Paciente</label>
            <InputText id="pacienteId" value={newPacienteId} onChange={(e) => setNewPacienteId(e.target.value)} />
          </div>
          <Button label="Guardar" icon="pi pi-check" onClick={handleAddOdontograma} />
        </div>
      </Dialog>

      <Dialog header="Editar Descripción" visible={editVisible} style={{ width: '50vw' }} onHide={() => setEditVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="descripcion">Descripción</label>
            <InputTextarea autoResize id="descripcion" value={newDescripcion} onChange={(e) => setNewDescripcion(e.target.value)} />
          </div>
          <Button label="Guardar" icon="pi pi-check" onClick={handleEditDescripcion} />
        </div>
      </Dialog>
    </div>
  );
};

export default Odontograma;

