package com.exam3p.odontologiaapirestfull.repository;

import com.exam3p.odontologiaapirestfull.entity.FichasTecnica;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FichaTecnicaRepository extends JpaRepository<FichasTecnica, Integer> {
    List<FichasTecnica> findByPacienteId(Integer paciente_id);
}
