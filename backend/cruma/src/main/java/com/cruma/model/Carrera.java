package com.cruma.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "carrera")
@Data @NoArgsConstructor @AllArgsConstructor
public class Carrera {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 50, nullable = false, unique = true)
    private String codigo;

    @Column(length = 255, nullable = false)
    private String nombre;
}