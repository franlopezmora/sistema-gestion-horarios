package com.cruma.service;

import com.cruma.dto.ComisionDTO;
import com.cruma.model.Comision;
import com.cruma.repository.ComisionMateriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComisionService {

    private final ComisionMateriaRepository cmRepo;

    public ComisionService(ComisionMateriaRepository cmRepo) {
        this.cmRepo = cmRepo;
    }

    public List<ComisionDTO> listarPorMateriaCarreraPeriodo(
            Integer materiaId, Integer carreraId, Integer periodoId) {

        return cmRepo
                .findDistinctComisionByMateriaAndCarreraAndPeriodo(materiaId, carreraId, periodoId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ComisionDTO toDto(Comision comision) {
        return new ComisionDTO(comision.getId(), comision.getSeccion());
    }
}