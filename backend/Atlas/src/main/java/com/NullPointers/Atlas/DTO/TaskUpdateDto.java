package com.NullPointers.Atlas.DTO;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class TaskUpdateDto {
    private String name;
    private String taskId;
    private boolean completed;
}
