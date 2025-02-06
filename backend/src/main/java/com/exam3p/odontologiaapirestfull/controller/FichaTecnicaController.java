package com.exam3p.odontologiaapirestfull.controller;

import com.exam3p.odontologiaapirestfull.entity.FichasTecnica;
import com.exam3p.odontologiaapirestfull.service.FichaTecnicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/ficha")
public class FichaTecnicaController {

    @Autowired
    private FichaTecnicaService fichaTecnicaService;

    @GetMapping("/lista")
    @ResponseStatus(HttpStatus.OK)
    public List<FichasTecnica> getFichaTecnica() {
        return fichaTecnicaService.getAllFichasTecnicas();
    }

    @GetMapping("/paciente/{pacienteId}")
    public List<FichasTecnica> getFichaTecnicaByPacienteId(@PathVariable Integer pacienteId) {
        return fichaTecnicaService.getFichasTecnicasByPacienteId(pacienteId);
    }

    @PostMapping("/save")
    public ResponseEntity<FichasTecnica> crearFichaTecnica(@RequestBody FichasTecnica ficha) {
        try {
            FichasTecnica nuevaFicha = fichaTecnicaService.createFichaTecnica(ficha);
            return new ResponseEntity<>(nuevaFicha, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateFichaById(@PathVariable Integer id, @RequestBody FichasTecnica ficha) {
        Optional<FichasTecnica> existingFicha = fichaTecnicaService.getFichaTecnicaById(id);
        if (existingFicha.isPresent()) {
            fichaTecnicaService.updateFichaTecnica(id, ficha);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFichaById(@PathVariable Integer id) {
        if (fichaTecnicaService.deleteFichaTecnicaById(id)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
