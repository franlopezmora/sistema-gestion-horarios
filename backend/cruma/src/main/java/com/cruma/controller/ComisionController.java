package com.cruma.controller;

import com.cruma.dto.ComisionDTO;
import com.cruma.service.ComisionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class ComisionController {

    private final ComisionService service;

    public ComisionController(ComisionService service) {
        this.service = service;
    }

    @GetMapping("/materias/{materiaId}/comisiones")
    public List<ComisionDTO> getComisionesDeMateria(
            @PathVariable Integer materiaId,
            @RequestParam Integer carreraId,
            @RequestParam Integer periodoId) {

        return service.listarPorMateriaCarreraPeriodo(materiaId, carreraId, periodoId);
    }
}