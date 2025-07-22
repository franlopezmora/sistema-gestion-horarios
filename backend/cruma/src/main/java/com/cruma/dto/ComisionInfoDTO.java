package com.cruma.dto;

import lombok.*;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class ComisionInfoDTO {
    private String seccion;
    private String carrera;
    private String periodo;
    private List<HorarioDTO> horarios;
}