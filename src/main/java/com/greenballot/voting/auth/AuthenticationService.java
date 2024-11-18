package com.greenballot.voting.auth;


import com.greenballot.voting.config.JwtService;
import com.greenballot.voting.dto.UserDto;
import com.greenballot.voting.token.Token;
import com.greenballot.voting.repository.TokenRepository;
import com.greenballot.voting.token.TokenType;
import com.greenballot.voting.user.User;
import com.greenballot.voting.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final org.apache.logging.log4j.Logger logger = LogManager.getLogger(AuthenticationService.class);

    public AuthenticationResponse register(RegisterRequest request) throws Exception {
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .walletAddress(request.getWalletAddress())
                .role(request.getRole())
                .build();
        Optional<User> u = repository.findByEmail(user.getEmail());
        if (u.isPresent()) {
            var jwtToken = jwtService.generateToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);
            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .build();
        }


        var savedUser = repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);


        saveUserToken(savedUser, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = this.repository.findByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    public String getRole(String authorization) {
        String username = jwtService.extractUsername(authorization);
        Optional<User> u = repository.findByEmail(username);
        if (u.isPresent()) {
            User user = u.get();
            String role = user.getRole().name();
            return role;
        } else {
            String role = "VIEWER";
            return role;
        }

    }

    public User getUser(String authorization) {
        String username = jwtService.extractUsername(authorization);
        Optional<User> u = repository.findByEmail(username);
        if (u.isPresent())
            return u.get();
        else
            logger.error("could not find user with the provided email");
        return null;
    }

    public String updateUser(UpdateUserRequest request) {
        Optional<User> u = repository.findByEmail(request.getOldEmail());
        if (u.isPresent()) {
            User user = u.get();
            user.setFirstname(request.getFirstname());
            user.setLastname(request.getLastname());
            user.setEmail(request.getEmail());
            user.setWalletAddress(request.getWalletAddress());
            repository.save(user);
            return "Success";
        } else {
            logger.error("Error: could not find user");
            return "Error";
        }
    }

    public List<String> getUsers() {
        List<User> users = repository.findAll();

        List<UserDto> userDtos = users.stream().map(x-> UserDto.builder()
                .id(x.getId())
                .firstname(x.getFirstname())
                .lastname(x.getLastname())
                .email(x.getEmail())
                .role(x.getRole())
                .build()
        ).collect(Collectors.toList());

        List<String> result = userDtos.stream().map(x -> x.toString()).collect(Collectors.toList());
        return result;
    }

//    public AuthenticationResponse changePassword(UpdatePasswordRequest request) {
//
//        Optional<User> u = repository.findByEmail(request.getEmail());
//        if(u.isPresent()){
//            User user = u.get();
//            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
//
//        }
//
//        return null;
//    }
}
