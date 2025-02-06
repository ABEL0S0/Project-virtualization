package com.exam3p.odontologiaapirestfull.controller;

import com.exam3p.odontologiaapirestfull.entity.Odontograma;
import com.exam3p.odontologiaapirestfull.service.OdontogramaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/odontograma")
public class OdontogramaController {

    @Autowired
    private OdontogramaService odontogramaService;

    @GetMapping("/lista")
    @ResponseStatus(HttpStatus.OK)
    public List<Odontograma> getAllOdontogramas() {
        return odontogramaService.getAllOdontogramas();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Odontograma> getOdontogramaById(@PathVariable Integer id) {
        return odontogramaService.getOdontogramaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/paciente/{pacienteId}")
    public List<Odontograma> getOdontogramasByPacienteId(@PathVariable Integer pacienteId) {
        return odontogramaService.getOdontogramasByPacienteId(pacienteId);
    }

    @PostMapping("/crear")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Odontograma> createOdontograma(@RequestBody Odontograma odontograma) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(odontogramaService.createOdontograma(odontograma));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Odontograma> updateOdontograma(@PathVariable Integer id, @RequestBody Odontograma odontograma) {
        try {
            return ResponseEntity.ok(odontogramaService.updateOdontograma(id, odontograma));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOdontogramaById(@PathVariable Integer id) {
        if (odontogramaService.deleteOdontogramaById(id)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/{id}/subirImg")
    public ResponseEntity<String> subirImagen(@PathVariable Integer id, @RequestParam("image") MultipartFile image) {
        try {
            String filename = odontogramaService.uploadImage(id, image.getBytes(), image.getOriginalFilename());
            return ResponseEntity.ok("Imagen subida con éxito: " + filename);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al subir la imagen");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/{id}/imagen")
    public ResponseEntity<Resource> obtenerImagen(@PathVariable Integer id) {
        try {
            byte[] imageBytes = odontogramaService.getImage(id);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"imagen_" + id + ".jpg\"")
                    .header(HttpHeaders.CONTENT_TYPE, "image/jpeg")
                    .body(new ByteArrayResource(imageBytes));
        } catch (RuntimeException | IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{id}/actualizarImg")
    public ResponseEntity<String> actualizarImagen(@PathVariable Integer id, @RequestParam("image") MultipartFile image) {
        try {
            odontogramaService.updateImage(id, image.getBytes(), image.getOriginalFilename());
            return ResponseEntity.ok("Imagen actualizada con éxito");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar la imagen");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
