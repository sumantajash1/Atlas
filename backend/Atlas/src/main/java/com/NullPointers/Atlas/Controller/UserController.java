package com.NullPointers.Atlas.Controller;

import com.NullPointers.Atlas.DTO.UserResponseDto;
import com.NullPointers.Atlas.DTO.UserSignInDto;
import com.NullPointers.Atlas.DTO.UserSignUpDto;
import com.NullPointers.Atlas.DTO.UserUpdateDto;
import com.NullPointers.Atlas.Service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    UserService userService;

    @PostMapping("/signUp")
    public ResponseEntity<Pair<String,UserResponseDto>> SignUp(@RequestBody UserSignUpDto userSignUpDto, HttpServletResponse response) {
        Pair<String, UserResponseDto> userServiceResponse = userService.register(userSignUpDto);
        if(userServiceResponse.getFirst().equals("Error")) {
            return ResponseEntity.badRequest().body(Pair.of("Error", userServiceResponse.getSecond()));
        }
        //response.setHeader("JwtToken", userServiceResponse.getSecond());
        //response.setHeader(HttpHeaders.SET_COOKIE, CookieUtil.generateCookie(userServiceResponse.getSecond()).toString());
        return ResponseEntity.ok(Pair.of(userServiceResponse.getFirst(), userServiceResponse.getSecond()));
    }

    @PostMapping("/signIn")
    public ResponseEntity<Pair<String,UserResponseDto>> SignIn(@RequestBody UserSignInDto userSignInDto, HttpServletResponse response) {
        Pair<String, UserResponseDto> userServiceResponse = userService.Login(userSignInDto);
        if (userServiceResponse.getFirst().equals("Error")) {
            return ResponseEntity.badRequest().body(Pair.of("Error", userServiceResponse.getSecond()));
        }
        //response.setHeader("JwtToken", userServiceResponse.getFirst());
        //response.setHeader(HttpHeaders.SET_COOKIE, CookieUtil.generateCookie(userServiceResponse.getFirst()).toString());
        return ResponseEntity.ok(Pair.of(userServiceResponse.getFirst(), userServiceResponse.getSecond()));
    }

    @PostMapping("/updateDetails")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<UserResponseDto> updateDetails(@RequestBody UserUpdateDto userUpdateDto) {
        Pair<String, UserResponseDto> userServiceResponse = userService.updateUserDetails(userUpdateDto);
        if(userServiceResponse.getFirst().equals("Error")) {
            return ResponseEntity.badRequest().body(new UserResponseDto());
        }
        return ResponseEntity.ok(userService.updateUserDetails(userUpdateDto).getSecond());
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/secureMethod")
    public ResponseEntity<String> secureMethod() {
        return ResponseEntity.ok("Secure method accessed");
    }

    @GetMapping("/healthCheck")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("healthy");
    }

}
