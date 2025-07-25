package com.NullPointers.Atlas.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class TaskTreeDto {
    private String parentId; // null for root node
    private String taskId;
    private String parentLabel;
    private String authorId;
    private String label; // taskname
    private LocalDate startDate;
    private LocalDate endDate;
    private int hrsAssigned;
    private int remHrs;
    private LocalDate assignedDate;
    private boolean status;
    private List<TaskTreeDto> children;
}
