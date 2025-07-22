package com.cruma.controller;

import com.cruma.dto.MateriaDTO;
import com.cruma.service.MateriaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materias")
@CrossOrigin("http://localhost:3000")
public class MateriaController {

    private final MateriaService service;

    public MateriaController(MateriaService service) {
        this.service = service;
    }

    @GetMapping
    public List<MateriaDTO> getAll() {
        return service.listar();
    }
}