package com.NullPointers.Atlas.Service;

import com.NullPointers.Atlas.DAO.UserDao;
import com.NullPointers.Atlas.DTO.UserResponseDto;
import com.NullPointers.Atlas.DTO.UserSignInDto;
import com.NullPointers.Atlas.DTO.UserSignUpDto;
import com.NullPointers.Atlas.DTO.UserUpdateDto;
import com.NullPointers.Atlas.Entity.User;
import com.NullPointers.Atlas.Utils.CalculationUtil;
import com.NullPointers.Atlas.Utils.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {
    @Autowired
    UserDao userDao;
    @Autowired
    PasswordEncoder passwordEncoder;

    public Pair<String, UserResponseDto> register(UserSignUpDto userSignUpDto) {
        if(userDao.findByEmail(userSignUpDto.getEmail()) != null) {
            return Pair.of("Error", null);
        }
        try {
            User user = new User();
            user.setUserId(UUID.randomUUID().toString());
            user.setName(userSignUpDto.getName());
            user.setEmail(userSignUpDto.getEmail());
            user.setPassword(passwordEncoder.encode(userSignUpDto.getPassword()));
            user.setTaskCompletionPercentage(0.0);
            userDao.save(user);
            String jwtToken = JwtTokenUtil.generateToken(user.getUserId());
            UserResponseDto userResponseDto = new UserResponseDto(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getMobileNum(),
                user.getSleepCycle(),
                user.getDailyLimit(),
                user.getTaskCompletionPercentage()
            );
            return Pair.of(jwtToken, userResponseDto);
        } catch (org.springframework.dao.DuplicateKeyException e) {
            e.printStackTrace();
            return Pair.of("Error", null);
        } catch (Exception e) {
            e.printStackTrace();
            return Pair.of("Error", null);
        }
    }


    public Pair<String, UserResponseDto> Login(UserSignInDto userSignInDto) {
        try {
            User user = userDao.findByEmail(userSignInDto.getEmail());
            if (user == null) {
                return Pair.of("Error", null);
            }
            if (!passwordEncoder.matches(userSignInDto.getPassword(), user.getPassword())) {
                return Pair.of("Error", null);
            }
            String jwtToken = JwtTokenUtil.generateToken(user.getUserId());
            UserResponseDto userResponseDto = new UserResponseDto(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getMobileNum(),
                user.getSleepCycle(),
                user.getDailyLimit(),
                user.getTaskCompletionPercentage()
            );
            return Pair.of(jwtToken, userResponseDto);
        } catch (Exception e) {
            e.printStackTrace();
            return Pair.of("Error", null);
        }
    }

    public Pair<String, UserResponseDto> updateUserDetails(UserUpdateDto userUpdateDto) {
        try {
            User user = userDao.findByUserId(userUpdateDto.getUserId());
            if (user == null) {
                return Pair.of("Error", new UserResponseDto());
            }
            if (userUpdateDto.getMobileNum() != null) {
                user.setMobileNum(userUpdateDto.getMobileNum());
            }
            if (userUpdateDto.getSleepCycle() != null) {
                user.setSleepCycle(userUpdateDto.getSleepCycle());
            }
            if (userUpdateDto.getMaxTimePerDay() != 0) {
                user.setDailyLimit(userUpdateDto.getMaxTimePerDay());
            }
            userDao.save(user);
            UserResponseDto responseDto = new UserResponseDto();
            responseDto.setUserId(user.getUserId());
            responseDto.setName(user.getName());
            responseDto.setEmail(user.getEmail());
            responseDto.setMobileNum(user.getMobileNum());
            responseDto.setSleepCycle(user.getSleepCycle());
            responseDto.setMaxTimePerDay(CalculationUtil.MinuteToHours(user.getDailyLimit()));
            responseDto.setTaskCompletionPercentage(user.getTaskCompletionPercentage());
            return Pair.of("Success", responseDto);
        } catch (Exception e) {
            e.printStackTrace();
            return Pair.of("Error", new UserResponseDto());
        }
    }

}
