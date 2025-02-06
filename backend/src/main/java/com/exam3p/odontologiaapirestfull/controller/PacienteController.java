package com.exam3p.odontologiaapirestfull.controller;

import com.exam3p.odontologiaapirestfull.entity.Paciente;
import com.exam3p.odontologiaapirestfull.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/pacientes")
public class PacienteController {

    @Autowired
    private PacienteRepository pacienteRepository;

    @GetMapping("/list")
    public List<Paciente> getAllPacientes(){
        return pacienteRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Paciente> getPacienteById(@PathVariable Integer id){
        return pacienteRepository.findById(id);
    }

    @PostMapping("/save")
    public void createPaciente(@RequestBody Paciente paciente){
        pacienteRepository.save(paciente);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletePacienteById(@PathVariable Integer id){
        if (pacienteRepository.existsById(id)) {
            pacienteRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updatePacienteById(@PathVariable Integer id, @RequestBody Paciente paciente){
        Optional<Paciente> existingPaciente = pacienteRepository.findById(id);
        if (existingPaciente.isPresent()) {
            Paciente updatedPaciente = existingPaciente.get();
            updatedPaciente.setNombre(paciente.getNombre());
            updatedPaciente.setApellido(paciente.getApellido());
            updatedPaciente.setId(paciente.getId());
            updatedPaciente.setTelefono(paciente.getTelefono());
            updatedPaciente.setCorreo(paciente.getCorreo());
            updatedPaciente.setFecha_nacimiento(paciente.getFecha_nacimiento());
            updatedPaciente.setGenero(paciente.getGenero());
            pacienteRepository.save(updatedPaciente);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}