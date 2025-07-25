package com.NullPointers.Atlas.Filter;

import com.NullPointers.Atlas.Utils.JwtTokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;

@Slf4j
@Component
public class JwtRequestFilter extends OncePerRequestFilter {


    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String header = request.getHeader("Authorization");
        if(header==null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        String jwtToken = header.substring(7);
        if(jwtToken.isEmpty()) {
            Cookie[] cookies = request.getCookies();
            if(cookies != null) {
                for(Cookie cookie : cookies) {
                    if(cookie.getName().equals("jwtToken")) {
                        jwtToken = cookie.getValue();
                        break;
                    }
                }
            }
        }
        if(jwtToken != null && JwtTokenUtil.validateToken(jwtToken)) {
            String userId = JwtTokenUtil.getUserIdfromToken(jwtToken);
            log.info("---------> UserId : " + userId);
            Collection<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                userId, null
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.equalsIgnoreCase("/user/signUp") ||
               path.equalsIgnoreCase("/user/signIn") ||
               path.equalsIgnoreCase("/user/healthCheck") ||
               path.startsWith("/task/");
    }
}
