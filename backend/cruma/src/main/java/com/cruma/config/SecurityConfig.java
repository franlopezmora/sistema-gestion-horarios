package com.cruma.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1) Desactivamos CSRF (no tienes sesiones ni formularios clásicos)
                .csrf(csrf -> csrf.disable())

                // 2) Permitimos **todas** las peticiones sin autenticación
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        // 3) Ya no necesitamos HTTP Basic, JWT, nada.
        // Si quisieras mantener basic sólo quita el siguiente comentario:
        // .and().httpBasic();

        return http.build();
    }
}
