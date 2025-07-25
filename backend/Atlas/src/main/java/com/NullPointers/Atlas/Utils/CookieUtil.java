package com.NullPointers.Atlas.Utils;

import jakarta.servlet.http.Cookie;
import org.springframework.http.ResponseCookie;

public class CookieUtil {
    public static ResponseCookie generateCookie(String jwtToken) {
        return ResponseCookie
                .from("JwtToken", jwtToken)
                .httpOnly(false)
                .secure(false)
                .maxAge(60*60*60*10)
                .path("/")
                .build();
    }
}
