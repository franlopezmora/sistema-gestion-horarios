package com.cruma.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "periodo")
@Data @NoArgsConstructor @AllArgsConstructor
public class Periodo {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 10, nullable = false, unique = true)
    private String codigo;

    @Column(length = 255, nullable = false)
    private String descripcion;
}