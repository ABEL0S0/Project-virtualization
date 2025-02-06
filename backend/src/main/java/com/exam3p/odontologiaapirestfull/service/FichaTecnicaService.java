package com.exam3p.odontologiaapirestfull.service;

import com.exam3p.odontologiaapirestfull.dto.PacienteData;
import com.exam3p.odontologiaapirestfull.entity.FichasTecnica;
import com.exam3p.odontologiaapirestfull.repository.FichaTecnicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
public class FichaTecnicaService {

    @Autowired
    private FichaTecnicaRepository fichaTecnicaRepository;

    @Autowired
    private RestTemplate restTemplate;

    private static final String PACIENTE_SERVICE_URL = "http://localhost:8080/pacientes"; // Ajusta la URL según tu configuración.

    public FichasTecnica createFichaTecnica(FichasTecnica fichaTecnica) {
        // Verificar la existencia del paciente antes de guardar la ficha técnica
        PacienteData paciente = getPacienteDataById(fichaTecnica.getPacienteId());
        if (paciente == null) {
            throw new RuntimeException("Paciente no encontrado con ID: " + fichaTecnica.getPacienteId());
        }

        // Guardar la ficha técnica
        return fichaTecnicaRepository.save(fichaTecnica);
    }

    public List<FichasTecnica> getAllFichasTecnicas() {
        return fichaTecnicaRepository.findAll();
    }

    public Optional<FichasTecnica> getFichaTecnicaById(Integer id) {
        return fichaTecnicaRepository.findById(id);
    }

    public List<FichasTecnica> getFichasTecnicasByPacienteId(Integer pacienteId) {
        return fichaTecnicaRepository.findByPacienteId(pacienteId);
    }

    public FichasTecnica updateFichaTecnica(Integer id, FichasTecnica ficha) {
        Optional<FichasTecnica> existingFicha = fichaTecnicaRepository.findById(id);
        if (existingFicha.isPresent()) {
            FichasTecnica updateFicha = existingFicha.get();
            updateFicha.setDiagnostico(ficha.getDiagnostico());
            updateFicha.setPacienteId(ficha.getPacienteId());
            updateFicha.setPago(ficha.getPago());
            updateFicha.setObservaciones(ficha.getObservaciones());
            updateFicha.setPresupuesto(ficha.getPresupuesto());
            updateFicha.setTratamientos(ficha.getTratamientos());
            updateFicha.setFecha_pago(ficha.getFecha_pago());
            return fichaTecnicaRepository.save(updateFicha);
        } else {
            throw new RuntimeException("Ficha Técnica no encontrada con ID: " + id);
        }
    }

    public boolean deleteFichaTecnicaById(Integer id) {
        if (fichaTecnicaRepository.existsById(id)) {
            fichaTecnicaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private PacienteData getPacienteDataById(Integer pacienteId) {
        try {
            String url = PACIENTE_SERVICE_URL + "/" + pacienteId;
            return restTemplate.getForObject(url, PacienteData.class);
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener datos del paciente: " + e.getMessage(), e);
        }
    }
}

