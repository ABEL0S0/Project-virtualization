package com.exam3p.odontologiaapirestfull.repository;

import com.exam3p.odontologiaapirestfull.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
}
