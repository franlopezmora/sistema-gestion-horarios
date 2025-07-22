package com.cruma.service;

import com.cruma.dto.MateriaDTO;
import com.cruma.model.Materia;
import com.cruma.repository.MateriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MateriaService {

    private final MateriaRepository repo;

    public MateriaService(MateriaRepository repo) {
        this.repo = repo;
    }

    public List<MateriaDTO> listar() {
        return repo.findAll().stream()
                .map(m -> new MateriaDTO(
                        m.getId(),
                        m.getCodigo(),
                        m.getNombre(),
                        m.getAnioCarrera(),
                        m.getElectiva()
                ))
                .collect(Collectors.toList());
    }
}