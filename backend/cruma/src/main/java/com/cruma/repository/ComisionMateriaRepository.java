package com.cruma.repository;

import com.cruma.model.ComisionMateria;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComisionMateriaRepository extends JpaRepository<ComisionMateria, Integer> {
}