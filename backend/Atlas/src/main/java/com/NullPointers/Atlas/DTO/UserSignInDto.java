package com.NullPointers.Atlas.DTO;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class UserSignInDto {
    private String email;
    private String password;
}
