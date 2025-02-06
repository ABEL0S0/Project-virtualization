import Navbar from "./Navbar";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

function  Home() {
  return (
    <div className="p-d-flex p-jc-center p-ai-center">
      <Navbar />
      <div className="p-d-flex p-jc-center p-ai-center" style={{ height: '100vh' }}>
        <Card title="Bienvenido al Sistema Odontológico" subTitle="Gestión de Pacientes, Fichas Técnicas y Odontogramas" style={{ width: '100%',height: '100%' }}>
          <p className="p-m-0" style={{lineHeight: '1.5'}}>
            Este sistema le permitirá gestionar información relacionada con pacientes, fichas técnicas y odontogramas de manera eficiente y sencilla.
          </p>
          <div className="p-d-flex p-jc-center" style={{ marginTop: '2rem' }}>
            <Button label="Pacientes" icon="pi pi-user" className="p-button-primary p-mr-2" onClick={() => window.location = "/home/pacientes"} />
            <Button label="Fichas Técnicas" icon="pi pi-file" className="p-button-secondary p-mr-2" onClick={() => window.location = "/home/fichas  "} />
            <Button label="Odontogramas" icon="pi pi-pencil" className="p-button-success" onClick={() => window.location = "/home/odontogramas"} />
          </div>
        </Card>
      </div>
    </div>
  );
  }
  export default Home;

  