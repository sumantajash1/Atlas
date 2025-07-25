package com.NullPointers.Atlas.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class UserResponseDto {
    private String userId;
    private String name;
    private String email;
    private String mobileNum;
    private String sleepCycle;
    private float maxTimePerDay;
    private double taskCompletionPercentage;
}
