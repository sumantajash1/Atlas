package com.NullPointers.Atlas.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class CreateTaskReqBody {
    private String label;
    private LocalDate startDate;
    private LocalDate endDate;
    private String depth;
    private String syllabus;
    private String extraInstruction;
    private int maxHourPerDay;
}
