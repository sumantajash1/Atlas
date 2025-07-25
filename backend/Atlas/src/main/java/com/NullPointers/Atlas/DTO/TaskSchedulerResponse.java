package com.NullPointers.Atlas.DTO;

import com.NullPointers.Atlas.Entity.Task;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class TaskSchedulerResponse {
    private List<Task> tasks;
    private boolean success;
    private int statusCode;
    private String statusMessage;
}
