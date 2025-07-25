package com.NullPointers.Atlas.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class UserUpdateDto {
    private String userId;
    private String mobileNum;
    private String sleepCycle;
    private int maxTimePerDay;
}
