package com.NullPointers.Atlas.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Document("Users")
public class User {
    @Id
    private String userId;
    private String name;
    private String email;
    private String mobileNum;
    private String password;
    private String sleepCycle;
    private int dailyLimit;
    private double taskCompletionPercentage;
}
