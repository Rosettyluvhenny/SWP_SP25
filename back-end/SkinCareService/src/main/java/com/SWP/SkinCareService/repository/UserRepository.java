package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<User> findAllByActiveTrue(Pageable pageable);

    Page<User> findAllByActiveFalse(Pageable pageable);

    Optional<User> findByPhone(String phone);

    boolean existsByPhone(String phone);
    List<User> findAllByActiveTrue();

}
