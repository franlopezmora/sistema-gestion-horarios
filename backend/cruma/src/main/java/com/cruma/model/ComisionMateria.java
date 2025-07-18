package com.cruma.model;

import jakarta.persistence.*;

@Entity
@Table(name = "comision_materia")
public class ComisionMateria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // (Podrás completar en detalle más adelante: comision, materia, periodo, horarios…)

    public ComisionMateria() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
}
