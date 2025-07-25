package com.NullPointers.Atlas.DAO;

import com.NullPointers.Atlas.DTO.UserSignUpDto;
import com.NullPointers.Atlas.Entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends MongoRepository<User, String> {
    User findByEmail(String email);

    User findByUserId(String userId);
}
