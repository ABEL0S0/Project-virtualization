package com.exam3p.odontologiaapirestfull.repository;

import com.exam3p.odontologiaapirestfull.entity.Odontograma;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OdontogramaRepository extends JpaRepository<Odontograma, Integer> {
    List<Odontograma> findByPacienteId(Integer pacienteId);
}