package com.NullPointers.Atlas.Utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;

import static io.jsonwebtoken.Jwts.builder;

public class JwtTokenUtil {
    private static final String secret = "dsdsgdskj523kj523kjkljdkghsdgsekj23523542354j23klj23klt4kwhntgewklgkljgikejtk2jtk23j5kl23j52";
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes()) ;

    public static String generateToken(String userId) {
        return builder()
                .setSubject(userId)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

    public static boolean validateToken(String jwtToken) {
        try {
            Jwts
                    .parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(jwtToken);
            System.out.println("Token is validated");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static String getUserIdfromToken(String jwtToken) {
        return Jwts
                .parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(jwtToken)
                .getBody()
                .getSubject();
    }
}