package com.SWP.SkinCareService.config;

import com.SWP.SkinCareService.entity.Payment;
import com.SWP.SkinCareService.entity.Role;
import com.SWP.SkinCareService.entity.User;
import com.SWP.SkinCareService.repository.PaymentRepository;
import com.SWP.SkinCareService.repository.RoleRepository;
import com.SWP.SkinCareService.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ApplicationInitCofig {


    PasswordEncoder passwordEncoder;
    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository, PaymentRepository paymentRepository){
        return args ->{
            if (userRepository.findByUsername("admin").isEmpty()){
                Role userRole = roleRepository.save(Role.builder().name("USER").description("User role").build());
                Role adminRole   = roleRepository.save(Role.builder().name("ADMIN").description("Admin role").build());
                Role therapistRole   = roleRepository.save(Role.builder().name("THERAPIST").description("Therapist role").build());
                Role StaffRole   = roleRepository.save(Role.builder().name("STAFF").description("Therapist role").build());
                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);

                paymentRepository.saveAll(List.of(Payment.builder().name("Cash").build()
                        ,Payment.builder().name("VNPay").build()));
                User user = User.builder()
                        .username("admin")
                        .roles(roles)
                        .active(true)
                        .password(passwordEncoder.encode("admin"))
                        .build();
                userRepository.save(user);
                log.warn("admin user has been created with default password: admin");
            }
        };
    }



}
