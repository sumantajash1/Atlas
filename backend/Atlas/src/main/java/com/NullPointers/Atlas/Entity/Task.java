package com.NullPointers.Atlas.Entity;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Document("Tasks")
@Builder
public class Task {
    @Id
    private String taskId;
    private String parentId; // null for root node
    private String rootId;
    private String parentLabel;
    private String authorId;
    private String label; // taskname
    private LocalDate startDate;
    private LocalDate endDate;
    private int duration; //minute
    private int remMin; //minute
    private LocalDate assignedDate;
    private boolean status;
    private int maxTimePerDayInMinute;
    private boolean isLeafNode;
}
