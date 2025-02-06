package com.exam3p.odontologiaapirestfull.service;

import com.exam3p.odontologiaapirestfull.dto.PacienteData;
import com.exam3p.odontologiaapirestfull.entity.Odontograma;
import com.exam3p.odontologiaapirestfull.repository.OdontogramaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;

@Service
public class OdontogramaService {

    @Autowired
    private OdontogramaRepository odontogramaRepository;

    @Autowired
    private RestTemplate restTemplate;

    private static final String PACIENTE_SERVICE_URL = "http://localhost:8080/pacientes";
    private static final String UPLOAD_DIR = "odontogramas/";

    public Odontograma createOdontograma(Odontograma odontograma) {
        // Verificar que el paciente existe antes de crear el odontograma
        PacienteData paciente = getPacienteDataById(odontograma.getPacienteId().intValue());
        if (paciente == null) {
            throw new RuntimeException("Paciente no encontrado con ID: " + odontograma.getPacienteId());
        }

        odontograma.setDescripcion(odontograma.getDescripcion() != null ? odontograma.getDescripcion() : "");
        return odontogramaRepository.save(odontograma);
    }

    public Optional<Odontograma> getOdontogramaById(Integer id) {
        return odontogramaRepository.findById(id);
    }

    public List<Odontograma> getAllOdontogramas() {
        return odontogramaRepository.findAll();
    }

    public List<Odontograma> getOdontogramasByPacienteId(Integer pacienteId) {
        return odontogramaRepository.findByPacienteId(pacienteId);
    }

    public Odontograma updateOdontograma(Integer id, Odontograma odontograma) {
        Optional<Odontograma> existingOdontograma = odontogramaRepository.findById(id);
        if (existingOdontograma.isPresent()) {
            Odontograma updateOdontograma = existingOdontograma.get();
            updateOdontograma.setPacienteId(odontograma.getPacienteId());
            updateOdontograma.setDescripcion(odontograma.getDescripcion());
            return odontogramaRepository.save(updateOdontograma);
        } else {
            throw new RuntimeException("Odontograma no encontrado con ID: " + id);
        }
    }

    public boolean deleteOdontogramaById(Integer id) {
        if (odontogramaRepository.existsById(id)) {
            odontogramaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public String uploadImage(Integer id, byte[] imageBytes, String originalFilename) throws IOException {
        Optional<Odontograma> odontogramaOptional = odontogramaRepository.findById(id);
        if (odontogramaOptional.isEmpty()) {
            throw new RuntimeException("Odontograma no encontrado con ID: " + id);
        }

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filename = id + "_" + originalFilename;
        Path filePath = uploadPath.resolve(filename);

        Files.write(filePath, imageBytes);

        Odontograma odontograma = odontogramaOptional.get();
        odontograma.setImg_url(filePath.toString());
        odontogramaRepository.save(odontograma);

        return filename;
    }

    public byte[] getImage(Integer id) throws IOException {
        Odontograma odontograma = odontogramaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Odontograma no encontrado con ID: " + id));

        if (odontograma.getImg_url() == null || !Files.exists(Paths.get(odontograma.getImg_url()))) {
            throw new RuntimeException("Imagen no encontrada para el odontograma con ID: " + id);
        }

        return Files.readAllBytes(Paths.get(odontograma.getImg_url()));
    }

    public void updateImage(Integer id, byte[] imageBytes, String originalFilename) throws IOException {
        Optional<Odontograma> odontogramaOptional = odontogramaRepository.findById(id);
        if (odontogramaOptional.isEmpty()) {
            throw new RuntimeException("Odontograma no encontrado con ID: " + id);
        }

        Odontograma odontograma = odontogramaOptional.get();

        // Eliminar la imagen anterior si existe
        if (odontograma.getImg_url() != null) {
            Path oldImagePath = Paths.get(odontograma.getImg_url());
            if (Files.exists(oldImagePath)) {
                Files.delete(oldImagePath);
            }
        }

        // Subir la nueva imagen
        String newFilename = id + "_" + originalFilename;
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path newFilePath = uploadPath.resolve(newFilename);
        Files.write(newFilePath, imageBytes);

        odontograma.setImg_url(newFilePath.toString());
        odontogramaRepository.save(odontograma);
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