package com.NullPointers.Atlas.DTO;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class UserSignUpDto {
    private String name;
    private String email;
    private String password;
    private int maxHrsPerDay;
}
