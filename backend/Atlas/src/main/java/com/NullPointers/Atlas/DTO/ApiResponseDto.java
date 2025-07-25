package com.NullPointers.Atlas.DTO;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ApiResponseDto {
    private String label;
    private String parentLabel;
    private int level;
    private int estimatedHours;
    private List<ApiResponseDto> children;
}
