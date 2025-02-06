package com.exam3p.odontologiaapirestfull.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "fichas_tecnicas")
@Getter
@Setter
@NoArgsConstructor
public class FichasTecnica{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String diagnostico;
    @Column(name = "paciente_id")
    private Integer pacienteId;
    private String observaciones;
    private Long presupuesto;
    private Long pago;
    private Date fecha_pago;
    private String tratamientos;
}